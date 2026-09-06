// Copyright (c) 2015–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: LicenseRef-RorohikoSourceAvailable
// https://github.com/zwettemaan/InDesignBrot

const localFileSystem = require("uxp").storage.localFileSystem;

const SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG = "InDesignBrotSuppressElapsedTimeDialog";
const RESULT_GROUP_LABEL                        = "Calculated_Mandelbrot";
const TITLE_FRAME_LABEL                         = "InDesignBrotComparisonTitle";
const TITLE_FRAME_NAME                          = "InDesignBrotComparisonTitle";
const TITLE_TOP_INSET                           =  6;
const TITLE_SIDE_INSET                          = 12;
const TITLE_HEIGHT                              = 18;
const RESULT_TOP_OFFSET                         = 28;

const state = {
    busy: false,
    initPromise: null,
    runtimeFolder: null
};

const directButton = document.getElementById("run-direct");
const bridgeButton = document.getElementById("run-bridge");
const statusNode   = document.getElementById("status");

function setButtonsDisabled(disabled) {
// coderstate: procedure

    directButton.disabled = disabled;
    bridgeButton.disabled = disabled;
}

function setStatus(message, kind) {
// coderstate: procedure

    statusNode.textContent = message;
    if (kind) {
        statusNode.dataset.kind = kind;
    }
    else {
        delete statusNode.dataset.kind;
    }
}

function formatError(err) {
// coderstate: function

    if (! err) {
        return "Unknown error";
    }

    if (err instanceof Error && err.message) {
        return err.message;
    }

    return String(err);
}

function formatElapsedSeconds(milliseconds) {
// coderstate: function

    return (milliseconds / 1000).toFixed(3);
}

// requestAnimationFrame is also callback-based. Waiting for two frames gives the
// status text a chance to paint before a long-running action starts.
function waitForStatusPaint() {
// coderstate: promisor

    return new Promise(function waitForStatusPaintPromise(resolve) {
        if (typeof requestAnimationFrame == "function") {
            requestAnimationFrame(function afterFirstFrame() {
                requestAnimationFrame(resolve);
            });
            return;
        }

        setTimeout(resolve, 0);
    });
}

function getActiveDocument() {
// coderstate: function

    let retVal = undefined;

    do {
        try {
            const app = crdtuxpIDSN.getInDesignApp();
            if (! app) {
                break;
            }

            const doc = app.activeDocument;
            if (! doc || ! doc.isValid || doc.constructor.name != "Document") {
                break;
            }

            retVal = doc;
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}

function ensureComparisonTitleFrame(doc) {
// coderstate: function

    const frames = crdtuxpIDSN.collectionToArray(doc.textFrames);
    for (let index = 0; index < frames.length; index += 1) {
        const frame = frames[index];
        if (! frame || ! frame.isValid) {
            continue;
        }

        if (frame.label == TITLE_FRAME_LABEL || frame.name == TITLE_FRAME_NAME) {
            return frame;
        }
    }

    const titleFrame = doc.textFrames.add();
    titleFrame.label = TITLE_FRAME_LABEL;
    titleFrame.name = TITLE_FRAME_NAME;
    return titleFrame;
}

function findResultGroup(doc) {
// coderstate: function

    const groups = crdtuxpIDSN.collectionToArray(doc.groups);
    for (let index = groups.length - 1; index >= 0; index -= 1) {
        const group = groups[index];
        if (group && group.isValid && group.label == RESULT_GROUP_LABEL) {
            return group;
        }
    }

    return undefined;
}

function updateDocumentPresentation(methodLabel, elapsedMilliseconds) {
// coderstate: procedure

    const doc = getActiveDocument();
    if (! doc) {
        return;
    }

    const firstPage = doc.pages.item(0);
    const pageBounds = firstPage.bounds;
    const titleFrame = ensureComparisonTitleFrame(doc);
    titleFrame.geometricBounds = [
        pageBounds[0] + TITLE_TOP_INSET,
        pageBounds[1] + TITLE_SIDE_INSET,
        pageBounds[0] + TITLE_TOP_INSET + TITLE_HEIGHT,
        pageBounds[3] - TITLE_SIDE_INSET
    ];
    titleFrame.contents = methodLabel + ": " + formatElapsedSeconds(elapsedMilliseconds) + " s";

    const resultGroup = findResultGroup(doc);
    if (! resultGroup) {
        return;
    }

    const resultBounds = resultGroup.visibleBounds || resultGroup.geometricBounds;
    if (! resultBounds || resultBounds.length < 4) {
        return;
    }

    const targetTop = pageBounds[0] + RESULT_TOP_OFFSET;
    if (Math.abs(resultBounds[0] - targetTop) < 0.5) {
        return;
    }

    resultGroup.move([resultBounds[1], targetTop]);
}

function erasePreviousRenderingIfAny() {
// coderstate: procedure

    const doc = getActiveDocument();
    if (! doc) {
        return;
    }

    const resultGroup = findResultGroup(doc);
    if (resultGroup && resultGroup.isValid) {
        resultGroup.remove();
    }
}

async function getRuntimeFolder() {
// coderstate: promisor

    if (state.runtimeFolder) {
        return state.runtimeFolder;
    }

    const pluginFolder  = await localFileSystem.getPluginFolder();
    const runtimeFolder = await pluginFolder.getEntry("runtime");
    const crdtFolder    = await runtimeFolder.getEntry("CreativeDeveloperTools_UXP");

    await crdtFolder.getEntry("crdtuxp.js");
    await crdtFolder.getEntry("crdtuxpIDSN.js");

    await runtimeFolder.getEntry("InDesignBrot_main.js");
    await runtimeFolder.getEntry("InDesignBrot.idjs");

    state.runtimeFolder = runtimeFolder;

    return runtimeFolder;
}

async function initializeRuntimeImpl() {
// coderstate: promisor

    try {
        await getRuntimeFolder();

        let crdtuxp = require("./runtime/CreativeDeveloperTools_UXP/crdtuxp.js");
        let crdtuxpIDSN = require("./runtime/CreativeDeveloperTools_UXP/crdtuxpIDSN.js");

        await crdtuxp.init();

        if (typeof global !== "undefined") {
            global.crdtuxp = crdtuxp;
            global.crdtuxpIDSN = crdtuxpIDSN;
        }

        return state;
    }
    catch (err) {
        state.initPromise = null;
        throw err;
    }
}

async function initializeRuntime() {
// coderstate: promisor

    if (! state.initPromise) {
        state.initPromise = initializeRuntimeImpl();
    }

    return state.initPromise;
}

async function runDirectInPanel() {
// coderstate: promisor

    await initializeRuntime();
    const inDesignBrot = require("./runtime/InDesignBrot_main.js");

    crdtuxpIDSN.setAppLabel(SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "yes");

    const startDate = new Date();
    let elapsedMilliseconds = -1;
    let mainResult;
    try {
        mainResult = await inDesignBrot.main();
        const endDate = new Date();
        elapsedMilliseconds = endDate.getTime() - startDate.getTime();
    }
    finally {
        crdtuxpIDSN.setAppLabel(SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "");
    }

    if (! mainResult || ! mainResult.ok) {
        return {
            ok: false,
            error: (mainResult && mainResult.error) || "InDesignBrot run failed."
        };
    }

    updateDocumentPresentation("Panel UXP", elapsedMilliseconds);

    return {
        ok: true,
        elapsedMilliseconds: elapsedMilliseconds
    };
}

async function runViaUXPScript() {
// coderstate: promisor

    await initializeRuntime();
    const runtimeFolder = await getRuntimeFolder();
    const launcherEntry = await runtimeFolder.getEntry("InDesignBrot.idjs");
    const launcherSourceText = await launcherEntry.read();

    crdtuxpIDSN.setBridgeState(crdtuxpIDSN.BRIDGE_STATE_REQUEST);
    crdtuxpIDSN.setAppLabel(SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "yes");

    try {
        await crdtuxpIDSN.doUXPScriptFile(
            launcherEntry.nativePath,
            {
                sourceText: launcherSourceText,
                requireSourceInspection: true
            }
        );
    }
    finally {
        crdtuxpIDSN.setAppLabel(SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "");
    }

    const result = await crdtuxpIDSN.waitForBridgeResult(
        function handleBridgeStarted() {
            setStatus(
                "Bridged UXPScript started. The panel is waiting for InDesignBrot to replace the Started label with the elapsed time.",
                "note"
            );
        }
    );

    if (result.ok) {
        updateDocumentPresentation("UXPScript", result.elapsedMilliseconds);
    }

    return result;
}

async function runAction(startMessage, action, buildSuccessMessage) {
// coderstate: promisor

    await initializeRuntime();

    if (state.busy) {
        return;
    }

    state.busy = true;
    setButtonsDisabled(true);
    setStatus(startMessage, "note");
    await waitForStatusPaint();

    try {
        erasePreviousRenderingIfAny();
        await crdtuxpIDSN.asyncSleep(500);
        const result = await action();
        if (result && result.ok === false) {
            setStatus(formatError(result.error), "error");
        }
        else {
            setStatus(buildSuccessMessage(result), "note");
        }
    }
    catch (err) {
        crdtuxp.logError(arguments, "throws " + err);
        setStatus(formatError(err), "error");
    }
    finally {
        state.busy = false;
        setButtonsDisabled(false);
    }
}

directButton.addEventListener(
    "click", 
    function handleDirectClick() {
    // coderstate: procedure

        runAction(
            "Running InDesignBrot in panel UXP...",
            runDirectInPanel,
            function buildDirectSuccessMessage(result) {
            // coderstate: function
                return "Panel UXP run completed in " + formatElapsedSeconds(result.elapsedMilliseconds) + " s.";
            }
        );
    }
);

bridgeButton.addEventListener(
    "click", 
    function handleBridgeClick() {
    // coderstate: procedure

        runAction(
            "Running InDesignBrot via UXPScript...",
            runViaUXPScript,
            function buildBridgeSuccessMessage(result) {
                // coderstate: function
                return "UXPScript run completed in " + formatElapsedSeconds(result.elapsedMilliseconds) + " s.";
            }
        );
    }
);

document.querySelectorAll("a.ext-link").forEach(
    function attachExtLink(a) {
    // coderstate: procedure

        a.addEventListener(
            "click", 
            function handleExtLinkClick(e) {
                // coderstate: procedure

                e.preventDefault();
                const url = a.dataset.url;
                if (url) {
                    try {
                        require("uxp").shell.openExternal(url);
                    }
                    catch (err) {
                        setStatus("Visit: " + url, "note");
                    }
                }
            }
        );
    }
);