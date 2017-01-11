# a2png

a2png is a script for generating PNG previews from asciicast JSON files.

## Installation

Just clone the repository:

    git clone https://github.com/asciinema/a2png.git

You also need [PhantomJS](http://phantomjs.org/) v2.0 or later.

If you want the PNG files to be optimized install
[pngquant](https://pngquant.org/).

## Usage

    a2png.sh [-t theme] [-s scale] [-w columns] [-h rows] <input-json-path-or-url> <output-png-path> <time>

For example:

    a2png.sh https://asciinema.org/a/42383.json output.png 78
    a2png.sh -t solarized-dark -s 2 -w 80 -h 24 demo.json output.png 10.5

## License

Copyright &copy; 2017 Marcin Kulik.
