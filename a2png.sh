#!/usr/bin/env bash

# usage:
#   ./a2png.sh path/or/url/to/asciicast.json path/to/output.png seconds-in
#
# examples:
#   ./a2png.sh https://asciinema.org/a/42383.json output.png 78
#   ./a2png.sh demo.json output.png 10.5

set -e

in=$1
out=$2
time=$3

a2png_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

phantomjs \
    ${a2png_dir}/a2png.js \
    ${a2png_dir} \
    $in \
    out.png \
    npt:$time \
    2

if [ $(which pngquant 2>/dev/null) ]; then
    echo "Optimizing PNG with pngquant..."
    pngquant 24 --ext q.png out.png
    mv outq.png out.png
fi

mv out.png $out