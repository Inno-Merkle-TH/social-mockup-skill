#!/usr/bin/env bash
# usage: bash new_project.sh <path/to/project-name>
# Creates a self-contained mockup project (kit copied in, so it can be zipped/shared alone).
set -euo pipefail
[ $# -ge 1 ] || { echo "usage: $0 <project-dir>"; exit 1; }
SKILL="$(cd "$(dirname "$0")/.." && pwd)"; P="$1"
[ -e "$P/index.html" ] && { echo "$P/index.html exists, refusing to overwrite"; exit 1; }
mkdir -p "$P"/{kit,brand/fonts,assets,captures}
cp -R "$SKILL/assets/." "$P/kit/"
cp "$SKILL/templates/brand.example.css" "$P/brand.css"
cp "$SKILL/templates/demo-brand/logo.svg" "$P/brand/logo.svg"
sed -i.bak 's|demo-brand/logo.svg|brand/logo.svg|' "$P/brand.css" && rm "$P/brand.css.bak"
cp "$SKILL/templates/index.starter.html" "$P/index.html"
cp "$SKILL/templates/notes.template.md" "$P/notes.md"
echo "✓ project ready: $P"
echo "  1. fill $P/brand.css + brand/ + assets/"
echo "  2. copy shots from $SKILL/templates/gallery.html into $P/index.html"
echo "  3. node $SKILL/scripts/export.cjs $P"
