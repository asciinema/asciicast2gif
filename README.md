# asciicast2gif

asciicast2gif is a tool for generating GIF animations from
[asciicast](https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v1.md) files
recorded by [asciinema](https://github.com/asciinema/asciinema).

## How it works

Here's how the asciicast->GIF conversion is implemented.

`asciicast2gif` shell script parses command line arguments and executes Node.js script
(`main.js`). `main.js` loads asciicast (either from remote URL or local
filesystem), generates text representation of the screen for each frame
using [asciinema-player](https://github.com/asciinema/asciinema-player)'s
virtual terminal emulator, and sends it to PhantomJS-based renderer script
(`renderer.js`), which saves PNG screenshots to a temporary directory. Finally,
`main.js` calls ImageMagick's `convert` on these PNG images to construct GIF
animation, also piping it to `gifsicle` to get the final, optimized GIF file.

Note, `asciicast2gif` doesn't capture screenshots at a fixed frame-rate (e.g. 30 FPS)
like [alternative tools](#alternatives). Instead, it generates PNG files for
each screen update, and specifies delay for every image individually (`convert
-delay <delay-a> 0.png -delay <delay-b> 1.png -delay <delay-c> 2.png ...`). When
the screen is idle there're no screenshots generated. This saves disk space and
makes it less work for both `convert` and `gifsicle`, while resulting in smaller
GIF file.

## Installation

Due to the multitude of build time and runtime dependencies the easiest (and
recommended) way to use asciicast2gif is through [asciicast2gif Docker
image](#docker-image). You can also `npm install` it or build it from source.

### Docker image

You can use asciicast2gif through [official asciicast2gif Docker
image](https://hub.docker.com/r/asciinema/asciicast2gif/) (automated build on
Docker Hub from this repository).

Pull the image:

    docker pull asciinema/asciicast2gif

Use it like this:

    docker run --rm -v $PWD:/data asciinema/asciicast2gif [options and arguments...]

You need to mount some local directory at `/data` so input and output files can
be accessed by the container. Mounting current working directory (`$PWD`) makes
most sense in majority of cases.

For example, generating GIF from local file, with double speed and Solarized
theme:

    docker run --rm -v $PWD:/data asciinema/asciicast2gif -s 2 -t solarized-dark demo.json demo.gif

Running the above, long command can get old very quickly. Creating a shell alias
may be a good idea:

    alias asciicast2gif='docker run --rm -v $PWD:/data asciinema/asciicast2gif'

Look at [general usage instructions](#usage) below for all command line
arguments, options etc.

### npm package

To install asciicast2gif using `npm` run:

    npm install asciicast2gif

Following runtime dependencies need to be also installed:

- [ImageMagick](http://www.imagemagick.org/)
- [gifsicle](https://www.lcdf.org/gifsicle/)

### Building from source

Clone the repository:

    git clone --recursive https://github.com/asciinema/asciicast2gif.git
    cd asciicast2gif

All further commands are assumed to be called from within the checked out
directory.

#### Install build time dependencies

Both Node.js script (`main.js`) and page script used by renderer's HTML page
(`page/page.js`) need to be build from
[ClojureScript source code](https://github.com/asciinema/asciicast2gif/tree/master/src/asciinema/gif).

You need
[Java 8 JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
and [Leiningen](https://leiningen.org/#install).

#### Install runtime dependencies

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

#### Build

To build the scripts run:

    lein cljsbuild once main && lein cljsbuild once page 

## Usage

    asciicast2gif [-t theme] [-s speed] [-S scale] [-w cols] [-h rows] <input-json-path-or-url> <output-gif-path>

Following options are supported:

    -t <theme>        color theme, one of: asciinema, tango, solarized-dark, solarized-light, monokai (default: asciinema)
    -s <speed>        animation speed (default: 1)
    -S <scale>        image scale / pixel density (default: 2)
    -w <columns>      clip terminal to specified number of columns (width)
    -h <rows>         clip terminal to specified number of rows (height)

Example of generating GIF from asciicast URL, with default options (normal
speed, double pixel density, asciinema theme):

    asciicast2gif https://asciinema.org/a/118274.json demo.gif

![example gif 1](https://s3.eu-central-1.amazonaws.com/sickill/github/asciicast2gif/demo-1.gif)

Example of generating GIF from local asciicast file, with Solarized Dark theme,
double speed (`-s 2`), single pixel density (`-S 1`):

    asciicast2gif -t solarized-dark -s 2 -S 1 118274.json demo.gif

![example gif 2](https://s3.eu-central-1.amazonaws.com/sickill/github/asciicast2gif/demo-2.gif)

### Debugging

You can set `DEBUG=1` environment variable to make the output of the conversion
process more verbose.

### Tweaking conversion process

You can pass extra arguments to Node.js script invocation via `NODE_OPTS`
environment variable.

#### Limiting node process memory usage

Limit Node's heap size to 512 MB:

    NODE_OPTS="--max-old-space-size=512" asciicast2gif ...

## Alternatives

There are following alternative tools solving this problem:

- [tav/asciinema2gif](https://github.com/tav/asciinema2gif)
- [pettarin/asciicast2gif](https://github.com/pettarin/asciicast2gif)

## License

Copyright &copy; 2017 Marcin Kulik.
