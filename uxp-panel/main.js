// Copyright (c) 2015–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: LicenseRef-RorohikoSourceAvailable
// https://github.com/zwettemaan/InDesignBrot

const localFileSystem = require("uxp").storage.localFileSystem;

const SCRIPT_LABEL_BRIDGE_STATE = "InDesignBrotBridgeStatus";
const BRIDGE_STATE_REQUEST = "Request";
const BRIDGE_STATE_STARTED = "Started";

const BRIDGE_STATE_POLL_INTERVAL_MS = 100;
const BRIDGE_REQUEST_TIMEOUT_MS = 30000;
const BRIDGE_COMPLETION_TIMEOUT_MS = 300000;

const SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG = "InDesignBrotSuppressElapsedTimeDialog";
const RESULT_GROUP_LABEL = "Calculated_Mandelbrot";
const TITLE_FRAME_LABEL = "InDesignBrotComparisonTitle";
const TITLE_FRAME_NAME = "InDesignBrotComparisonTitle";
const TITLE_TOP_INSET = 6;
const TITLE_SIDE_INSET = 12;
const TITLE_HEIGHT = 18;
const RESULT_TOP_OFFSET = 28;

const state = {
    busy: false,
    initPromise: null,
    runtimeFolder: null,
    crdtuxp: null,
    crdtuxpIDSN: null
};

const directButton = document.getElementById("run-direct");
const bridgeButton = document.getElementById("run-bridge");
const statusNode = document.getElementById("status");

// getInDesignApp/waitForInDesignApp live in crdtuxpIDSN_bridge_common.js, shared
// with crdtuxpIDSN_bridge_runner.idjs (which runs in its own UXPScript engine
// instance and can't share module state with this panel, hence the separate
// require() rather than a shared import).
let bridgeCommonModule = null;
function getBridgeCommon() {
// coderstate: function

    if (! bridgeCommonModule) {
        bridgeCommonModule = require("./runtime/CreativeDeveloperTools_UXP/crdtuxpIDSN_bridge_common.js");
    }
    return bridgeCommonModule;
}

function getInDesignApp() {
// coderstate: function

    return getBridgeCommon().getInDesignApp();
}

async function waitForInDesignApp() {
// coderstate: promisor

    return getBridgeCommon().waitForInDesignApp();
}

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

// app is always a valid, already-waited-for app by the time these are
// called, so no guard needed — a missing insertLabel/extractLabel would mean
// something is fundamentally wrong, and the resulting TypeError is enough to
// surface that up to runAction's catch.
function setAppLabel(app, key, value) {
// coderstate: procedure

    app.insertLabel(key, String(value == null ? "" : value));
}

function getAppLabel(app, key) {
// coderstate: function

    return String(app.extractLabel(key) || "");
}

function isElapsedLabelValue(value) {
// coderstate: function

    return /^\d+(\.\d+)?$/.test(String(value || ""));
}

// setTimeout is callback-based, so this wrapper is the minimal bridge that lets
// the rest of the panel code use await for short polling delays.
function sleep(milliseconds) {
// coderstate: promisor

    return new Promise(function sleepPromise(resolve) {
        setTimeout(resolve, milliseconds);
    });
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

function getCollectionItems(collection) {
    return collection.everyItem().getElements().slice(0);
}

function getActiveDocument() {
// coderstate: function

    try {
        const doc = getInDesignApp().activeDocument;
        if (doc && doc.isValid && doc.constructor.name == "Document") {
            return doc;
        }
    }
    catch (err) {
    }

    return undefined;
}

function ensureComparisonTitleFrame(doc) {
// coderstate: function

    const frames = getCollectionItems(doc.textFrames);
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

    const groups = getCollectionItems(doc.groups);
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

    const pluginFolder = await localFileSystem.getPluginFolder();
    const runtimeFolder = await pluginFolder.getEntry("runtime");

    await runtimeFolder.getEntry("InDesignBrot_main.js");
    await runtimeFolder.getEntry("InDesignBrot.idjs");

    const crdtFolder = await runtimeFolder.getEntry("CreativeDeveloperTools_UXP");
    await crdtFolder.getEntry("crdtuxp.js");
    await crdtFolder.getEntry("crdtuxpIDSN.js");
    await crdtFolder.getEntry("crdtuxpIDSN_bridge_runner.idjs");
    await crdtFolder.getEntry("crdtuxpIDSN_bridge_common.js");

    state.runtimeFolder = runtimeFolder;
    
    return runtimeFolder;
}

async function initializeRuntimeImpl() {
// coderstate: promisor

    try {
        await getRuntimeFolder();

        state.crdtuxp = require("./runtime/CreativeDeveloperTools_UXP/crdtuxp.js");
        if (typeof global !== "undefined") {
            global.crdtuxp = state.crdtuxp;
        }
        globalThis.crdtuxp = state.crdtuxp;

        await state.crdtuxp.init();
        state.crdtuxpIDSN = require("./runtime/CreativeDeveloperTools_UXP/crdtuxpIDSN.js");
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

async function waitForBridgeResult(app, onStarted) {
// coderstate: promisor

    const requestDeadline = Date.now() + BRIDGE_REQUEST_TIMEOUT_MS;
    const completionDeadline = Date.now() + BRIDGE_COMPLETION_TIMEOUT_MS;
    let didReportStart = false;

    while (true) {
        const statusValue = getAppLabel(app, SCRIPT_LABEL_BRIDGE_STATE);

        if (isElapsedLabelValue(statusValue)) {
            return {
                elapsedMilliseconds: Math.round(parseFloat(statusValue) * 1000)
            };
        }

        if (statusValue == BRIDGE_STATE_STARTED) {
            if (! didReportStart) {
                didReportStart = true;
                if (typeof onStarted == "function") {
                    onStarted();
                }
            }
        }
        else if (statusValue && statusValue != BRIDGE_STATE_REQUEST) {
            throw new Error(statusValue);
        }

        if (! didReportStart && Date.now() > requestDeadline) {
            throw new Error("Bridge request stayed pending for more than 5 seconds.");
        }

        if (didReportStart && Date.now() > completionDeadline) {
            throw new Error("Bridge run did not finish within 300 seconds.");
        }

        await sleep(BRIDGE_STATE_POLL_INTERVAL_MS);
    }
}

async function runDirectInPanel() {
// coderstate: promisor

    const runtime = await initializeRuntime();
    const inDesignBrot = require("./runtime/InDesignBrot_main.js");
    const app = await waitForInDesignApp();

    setAppLabel(app, SCRIPT_LABEL_BRIDGE_STATE, BRIDGE_STATE_REQUEST);
    setAppLabel(app, SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "yes");

    try {
            await inDesignBrot.main();
    }
    finally {
        setAppLabel(app, SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "");
    }

    const result = await waitForBridgeResult(app);
    if (typeof runtime.crdtuxp.finalize == "function") {
        await runtime.crdtuxp.finalize();
    }

    updateDocumentPresentation("Panel UXP", result.elapsedMilliseconds);
    return result;
}

async function runViaUXPScript() {
// coderstate: promisor

    const runtime = await initializeRuntime();
    const runtimeFolder = await getRuntimeFolder();
    const launcherEntry = await runtimeFolder.getEntry("InDesignBrot.idjs");
    const launcherSourceText = await launcherEntry.read();
    const app = await waitForInDesignApp();

    setAppLabel(app, SCRIPT_LABEL_BRIDGE_STATE, BRIDGE_STATE_REQUEST);
    setAppLabel(app, SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "yes");

    try {
        await runtime.crdtuxpIDSN.doUXPScriptFile(
            launcherEntry.nativePath,
            {
                sourceText: launcherSourceText,
                requireSourceInspection: true
            }
        );
    }
    finally {
        setAppLabel(app, SCRIPT_LABEL_SUPPRESS_ELAPSED_TIME_DIALOG, "");
    }

    const result = await waitForBridgeResult(app, function handleBridgeStarted() {
        setStatus(
            "Bridged UXPScript started. The panel is waiting for InDesignBrot to replace the Started label with the elapsed time.",
            "note"
        );
    });

    updateDocumentPresentation("UXPScript", result.elapsedMilliseconds);
    return result;
}

async function runAction(startMessage, action, buildSuccessMessage) {
// coderstate: promisor

    if (state.busy) {
        return;
    }

    state.busy = true;
    setButtonsDisabled(true);
    setStatus(startMessage, "note");
    await waitForStatusPaint();

    try {
        erasePreviousRenderingIfAny();
        await sleep(500);
        const result = await action();
        setStatus(buildSuccessMessage(result), "note");
    }
    catch (err) {
        console.error(err);
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