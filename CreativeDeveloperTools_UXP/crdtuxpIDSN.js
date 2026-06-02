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

const DEFAULT_UXPSCRIPT_BRIDGE_ENGINE = "CRDT_UXP_UXPScriptBridge";
const DEFAULT_UXPSCRIPT_BRIDGE_TASK_NAME = "CRDT_UXP_UXPScriptBridgeTask";
const BRIDGE_RUNNER_FILE_NAME = "crdtuxpIDSN_bridge_runner.idjs";
const BRIDGE_PAYLOAD_LABEL = "__CRDT_UXP_INDESIGN_UXPSCRIPT_BRIDGE_PAYLOAD__";
const UXP_VARIANT_INDESIGN_UXP = "UXP_VARIANT_INDESIGN_UXP";
const UXP_VARIANT_INDESIGN_UXPSCRIPT = "UXP_VARIANT_INDESIGN_UXPSCRIPT";

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

function logBridgeError(reportingFunctionArguments, message) {
// coderstate: procedure
    let crdtuxp = getCRDTUXP();

    if (crdtuxp && typeof crdtuxp.logError == "function") {
        crdtuxp.logError(reportingFunctionArguments, message);
    }
    else if (typeof console != "undefined" && console && typeof console.error == "function") {
        console.error(message);
    }
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

            if (retVal.indexOf("plugin:") == 0) {
                let nativePath = retVal.substring("plugin:".length);

                if (! isAbsoluteNativePath(nativePath)) {
                    throw new Error("Unsupported plugin path: " + retVal);
                }

                retVal = nativePath;
            }
        }
        catch (err) {
            logBridgeError(arguments, "normalizeNativePath throws " + err);
            retVal = undefined;
        }
    }
    while (false);

    return retVal;
}

function getBridgeEngineName(options) {
// coderstate: function
    let retVal = DEFAULT_UXPSCRIPT_BRIDGE_ENGINE;

    try {
        if (options && options.engineName) {
            retVal = String(options.engineName);
        }
    }
    catch (err) {
        logBridgeError(arguments, "getBridgeEngineName throws " + err);
    }

    return retVal;
}
function getBridgeTaskName(options) {
// coderstate: function
    let retVal = DEFAULT_UXPSCRIPT_BRIDGE_TASK_NAME;

    try {
        if (options && options.taskName) {
            retVal = String(options.taskName);
        }
    }
    catch (err) {
        logBridgeError(arguments, "getBridgeTaskName throws " + err);
    }

    return retVal;
}

function getBridgeContext() {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            let crdtuxp = getCRDTUXP();
            if (! crdtuxp || typeof crdtuxp.getUXPContext != "function") {
                throw new Error("crdtuxp.js is unavailable.");
            }

            let uxpContext = crdtuxp.getUXPContext();
            if (! uxpContext) {
                throw new Error("Could not determine UXP context.");
            }

            if (
                uxpContext.uxpVariant != UXP_VARIANT_INDESIGN_UXP
            &&
                uxpContext.uxpVariant != UXP_VARIANT_INDESIGN_UXPSCRIPT
            ) {
                throw new Error("UXPScript bridge is only available in desktop InDesign.");
            }

            if (! uxpContext.indesign || ! uxpContext.app || typeof uxpContext.app.doScript != "function") {
                throw new Error("InDesign doScript() is unavailable.");
            }

            retVal = {
                crdtuxp: crdtuxp,
                uxpContext: uxpContext
            };
        }
        catch (err) {
            throw err;
        }
    }
    while (false);

    return retVal;
}

function wouldUXPScriptRunInAsyncMode(scriptText) {
// coderstate: function
    let retVal = false;

    try {
        retVal = /\basync\b/.test(String(scriptText || ""));
    }
    catch (err) {
        logBridgeError(arguments, "wouldUXPScriptRunInAsyncMode throws " + err);
    }

    return retVal;
}

module.exports.wouldUXPScriptRunInAsyncMode = wouldUXPScriptRunInAsyncMode;
module.exports.DEFAULT_UXPSCRIPT_BRIDGE_ENGINE = DEFAULT_UXPSCRIPT_BRIDGE_ENGINE;
module.exports.DEFAULT_UXPSCRIPT_BRIDGE_TASK_NAME = DEFAULT_UXPSCRIPT_BRIDGE_TASK_NAME;

function validateSyncSafeSource(sourceText, options) {
// coderstate: procedure
    if (options && options.allowAsyncToken) {
        return;
    }

    if (sourceText === undefined || sourceText === null) {
        if (options && options.requireSourceInspection) {
            throw new Error("Bridge source text is required when requireSourceInspection is true.");
        }
        return;
    }

    if (wouldUXPScriptRunInAsyncMode(sourceText)) {
        throw new Error("Bridge source contains the token 'async'. InDesign may switch the launch into slow redraw-heavy mode.");
    }
}

function resolveUXPScriptFilePath(filePath, options) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (filePath === undefined || filePath === null || filePath === "") {
                break;
            }

            retVal = normalizeNativePath(filePath);
            if (isAbsoluteNativePath(retVal)) {
                break;
            }

            retVal = String(filePath);

            let bridgeContext = getBridgeContext();
            let crdtuxp = bridgeContext.crdtuxp;
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
                retVal = uxpContext.path.resolve(String(basePath), retVal);
                retVal = normalizeNativePath(retVal);
            }
        }
        catch (err) {
            logBridgeError(arguments, "resolveUXPScriptFilePath throws " + err);
            retVal = undefined;
        }
    }
    while (false);

    return retVal;
}

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
            logBridgeError(arguments, "getUXPScriptLanguage throws " + err);
        }
    }
    while (false);

    return retVal;
}

function resolveBridgeRunnerPath(bridgeContext) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            let crdtuxp = bridgeContext && bridgeContext.crdtuxp;
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
                    throw new Error("crdtuxp.path.dirName() is unavailable.");
                }

                crdtuxpFolderPath = crdtuxp.path.dirName(__filename, {
                    addTrailingSeparator: true
                });
            }

            if (! crdtuxpFolderPath && crdtuxp && typeof crdtuxp.getCurrentScriptPath == "function") {
                let modulePath = crdtuxp.getCurrentScriptPath();

                if (modulePath) {
                    if (! crdtuxp || ! crdtuxp.path || typeof crdtuxp.path.dirName != "function") {
                        throw new Error("crdtuxp.path.dirName() is unavailable.");
                    }

                    crdtuxpFolderPath = crdtuxp.path.dirName(modulePath, {
                        addTrailingSeparator: true
                    });
                }
            }

            if (! crdtuxpFolderPath) {
                throw new Error("Could not determine the CRDT_UXP folder path.");
            }

            if (uxpContext && uxpContext.path && typeof uxpContext.path.resolve == "function") {
                retVal = uxpContext.path.resolve(crdtuxpFolderPath, BRIDGE_RUNNER_FILE_NAME);
                retVal = normalizeNativePath(retVal);
                break;
            }

            retVal = String(crdtuxpFolderPath) + BRIDGE_RUNNER_FILE_NAME;
            retVal = normalizeNativePath(retVal);
        }
        catch (err) {
            logBridgeError(arguments, "resolveBridgeRunnerPath throws " + err);
            retVal = undefined;
        }
    }
    while (false);

    return retVal;
}

function setBridgePayload(bridgeContext, payload) {
// coderstate: procedure
    let app = bridgeContext && bridgeContext.uxpContext && bridgeContext.uxpContext.app;

    if (! app || typeof app.insertLabel != "function") {
        throw new Error("InDesign label API is unavailable.");
    }

    app.insertLabel(BRIDGE_PAYLOAD_LABEL, JSON.stringify(payload || {}));
}

function executeBridgePayload(payload) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            let bridgeContext = getBridgeContext();
            let uxpContext = bridgeContext.uxpContext;
            let uxpscriptLanguage = getUXPScriptLanguage(uxpContext);
            let runnerPath = resolveBridgeRunnerPath(bridgeContext);

            if (! uxpscriptLanguage) {
                throw new Error("InDesign UXPSCRIPT language is unavailable.");
            }

            if (! runnerPath) {
                throw new Error("Could not resolve the bridge runner path.");
            }

            if (! isAbsoluteNativePath(runnerPath)) {
                throw new Error("Bridge runner path is not absolute: " + runnerPath);
            }

            setBridgePayload(bridgeContext, payload);
            retVal = Promise.resolve(uxpContext.app.doScript(runnerPath, uxpscriptLanguage));
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

function createTempBridgeScriptFile(scriptText) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            let crdtuxp = getCRDTUXP();
            if (! crdtuxp || typeof crdtuxp.getDir != "function") {
                throw new Error("crdtuxp.getDir() is unavailable.");
            }

            retVal = Promise.resolve(crdtuxp.getDir(crdtuxp.TMP_DIR)).then(function handleTmpDirResolve(tmpDirPath) {
                let tempFilePath = undefined;

                if (! tmpDirPath) {
                    throw new Error("Could not resolve the temporary directory.");
                }

                tempFilePath = String(tmpDirPath)
                    + "crdtuxpIDSN_bridge_"
                    + String(Date.now())
                    + "_"
                    + String(Math.floor(Math.random() * 1000000000))
                    + ".idjs";

                return Promise.resolve(crdtuxp.fileAppendString(tempFilePath, String(scriptText))).then(function handleWriteResolve(writeSucceeded) {
                    if (! writeSucceeded) {
                        throw new Error("Could not write the temporary bridge payload file.");
                    }

                    return tempFilePath;
                });
            });
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

function cleanupTempBridgeScriptFile(filePath) {
// coderstate: procedure
    try {
        let crdtuxp = getCRDTUXP();

        if (! filePath || ! crdtuxp || typeof crdtuxp.fileDelete != "function") {
            return;
        }

        Promise.resolve(crdtuxp.fileDelete(String(filePath))).then(
            function handleDeleteResolve(deleteSucceeded) {
                if (! deleteSucceeded) {
                    logBridgeError(arguments, "Could not delete temporary bridge payload file " + filePath);
                }
            },
            function handleDeleteReject(err) {
                logBridgeError(arguments, "Deleting temporary bridge payload file throws " + err);
            }
        );
    }
    catch (err) {
        logBridgeError(arguments, "cleanupTempBridgeScriptFile throws " + err);
    }
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
 * By default, the bridge rejects source that contains the token <code>async</code>, because
 * observed InDesign behavior suggests that the top-level launcher can switch into a slower,
 * redraw-heavy mode even when that token only appears in comments or strings.
 *
 * @function doUXPScript
 * @memberOf crdtuxpIDSN
 *
 * @param {string} scriptText - UXPScript source to run
 * @param {object=} options - <code>{<br>
 *     allowAsyncToken: false to reject source containing the token async<br>
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

            validateSyncSafeSource(scriptText, options);

            retVal = createTempBridgeScriptFile(String(scriptText)).then(function handleTempBridgeScriptResolve(tempFilePath) {
                return executeBridgePayload({
                    mode: "file",
                    filePath: tempFilePath,
                    clearPending: ! options || options.clearPending !== false,
                    taskName: getBridgeTaskName(options)
                }).then(
                    function handleBridgeResolve(value) {
                        cleanupTempBridgeScriptFile(tempFilePath);
                        return value;
                    },
                    function handleBridgeReject(err) {
                        cleanupTempBridgeScriptFile(tempFilePath);
                        throw err;
                    }
                );
            });
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

module.exports.doUXPScript = doUXPScript;

/**
 * Run a UXPScript file through the InDesign bridge.<br>
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

            validateSyncSafeSource(options && options.sourceText, options);

            retVal = executeBridgePayload({
                mode: "file",
                filePath: resolvedPath,
                clearPending: ! options || options.clearPending !== false,
                taskName: getBridgeTaskName(options)
            });
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

module.exports.doUXPScriptFile = doUXPScriptFile;

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

    let crdtuxp = getCRDTUXP();

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
            if (crdtuxp && typeof crdtuxp.logError == "function") {
                crdtuxp.logError(arguments, "throws " + err);
            }
        }
    }
    while (false);

    return retVal;
}

module.exports.collectionToArray = collectionToArray;
