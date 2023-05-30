UXES = global.UXES;
if (! UXES) {
    UXES = {};
    global.UXES = UXES;
}

UXES.relativeFilePathsToLoad = [

    "../shared/appMapper.js",

    "../api/globals.js",
    "./api/globals.js",
    "../shared/globals.js",
    "./globals.js",

    "../api/tweakableSettings.js",
    "../shared/tweakableSettings.js",

    "../api/utils.js",
    "../shared/utils.js",
    "./utils.js",

    "../api/path.js",
    "../shared/path.js",
    "./path.js",

    "../api/fileio.js",
    "./fileio.js",
    
    "../api/compat.js",
    "./compat.js",

    "../shared/init.js",
    "../../InDesignBrot.js"
];

UXES.initDirsScript = function initDirsScript() {

    var retVal = false;

    do {
        try {

            if (! UXES.dirs) {
                UXES.dirs = {};
            }

            UXES.dirs.TEMP = 
                UXES.path.addTrailingSeparator(UXES.os.tmpdir());

            UXES.dirs.HOME = 
                UXES.path.addTrailingSeparator(process.env.HOME);

            UXES.dirs.DESKTOP = 
                UXES.dirs.HOME + "Desktop" + UXES.path.SEPARATOR;

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
            const desktop = process.env.HOME + "/Desktop";
            const logFile = desktop + "/criticalErrors.log";
            UXES.fs.writeSync(logFile, error + "\n");
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

    UXES.G = global;

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
                    if (testEntry()) {
                        UXES.logNote("Passed test " + testEntryName);
                    }
                    else {
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

    UXES.initDirsScript();

    UXES.sharedInitScript();

    for (var member in UXES) {
        nameSpace[member] = UXES[member]; 
        exports[member] = UXES[member];       
    }

    if (UXES.S.RUN_TESTS) {
        verifyImplementationsAvailable(UXES);
        runTests(UXES.tests);
    }

    UXES.main();
}
