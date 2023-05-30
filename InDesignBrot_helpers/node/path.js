//
// This code is exclusively Node.js. It provides Node-specific 
// implementations of the path API.
//
// path.js depends on these functions being implemented
// When adding new functionality here, make sure to also 
// add corresponding tests to the utils_verifyDependencies()
//

UXES.path.exists = function exists(filePath) {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        try {
            
            if (! filePath) {
                break;
            }

            var lastChar = filePath.charAt(filePath.length - 1);
            if (lastChar == '/' || lastChar == '\\') {
                filePath = filePath.substr(0, filePath.length - 1);
            }

            var lstat = UXES.fs.lstatSync(filePath);
            retVal = true;
        }
        catch (err) {    
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.path.isDir = function isDir(folderPath) {

    var retVal = false;

    UXES.logEntry(arguments);

    try {
        var lstat = UXES.fs.lstatSync(folderPath);
        retVal = lstat.isDirectory()
    }
    catch (err) {    
    }

    UXES.logExit(arguments);

    return retVal;
}

UXES.path.mkdir = function mkdir(folderPath, separator) {

    var success = false;
    UXES.logEntry(arguments);

    do {
        try {
            if (! folderPath) {
                UXES.logError(arguments, "no folderPath");
                break;
            }

            if (UXES.path.exists(folderPath)) {
                success = true;
                break;
            }

            var parentFolderPath = UXES.path.dirname(folderPath, separator);
            success = UXES.path.mkdir(parentFolderPath, separator);
            if (! success) {
                UXES.logError(arguments, "cannot create parent folder");
                break;
            }

            try {
                UXES.fs.mkdirSync(folderPath);
            }
            catch (err) {                
            }

            success = UXES.path.isDir(folderPath);
        }
        catch (err) {
            UXES.logError(arguments, "throws" + err);       
        }
    }
    while (false);

    UXES.logExit(arguments);

    return success;
}
