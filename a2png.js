#!/usr/bin/env phantomjs

var system = require('system');
var fs = require('fs');

if (system.args.length < 4) {
  console.log("usage: " + system.args[0] + " <asciicast-url> <image-path> <poster> <scale>");
  console.log("   ex: " + system.args[0] + " demo.json shot.png npt:10 2");
  exit(1);
}

var a2pngDir = system.args[1];
var jsonUrl = system.args[2];
var imagePath = system.args[3];
var poster = system.args[4];
var scale = parseInt(system.args[5], 10);
var localServerPort = 4444;
var pageUrl = a2pngDir + '/a2png.html';

var page = require('webpage').create();
page.settings.localToRemoteUrlAccessEnabled = true;
page.viewportSize = { width: 9999, height: 9999 };
page.zoomFactor = scale;

var server;

function exit(code) {
  if (server) {
    console.log('Shutting down local server...');
    server.close();
  }

  phantom.exit(code === undefined ? 0 : code);
}

if (!(/^https?:\/\//.test(jsonUrl))) {
  console.log('Input is local file, starting server on port ' + localServerPort + '...');

  var path = jsonUrl;
  jsonUrl = "http://localhost:" + localServerPort + "/";

  server = require('webserver').create();
  var ok = server.listen(localServerPort, function(request, response) {
    try {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.write(fs.read(path));
      response.close();
    } catch (e) {
      console.log("Error serving asciicast file:", e);
      response.statusCode = 500;
      response.write('');
      response.close();
    }
  });

  if (!ok) {
    console.log("Couldn't start server. Port taken?");
    server = null;
    exit(1);
  }
}

page.onConsoleMessage = function(msg) {
  console.log('console.log: ' + msg);
};

page.onError = function(msg, trace) {
  console.log('Script error: ' + msg);
  exit(1);
};

page.onResourceError = function(resourceError) {
  console.log('Unable to load resource (#' + resourceError.id + ', URL:' + resourceError.url + ')');
  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
  exit(1);
};

page.onCallback = function(data) {
  var rect = data.rect;

  if (!rect) {
    console.log("Couldn't get geometry of requested DOM element");
    exit(1);
    return;
  }

  page.clipRect = {
    left: rect.left * scale,
    top: rect.top * scale,
    width: rect.width * scale,
    height: rect.height * scale
  };

  console.log('Saving screenshot...');
  page.render(imagePath);
  exit(0);
};

console.log('Loading player page...');

page.open(pageUrl, function(status) {
  if (status !== "success") {
    console.log("Failed to load " + url);
    exit(1);
  }

  var rect = page.evaluate(function(jsonUrl, poster) {
    function initPlayer() {
      var opts = {
        poster: poster,
        onCanPlay: function() {
          setTimeout(function() { // wait for terminal to resize and poster to render
            var elements = document.querySelectorAll('.asciinema-player');

            if (elements.length > 0) {
              window.callPhantom({ rect: elements[0].getBoundingClientRect() });
            } else {
              window.callPhantom({ rect: undefined });
            }
          }, 10);
        }
      };

      asciinema.player.js.CreatePlayer('player', jsonUrl, opts);
    }

    FontFaceOnload("Powerline Symbols", {
      success: initPlayer,
      error: function() {
        console.log('Failed to pre-load Powerline Symbols font');
        window.callPhantom({ rect: undefined });
      },
      timeout: 1000
    });
  }, jsonUrl, poster);
});

// vim: ft=javascript
