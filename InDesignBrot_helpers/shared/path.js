if (UXES.checkMac()) {
    UXES.path.SEPARATOR = "/";
    UXES.path.OTHER_SEPARATOR = "\\";
    UXES.isLinux = false;
    UXES.isMac = true;
    UXES.isWindows = false;
}
else if (UXES.checkLinux()) {
    UXES.path.SEPARATOR = "/";
    UXES.path.OTHER_SEPARATOR = "\\";
    UXES.isLinux = true;
    UXES.isMac = false;
    UXES.isWindows = false;
}
else {
    UXES.path.SEPARATOR = "\\";
    UXES.path.OTHER_SEPARATOR = "/";
    UXES.isLinux = false;
    UXES.isMac = false;
    UXES.isWindows = true;
}

UXES.path.REGEXP_KEEP_SLASH = /[^\/]*/g;
UXES.path.REGEXP_KEEP_BACKSLASH = /[^\\]*/g;
UXES.path.DRIVE_LETTER = /[a-z]:/i;
UXES.path.GUESS_SEPARATOR = "?";
UXES.path.EITHER_SEPARATOR = "*";

UXES.path.addTrailingSeparator = function addTrailingSeparator(filePath, separator) {

    var retVal = filePath;
    
    UXES.logEntry(arguments);

    do {

        var separators = "";
        if (! filePath) {
            break;            
        }

        if (! separator) {
            separator = UXES.path.EITHER_SEPARATOR;
        }

        if (separator == UXES.path.EITHER_SEPARATOR) {
            separators = UXES.path.SEPARATOR + UXES.path.OTHER_SEPARATOR;
            separator = UXES.path.guessSeparator(filePath);
        }
        else if (separator == UXES.path.GUESS_SEPARATOR) {
            separator = UXES.path.guessSeparator(filePath);
            separators = separator;
        }
        else {
            separators = separator
        }

        var lastChar = filePath.substr(-1);
        if (separators.indexOf(lastChar) >= 0) {
            break;
        }

        retVal += separator;
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
};

UXES.path.basename = function basename(filePath, separator) {
    
    var retVal;

    UXES.logEntry(arguments);

    do {

        try {

            var splitPath = UXES.path.splitPath(filePath, separator);
            if (! splitPath) {
                UXES.logError(arguments, "no splitPath");
                break;
            }

            var endSegment;
            do {
                endSegment = splitPath.pop();   
            }
            while (splitPath.length > 0 && endSegment == "");
            
            if (endSegment) {
                retVal = endSegment;        
            }
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.path.dirname = function dirname(filePath, separator) {
    
    var retVal;

    UXES.logEntry(arguments);

    do {

        try {

            var joinSeparator;
            if (separator == undefined || separator == UXES.path.EITHER_SEPARATOR) {
                joinSeparator = UXES.path.guessSeparator(filePath);
            }
            else if (separator == UXES.path.GUESS_SEPARATOR) { 
                separator = UXES.path.guessSeparator(filePath);
                joinSeparator = separator;
            }
            else {
                joinSeparator = separator;
            }

            var splitPath = UXES.path.splitPath(filePath, separator);
            if (! splitPath) {
                UXES.logError(arguments, "no splitPath");
                break;
            }

            do {
                var endSegment = splitPath.pop();   
            }
            while (splitPath.length > 0 && endSegment == "");

            if (splitPath.length == 0) {
                retVal = "";
            }
            else {
                retVal = splitPath.join(joinSeparator) + joinSeparator;
            }
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

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

UXES.path.guessSeparator = function guessSeparator(filePath, likelySeparator) {

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

UXES.path.reduce = function reduce(filePath, separator) {
    
    var retVal;

    UXES.logEntry(arguments);

    do {
        try {

            var joinSeparator;
            if (separator == undefined || separator == UXES.path.EITHER_SEPARATOR) {
                joinSeparator = UXES.path.guessSeparator(filePath);
            }
            else if (separator == UXES.path.GUESS_SEPARATOR) { 
                separator = UXES.path.guessSeparator(filePath);
                joinSeparator = separator;
            }
            else {
                joinSeparator = separator;
            }

            var splitPath = UXES.path.splitPath(filePath, separator);
            if (! splitPath) {
                UXES.logError(arguments, "no splitPath");
                break;
            }

            var cleanSegments = [];
            for (var idx = 0; idx < splitPath.length; idx++) {
                do {
                    var segment = splitPath[idx];

                    if (segment == "..") {
                        if (cleanSegments.length > 0) {
                            cleanSegments.pop();
                            break;
                        }

                        cleanSegments.push(segment);
                        break;
                    }

                    if (! segment) {
                        // Only allow an empty segment at the beginning
                        if (cleanSegments.length == 0) {
                            cleanSegments.push(segment);
                        }
                        break;
                    }

                    // Make relative paths always start with "./"
                    // Ignore "." in the middle of the path
                    if (segment == ".") {
                        if (cleanSegments.length == 0) {
                            cleanSegments.push(segment);
                        }
                        break;
                    }
                    
                    if (cleanSegments.length == 0) {
                        if (separator == "\\" || separator == UXES.path.EITHER_SEPARATOR) {
                            // Consider "X:" to be a drive letter prefix
                            if (segment.match(UXES.path.DRIVE_LETTER)) {
                                cleanSegments.push(segment);
                                break;
                            }
                        }

                        cleanSegments.push(".");
                    }

                    cleanSegments.push(segment);
                }
                while (false);
            }
        
            retVal = cleanSegments.join(joinSeparator);
        }
        catch (err) {  
            UXES.logError(arguments, "throws " + err);          
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.path.splitPath = function splitPath(filePath, separator) {
    
    var retVal;

    UXES.logEntry(arguments);

    do {

        try {

            if (! filePath) {
                UXES.logError(arguments, "no filePath");
                break;
            }

            if (! separator) {
                separator = UXES.path.EITHER_SEPARATOR;
            }
        
            // toString() handles cases where filePath is an ExtendScript File/Folder object
            var filePath = filePath.toString();
            
            var splitPath;
            if (separator == UXES.path.EITHER_SEPARATOR) {
                var splitBySeparatorPath = filePath.toString().split(UXES.path.SEPARATOR);
                splitPath = [];
                for (var idx = 0; idx < splitBySeparatorPath.length; idx++) {  
                    var subPath = splitBySeparatorPath[idx];
                    if (! subPath) {
                        if (splitPath.length == 0) {
                            splitPath.push(subPath);
                        }
                    }
                    else {
                        splitPath = 
                            splitPath.concat(
                                subPath.split(UXES.path.OTHER_SEPARATOR));
                    }
                }
            }
            else {
                if (separator == UXES.path.GUESS_SEPARATOR) {
                    separator = UXES.path.guessSeparator(filePath);
                }
                splitPath = filePath.toString().split(separator);
            }

            retVal = splitPath;
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}
