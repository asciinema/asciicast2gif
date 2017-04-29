# a2gif

a2gif is a tool for generating GIF animations from
[asciicast](https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v1.md) files
recorded by [asciinema](https://github.com/asciinema/asciinema).

## Installation

Clone the repository:

    git clone https://github.com/asciinema/a2gif.git

Install leiningen & compile scripts:

    TODO: describe

Install dependencies (PhantomJS):

    npm install

## Usage

    a2gif [-t theme] [-s speed] [-S scale] [-w cols] [-h rows] <input-json-path-or-url> <output-gif-path>

Example of generating GIF from asciicast URL, with default options (normal
speed, double pixel density, asciinema theme):

    a2gif https://asciinema.org/a/42383.json output.gif

Example of generating GIF from local asciicast file, with Solarized Dark theme,
double speed (`-s 2`), single pixel density (`-S 1`), forcing terminal size to
80 columns by 24 rows:

    a2gif -t solarized-dark -s 2 -S 1 -w 80 -h 24 demo.json output.gif

## License

Copyright &copy; 2017 Marcin Kulik.
