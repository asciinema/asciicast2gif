#!/usr/bin/env phantomjs

var system = require('system');

var pageUrl = system.args[1];
var width = parseInt(system.args[2], 10);
var height = parseInt(system.args[3], 10);
var theme = system.args[4];
var scale = parseInt(system.args[5], 10);

var page = require('webpage').create();
page.viewportSize = { width: 9999, height: 9999 };
page.zoomFactor = scale;

function logDebug(message) {
  if (system.env['DEBUG'] === '1') {
    console.log(message);
  }
}

function logError(message) {
  console.log("\u001b[31m==> \u001b[0m" + message);
}

function exit(code) {
  phantom.exit(code === undefined ? 0 : code);
}

page.onConsoleMessage = function(msg) {
  logDebug('console.log: ' + msg);
};

page.onError = function(msg, trace) {
  logError('Script error: ' + msg);
  exit(1);
};

page.onResourceError = function(resourceError) {
  logError('Unable to load resource (#' + resourceError.id + ', URL:' + resourceError.url + ')');
  logError('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
  exit(1);
};

page.onCallback = function(data) {
  var rect = data.rect;

  if (!rect) {
    logError("Couldn't get geometry of requested DOM element");
    exit(1);
    return;
  }

  logDebug('Setting clipRect...');
  page.clipRect = {
    left: rect.left * scale,
    top: rect.top * scale,
    width: rect.width * scale,
    height: rect.height * scale
  };

  logDebug('Reading update from stdin...');
  var line = system.stdin.readLine();

  while (line !== '') {
    var screen = JSON.parse(line);
    var imagePath = system.stdin.readLine();
    if (imagePath == '') {
      logError('Error: imagePath empty');
      exit(1);
    }

    logDebug('Calling updateTerminal...');
    page.evaluate(function(screen) {
      window.updateTerminal(screen);
    }, screen);

    logDebug('Saving screenshot to ' + imagePath + '...');
    page.render(imagePath);

    logDebug('Reading update from stdin...');
    line = system.stdin.readLine();
  }

  logDebug('Rendering success');

  exit(0);
};

logDebug('Loading page...');

page.open(pageUrl, function(status) {
  if (status !== "success") {
    logError("Failed to load " + url);
    exit(1);
  }

  page.evaluate(function(width, height, theme) {
    function initTerminal() {
      var opts = {
        width: width,
        height: height,
        theme: theme
      };

      window.updateTerminal = asciinema.gif.page.InitTerminal('player', opts);

      setTimeout(function() { // let Powerline font render
        var elements = document.querySelectorAll('.asciinema-player');

        if (elements.length > 0) {
          window.callPhantom({ rect: elements[0].getBoundingClientRect() });
        } else {
          window.callPhantom({ rect: undefined });
        }
      }, 10);
    }

    FontFaceOnload("Powerline Symbols", {
      success: initTerminal,
      error: function() {
        console.log('Failed to pre-load Powerline Symbols font');
        initTerminal();
      },
      timeout: 1000
    });
  }, width, height, theme);
});

// vim: ft=javascript
