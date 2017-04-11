# a2png

a2png is a script for generating PNG previews from asciicast JSON files.

## Installation

Clone the repository:

    git clone https://github.com/asciinema/a2png.git

Install leiningen & compile scripts:

    TODO: describe

Install dependencies (PhantomJS):

    npm install

If you want the PNG files to be optimized install
[pngquant](https://pngquant.org/).

## Usage

    a2png.sh <input-json-path-or-url> <output-png-path> <time> [theme] [scale]

For example:

    a2png.sh https://asciinema.org/a/42383.json output.png 78
    a2png.sh demo.json output.png 10.5 solarized-dark 2

## License

Copyright &copy; 2017 Marcin Kulik.
