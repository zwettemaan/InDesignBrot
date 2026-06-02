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

const PLUGIN_PATH_PREFIX = "plugin:";
const BRIDGE_RUNNER_FILE_NAME = "crdtuxpIDSN_bridge_runner.idjs";
const BRIDGE_PAYLOAD_LABEL = "__CRDT_UXP_INDESIGN_UXPSCRIPT_BRIDGE_PAYLOAD__";

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

function wouldUXPScriptRunInAsyncMode(scriptText) {
// coderstate: function
    let retVal = false;

    try {
        retVal = /\basync\b/.test(String(scriptText || ""));
    }
    catch (err) {
        crdtuxp.logError(arguments, "throws " + err);
    }

    return retVal;
}

module.exports.wouldUXPScriptRunInAsyncMode = wouldUXPScriptRunInAsyncMode;

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

            if (wouldUXPScriptRunInAsyncMode(sourceText)) {
                crdtuxp.logError(arguments, "Bridge source contains the token 'async'. InDesign may switch the launch into slow redraw-heavy mode.");
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
            crdtuxp.logError(arguments, "throws " + err);
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
            crdtuxp.logError(arguments, "throws " + err);
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
                retVal = uxpContext.path.resolve(crdtuxpFolderPath, BRIDGE_RUNNER_FILE_NAME);
                retVal = normalizeNativePath(retVal);
                break;
            }

            retVal = String(crdtuxpFolderPath) + BRIDGE_RUNNER_FILE_NAME;
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

function setBridgePayload(bridgeContext, filePath) {
// coderstate: procedure

    do {
        try {
            let app = bridgeContext && bridgeContext.uxpContext && bridgeContext.uxpContext.app;

            if (! app || typeof app.insertLabel != "function") {
                crdtuxp.logError(arguments, "InDesign label API is unavailable.");
                break;
            }

            if (! filePath) {
                crdtuxp.logError(arguments, "Bridge payload filePath is unavailable.");
                break;
            }

            app.insertLabel(BRIDGE_PAYLOAD_LABEL, String(filePath));
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);
}

function executeBridgePayload(filePath) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            let bridgeContext = getBridgeContext();
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

            setBridgePayload(bridgeContext, filePath);
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
            retVal = Promise.resolve(crdtuxp.getDir(crdtuxp.TMP_DIR)).then(
                function handleTmpDirResolve(tmpDirPath) {
                    // coderstate: promisor

                    let tempFilePath = undefined;
                    do {
                        if (! tmpDirPath) {
                            crdtuxp.logError(arguments, "Could not resolve the temporary directory.");
                            break;
                        }

                        tempFilePath = String(tmpDirPath)
                            + "crdtuxpIDSN_bridge_"
                            + String(Date.now())
                            + "_"
                            + String(Math.floor(Math.random() * 1000000000))
                            + ".idjs";

                        return Promise.resolve(crdtuxp.fileAppendString(tempFilePath, String(scriptText))).then(
                            function handleWriteResolve(writeSucceeded) {
                                // coderstate: function

                                do {
                                    
                                    if (! writeSucceeded) {
                                        crdtuxp.logError(arguments, "Could not write the temporary bridge payload file.");
                                    }
                                    
                                }
                                while (false);

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

function cleanupTempBridgeScriptFile(filePath) {
// coderstate: procedure

    do {
        try {
            
            if (! filePath || ! crdtuxp || typeof crdtuxp.fileDelete != "function") {
                break;
            }

            Promise.resolve(crdtuxp.fileDelete(String(filePath))).then(
                function handleDeleteResolve(deleteSucceeded) {
                    if (! deleteSucceeded) {
                        crdtuxp.logError(arguments, "Could not delete temporary bridge payload file " + filePath);
                    }
                },
                function handleDeleteReject(err) {
                    crdtuxp.logError(arguments, "Deleting temporary bridge payload file throws " + err);
                }
            );
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);
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

            retVal = createTempBridgeScriptFile(String(scriptText)).then(
                function handleTempBridgeScriptResolve(tempFilePath) {
                    return executeBridgePayload(tempFilePath).then(
                        function handleBridgeResolve(value) {
                            cleanupTempBridgeScriptFile(tempFilePath);
                            return value;
                        },
                        function handleBridgeReject(err) {
                            cleanupTempBridgeScriptFile(tempFilePath);
                            crdtuxp.logError(arguments, "Bridge execution throws " + err);
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

module.exports.doUXPScript = doUXPScript;

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

            validateSyncSafeSource(options && options.sourceText, options);

            retVal = executeBridgePayload(resolvedPath);
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

module.exports.collectionToArray = collectionToArray;
