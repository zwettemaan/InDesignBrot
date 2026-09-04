// Copyright (c) 2024–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: Elastic-2.0
// https://github.com/zwettemaan/CRDT_UXP

// Shared by crdtuxpIDSN_bridge_runner.idjs (runs standalone inside the
// UXPScript engine instance spun up via app.doScript) and the InDesignBrot
// panel's main.js (runs in the panel's own UXP webview context). These are
// separate JS runtimes with no shared global/module state, so this file is
// require()'d independently by each — one source of truth, two loaded copies.

const APP_WAIT_TIMEOUT_MS = 2000;
const APP_WAIT_INTERVAL_MS = 25;

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
            console.log("getInDesignApp throws " + err);
        }
    }
    while (false);

    return retVal;
}

function waitForInDesignApp() {
// coderstate: promisor

    return new Promise(
        function waitForInDesignAppExecutor(resolve, reject) {
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

module.exports.getRequireFunction = getRequireFunction;
module.exports.getInDesignApp = getInDesignApp;
module.exports.waitForInDesignApp = waitForInDesignApp;
