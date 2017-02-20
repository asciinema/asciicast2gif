#!/usr/bin/env phantomjs

var system = require('system');
var fs = require('fs');

var a2pngDir = system.args[1];
var jsonUrl = system.args[2];
var imagePath = system.args[3];
var poster = system.args[4];

var theme = system.env['THEME'];
var scale = parseInt(system.env['SCALE'], 10);
var width = system.env['WIDTH'] || null;
var height = system.env['HEIGHT'] || null;

var pageUrl = a2pngDir + '/a2png.html';

var page = require('webpage').create();
page.settings.localToRemoteUrlAccessEnabled = true;
page.viewportSize = { width: 9999, height: 9999 };
page.zoomFactor = scale;

function exit(code) {
  phantom.exit(code === undefined ? 0 : code);
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

var input;

if (!(/^https?:\/\//.test(jsonUrl))) {
  console.log('Reading asciicast file...');
  input = {
    type: 'json',
    data: fs.read(jsonUrl)
  };
} else {
  input = {
    type: 'url',
    data: jsonUrl
  };
}

console.log('Loading player page...');

page.open(pageUrl, function(status) {
  if (status !== "success") {
    console.log("Failed to load " + url);
    exit(1);
  }

  var rect = page.evaluate(function(input, poster, theme, width, height) {
    function initPlayer() {
      var opts = {
        poster: poster,
        theme: theme,
        width: width,
        height: height,
        onCanPlay: function() {
          setTimeout(function() { // let Powerline font render
            var elements = document.querySelectorAll('.asciinema-player');

            if (elements.length > 0) {
              window.callPhantom({ rect: elements[0].getBoundingClientRect() });
            } else {
              window.callPhantom({ rect: undefined });
            }
          }, 10);
        }
      };

      var data;

      if (input.type == 'json') {
        data = JSON.parse(input.data);
      } else {
        data = input.data;
      }

      asciinema.player.js.CreatePlayer('player', data, opts);
    }

    FontFaceOnload("Powerline Symbols", {
      success: initPlayer,
      error: function() {
        console.log('Failed to pre-load Powerline Symbols font');
        window.callPhantom({ rect: undefined });
      },
      timeout: 1000
    });
  }, input, poster, theme, width, height);
});

// vim: ft=javascript
