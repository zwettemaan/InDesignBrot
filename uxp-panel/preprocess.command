#!/bin/zsh

set -euo pipefail

# zsh modifiers: ${0:A} = absolute path of this script (resolves symlinks);
# :h = "head" of path, i.e. strip last component (like dirname). So:
SCRIPT_DIR=${0:A:h}         # dir containing this script
PROJECT_DIR=${SCRIPT_DIR:h} # parent of SCRIPT_DIR (:h applied again)
RUNTIME_DIR="$SCRIPT_DIR/runtime"

[[ -f "$PROJECT_DIR/InDesignBrot_main.js" ]] || {
    print -u2 "Missing $PROJECT_DIR/InDesignBrot_main.js"
    exit 1
}

[[ -f "$PROJECT_DIR/InDesignBrot.idjs" ]] || {
    print -u2 "Missing $PROJECT_DIR/InDesignBrot.idjs"
    exit 1
}

[[ -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxp.js" ]] || {
    print -u2 "Missing $PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxp.js"
    exit 1
}

[[ -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN.js" ]] || {
    print -u2 "Missing $PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN.js"
    exit 1
}

[[ -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_runner.idjs" ]] || {
    print -u2 "Missing $PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_runner.idjs"
    exit 1
}

[[ -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_common.js" ]] || {
    print -u2 "Missing $PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_common.js"
    exit 1
}

mkdir -p "$RUNTIME_DIR/CreativeDeveloperTools_UXP"

rm -f "$RUNTIME_DIR/InDesignBrot_doscript_probe.idjs"
rm -f "$RUNTIME_DIR/InDesignBrot_doscript_probe_helper.js"
rm -f "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN.js"
rm -f "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_runner.idjs"
rm -f "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_common.js"

cp -f "$PROJECT_DIR/InDesignBrot_main.js" "$RUNTIME_DIR/InDesignBrot_main.js"
cp -f "$PROJECT_DIR/InDesignBrot.idjs" "$RUNTIME_DIR/InDesignBrot.idjs"
cp -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxp.js" "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxp.js"
cp -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN.js" "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN.js"
cp -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_runner.idjs" "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_runner.idjs"
cp -f "$PROJECT_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_common.js" "$RUNTIME_DIR/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_common.js"

print "Staged InDesignBrot runtime into $RUNTIME_DIR"