#!/usr/bin/env node
'use strict';
const meow = require('meow')
const tmp = require('tmp')
const { statSync } = require('fs')
const { execSync, execFile } = require('child_process')

tmp.setGracefulCleanup();

let missingDependency = false;

function commandExists(name, bin) {
    try {
        if (process.platform == 'win32') {
            execSync(`where ${bin}`)
        } else {
            execSync(`type ${bin} >/dev/null 2>&1`)
        }
    } catch (error) {
        missingDependency = true
        console.error(`Error: ${name} not installed? Executable '${bin}' not found.`)
    }
}

function fileExists(path) {
    try {
        statSync(path)
    } catch (error) {
        missingDependency = true
        console.error(`Error: ${path} not found. The packaged js files are missing. \nPlease open a new issue at: https://github.com/asciinema/asciicast2gif/issues`)
    }
}

commandExists('Node.js', 'node')
commandExists('ImageMagick', 'convert')
commandExists('gifsicle', 'gifsicle')
fileExists('./main.js')
fileExists('./page/page.js')

if (missingDependency) {
    process.exit(1);
}

const cli = meow({ help:`
    asciicast2gif - Generate GIF animations from asciicasts (asciinema recordings)

    usage: asciicast2gif [-t theme] [-s speed] [-S scale] [-w columns] [-h rows] <input-json-path-or-url> <output-gif-path>

    options:
      -t <theme>        color theme, one of: asciinema, tango, solarized-dark, solarized-light, monokai (default: asciinema)
      -s <speed>        animation speed (default: 1)
      -S <scale>        image scale / pixel density (default: 2)
      -w <columns>      clip terminal to specified number of columns (width)
      -h <rows>         clip terminal to specified number of rows (height)
`, description: false }, {
    alias: {
        t: 'theme',
        s: 'speed',
        S: 'scale',
        w: 'columns',
        h: 'rows',
    }
});

if (cli.input.length != 2) {
    cli.showHelp(0);
}

const theme = cli.flags.theme || "asciinema"
const speed = cli.flags.speed || 1
const scale = cli.flags.scale || 2
const width = cli.flags.width || ""
const height = cli.flags.height || ""
const input = cli.input[0] || ""
const output = cli.input[1] || ""

if (width != "") {
    process.env.WIDTH = width
}

if (height != "") {
    process.env.HEIGHT = height
}

const tmpobj = tmp.dirSync({ unsafeCleanup: true, template: '/tmp/asciicast2gif-XXXXXX' });
const tempdir = tmpobj.name

console.log("\x1b[32m==> \x1b[0mStarting up...")

const child = execFile('./main.js', [input, output, tempdir, theme, speed, scale], (error, stdout, stderr) => {
    if (error) {
        console.error('Error on execFile ./main.js:', error)
    }
    console.log(stdout)
    console.log(stderr)
});

child.on('close', (exitCode, signal) => {
    tmpobj.removeCallback();
    console.log("\x1b[32m==> \x1b[0mDone.")
});
