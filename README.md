# a2gif

a2gif is a tool for generating GIF animations from
[asciicast](https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v1.md) files
recorded by [asciinema](https://github.com/asciinema/asciinema).

## How it works

Here's how the asciicast->GIF conversion is implemented.

`a2gif` shell script parses command line arguments and executes Node.js script
(`main.js`). `main.js` loads asciicast (either from remote URL or local
filesystem), generates text representation of the screen for each frame
using [asciinema-player](https://github.com/asciinema/asciinema-player)'s
virtual terminal emulator, and sends it to PhantomJS-based renderer script
(`renderer.js`), which saves PNG screenshots to a temporary directory. Finally,
`main.js` calls ImageMagick's `convert` on these PNG images to construct GIF
animation, also piping it to `gifsicle` to get the final, optimized GIF file.

Note, `a2gif` doesn't capture screenshots at a fixed frame-rate (e.g. 30 FPS)
like alternative tools. Instead, it generates PNG files for each screen update,
and specifies delay for every image individually (`convert -delay <delay-a>
0.png -delay <delay-b> 1.png -delay <delay-c> 2.png ...`). When the screen is
idle there're no screenshots generated. This saves disk space and makes it less
work for both `convert` and `gifsicle`, while resulting in smaller GIF file.

## Installation

Clone the repository:

    git clone --recursive https://github.com/asciinema/a2gif.git
    cd a2gif

All further commands are assumed to be called from within the checked out
directory.

### Install build time dependencies

Both Node.js script (`main.js`) and page script used by renderer's HTML page
(`page/page.js`) need to be build from
[ClojureScript source code](https://github.com/asciinema/a2gif/tree/master/src/asciinema/gif).

You need
[Java 8 JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
and [Leiningen](https://leiningen.org/#install).

### Install runtime dependencies

Following runtime dependencies need to be installed:

- [Node.js](https://nodejs.org/en/)
- [PhantomJS](http://phantomjs.org/) (optional, see below)
- [ImageMagick](http://www.imagemagick.org/)
- [gifsicle](https://www.lcdf.org/gifsicle/)

Install Node.js wrapper for PhantomJS:

    npm install

If you don't have PhantomJS available in `$PATH` at this point it will be
automatically downloaded during
[phantomjs-prebuilt](https://www.npmjs.com/package/phantomjs-prebuilt)
package installation.

### Build

To build the scripts run:

    lein cljsbuild once main && lein cljsbuild once page 

## Usage

    a2gif [-t theme] [-s speed] [-S scale] [-w cols] [-h rows] <input-json-path-or-url> <output-gif-path>

Example of generating GIF from asciicast URL, with default options (normal
speed, double pixel density, asciinema theme):

    a2gif https://asciinema.org/a/118274.json demo.gif

![example gif 1](https://www.dropbox.com/s/e5l8ni0eth9o55s/demo-1.gif?dl=1)

Example of generating GIF from local asciicast file, with Solarized Dark theme,
double speed (`-s 2`), single pixel density (`-S 1`):

    a2gif -t solarized-dark -s 2 -S 1 118274.json demo.gif

![example gif 2](https://www.dropbox.com/s/05dclrsq9eqqsvi/demo-2.gif?dl=1)

### Tweaking conversion process

You can pass extra arguments to Node.js script invocation via `NODE_OPTS`
environment variable.

#### Limiting node process memory usage

Limit Node's heap size to 512 MB:

    NODE_OPTS="--max-old-space-size=512" a2gif ...

## License

Copyright &copy; 2017 Marcin Kulik.
