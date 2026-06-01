#!/bin/zsh

set -euo pipefail

SCRIPT_DIR=${0:A:h}
PROJECT_DIR=${SCRIPT_DIR:h}
RUNTIME_DIR="$SCRIPT_DIR/runtime"
CRDT_BRIDGE_SOURCE_DIR="/Users/kris/Documents/Controlled/Rorohiko/TightenerComponents/CRDT_UXP/CreativeDeveloperTools_UXP"

[[ -f "$PROJECT_DIR/InDesignBrot_main.js" ]] || {
    print -u2 "Missing $PROJECT_DIR/InDesignBrot_main.js"
    exit 1
}

[[ -f "$PROJECT_DIR/InDesignBrot.idjs" ]] || {
    print -u2 "Missing $PROJECT_DIR/InDesignBrot.idjs"
    exit 1
}

[[ -f "$SCRIPT_DIR/InDesignBrot_bridge_runner.idjs" ]] || {
    print -u2 "Missing $SCRIPT_DIR/InDesignBrot_bridge_runner.idjs"
    exit 1
}

[[ -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxp.js" ]] || {
    print -u2 "Missing $PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxp.js"
    exit 1
}

[[ -f "$CRDT_BRIDGE_SOURCE_DIR/crdtuxpIDSN.js" ]] || {
    print -u2 "Missing $CRDT_BRIDGE_SOURCE_DIR/crdtuxpIDSN.js"
    exit 1
}

mkdir -p "$RUNTIME_DIR/CreativeDeveloperTools_UXP"

cp -f "$PROJECT_DIR/InDesignBrot_main.js" "$RUNTIME_DIR/InDesignBrot_main.js"
cp -f "$PROJECT_DIR/InDesignBrot.idjs" "$RUNTIME_DIR/InDesignBrot.idjs"
cp -f "$SCRIPT_DIR/InDesignBrot_bridge_runner.idjs" "$RUNTIME_DIR/InDesignBrot_bridge_runner.idjs"
cp -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxp.js" "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxp.js"
cp -f "$CRDT_BRIDGE_SOURCE_DIR/crdtuxpIDSN.js" "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN.js"

print "Staged InDesignBrot runtime into $RUNTIME_DIR"