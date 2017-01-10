#!/usr/bin/env bash

# usage:
#   ./gen-png.sh path/or/url/to/asciicast.json path/to/output.png seconds-in
#
# examples:
#   ./gen-png.sh https://asciinema.org/a/42383.json output.png 78
#   ./gen-png.sh demo.json output.png 10.5

phantomjs \
  gen-png.js \
  $1 \
  $2 \
  npt:$3 \
  2
