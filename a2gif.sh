#!/usr/bin/env bash

set -e

a2gif_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

tmp_dir=$(mktemp -d 2>/dev/null || mktemp -d -t 'a2gif-tmp')
trap 'rm -rf $tmp_dir' EXIT

theme="asciinema"
scale=2

while getopts ":w:h:t:s:" opt; do
    case $opt in
        t)
            theme=$OPTARG
            ;;
        s)
            scale=$OPTARG
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

if (($# != 2)); then
    echo "usage: a2gif [-t theme] [-s scale] <input-json-path-or-url> <output-gif-path>"
    exit 1
fi

env WIDTH=$width HEIGHT=$height node \
    --max-old-space-size=512 \
    "${a2gif_dir}/main.js" \
    "${1}" \
    "${2}" \
    "${tmp_dir}" \
    $theme \
    $scale

echo "Done."
