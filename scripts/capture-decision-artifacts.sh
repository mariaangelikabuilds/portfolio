#!/usr/bin/env bash
# Capture decision artifact PNGs from the brainstorm mockup HTML files.
# Uses Edge headless on Windows. Paths are converted via cygpath so that
# file:// URLs resolve on Windows (/d/... → D:/...).

set -e

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
BRAINSTORM_DIR="/d/2026 Workspace/portfolio/.superpowers/brainstorm/1795-1776776197/content"
OUT_DIR="/d/2026 Workspace/portfolio/public/assets/decisions"
BRAINSTORM_WIN=$(cygpath -m "$BRAINSTORM_DIR")
OUT_WIN=$(cygpath -m "$OUT_DIR")

mkdir -p "$OUT_DIR"

capture() {
  local name="$1"
  local width="$2"
  local height="$3"
  local tmpdir
  tmpdir=$(mktemp -d)
  "$EDGE" \
    --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --user-data-dir="$(cygpath -m "$tmpdir")" \
    --virtual-time-budget=3000 \
    --window-size="${width},${height}" \
    --screenshot="${OUT_WIN}/${name}.png" \
    "file:///${BRAINSTORM_WIN}/${name}.html"
  rm -rf "$tmpdir"
}

capture "accent-color" 1280 1400
capture "typography" 1280 1400
capture "landing-layout" 1400 1100

echo ""
echo "Decision artifacts captured to $OUT_DIR"
ls -la "$OUT_DIR"
sha256sum "$OUT_DIR"/*.png
