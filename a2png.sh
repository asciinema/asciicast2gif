#!/usr/bin/env bash

# usage:
#   a2png.sh path/or/url/to/asciicast.json path/to/output.png seconds-in
#
# examples:
#   a2png.sh https://asciinema.org/a/42383.json output.png 78
#   a2png.sh demo.json output.png 10.5

set -e

in=$1
out=$2
time=$3

player_version=v2.4.0
a2png_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "${a2png_dir}/asciinema-player.js" ]; then
    echo "asciinema-player.js missing, downloading ..."
    $(cd $a2png_dir; wget -q --show-progress https://github.com/asciinema/asciinema-player/releases/download/${player_version}/asciinema-player.js)
fi

if [ ! -f "${a2png_dir}/asciinema-player.css" ]; then
    echo "asciinema-player.css missing, downloading ..."
    $(cd $a2png_dir; wget -q --show-progress https://github.com/asciinema/asciinema-player/releases/download/${player_version}/asciinema-player.css)
fi

tmp_dir=$(mktemp -d 2>/dev/null || mktemp -d -t 'a2png-tmp')
trap 'rm -rf $tmp_dir' EXIT

phantomjs \
    ${a2png_dir}/a2png.js \
    ${a2png_dir} \
    $in \
    ${tmp_dir}/out.png \
    npt:$time \
    2

if [ $(which pngquant 2>/dev/null) ]; then
    echo "Optimizing PNG with pngquant..."
    pngquant 24 --ext q.png ${tmp_dir}/out.png
    mv ${tmp_dir}/outq.png ${tmp_dir}/out.png
fi

mv ${tmp_dir}/out.png $out
echo "Done."
