(function() {

if (! UXES.path) {
	UXES.path = {};
}

if (! UXES.tests.path) {
    UXES.tests.path = {};
}

UXES.path.REGEXP_KEEP_SLASH = /[^\/]*/g;
UXES.path.REGEXP_KEEP_BACKSLASH = /[^\\]*/g;

UXES.path.addTrailingSeparator = function addTrailingSeparator(filePath, separator) {

    var retVal = filePath;
    
    UXES.logEntry(arguments);

    do {

        if (! filePath) {
            break;            
        }

        if (! separator) {
            separator = UXES.path.SEPARATOR;
        }

        if (separator == UXES.path.GUESS_SEPARATOR) {
            separator = UXES.path.guessSeparator(filePath);
        }

        var lastChar = filePath.substr(-1);        
        if (lastChar == separator) {
            break;
        }

        retVal += separator;
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
};

UXES.path.basename = function basename(filePath, separator) {
    
    var endSegment;

    UXES.logEntry(arguments);

    if (! separator) {
        separator = UXES.path.SEPARATOR;
    }

    if (separator == UXES.path.GUESS_SEPARATOR) {
        separator = UXES.path.guessSeparator(filePath);
    }

    // toString() handles cases where filePath is an ExtendScript File/Folder object
    var splitPath = filePath.toString().split(separator);
    do {
        endSegment = splitPath.pop();   
    }
    while (splitPath.length > 0 && endSegment == "");

    UXES.logExit(arguments);

    return endSegment;
}

UXES.path.dirname = function dirname(filePath, separator) {
    
    var retVal;

    UXES.logEntry(arguments);

    if (! separator) {
        separator = UXES.path.SEPARATOR;
    }

    if (separator == UXES.path.GUESS_SEPARATOR) {
        separator = UXES.path.guessSeparator(filePath);
    }

    // toString() handles cases where filePath is an ExtendScript File/Folder object
    var splitPath = filePath.toString().split(separator);
    do {
        var endSegment = splitPath.pop();   
    }
    while (splitPath.length > 0 && endSegment == "");

    retVal = splitPath.join(separator);

    UXES.logExit(arguments);

    return retVal;
}

UXES.path.filenameExtension = function filenameExtension(filePath) {
    
    var retVal;

    UXES.logEntry(arguments);

    var splitName = UXES.path.basename(filePath).split(".");
    var extension = "";
    if (splitName.length > 1) {
        extension = splitName.pop();
    }

    retVal = extension.toLowerCase();

    UXES.logExit(arguments);

    return retVal;
}

UXES.path.guessSeparator = function addTrailingSeparator(filePath, likelySeparator) {

    var retVal = UXES.path.SEPARATOR;
    
    UXES.logEntry(arguments);

    do {

        if (! filePath) {
            break;            
        }

        if (! likelySeparator) {
            likelySeparator = UXES.path.SEPARATOR;
        }

        var lastChar = filePath.substr(-1);        
        if (lastChar == UXES.path.SEPARATOR || lastChar == UXES.path.OTHER_PLATFORM_SEPARATOR) {
            retVal = lastChar;
            break;
        }

        var slashCount = filePath.replace(UXES.path.REGEXP_KEEP_SLASH, "").length;
        var backSlashCount = filePath.replace(UXES.path.REGEXP_KEEP_BACKSLASH, "").length;
        if (backSlashCount < slashCount) {
            retVal = "/";
        }
        else if (backSlashCount > slashCount) {
            retVal = "\\";
        }
        else if (likelySeparator != UXES.path.GUESS_SEPARATOR) {
            retVal = likelySeparator;
        }
        else {
            retVal = UXES.path.SEPARATOR;
        }

    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
};

})();
