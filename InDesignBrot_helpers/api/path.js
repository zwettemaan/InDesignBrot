//
// This is the utils API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//


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
UXES.path.reduce               = UXES.IMPLEMENTATION_MISSING;

//----------- Tests

if (! UXES.tests.path) {
    UXES.tests.path = {};
}

UXES.tests.path.basename = function tests_basename() {

    var retVal = true;

    do {

        var tests = [
            {
                filePath: "/Users/kris/Desktop",
                separator: undefined,
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop",
                separator: undefined,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris/Desktop",
                separator: UXES.path.EITHER_SEPARATOR,
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop",
                separator: UXES.path.EITHER_SEPARATOR,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris/Desktop",
                separator: UXES.path.GUESS_SEPARATOR,
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop",
                separator: UXES.path.GUESS_SEPARATOR,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris/Desktop",
                separator: "/",
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop",
                separator: "/",
                basename: "C:\\Users\\kris\\Desktop",
                dirname: ""
            },         
            {
                filePath: "/Users/kris/Desktop",
                separator: "\\",
                basename: "/Users/kris/Desktop",
                dirname: ""
            },
            {
                filePath: "C:\\Users\\kris\\Desktop",
                separator: "\\",
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris/Desktop/",
                separator: undefined,
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop\\",
                separator: undefined,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris/Desktop/",
                separator: UXES.path.EITHER_SEPARATOR,
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop\\",
                separator: UXES.path.EITHER_SEPARATOR,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris/Desktop/",
                separator: UXES.path.GUESS_SEPARATOR,
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop\\",
                separator: UXES.path.GUESS_SEPARATOR,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris/Desktop/",
                separator: "/",
                basename: "Desktop",
                dirname: "/Users/kris/"
            },
            {
                filePath: "C:\\Users\\kris\\Desktop\\",
                separator: "/",
                basename: "C:\\Users\\kris\\Desktop\\",
                dirname: ""
            },         
            {
                filePath: "/Users/kris/Desktop/",
                separator: "\\",
                basename: "/Users/kris/Desktop/",
                dirname: ""
            },
            {
                filePath: "C:\\Users\\kris\\Desktop\\",
                separator: "\\",
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users\\kris/Desktop",
                separator: undefined,
                basename: "Desktop",
                macDirname: "/Users/kris/",
                winDirname: "\\Users\\kris\\"
            },
            {
                filePath: "C:\\Users/kris\\Desktop",
                separator: undefined,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users\\kris/Desktop",
                separator: UXES.path.EITHER_SEPARATOR,
                basename: "Desktop",
                macDirname: "/Users/kris/",
                winDirname: "\\Users\\kris\\"
            },
            {
                filePath: "C:\\Users/kris\\Desktop",
                separator: UXES.path.EITHER_SEPARATOR,
                basename: "Desktop",
                dirname: "C:\\Users\\kris\\"
            },
            {
                filePath: "/Users/kris\\Desktop",
                separator: UXES.path.GUESS_SEPARATOR,
                basename: "kris\\Desktop",
                dirname: "/Users/"
            },
            {
                filePath: "C:\\Users\\kris/Desktop",
                separator: UXES.path.GUESS_SEPARATOR,
                basename: "kris/Desktop",
                dirname: "C:\\Users\\"
            },
            {
                filePath: "/Users/kris\\Desktop",
                separator: "/",
                basename: "kris\\Desktop",
                dirname: "/Users/"
            },
            {
                filePath: "C:\\Users/kris\\Desktop",
                separator: "/",
                basename: "kris\\Desktop",
                dirname: "C:\\Users/"
            },         
            {
                filePath: "/Users\\kris/Desktop",
                separator: "\\",
                basename: "kris/Desktop",
                dirname: "/Users\\"
            },
            {
                filePath: "C:\\Users\\kris/Desktop/t.txt",
                separator: UXES.path.GUESS_SEPARATOR,
                macBasename: "t.txt",
                winBasename: "kris/Desktop/t.txt",
                macDirname: "C:\\Users\\kris/Desktop/",
                winDirname: "C:\\Users\\"
            },
            {
                filePath: "/Users/kris\\Desktop\\t.txt",
                separator: UXES.path.GUESS_SEPARATOR,
                macBasename: "kris\\Desktop\\t.txt",
                winBasename: "t.txt",
                macDirname: "/Users/",
                winDirname: "/Users/kris\\Desktop\\"
            }
        ]

        for (var testIdx = 0; testIdx < tests.length; testIdx++) {
            var test = tests[testIdx];
            var basename = UXES.path.basename(test.filePath, test.separator);
            var dirname = UXES.path.dirname(test.filePath, test.separator);
            var expectedBasename;
            var expectedDirname;
            if (UXES.isMac) {
                if ("macBasename" in test) {
                    expectedBasename = test.macBasename;
                }
                else {
                    expectedBasename = test.basename;
                }
                if ("macDirname" in test) {
                    expectedDirname = test.macDirname;
                }
                else {
                    expectedDirname = test.dirname;
                }
            } 
            else if (UXES.isWindows) {
                if ("winBasename" in test) {
                    expectedBasename = test.winBasename;
                }
                else {
                    expectedBasename = test.basename;
                }
                if ("winDirname" in test) {
                    expectedDirname = test.winDirname;
                }
                else {
                    expectedDirname = test.dirname;
                }
            }
            if (expectedBasename != basename) {
                retVal = false;
                UXES.logError(arguments, "basename(" + test.filePath + "," + test.separator + ") returned '" + basename + "' but expected '" + expectedBasename + "'");
            }
            if (expectedDirname != dirname) {
                retVal = false;
                UXES.logError(arguments, "dirname(" + test.filePath + "," + test.separator + ") returned '" + dirname + "' but expected '" + expectedDirname + "'");
            }
        }
    }
    while (false);

    return retVal;
}

UXES.tests.path.checkLowLevelPathFunctions = function tests_checkLowLevelPathFunctions() {

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

UXES.tests.path.pathReduce = function tests_pathReduce() {

    var retVal = true;

    do {

        var tests = [
            {
                filePath: "./relative/path/../somewhere/",
                reduce: "./relative/somewhere",
            },
            {
                filePath: "./relative/path/../somewhere/",
                reduce: "./relative/somewhere",
                separator: "/"
            },
            {
                filePath: "./relative/path/../somewhere",
                reduce: "./relative/somewhere",
                separator: "/"
            },
            {
                filePath: "relative/path/../somewhere/",
                reduce: "./relative/somewhere",
                separator: "/"
            },
            {
                filePath: "relative/path/../somewhere",
                reduce: "./relative/somewhere",
                separator: "/"
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere",
                reduce: "C:\\Users\\somewhere",
                separator: "\\"
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere\\",
                reduce: "C:\\Users\\somewhere",
                separator: "\\"
            },
            {
                filePath: "C:/Users/Path/../somewhere",
                reduce: "C:/Users/Path/../somewhere",
                separator: "\\"
            },
            {
                filePath: "C:/Users/Path/../somewhere/",
                reduce: "C:/Users/Path/../somewhere/",
                separator: "\\"
            },
            {
                filePath: "./relative/path/../somewhere/",
                reduce: ".\\./relative/path/../somewhere/",
                separator: "\\"
            },
            {
                filePath: "./relative/path/../somewhere",
                reduce: ".\\./relative/path/../somewhere",
                separator: "\\"
            },
            {
                filePath: "relative/path/../somewhere/",
                reduce: ".\\relative/path/../somewhere/",
                separator: "\\"
            },
            {
                filePath: "relative/path/../somewhere",
                reduce: ".\\relative/path/../somewhere",
                separator: "\\"
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere",
                reduce: "./C:\\Users\\Path\\..\\somewhere",
                separator: "/"
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere\\",
                reduce: "./C:\\Users\\Path\\..\\somewhere\\",
                separator: "/"
            },
            {
                filePath: "C:/Users/Path/../somewhere",
                reduce: "C:/Users/Path/../somewhere",
                separator: "\\"
            },
            {
                filePath: "C:/Users/Path/../somewhere/",
                reduce: "./C:/Users/somewhere",
                separator: "/"
            },
            {
                filePath: "./relative/path/../somewhere/",
                reduce: "./relative/somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "./relative/path/../somewhere",
                reduce: "./relative/somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "relative/path/../somewhere/",
                reduce: "./relative/somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "relative/path/../somewhere",
                reduce: "./relative/somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere",
                reduce: "C:\\Users\\somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere\\",
                reduce: "C:\\Users\\somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "C:/Users/Path/../somewhere",
                reduce: "./C:/Users/somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "C:/Users/Path/../somewhere/",
                reduce: "./C:/Users/somewhere",
                separator: UXES.path.GUESS_SEPARATOR
            },
            {
                filePath: "./relative/path/../somewhere/",
                reduce: "./relative/somewhere",
            },
            {
                filePath: "./relative/path/../somewhere",
                reduce: "./relative/somewhere",
                separator: "/"
            },
            {
                filePath: "relative/path/../somewhere/",
                reduce: "./relative/somewhere",
                separator: "/"
            },
            {
                filePath: "relative/path/../somewhere",
                reduce: "./relative/somewhere",
                separator: "/"
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere",
                reduce: "C:\\Users\\somewhere",
                separator: "\\"
            },
            {
                filePath: "C:\\Users\\Path\\..\\somewhere\\",
                reduce: "C:\\Users\\somewhere",
                separator: "\\"
            },
            {
                filePath: "C:/Users/Path/..\\somewhere",
                reduce: "C:/Users/Path/..\\somewhere",
                separator: "\\"
            },
            {
                filePath: "C:/Users/Path/..\\somewhere/",
                reduce: "C:/Users/Path/..\\somewhere/",
                separator: "\\"
            }
        ];

        for (var testIdx = 0; testIdx < tests.length; testIdx++) {
            var test = tests[testIdx];
            var reduce = UXES.path.reduce(test.filePath, test.separator);
            var expectedReduce;
            if (UXES.isMac) {
                if ("macReduce" in test) {
                    expectedReduce = test.macReduce;
                }
                else {
                    expectedReduce = test.reduce;
                }
            } 
            else if (UXES.isWindows) {
                if ("winBasename" in test) {
                    expectedReduce = test.winBasename;
                }
                else {
                    expectedReduce = test.basename;
                }
            }
            if (expectedReduce != reduce) {
                retVal = false;
                UXES.logError(arguments, "reduce(" + test.filePath + "," + test.separator + ") returned '" + reduce + "' but expected '" + expectedReduce + "'");
            }
        }
    }
    while (false);

    return retVal;
}
