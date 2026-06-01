#!/bin/zsh

set -euo pipefail

SCRIPT_DIR=${0:A:h}

"$SCRIPT_DIR/preprocess.command"
node "$SCRIPT_DIR/build-ccx.mjs"