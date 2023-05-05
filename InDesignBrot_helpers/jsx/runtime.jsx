(function() {

// Don't use `var UXES`
// By using `var` we will end up defining this in the wrong scope

if ("undefined" == typeof UXES) {
    UXES = {};
}

UXES.relativeFilePathsToLoad = [

    "../shared/appMapper.js",

    "../api/globals.js",
    "../shared/globals.js",
    "./globals.jsx",

    "../api/tweakableSettings.js",
    "../shared/tweakableSettings.js",

    "../api/utils.js",
    "../shared/utils.js",
    "./utils.jsx",

    "../api/pathUtils.js",
    "../shared/pathUtils.js",
    "./pathUtils.jsx",

    "../api/fileio.js",
    "../shared/fileio.js",
    "./fileio.jsx",
    
    "../api/idDOM.js",
    "./idDOM.jsx",

    "../api/compat.js",
    "./compat.jsx",

    "./promiscuous-browser.jsx",

    "../shared/init.js",
    "../../InDesignBrot.js"
];

if (! UXES.tests) {
    UXES.tests = {};
}

UXES.initDirsScript = function initDirsScript() {

    var retVal = false;

    do {
        try {

            if (! UXES.dirs) {
                UXES.dirs = {};
            }

            UXES.dirs.HOME = UXES.path.addTrailingSeparator(Folder("~").fsName);
            UXES.dirs.DESKTOP = UXES.path.addTrailingSeparator(Folder.desktop.fsName);
            UXES.dirs.TEMP = UXES.path.addTrailingSeparator(Folder.temp.fsName);


            if (UXES.isMac) {
                UXES.dirs.DRIVE_PREFIX = "";
            }
            else {
                var splitHomePath = UXES.dirs.HOME.split(UXES.path.SEPARATOR);
                if (splitHomePath.length > 0) {
                    UXES.dirs.DRIVE_PREFIX = splitHomePath[0] + UXES.path.SEPARATOR;
                }
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
    
    if (UXES.S.LOG_CRITICAL_ERRORS && UXES.S.CRITICAL_LOG_FILE_ON_DESKTOP) {

        try {
            var logFile = File(Folder.desktop.fsName + "/" + UXES.S.CRITICAL_LOG_FILE_ON_DESKTOP);
            logFile.open("a");
            logFile.encoding = "UTF8";
            logFile.writeln(error);   
            logFile.close();         
        }
        catch (err) {

            try {
                alert(error);
            }
            catch (err) {   
            }

        }
    }
}

})();

UXES.loadModules = function loadModules(nameSpace, completionCallback) {

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

    var basePath = File($.fileName).parent.fsName + "/";
    for (var pathIdx = 0; pathIdx < UXES.relativeFilePathsToLoad.length; pathIdx++) {
        var path = basePath + UXES.relativeFilePathsToLoad[pathIdx];
        $.evalFile(path);
    }

    UXES.initDirsScript();
    UXES.sharedInitScript();

    for (var member in UXES) {
        nameSpace[member] = UXES[member];        
    }

    if (UXES.S.RUN_TESTS) {
        verifyImplementationsAvailable(UXES);
        runTests(UXES.tests);
    }

    UXES.main();

}
