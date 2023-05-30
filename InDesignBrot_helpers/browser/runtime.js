// Don't use `var UXES`
// By using `var` we will end up defining this in the wrong scope

if ("undefined" == typeof UXES) {
    UXES = {};
}

UXES.relativeFilePathsToLoad = [

    "../api/globals.js",
    "./api/globals.js",
    "../shared/globals.js",
    "./globals.js",

    "../api/tweakableSettings.js",
    "../shared/tweakableSettings.js",

    "../api/utils.js",
    "../shared/utils.js",
    "./utils.idjs",

    "../api/path.js",
    "../shared/path.js",
    "./path.idjs",

    "../api/fileio.js",
    "./fileio.idjs",
    
    "../api/idDOM.js",
    "./idDOM.idjs",

    "../api/compat.js",
    "./compat.idjs",

    "../shared/init.js",
    "../../InDesignBrot.js"
];

// require() and global.require() are different functions. I've come up with a mix-and-match
// using both. Below, I fetch UXES.fs and UXES.g_fs which are different 'fs-like'
// entities

if (! UXES.S) {
    UXES.S = {};
}

if (! UXES.C) {
    UXES.C = {};
}

if (! UXES.IMPLEMENTATION_MISSING) {
    UXES.IMPLEMENTATION_MISSING = function IMPLEMENTATION_MISSING() {
        UXES.logError("Implementation is missing");        
    };
}

if (! UXES.VALUE_NOT_INITIALIZED) {
    UXES.VALUE_NOT_INITIALIZED = { VALUE_NOT_INITIALIZED: true };
}

if (! UXES.tests) {
    UXES.tests = {};
}

if (! UXES.uxp) {
    UXES.uxp = require("uxp");
}

if (! UXES.storage) {
    UXES.storage = UXES.uxp.storage;
}

if (! UXES.fs) {
    UXES.fs = UXES.storage.localFileSystem;
}

if (! UXES.g_fs) {
    UXES.g_fs = global.require("fs");
}

UXES.initDirsScript = async function initDirsScript() {

    var retVal = false;

    do {
        try {

            if (! UXES.dirs) {
                UXES.dirs = {};
            }

            var appLocalTemp = await UXES.fs.getTemporaryFolder();
            UXES.dirs.TEMP = 
                UXES.path.addTrailingSeparator(appLocalTemp.nativePath);

            // At the moment, on Windows, the temp path seems to give us relevant data 
            // regarding the user's context. This can break at any new UXPScript
            // version!

            try {

                var splitTempPath = UXES.dirs.TEMP.split(UXES.path.SEPARATOR);

                if (UXES.isWindows) {

                    if (splitTempPath.length > 0) {
                        UXES.dirs.DRIVE_PREFIX = splitTempPath[0] + UXES.path.SEPARATOR;
                    }

                    if (splitTempPath.length > 1) {
                        UXES.dirs.USERS = 
                            UXES.dirs.DRIVE_PREFIX + 
                            splitTempPath[1] + UXES.path.SEPARATOR;
                    }

                    if (splitTempPath.length > 2) {
                        UXES.dirs.HOME = 
                            UXES.dirs.USERS + 
                            splitTempPath[2] + UXES.path.SEPARATOR;
                    }

                }
                else {
                
                    // On Mac, the temp path is located in /var... - of no use to us 
                    UXES.dirs.DRIVE_PREFIX = "";

                }
            }
            catch (err) {            
            }

            // Fall back to using ExtendScript if we did not manage to get the data
            if (! UXES.dirs.HOME) {
                UXES.dirs.HOME = 
                    UXES.path.addTrailingSeparator(
                        eval(
                            UXES.G.app.doScript(
                                ES_SCRIPT_getHomeDir, 
                                ScriptLanguage.JAVASCRIPT)));
            }

        }
        catch (err) { 
            UXES.criticalError("initScript throws " + err);
        }
    }
    while (false);
}

UXES.criticalError = function criticalError(error) {

    if (UXES.logError) {
        UXES.logError(error);
    }
    
    if (UXES.S.LOG_CRITICAL_ERRORS) {

        try {
            const desktop = 
                UXES.fs.getFolder(
                    UXES.storage.domains.userDesktop);
            const logFile = desktop.nativePath + "/criticalErrors.log";
            logFile.write(error);            
        }
        catch (err) {

            try {
                console.log(error);
            }
            catch (err) {   
            }

        }
    }
}

exports.loadModules = async function loadModules(nameSpace, completionCallback) {

    var failedTests = 0;
    var missingImplementations = 0;

    function verifyImplementationsAvailable(apiCollection) {
        if (apiCollection) {
            for (var entryName in apiCollection) {
                var entry = apiCollection[entryName];
                if ("function" == typeof entry && entry == UXES.IMPLEMENTATION_MISSING && entryName != "IMPLEMENTATION_MISSING") {
                    missingImplementations++;
                    UXES.criticalError("Missing implementation " + entryName);
                }
            }
        }
    }

    function runTests(testCollection) {
        if (testCollection) {
            for (var testEntryName in testCollection) {
                var testEntry = testCollection[testEntryName];
                if ("function" == typeof testEntry) {
                    if (! testEntry()) {
                        UXES.criticalError("Failed test " + testEntryName);
                        failedTests++;
                    }
                }
                else if ("object" == typeof testEntry) {
                    runTests(testEntry);
                }
            }
        }
    }

    for (var pathIdx = 0; pathIdx < UXES.relativeFilePathsToLoad.length; pathIdx++) {
        var path = UXES.relativeFilePathsToLoad[pathIdx];
        require(path);
    }

    await UXES.initDirsScript();

    UXES.sharedInitScript();

    for (var member in UXES) {
        nameSpace[member] = UXES[member];        
    }

    if (UXES.S.RUN_TESTS) {
        verifyImplementationsAvailable(UXES);
        runTests(UXES.tests);
    }

    await UXES.main();
}
