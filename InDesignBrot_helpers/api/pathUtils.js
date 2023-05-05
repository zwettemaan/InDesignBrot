//
// This is the utils API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

(function(){


function declareAPI() {

    if (! UXES.path) {
        UXES.path = {};
    }

    UXES.path.addTrailingSeparator = UXES.IMPLEMENTATION_MISSING;
    UXES.path.basename             = UXES.IMPLEMENTATION_MISSING;
    UXES.path.dirname              = UXES.IMPLEMENTATION_MISSING;
    UXES.path.exists               = UXES.IMPLEMENTATION_MISSING;
    UXES.path.filenameExtension    = UXES.IMPLEMENTATION_MISSING;
    UXES.path.guessSeparator       = UXES.IMPLEMENTATION_MISSING;
    UXES.path.isDir                = UXES.IMPLEMENTATION_MISSING;
    UXES.path.mkdir                = UXES.IMPLEMENTATION_MISSING;

}

//----------- Tests

if (! UXES.tests.path) {
    UXES.tests.path = {};
}

UXES.tests.path.basename = function test_basename() {

    var retVal = true;

    do {
        var expected;
        var filePath;

        if (UXES.isMac) {
            expected = "kris";
            filePath = "/Users/kris";
        }
        else {
            expected = "kris";
            filePath = "C:\\Users\\kris";
        }
        if (expected != UXES.path.basename(filePath)) {
            retVal = false;
        }

        if (UXES.isMac) {
            expected = "kris";
            filePath = "/Users/kris/";
        }
        else {
            expected = "kris";
            filePath = "C:\\Users\\kris\\";
        }
        if (expected != UXES.path.basename(filePath)) {
            retVal = false;
        }

        expected = "kris";
        filePath = "/Users/kris";
        if (expected != UXES.path.basename(filePath, UXES.path.GUESS_SEPARATOR)) {
            retVal = false;
        }

        expected = "kris";
        filePath = "/Users/kris/";
        if (expected != UXES.path.basename(filePath, UXES.path.GUESS_SEPARATOR)) {
            retVal = false;
        }

    }
    while (false);

    return retVal;
}

UXES.tests.path.checkLowLevelPathFunctions = function checkLowLevelPathFunctions() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            if (UXES.isWindows) {

                // Directory
                if (! UXES.path.exists(UXES.dirs.DRIVE_PREFIX + "/Users")) {
                    UXES.logError(arguments, UXES.dirs.DRIVE_PREFIX + "/Users should exist");
                    break;
                }

                // Directory with trailing separator
                if (! UXES.path.exists(UXES.dirs.DRIVE_PREFIX + "/Users/")) {
                    UXES.logError(arguments, UXES.dirs.DRIVE_PREFIX + "/Users/ should exist");
                    break;
                }

                // Directory with spaces in the name
                if (! UXES.path.exists(UXES.dirs.DRIVE_PREFIX + "/Program Files")) {
                    UXES.logError(arguments, "'" + UXES.dirs.DRIVE_PREFIX + "/Program Files' should exist");
                    break;
                }

                // Directory with spaces in the name and trailing slash
                if (! UXES.path.exists(UXES.dirs.DRIVE_PREFIX + "/Program Files/")) {
                    UXES.logError(arguments, "'" + UXES.dirs.DRIVE_PREFIX + "/Program Files/' should exist");
                    break;
                }

                // A file
                if (! UXES.path.exists(UXES.dirs.DRIVE_PREFIX + "/Windows/System32/Drivers/etc/hosts")) {
                    UXES.logError(arguments, UXES.dirs.DRIVE_PREFIX + "/Windows/System32/Drivers/etc/hosts should exist");
                    break;
                }

                // A file with a trailing slash should exist
                if (! UXES.path.exists(UXES.dirs.DRIVE_PREFIX + "/Windows/System32/Drivers/etc/hosts/")) {
                    UXES.logError(arguments, UXES.dirs.DRIVE_PREFIX + "/Windows/System32/Drivers/etc/hosts/ should exist");
                    break;
                }

                // A non-existent file
                if (UXES.path.exists(UXES.dirs.DRIVE_PREFIX + "/Users/file_does_not_exist_no_way.txt")) {
                    UXES.logError(arguments, UXES.dirs.DRIVE_PREFIX + "/Users/file_does_not_exist_no_way.txt should not exist");
                    break;
                }
            }

            if (UXES.isMac) {

                // Directory
                if (! UXES.path.exists("/Users")) {
                    UXES.logError(arguments, "/Users should exist");
                    break;
                }

                // Directory with trailing separator
                if (! UXES.path.exists("/Users/")) {
                    UXES.logError(arguments, "/Users/ should exist");
                    break;
                }

                // Directory with spaces in the name
                if (! UXES.path.exists("/Library/Application Support")) {
                    UXES.logError(arguments, "/Library/Application Support should exist");
                    break;
                }

                // Directory with spaces in the name and trailing slash
                if (! UXES.path.exists("/Library//Application Support/")) {
                    UXES.logError(arguments, "/Library/Application Support/ should exist");
                    break;
                }

                // A file
                if (! UXES.path.exists("/etc/hosts")) {
                    UXES.logError(arguments, "/etc/hosts should exist");
                    break;
                }

                // A file with a trailing slash should exist
                if (! UXES.path.exists("/etc/hosts/")) {
                    UXES.logError(arguments, "/etc/hosts/ should exist");
                    break;
                }

                // A non-existent file
                if (UXES.path.exists("/etc/file_does_not_exist_no_way.txt")) {
                    UXES.logError(arguments, "/etc/file_does_not_exist_no_way.txt should not exist");
                    break;
                }
            }

            retVal = true;      
            UXES.logNote(arguments, "test passed");
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
            retVal = false;
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

//-------------------

declareAPI();

})();