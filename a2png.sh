#!/usr/bin/env bash

# usage:
#   ./a2png.sh path/or/url/to/asciicast.json path/to/output.png seconds-in
#
# examples:
#   ./a2png.sh https://asciinema.org/a/42383.json output.png 78
#   ./a2png.sh demo.json output.png 10.5

in=$1
out=$2
time=$3

phantomjs \
  a2png.js \
  $in \
  $out \
  npt:$time \
  2
