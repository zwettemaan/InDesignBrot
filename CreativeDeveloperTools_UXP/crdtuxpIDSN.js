// Copyright (c) 2024–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: Elastic-2.0
// https://github.com/zwettemaan/CRDT_UXP

/**
 * Creative Developer Tools (CRDT) is a growing suite of tools aimed at script developers<br>
 * and plug-in developers for the Adobe Creative Cloud eco-system.<br>
 * <br>
 * This module provides functions that are specific to Adobe InDesign.
 * 
 * @module crdtuxpIDSN
 * @namespace crdtuxpIDSN
 */

if (! module.exports) {
    module.exports = {};
}
let crdtuxpIDSN = module.exports;

let crdtuxp = getCRDTUXP();

const APP_WAIT_TIMEOUT_MS                   =    2000;
const BRIDGE_DEFAULT_STATE_POLL_INTERVAL_MS =     100;
const BRIDGE_DEFAULT_REQUEST_TIMEOUT_MS     =   30000;
const BRIDGE_DEFAULT_COMPLETION_TIMEOUT_MS  =  300000;
const APP_WAIT_INTERVAL_MS                  =      25;
const PLUGIN_PATH_PREFIX                    = "plugin:";

crdtuxpIDSN.SCRIPT_LABEL_BRIDGE_PAYLOAD     = "__CRDT_UXP_INDESIGN_UXPSCRIPT_BRIDGE_PAYLOAD__";
crdtuxpIDSN.SCRIPT_LABEL_BRIDGE_STATE       = "__CRDT_UXP_INDESIGN_UXPSCRIPT_BRIDGE_STATE__";

crdtuxpIDSN.BRIDGE_STATE_STARTED            = "Started";
crdtuxpIDSN.BRIDGE_STATE_REQUEST            = "Request";

crdtuxpIDSN.FILE_NAME_EXTENSION_UXPSCRIPT   = ".idjs";

crdtuxpIDSN.BRIDGE_RUNNER_FILE_NAME         = "crdtuxpIDSN_bridge_runner" + crdtuxpIDSN.FILE_NAME_EXTENSION_UXPSCRIPT;
crdtuxpIDSN.BRIDGE_TEMP_FILE_NAME_PREFIX    = "crdtuxpIDSN_bridge_";

function cleanupTempBridgeScriptFile(filePath) {
// coderstate: promisor

    let retVal = Promise.resolve(undefined);

    do {
        try {
            
            if (! filePath) {
                crdtuxp.logError(arguments, "need filePath");
                break;
            }

            retVal = crdtuxp.fileDelete(String(filePath)).then(
                function handleTempBridgeDeleteResolve(deleteSucceeded) {
                    if (! deleteSucceeded) {
                        crdtuxp.logError(arguments, "Could not delete temporary bridge payload file " + filePath);
                    }
                },
                function handleTempBridgeDeleteReject(err) {
                    crdtuxp.logError(arguments, "Deleting temporary bridge payload file throws " + err);
                }
            );
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}

/**
 * Convert an InDesign collection into a pure JavaScript array
 *
 * @function collectionToArray
 * @memberOf crdtuxpIDSN
 *
 * @param {Collection} coll - an InDesign collection
 * @returns array with the collection elements
 */

function collectionToArray(coll) {
// coderstate: function
    let retVal = undefined;

    do {

        try {

            if (! coll) {
                break; 
            }

            if (coll instanceof Array) {
                retVal = coll.slice(0);
            }
            else {
                retVal = coll.everyItem().getElements().slice(0); 
            }

        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpIDSN.collectionToArray = collectionToArray;

function createTempBridgeScriptFile(scriptText) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            retVal = Promise.resolve(crdtuxp.getDir(crdtuxp.TMP_DIR)).then(
                function handleTmpDirResolve(tmpDirPath) {
                    // coderstate: promisor

                    let tempFilePath = undefined;
                    do {
                        if (! tmpDirPath) {
                            crdtuxp.logError(arguments, "Could not resolve the temporary directory.");
                            break;
                        }

                        tempFilePath = String(tmpDirPath) +
                            crdtuxpIDSN.BRIDGE_TEMP_FILE_NAME_PREFIX +
                            String(Date.now()) +
                            "_" +
                            String(Math.floor(Math.random() * 1000000000)) +
                            crdtuxpIDSN.FILE_NAME_EXTENSION_UXPSCRIPT;

                        return Promise.resolve(crdtuxp.fileAppendString(tempFilePath, String(scriptText))).then(
                            function handleWriteResolve(writeSucceeded) {
                                // coderstate: function

                                if (! writeSucceeded) {
                                    crdtuxp.logError(arguments, "Could not write the temporary bridge payload file.");
                                }

                                return tempFilePath;
                            }
                        );

                    }
                    while (false);
                }
            );
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

/**
 * Run a UXPScript source string through the InDesign bridge.<br>
 * <br>
 * This is meant for panel-side code that needs the final InDesign-facing work to run as
 * a host-owned UXPScript launch instead of directly inside the panel runtime.<br>
 * <br>
 * The bridge launches a clean UXPScript runner file and hands it a payload file path.<br>
 * For string input, the source is first written to a temporary <code>.idjs</code> file.<br>
 * <br>
 * By default, the bridge rejects source that matches a rough async-syntax heuristic after
 * comments and quoted strings are stripped, because observed InDesign behavior suggests that
 * the top-level launcher can switch into a slower, redraw-heavy mode when it contains real
 * async syntax such as <code>async function dummy() {}</code>. This is intentionally not a
 * full JavaScript parser.
 *
 * @function doUXPScript
 * @memberOf crdtuxpIDSN
 *
 * @param {string} scriptText - UXPScript source to run
 * @param {object=} options - <code>{<br>
 *     allowAsyncToken: false to bypass the rough async-mode source inspection<br>
 *     clearPending: accepted for backward compatibility; currently ignored<br>
 *     engineName: accepted for backward compatibility; currently ignored<br>
 *     taskName: accepted for backward compatibility; currently ignored<br>
 * }</code>
 * @returns {Promise<any>} result returned by InDesign <code>doScript()</code>
 */
function doUXPScript(scriptText, options) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            if (scriptText === undefined || scriptText === null) {
                retVal = Promise.reject(new Error("scriptText is required."));
                break;
            }

            if (! validateSyncSafeSource(scriptText, options)) {
                retVal = Promise.reject(new Error("Bridge source failed the sync-safe source check; see the log for the matched async token, or pass options.allowAsyncToken to bypass."));
                break;
            }

            retVal = createTempBridgeScriptFile(String(scriptText)).then(
                function handleTempBridgeScriptResolve(tempFilePath) {
                    return executeBridgePayload(tempFilePath).then(
                        function handleBridgeResolve(value) {
                            return cleanupTempBridgeScriptFile(tempFilePath).then(
                                function handleCleanupResolve() {
                                    return value;
                                }
                            );
                        },
                        function handleBridgeReject(err) {
                            crdtuxp.logError(arguments, "Bridge execution throws " + err);
                            return cleanupTempBridgeScriptFile(tempFilePath);
                        }
                    );
                }
            );

        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpIDSN.doUXPScript = doUXPScript;

/**
 * Run a UXPScript file through the InDesign bridge.<br>
 * <br>
 * The supplied file path is passed through directly; the bridge does not copy it to a
 * temporary file.<br>
 * <br>
 * If you want fail-loud inspection for the top-level launcher text, pass that source in
 * <code>options.sourceText</code> and set <code>options.requireSourceInspection = true</code>.
 *
 * @function doUXPScriptFile
 * @memberOf crdtuxpIDSN
 *
 * @param {string} filePath - absolute path, or a path relative to <code>options.basePath</code>
 * @param {object=} options - <code>{<br>
 *     basePath: base folder for relative file paths<br>
 *     sourceText: optional source text for sync-mode inspection<br>
 *     requireSourceInspection: reject if sourceText is not supplied<br>
 *     allowAsyncToken: false to reject inspected source containing the token async<br>
 *     clearPending: accepted for backward compatibility; currently ignored<br>
 *     engineName: accepted for backward compatibility; currently ignored<br>
 *     taskName: accepted for backward compatibility; currently ignored<br>
 * }</code>
 * @returns {Promise<any>} result returned by InDesign <code>doScript()</code>
 */
function doUXPScriptFile(filePath, options) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            let resolvedPath = resolveUXPScriptFilePath(filePath, options);
            if (! resolvedPath) {
                retVal = Promise.reject(new Error("filePath is required."));
                break;
            }

            if (! validateSyncSafeSource(options && options.sourceText, options)) {
                retVal = Promise.reject(new Error("Bridge source failed the sync-safe source check; see the log for the matched async token, or pass options.allowAsyncToken to bypass."));
                break;
            }

            retVal = executeBridgePayload(resolvedPath);
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpIDSN.doUXPScriptFile = doUXPScriptFile;

function executeBridgePayload(filePath) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            let bridgeContext = getBridgeContext();
            if (! bridgeContext) {
                crdtuxp.logError(arguments, "bridgeContext is undefined");
                break;
            }

            let uxpContext = bridgeContext.uxpContext;
            let uxpscriptLanguage = getUXPScriptLanguage(uxpContext);
            let runnerPath = resolveBridgeRunnerPath(bridgeContext);

            if (! uxpscriptLanguage) {
                crdtuxp.logError(arguments, "InDesign UXPSCRIPT language is unavailable.");
                break;
            }

            if (! runnerPath) {
                crdtuxp.logError(arguments, "Could not resolve the bridge runner path.");
                break;
            }

            if (! isAbsoluteNativePath(runnerPath)) {
                crdtuxp.logError(arguments, "Bridge runner path is not absolute: " + runnerPath);
                break;
            }

            setBridgePayload(filePath);
            retVal = Promise.resolve(uxpContext.app.doScript(runnerPath, uxpscriptLanguage));
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

function finalizeWithBridgeError(err) {
// coderstate: procedure
    const message = "UXPScript run failed: " + err;

    setBridgeState(message);
    crdtuxp.popAlert();

    return crdtuxp.finalize().then(
        function handleFinalizeReject() {
            crdtuxp.logError(arguments, "message " + message);
        }
    );
}
crdtuxpIDSN.finalizeWithBridgeError = finalizeWithBridgeError;

function finalizeWithBridgeValue(value) {
// coderstate: promisor

    setBridgeState(value);
    crdtuxp.popAlert();

    return crdtuxp.finalize().then(
        function handleFinalizeResolve() {
            return value;
        }
    );
}
crdtuxpIDSN.finalizeWithBridgeValue = finalizeWithBridgeValue;

function getAppLabel(key) {
// coderstate: function
    let retVal = "";

    do {
        try {

            let app = getInDesignApp();
            if (! app || typeof app.extractLabel != "function") {
                crdtuxp.logError(arguments, "app not available");
                break;
            }

            retVal = app.extractLabel(key);
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpIDSN.getAppLabel = getAppLabel;

function getAsyncModeHeuristicMatch(scriptText) {
// coderstate: function
    let retVal = "";

    do {
        try {
            let sourceText = sanitizeSourceForAsyncModeHeuristic(scriptText);
            let asyncPatterns = [
                /(^|[^\w$.])async\s+function\b/,
                /(^|[^\w$.])async\s+[_$A-Za-z][_$A-Za-z0-9]*\s*=>/,
                /(^|[^\w$.])async\s*\(/,
                /(^|[^\w$.])async\s+(?:static\s+)?(?:get\s+|set\s+)?(?:\*\s*)?[#_$A-Za-z][#_$A-Za-z0-9]*\s*\(/
            ];

            for (let index = 0; index < asyncPatterns.length; index += 1) {
                let match = sourceText.match(asyncPatterns[index]);
                if (! match) {
                    continue;
                }

                retVal = String(match[0]).replace(/^\s+/, "");
                break;
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
            retVal = "";
        }
    }
    while (false);

    return retVal;
}

function getBridgeContext() {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            let uxpContext = crdtuxp.getUXPContext();
            if (! uxpContext) {
                crdtuxp.logError(arguments, "Could not determine UXP context.");
                break;
            }

            if (
                uxpContext.uxpVariant != crdtuxp.UXP_VARIANT_INDESIGN_UXP
            &&
                uxpContext.uxpVariant != crdtuxp.UXP_VARIANT_INDESIGN_UXPSCRIPT
            ) {
                crdtuxp.logError(arguments, "UXPScript bridge is only available in desktop InDesign.");
                break;
            }

            if (! uxpContext.indesign || ! uxpContext.app || typeof uxpContext.app.doScript != "function") {
                crdtuxp.logError(arguments, "InDesign doScript() is unavailable.");
                break;
            }

            retVal = {
                crdtuxp: crdtuxp,
                uxpContext: uxpContext
            };
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}

function getBridgePayload() {
// coderstate: function

    return getAppLabel(crdtuxpIDSN.SCRIPT_LABEL_BRIDGE_PAYLOAD);
}
crdtuxpIDSN.getBridgePayload = getBridgePayload;

function getBridgeState() {
// coderstate: function

    return getAppLabel(crdtuxpIDSN.SCRIPT_LABEL_BRIDGE_STATE);
}
crdtuxpIDSN.getBridgeState = getBridgeState;

function getCRDTUXP() {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            retVal = global.crdtuxp;
            if (retVal) {
                break;
            }

            if (typeof require != "function") {
                break;
            }

            retVal = require("./crdtuxp.js");
            if (retVal) {
                global.crdtuxp = retVal;
            }
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}

function getInDesignApp() {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (global.app) {
                retVal = global.app;
                break;
            }

            if (typeof app != "undefined" && app && app.isValid) {
                global.app = app;
                retVal = global.app;
                break;
            }

            if (global.crdtuxp && typeof crdtuxp.getUXPContext == "function") {
                const uxpContext = crdtuxp.getUXPContext();
                if (uxpContext && uxpContext.app) {
                    global.app = uxpContext.app;
                    retVal = global.app;
                    break;
                }
            }

            const moduleRequire = getRequireFunction();
            if (! moduleRequire) {
                break;
            }

            const indesign = moduleRequire("indesign");
            const currentApp = indesign.app;

            if (! currentApp || ! currentApp.isValid) {
                break;
            }

            global.app = currentApp;
            retVal = global.app;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpIDSN.getInDesignApp = getInDesignApp;

function getRequireFunction() {
// coderstate: function
    let retVal = undefined;

    do {
        if (global && typeof global.require == "function") {
            retVal = global.require;
            break;
        }

        if (typeof require == "function") {
            retVal = require;
            break;
        }
    }
    while (false);

    return retVal;
}
crdtuxpIDSN.getRequireFunction = getRequireFunction;

function getStableInDesignApp() {
// coderstate: promisor

    return new Promise(
        function getStableInDesignAppExecutor(resolve, reject) {
            const deadline = Date.now() + APP_WAIT_TIMEOUT_MS;

            function checkForApp() {
                const currentApp = getInDesignApp();

                if (currentApp) {
                    resolve(currentApp);
                    return;
                }

                if (Date.now() > deadline) {
                    reject(new Error("InDesign app is unavailable."));
                    return;
                }

                setTimeout(checkForApp, APP_WAIT_INTERVAL_MS);
            }

            checkForApp();
        }
    );
}
crdtuxpIDSN.getStableInDesignApp = getStableInDesignApp;

function getUXPScriptLanguage(uxpContext) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (
                uxpContext
            &&
                uxpContext.indesign
            &&
                uxpContext.indesign.ScriptLanguage
            &&
                uxpContext.indesign.ScriptLanguage.UXPSCRIPT
            ) {
                retVal = uxpContext.indesign.ScriptLanguage.UXPSCRIPT;
                break;
            }

            if (
                global.indesignAPI
            &&
                global.indesignAPI.ScriptLanguage
            &&
                global.indesignAPI.ScriptLanguage.UXPSCRIPT
            ) {
                retVal = global.indesignAPI.ScriptLanguage.UXPSCRIPT;
                break;
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}

function isAbsoluteNativePath(filePath) {
// coderstate: function
    return /^(\/|[A-Za-z]:[\\/])/.test(String(filePath || ""));
}

function normalizeNativePath(filePath) {
// coderstate: function
    let retVal = undefined;

    do {
        try {

            if (filePath === undefined || filePath === null || filePath === "") {
                break;
            }

            retVal = String(filePath);

            if (retVal.indexOf(PLUGIN_PATH_PREFIX) != 0) {
                break;
            }

            let nativePath = retVal.substring(PLUGIN_PATH_PREFIX.length);

            if (! isAbsoluteNativePath(nativePath)) {
                crdtuxp.logError(arguments, "Unsupported plugin path: " + retVal);
                break;
            }

            retVal = nativePath;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
            retVal = undefined;
        }
    }
    while (false);

    return retVal;
}

function isElapsedLabelValue(value) {
// coderstate: function

    return /^\d+(\.\d+)?$/.test(String(value || ""));
}

function resolveBridgeRunnerPath(bridgeContext) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            let uxpContext = bridgeContext && bridgeContext.uxpContext;
            let crdtuxpFolderPath = undefined;

            if (
                crdtuxp
            &&
                crdtuxp.context
            &&
                crdtuxp.context.FILE_PATH_CRDT_UXP_FOLDER
            ) {
                crdtuxpFolderPath = String(crdtuxp.context.FILE_PATH_CRDT_UXP_FOLDER);
            }

            if (! crdtuxpFolderPath && typeof __filename == "string" && __filename) {
                if (! crdtuxp || ! crdtuxp.path || typeof crdtuxp.path.dirName != "function") {
                    crdtuxp.logError(arguments, "crdtuxp.path.dirName() is unavailable.");
                    break;
                }

                crdtuxpFolderPath = crdtuxp.path.dirName(__filename, {
                    addTrailingSeparator: true
                });
            }

            if (! crdtuxpFolderPath && crdtuxp && typeof crdtuxp.getCurrentScriptPath == "function") {
                let modulePath = crdtuxp.getCurrentScriptPath();

                if (modulePath) {
                    if (! crdtuxp || ! crdtuxp.path || typeof crdtuxp.path.dirName != "function") {
                        crdtuxp.logError(arguments, "crdtuxp.path.dirName() is unavailable.");
                        break;
                    }

                    crdtuxpFolderPath = crdtuxp.path.dirName(modulePath, {
                        addTrailingSeparator: true
                    });
                }
            }

            if (! crdtuxpFolderPath) {
                crdtuxp.logError(arguments, "Could not determine the CRDT_UXP folder path.");
                break;
            }

            if (uxpContext && uxpContext.path && typeof uxpContext.path.resolve == "function") {
                retVal = decodeURI(uxpContext.path.resolve("file://" + crdtuxpFolderPath, crdtuxpIDSN.BRIDGE_RUNNER_FILE_NAME).pathname);
                if (crdtuxp.IS_WINDOWS && retVal.substr(0,1) == "/") {
                    retVal = retVal.substr(1);
                }
                retVal = normalizeNativePath(retVal);
                break;
            }

            retVal = String(crdtuxpFolderPath) + crdtuxpIDSN.BRIDGE_RUNNER_FILE_NAME;
            retVal = normalizeNativePath(retVal);
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
            retVal = undefined;
        }
    }
    while (false);

    return retVal;
}

function resolveUXPScriptFilePath(filePath, options) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (filePath === undefined || filePath === null || filePath === "") {
                crdtuxp.logError(arguments, "need filePath");
                break;
            }

            retVal = normalizeNativePath(filePath);
            if (isAbsoluteNativePath(retVal)) {
                break;
            }

            retVal = String(filePath);

            let bridgeContext = getBridgeContext();
            if (! bridgeContext) {
                crdtuxp.logError(arguments, "failed to get bridgeContext");
                break;
            }

            let uxpContext = bridgeContext.uxpContext;
            let basePath = options && options.basePath;

            if (! basePath && crdtuxp.context) {
                basePath = 
                    crdtuxp.context.PATH_LAUNCHER_SCRIPT_PARENT
                    ||
                    crdtuxp.context.FILE_PATH_PROJECT_FOLDER
                    ||
                    crdtuxp.context.FILE_PATH_ROOT;
            }

            if (
                basePath
            &&
                uxpContext.path
            &&
                typeof uxpContext.path.resolve == "function"
            ) {
                retVal = decodeURI(uxpContext.path.resolve("file://" + String(basePath), retVal).pathname);
                if (crdtuxp.IS_WINDOWS && retVal.substr(0,1) == "/") {
                    retVal = retVal.substr(1);
                }
                retVal = normalizeNativePath(retVal);
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
            retVal = undefined;
        }
    }
    while (false);

    return retVal;
}

function sanitizeSourceForAsyncModeHeuristic(scriptText) {
// coderstate: function
    let retVal = "";

    do {
        try {
            let sourceText = String(scriptText || "");
            let state = "code";

            for (let index = 0; index < sourceText.length; index += 1) {
                let ch = sourceText.charAt(index);
                let nextCh = sourceText.charAt(index + 1);

                if (state == "lineComment") {
                    retVal += ch == "\n" ? "\n" : " ";
                    if (ch == "\n") {
                        state = "code";
                    }
                    continue;
                }

                if (state == "blockComment") {
                    if (ch == "*" && nextCh == "/") {
                        retVal += "  ";
                        index += 1;
                        state = "code";
                        continue;
                    }

                    retVal += ch == "\n" ? "\n" : " ";
                    continue;
                }

                if (
                    state == "singleQuote"
                ||
                    state == "doubleQuote"
                ||
                    state == "template"
                ) {
                    let quoteChar = state == "singleQuote" ? "'" : state == "doubleQuote" ? '"' : "`";

                    if (ch == "\\" && nextCh) {
                        retVal += "  ";
                        index += 1;
                        continue;
                    }

                    if (ch == quoteChar) {
                        retVal += " ";
                        state = "code";
                        continue;
                    }

                    retVal += ch == "\n" ? "\n" : " ";
                    continue;
                }

                if (ch == "/" && nextCh == "/") {
                    retVal += "  ";
                    index += 1;
                    state = "lineComment";
                    continue;
                }

                if (ch == "/" && nextCh == "*") {
                    retVal += "  ";
                    index += 1;
                    state = "blockComment";
                    continue;
                }

                if (ch == "'") {
                    retVal += " ";
                    state = "singleQuote";
                    continue;
                }

                if (ch == '"') {
                    retVal += " ";
                    state = "doubleQuote";
                    continue;
                }

                if (ch == "`") {
                    retVal += " ";
                    state = "template";
                    continue;
                }

                retVal += ch;
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
            retVal = "";
        }
    }
    while (false);

    return retVal;
}

function runPayload(filePath) {
// coderstate: function
    let retVal = undefined;

    do {
        try {

            const moduleRequire = getRequireFunction();
            if (! moduleRequire) {
                crdtuxp.logError(arguments, "require() is unavailable");
                break;
            }

            const indesign = moduleRequire("indesign");

            let app = getInDesignApp();
            if (! app) {
                crdtuxp.logError(arguments, "app not available");
                break;
            }

            retVal = runWithRedrawDisabled(
                function runPayloadWithRedrawDisabled() {
                    return app.doScript(filePath, indesign.ScriptLanguage.UXPSCRIPT);
                }
            );
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpIDSN.runPayload = runPayload;

function runWithRedrawDisabled(workFtn) {
// coderstate: procedure
    let retVal = undefined;

    let savedAppScriptPreferencesRedraw = false;

    do {
        try {

            let app = getInDesignApp();
            if (! app || typeof app.insertLabel != "function") {
                crdtuxp.logError(arguments, "app not available");
                break;
            }

            if (app && app.scriptPreferences && typeof app.scriptPreferences.enableRedraw != "undefined") {
                savedAppScriptPreferencesRedraw = app.scriptPreferences.enableRedraw;
                app.scriptPreferences.enableRedraw = false;
            }

            retVal = workFtn();
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);            
        }
            
    }
    while (false);

    if (savedAppScriptPreferencesRedraw) {
        try {
            app.scriptPreferences.enableRedraw = savedAppScriptPreferencesRedraw;
        }
        catch (restoreErr) {
            crdtuxp.logError(arguments, "failed to restore enableRedraw " + err);            
        }
    }

    return retVal;
}
crdtuxpIDSN.runWithRedrawDisabled = runWithRedrawDisabled;

function setAppLabel(key, value) {
// coderstate: procedure

    do {
        try {

            let app = getInDesignApp();
            if (! app || typeof app.insertLabel != "function") {
                crdtuxp.logError(arguments, "app not available");
                break;
            }

            app.insertLabel(key, value);
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);
}
crdtuxpIDSN.setAppLabel = setAppLabel;

function setBridgePayload(filePath) {
// coderstate: procedure

    setAppLabel(crdtuxpIDSN.SCRIPT_LABEL_BRIDGE_PAYLOAD, String(filePath));
}
crdtuxpIDSN.setBridgePayload = setBridgePayload;

function setBridgeState(value) {
// coderstate: procedure

    setAppLabel(crdtuxpIDSN.SCRIPT_LABEL_BRIDGE_STATE, String(value == null ? "" : value));
}
crdtuxpIDSN.setBridgeState = setBridgeState;

// setTimeout is callback-based, so this wrapper is the minimal bridge that lets
// the rest of the panel code use await for short polling delays.
function asyncSleep(milliseconds) {
// coderstate: promisor

    return new Promise(function asyncSleepPromise(resolve) {
        setTimeout(resolve, milliseconds);
    });
}
crdtuxpIDSN.asyncSleep = asyncSleep;

function validateSyncSafeSource(sourceText, options) {
// coderstate: function
    let retVal = false;

    do {
        try {

            if (sourceText === undefined || sourceText === null) {
                if (options && options.requireSourceInspection) {
                    crdtuxp.logError(arguments, "Bridge source text is required when requireSourceInspection is true.");
                    break;
                }
            }

            if (options && options.allowAsyncToken) {
                retVal = true;
                break;
            }

            let asyncHeuristicMatch = getAsyncModeHeuristicMatch(sourceText);
            if (asyncHeuristicMatch) {
                crdtuxp.logError(arguments, "Bridge source matches the rough async-mode heuristic (" + asyncHeuristicMatch + "). InDesign may switch the launch into slow redraw-heavy mode. This check can be bypassed with allowAsyncToken.");
                break;
            }

            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }

    }
    while (false);

    return retVal;
}

async function waitForBridgeResult(onStartedCallback, options) {
// coderstate: promisor

    let bridgeRequestTimeoutMilliseconds = BRIDGE_DEFAULT_REQUEST_TIMEOUT_MS;
    let bridgeCompletionTimeoutMilliseconds = BRIDGE_DEFAULT_COMPLETION_TIMEOUT_MS;
    let bridgeStatePollIntervalMilliseconds = BRIDGE_DEFAULT_STATE_POLL_INTERVAL_MS;
    if (options) {
        if (options.bridgeRequestTimeoutMilliseconds) {
            bridgeRequestTimeoutMilliseconds = options.bridgeRequestTimeoutMilliseconds;
        }
        if (options.bridgeCompletionTimeoutMilliseconds) {
            bridgeCompletionTimeoutMilliseconds = options.bridgeCompletionTimeoutMilliseconds;
        }
        if (options.bridgeStatePollIntervalMilliseconds) {
            bridgeStatePollIntervalMilliseconds = options.bridgeStatePollIntervalMilliseconds;
        }
    } 

    const requestDeadline = Date.now() + bridgeRequestTimeoutMilliseconds;
    const completionDeadline = Date.now() + bridgeCompletionTimeoutMilliseconds;

    let didReportStart = false;
    let errorMessage = undefined;

    while (true) {
        const bridgeState = getBridgeState();

        if (isElapsedLabelValue(bridgeState)) {
            return {
                ok: true,
                elapsedMilliseconds: Math.round(parseFloat(bridgeState) * 1000)
            };
        }

        if (bridgeState == crdtuxpIDSN.BRIDGE_STATE_STARTED) {
            if (! didReportStart) {
                didReportStart = true;
                if (typeof onStartedCallback == "function") {
                    onStartedCallback();
                }
            }
        }
        else if (bridgeState && bridgeState != crdtuxpIDSN.BRIDGE_STATE_REQUEST) {
            errorMessage = bridgeState;
            crdtuxp.logError(arguments, "error; bridgeState " + bridgeState);
            break;
        }

        if (! didReportStart && Date.now() > requestDeadline) {
            errorMessage = "Bridge request stayed pending for more than 5 seconds.";
            crdtuxp.logError(arguments, errorMessage);
            break;
        }

        if (didReportStart && Date.now() > completionDeadline) {
            errorMessage = "Bridge run did not finish within alloted time.";
            crdtuxp.logError(arguments, errorMessage);
            break;
        }

        await asyncSleep(bridgeStatePollIntervalMilliseconds);
    }

    return {
        ok: false,
        error: errorMessage || "Unknown bridge failure."
    };
}
crdtuxpIDSN.waitForBridgeResult = waitForBridgeResult;

/**
 * Rough async-mode heuristic for a top-level InDesign UXPScript launcher.<br>
 * <br>
 * Comments and quoted strings are stripped before matching common async syntax.
 * This is intentionally not a full JavaScript parser.
 *
 * @function wouldUXPScriptRunInAsyncMode
 * @memberOf crdtuxpIDSN
 * @param {string} scriptText - top-level launcher source text to inspect
 * @returns {boolean} true when the launcher matches the rough async-mode heuristic
 */
function wouldUXPScriptRunInAsyncMode(scriptText) {
// coderstate: function
    let retVal = false;

    try {
        retVal = getAsyncModeHeuristicMatch(scriptText) != "";
    }
    catch (err) {
        crdtuxp.logError(arguments, "throws " + err);
    }

    return retVal;
}
crdtuxpIDSN.wouldUXPScriptRunInAsyncMode = wouldUXPScriptRunInAsyncMode;
