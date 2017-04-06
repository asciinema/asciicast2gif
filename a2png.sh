#!/usr/bin/env bash

set -e

a2png_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

node "${a2png_dir}/main.js" "$@"

out=$2

if [ $(which pngquant 2>/dev/null) ]; then
    echo "Optimizing PNG with pngquant..."
    pngquant 24 -o "${out}.q" "$out"
    mv "${out}.q" "$out"
fi

echo "Done."
