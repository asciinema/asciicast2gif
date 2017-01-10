#!/usr/bin/env bash

# usage:
#   ./gen-png.sh path/or/url/to/asciicast.json path/to/output.png seconds-in
#
# examples:
#   ./gen-png.sh https://asciinema.org/a/42383.json output.png 78
#   ./gen-png.sh demo.json output.png 10.5

in=$1
out=$2
time=$3

phantomjs \
  gen-png.js \
  $in \
  $out \
  npt:$time \
  2
