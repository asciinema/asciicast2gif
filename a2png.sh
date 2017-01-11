#!/usr/bin/env bash

set -e

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

theme="asciinema"
scale=1
width=""
height=""

while getopts ":w:h:t:s:" opt; do
    case $opt in
        t)
            theme=$OPTARG
            ;;
        s)
            scale=$OPTARG
            ;;
        w)
            width=$OPTARG
            ;;
        h)
            height=$OPTARG
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            exit 1
            ;;
        :)
            echo "Option -$OPTARG requires an argument." >&2
            exit 1
            ;;
    esac
done

shift $((OPTIND-1))

if (($# != 3)); then
    echo "usage: a2png [-t theme] [-s scale] [-w columns] [-h rows] <input-json-path-or-url> <output-png-path> <time>"
    exit 1
fi

in=$1
out=$2
time=$3

env THEME=$theme SCALE=$scale WIDTH=$width HEIGHT=$height phantomjs \
    ${a2png_dir}/a2png.js \
    ${a2png_dir} \
    $in \
    ${tmp_dir}/out.png \
    npt:$time

if [ $(which pngquant 2>/dev/null) ]; then
    echo "Optimizing PNG with pngquant..."
    pngquant 24 --ext q.png ${tmp_dir}/out.png
    mv ${tmp_dir}/outq.png ${tmp_dir}/out.png
fi

mv ${tmp_dir}/out.png $out
echo "Done."
