//
// This code is exclusively ExtendScript. It provides ExtendScript-specific 
// implementations of the path API.
//
// utils.js depends on these functions being implemented
// When adding new functionality here, make sure to also 
// add corresponding tests to the utils_verifyDependencies()
//

if (! UXES.path) {
    UXES.path = {};
}

UXES.path.exists = function exists(filePath) {
    
    UXES.logEntry(arguments);

    var f = File(filePath);
    var retVal = f.exists;

    UXES.logExit(arguments);

    return retVal;
}

UXES.path.isDir = function isDir(folderPath) {
    
    UXES.logEntry(arguments);

    // This casts to a File instead of a Folder if the
    // path references a file

    var folder = Folder(folderPath);

    var retVal = (folder instanceof Folder);

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

            var folder = Folder(folderPath);
            folder.create();
            success = folder.exists;
        }
        catch (err) {
            UXES.logError(arguments, "throws" + err);       
        }
    }
    while (false);

    UXES.logExit(arguments);
    
    return success;
}
