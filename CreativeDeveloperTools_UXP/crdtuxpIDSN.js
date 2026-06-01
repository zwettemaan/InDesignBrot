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

const JAVASCRIPT_LANG = 1246920229;
const DEFAULT_UXPSCRIPT_BRIDGE_ENGINE = "CRDT_UXP_UXPScriptBridge";
const DEFAULT_UXPSCRIPT_BRIDGE_TASK_NAME = "CRDT_UXP_UXPScriptBridgeTask";
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

function quoteForJavaScript(value) {
// coderstate: function
    let crdtuxp = getCRDTUXP();

    if (crdtuxp && typeof crdtuxp.dQ == "function") {
        return crdtuxp.dQ(value);
    }

    return JSON.stringify(String(value == null ? "" : value));
}

function isAbsoluteNativePath(filePath) {
// coderstate: function
    return /^(\/|[A-Za-z]:[\\/])/.test(String(filePath || ""));
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

function getJavaScriptLanguage(uxpContext) {
// coderstate: function
    let retVal = JAVASCRIPT_LANG;

    do {
        try {
            if (
                uxpContext
            &&
                uxpContext.indesign
            &&
                uxpContext.indesign.ScriptLanguage
            &&
                uxpContext.indesign.ScriptLanguage.JAVASCRIPT
            ) {
                retVal = uxpContext.indesign.ScriptLanguage.JAVASCRIPT;
                break;
            }

            if (
                global.indesignAPI
            &&
                global.indesignAPI.ScriptLanguage
            &&
                global.indesignAPI.ScriptLanguage.JAVASCRIPT
            ) {
                retVal = global.indesignAPI.ScriptLanguage.JAVASCRIPT;
                break;
            }
        }
        catch (err) {
            logBridgeError(arguments, "getJavaScriptLanguage throws " + err);
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

            retVal = String(filePath);
            if (isAbsoluteNativePath(retVal)) {
                break;
            }

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

function buildBridgeSource(options) {
// coderstate: function
    let taskName = getBridgeTaskName(options);
    let engineName = getBridgeEngineName(options);

    return [
        "#targetengine " + quoteForJavaScript(engineName),
        "",
        "if (\"undefined\" == typeof CRDTUXPInDesignUXPScriptBridge) {",
        "    CRDTUXPInDesignUXPScriptBridge = {};",
        "}",
        "",
        "(function (bridge) {",
        "    var STATE_NAME = \"__CRDT_UXP_INDESIGN_UXPSCRIPT_BRIDGE_STATE__\";",
        "    var DEFAULT_TASK_NAME = " + quoteForJavaScript(taskName) + ";",
        "",
        "    function getTaskName(entry) {",
        "        if (entry && entry.taskName) {",
        "            return String(entry.taskName);",
        "        }",
        "        return DEFAULT_TASK_NAME;",
        "    }",
        "",
        "    function getNamedTasks(taskName) {",
        "        var matches = [];",
        "        var targetName = String(taskName || DEFAULT_TASK_NAME);",
        "",
        "        try {",
        "            var tasks = app.idleTasks.everyItem().getElements();",
        "            for (var index = 0; index < tasks.length; index++) {",
        "                if (tasks[index] && tasks[index].isValid && tasks[index].name == targetName) {",
        "                    matches.push(tasks[index]);",
        "                }",
        "            }",
        "        }",
        "        catch (err) {",
        "        }",
        "",
        "        return matches;",
        "    }",
        "",
        "    function removeTask(task) {",
        "        try {",
        "            if (task && task.isValid) {",
        "                task.remove();",
        "            }",
        "        }",
        "        catch (err) {",
        "        }",
        "    }",
        "",
        "    function clearNamedTasks(taskName) {",
        "        var matches = getNamedTasks(taskName);",
        "",
        "        for (var index = matches.length - 1; index >= 0; index--) {",
        "            removeTask(matches[index]);",
        "        }",
        "    }",
        "",
        "    function getState() {",
        "        var state = $.global[STATE_NAME];",
        "",
        "        if (! state) {",
        "            state = {",
        "                queue: [],",
        "                task: null,",
        "                boundTask: null,",
        "                taskName: DEFAULT_TASK_NAME,",
        "                handlerInstalled: false,",
        "                onIdle: null",
        "            };",
        "            $.global[STATE_NAME] = state;",
        "        }",
        "",
        "        if (! state.onIdle) {",
        "            state.onIdle = function () {",
        "                var activeState = getState();",
        "                var pending = activeState.queue.slice(0);",
        "                activeState.queue = [];",
        "",
        "                try {",
        "                    if (activeState.task && activeState.task.isValid) {",
        "                        activeState.task.sleep = 0;",
        "                    }",
        "                }",
        "                catch (sleepErr) {",
        "                }",
        "",
        "                for (var index = 0; index < pending.length; index++) {",
        "                    try {",
        "                        runEntry(pending[index]);",
        "                    }",
        "                    catch (runErr) {",
        "                        $.writeln(\"[CRDT_UXP UXPScriptBridge] \" + runErr);",
        "                    }",
        "                }",
        "",
        "                if (activeState.queue.length > 0) {",
        "                    try {",
        "                        if (activeState.task && activeState.task.isValid) {",
        "                            activeState.task.sleep = 1;",
        "                        }",
        "                    }",
        "                    catch (wakeErr) {",
        "                    }",
        "                }",
        "                else {",
        "                    detachTask(activeState);",
        "                }",
        "            };",
        "        }",
        "",
        "        return state;",
        "    }",
        "",
        "    function detachTask(state) {",
        "        if (! state) {",
        "            return;",
        "        }",
        "",
        "        try {",
        "            if (state.handlerInstalled && state.boundTask && state.boundTask.isValid) {",
        "                state.boundTask.removeEventListener(IdleTask.ON_IDLE, state.onIdle);",
        "            }",
        "        }",
        "        catch (removeListenerErr) {",
        "        }",
        "",
        "        removeTask(state.boundTask || state.task);",
        "        state.task = null;",
        "        state.boundTask = null;",
        "        state.handlerInstalled = false;",
        "    }",
        "",
        "    function normalizeEntry(entry) {",
        "        var normalized = {",
        "            mode: null,",
        "            taskName: getTaskName(entry),",
        "            clearPending: ! entry || entry.clearPending !== false",
        "        };",
        "",
        "        if (! entry || ! entry.mode) {",
        "            throw new Error(\"Bridge payload is missing mode.\");",
        "        }",
        "",
        "        normalized.mode = String(entry.mode);",
        "",
        "        if (normalized.mode == \"file\") {",
        "            if (! entry.filePath) {",
        "                throw new Error(\"Bridge payload is missing filePath.\");",
        "            }",
        "            normalized.filePath = String(entry.filePath);",
        "            return normalized;",
        "        }",
        "",
        "        if (normalized.mode == \"text\") {",
        "            normalized.scriptText = String(entry.scriptText || \"\");",
        "            return normalized;",
        "        }",
        "",
        "        throw new Error(\"Unsupported bridge mode: \" + normalized.mode);",
        "    }",
        "",
        "    function getOrCreateTask(taskName) {",
        "        var matches = getNamedTasks(taskName);",
        "        var task = null;",
        "",
        "        if (matches.length > 0) {",
        "            task = matches[0];",
        "            for (var duplicateIndex = matches.length - 1; duplicateIndex >= 1; duplicateIndex--) {",
        "                removeTask(matches[duplicateIndex]);",
        "            }",
        "            return task;",
        "        }",
        "",
        "        task = app.idleTasks.add();",
        "        task.name = String(taskName || DEFAULT_TASK_NAME);",
        "        task.sleep = 0;",
        "        return task;",
        "    }",
        "",
        "    function runWithRedrawDisabled(work) {",
        "        var originalEnableRedraw = null;",
        "        var redrawChanged = false;",
        "",
        "        try {",
        "            if (app && app.scriptPreferences && typeof app.scriptPreferences.enableRedraw != \"undefined\") {",
        "                originalEnableRedraw = app.scriptPreferences.enableRedraw;",
        "                app.scriptPreferences.enableRedraw = false;",
        "                redrawChanged = true;",
        "            }",
        "",
        "            return work();",
        "        }",
        "        finally {",
        "            if (redrawChanged) {",
        "                try {",
        "                    app.scriptPreferences.enableRedraw = originalEnableRedraw;",
        "                }",
        "                catch (restoreErr) {",
        "                }",
        "            }",
        "        }",
        "    }",
        "",
        "    function runEntry(entry) {",
        "        return runWithRedrawDisabled(function () {",
        "            if (entry.mode == \"file\") {",
        "                app.doScript(File(entry.filePath), ScriptLanguage.UXPSCRIPT);",
        "                return;",
        "            }",
        "",
        "            if (entry.mode == \"text\") {",
        "                app.doScript(entry.scriptText, ScriptLanguage.UXPSCRIPT);",
        "                return;",
        "            }",
        "",
        "            throw new Error(\"Unsupported bridge mode: \" + entry.mode);",
        "        });",
        "    }",
        "",
        "    bridge.handle = function (entry) {",
        "        var normalizedEntry = normalizeEntry(entry);",
        "        var state = getState();",
        "",
        "        if (normalizedEntry.clearPending) {",
        "            state.queue = [];",
        "            detachTask(state);",
        "            clearNamedTasks(normalizedEntry.taskName);",
        "        }",
        "",
        "        state.taskName = normalizedEntry.taskName;",
        "        state.task = getOrCreateTask(normalizedEntry.taskName);",
        "        if (state.boundTask !== state.task) {",
        "            state.boundTask = state.task;",
        "            state.handlerInstalled = false;",
        "        }",
        "",
        "        if (! state.handlerInstalled) {",
        "            state.task.addEventListener(IdleTask.ON_IDLE, state.onIdle);",
        "            state.handlerInstalled = true;",
        "        }",
        "",
        "        state.queue.push(normalizedEntry);",
        "        state.task.sleep = 1;",
        "        return true;",
        "    };",
        "",
        "    bridge.clear = function (entry) {",
        "        var state = getState();",
        "        var taskName = getTaskName(entry);",
        "",
        "        state.queue = [];",
        "        detachTask(state);",
        "        clearNamedTasks(taskName);",
        "        return true;",
        "    };",
        "",
        "    bridge.handleFromJson = function (rawPayload) {",
        "        return bridge.handle(eval(\"(\" + rawPayload + \")\"));",
        "    };",
        "",
        "    bridge.clearFromJson = function (rawPayload) {",
        "        return bridge.clear(eval(\"(\" + rawPayload + \")\"));",
        "    };",
        "})(CRDTUXPInDesignUXPScriptBridge);"
    ].join("\n");
}

function buildInvocationSource(payload, options) {
// coderstate: function
    let payloadJson = JSON.stringify(payload || {});

    return buildBridgeSource(options)
        + "\nCRDTUXPInDesignUXPScriptBridge.handleFromJson(" + quoteForJavaScript(payloadJson) + ");\n";
}

function buildClearSource(options) {
// coderstate: function
    let payloadJson = JSON.stringify({
        taskName: getBridgeTaskName(options)
    });

    return buildBridgeSource(options)
        + "\nCRDTUXPInDesignUXPScriptBridge.clearFromJson(" + quoteForJavaScript(payloadJson) + ");\n";
}

function executeBridgeSource(sourceText) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            let bridgeContext = getBridgeContext();
            let uxpContext = bridgeContext.uxpContext;
            let javascriptLanguage = getJavaScriptLanguage(uxpContext);

            retVal = Promise.resolve(uxpContext.app.doScript(sourceText, javascriptLanguage));
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

/**
 * Run a UXPScript source string through the InDesign idle-task bridge.<br>
 * <br>
 * This is meant for panel-side code that needs the final InDesign-facing work to run as
 * a host-owned UXPScript launch instead of directly inside the panel runtime.<br>
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
 *     clearPending: true to replace any earlier pending bridge launch<br>
 *     engineName: persistent ExtendScript engine name used for the bridge<br>
 *     taskName: idle task name used for the bridge<br>
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

            retVal = executeBridgeSource(
                buildInvocationSource(
                    {
                        mode: "text",
                        scriptText: String(scriptText),
                        clearPending: ! options || options.clearPending !== false,
                        taskName: getBridgeTaskName(options)
                    },
                    options
                )
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
 * Run a UXPScript file through the InDesign idle-task bridge.<br>
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
 *     clearPending: true to replace any earlier pending bridge launch<br>
 *     engineName: persistent ExtendScript engine name used for the bridge<br>
 *     taskName: idle task name used for the bridge<br>
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

            retVal = executeBridgeSource(
                buildInvocationSource(
                    {
                        mode: "file",
                        filePath: resolvedPath,
                        clearPending: ! options || options.clearPending !== false,
                        taskName: getBridgeTaskName(options)
                    },
                    options
                )
            );
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
 * Remove the current bridge idle task and clear any queued launches.
 *
 * @function clearUXPScriptBridge
 * @memberOf crdtuxpIDSN
 *
 * @param {object=} options - <code>{<br>
 *     engineName: persistent ExtendScript engine name used for the bridge<br>
 *     taskName: idle task name used for the bridge<br>
 * }</code>
 * @returns {Promise<any>} result returned by InDesign <code>doScript()</code>
 */
function clearUXPScriptBridge(options) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            retVal = executeBridgeSource(buildClearSource(options));
        }
        catch (err) {
            retVal = Promise.reject(err);
        }
    }
    while (false);

    return retVal;
}

module.exports.clearUXPScriptBridge = clearUXPScriptBridge;

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
