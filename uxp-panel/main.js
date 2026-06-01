// Copyright (c) 2015–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: LicenseRef-RorohikoSourceAvailable
// https://github.com/zwettemaan/InDesignBrot

const localFileSystem = require("uxp").storage.localFileSystem;

const BRIDGE_STATUS_LABEL = "InDesignBrotBridgeStatus";
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
    crdtuxp: null
};

const directButton = document.getElementById("run-direct");
const bridgeButton = document.getElementById("run-bridge");
const statusNode = document.getElementById("status");

function getRuntimeInDesignModule() {
    try {
        return require("./runtime/InDesignBrot_main.js");
    }
    catch (err) {
    }

    return undefined;
}

function getInDesignApp() {
    const currentApp = tryGetInDesignApp();

    if (! currentApp) {
        throw new Error("InDesign app is unavailable in this panel runtime.");
    }

    return currentApp;
}

function tryGetInDesignApp() {
    const runtimeModule = getRuntimeInDesignModule();
    if (runtimeModule && typeof runtimeModule.getInDesignApp == "function") {
        const runtimeApp = runtimeModule.getInDesignApp();
        if (runtimeApp) {
            return runtimeApp;
        }
    }

    const currentHost = require("indesign");
    return currentHost ? currentHost.app : undefined;
}

async function waitForInDesignApp() {
    const deadline = Date.now() + 2000;

    while (Date.now() <= deadline) {
        const currentApp = tryGetInDesignApp();
        if (currentApp) {
            return currentApp;
        }

        await sleep(25);
    }

    throw new Error("InDesign app is unavailable in this panel runtime.");
}

function getUXPScriptLanguage() {
    const runtimeModule = getRuntimeInDesignModule();
    if (runtimeModule && typeof runtimeModule.getUXPScriptLanguage == "function") {
        const runtimeLanguage = runtimeModule.getUXPScriptLanguage();
        if (runtimeLanguage) {
            return runtimeLanguage;
        }
    }

    const currentHost = require("indesign");
    const scriptLanguage = currentHost && currentHost.ScriptLanguage && currentHost.ScriptLanguage.UXPSCRIPT;

    if (! scriptLanguage) {
        throw new Error("InDesign UXPSCRIPT language is unavailable in this panel runtime.");
    }

    return scriptLanguage;
}

function setButtonsDisabled(disabled) {
    directButton.disabled = disabled;
    bridgeButton.disabled = disabled;
}

function setStatus(message, kind) {
    statusNode.textContent = message;
    if (kind) {
        statusNode.dataset.kind = kind;
    }
    else {
        delete statusNode.dataset.kind;
    }
}

function getAppLabelFromApp(app, key) {
    if (! app || typeof app.extractLabel != "function") {
        throw new Error("Application labels are not available in this InDesign runtime.");
    }

    return String(app.extractLabel(key) || "");
}

function setAppLabelOnApp(app, key, value) {
    if (! app || typeof app.insertLabel != "function") {
        throw new Error("Application labels are not available in this InDesign runtime.");
    }

    app.insertLabel(key, String(value));
}

function formatError(err) {
    if (! err) {
        return "Unknown error";
    }

    if (err instanceof Error && err.message) {
        return err.message;
    }

    return String(err);
}

function formatElapsedSeconds(milliseconds) {
    return (milliseconds / 1000).toFixed(3);
}

function sleep(milliseconds) {
    return new Promise(function sleepPromise(resolve) {
        setTimeout(resolve, milliseconds);
    });
}

function waitForStatusPaint() {
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

async function runWithSuppressedAlert(runtime, callback) {
    const originalAlert = runtime.crdtuxp.alert;

    runtime.crdtuxp.alert = function noopAlert() {
    };

    try {
        return await callback();
    }
    finally {
        runtime.crdtuxp.alert = originalAlert;
    }
}

async function getRuntimeFolder() {
    if (state.runtimeFolder) {
        return state.runtimeFolder;
    }

    const pluginFolder = await localFileSystem.getPluginFolder();
    const runtimeFolder = await pluginFolder.getEntry("runtime");

    await runtimeFolder.getEntry("InDesignBrot_main.js");
    await runtimeFolder.getEntry("InDesignBrot.idjs");
    await runtimeFolder.getEntry("InDesignBrot_bridge_runner.idjs");

    const crdtFolder = await runtimeFolder.getEntry("CreativeDeveloperTools_UXP");
    await crdtFolder.getEntry("crdtuxp.js");

    state.runtimeFolder = runtimeFolder;
    return runtimeFolder;
}

async function initializeRuntime() {
    if (! state.initPromise) {
        state.initPromise = (async function initializeRuntimeImpl() {
            await getRuntimeFolder();

            state.crdtuxp = require("./runtime/CreativeDeveloperTools_UXP/crdtuxp.js");
            if (typeof global !== "undefined") {
                global.crdtuxp = state.crdtuxp;
            }
            globalThis.crdtuxp = state.crdtuxp;

            await state.crdtuxp.init();
            return state;
        })().catch(function handleInitFailure(err) {
            state.initPromise = null;
            throw err;
        });
    }

    return state.initPromise;
}

async function runDirectInPanel() {
    const runtime = await initializeRuntime();
    const inDesignBrot = require("./runtime/InDesignBrot_main.js");
    const startTime = Date.now();

    await runWithSuppressedAlert(runtime, function runDirectWithSuppressedAlert() {
        return inDesignBrot.main();
    });

    if (typeof runtime.crdtuxp.finalize == "function") {
        await runtime.crdtuxp.finalize();
    }

    updateDocumentPresentation("Panel UXP", Date.now() - startTime);

    return {
        elapsedMilliseconds: Date.now() - startTime
    };
}

async function runViaUXPScript() {
    await initializeRuntime();
    const runtimeFolder = await getRuntimeFolder();
    const launcherEntry = await runtimeFolder.getEntry("InDesignBrot_bridge_runner.idjs");

    const app = await waitForInDesignApp();
    const pendingValue = "pending:" + Date.now();

    setAppLabelOnApp(app, BRIDGE_STATUS_LABEL, pendingValue);

    const rawResult = await Promise.resolve(app.doScript(
        launcherEntry.nativePath,
        getUXPScriptLanguage()
    ));

    const labelResult = getAppLabelFromApp(app, BRIDGE_STATUS_LABEL);
    const resultValue = labelResult && labelResult != pendingValue
        ? labelResult
        : rawResult;

    const elapsedSeconds = parseFloat(String(resultValue || ""));
    if (! Number.isFinite(elapsedSeconds)) {
        throw new Error(resultValue ? String(resultValue) : "UXPScript returned no elapsed time.");
    }

    const result = {
        elapsedMilliseconds: Math.round(elapsedSeconds * 1000)
    };

    updateDocumentPresentation("UXPScript", result.elapsedMilliseconds);
    return result;
}

async function runAction(startMessage, action, buildSuccessMessage) {
    if (state.busy) {
        return;
    }

    state.busy = true;
    setButtonsDisabled(true);
    setStatus(startMessage, "note");
    await waitForStatusPaint();

    try {
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

directButton.addEventListener("click", function handleDirectClick() {
    runAction(
        "Running InDesignBrot in panel UXP...",
        runDirectInPanel,
        function buildDirectSuccessMessage(result) {
            return "Panel UXP run completed in " + formatElapsedSeconds(result.elapsedMilliseconds) + " s.";
        }
    );
});

bridgeButton.addEventListener("click", function handleBridgeClick() {
    runAction(
        "Running InDesignBrot via UXPScript...",
        runViaUXPScript,
        function buildBridgeSuccessMessage(result) {
            return "UXPScript run completed in " + formatElapsedSeconds(result.elapsedMilliseconds) + " s.";
        }
    );
});

document.querySelectorAll("a.ext-link").forEach(function attachExtLink(a) {
    a.addEventListener("click", function handleExtLinkClick(e) {
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
    });
});