//
// This code can be shared between CEP/JavaScript, ExtendScript and UXPScript
//

var logLevelStack = [];

UXES.deepClone = function deepClone(obj) {

    var retVal = undefined;

    UXES.logEntry(arguments);

    do {
        try {
            
            if ("object" != typeof obj) {
                retVal = obj;
                break;
            }

            if (! obj) {
                retVal = obj;
                break;
            }

            var clone;
            if (obj instanceof Array) {
                clone = [];
            }
            else {
                clone = {};        
            }

            for (var x in obj) 
            {
                var val = obj[x];
                if (typeof val == "object")
                {
                    clone[x] = UXES.deepClone(val);
                }
                else
                {
                    clone[x] = val;
                }
            }

            retVal = clone;
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.dQ = function(s) {
    return '"' + s.toString().replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r") + '"';
}

UXES.leftPad = function leftPad(s, padChar, len) {

    var retVal = undefined;

    UXES.logEntry(arguments);

    do {
        try {

            retVal = s + "";

            if (retVal.length > len) {
                retVal = retVal.substring(retVal.length - len);
                break;
            }

            var padLength = len - retVal.length;

            var padding = new Array(padLength + 1).join(padChar)
            retVal = padding + retVal;
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.logEntry = function(reportingFunctionArguments) {
    if (UXES.S.LOG_ENTRY_EXIT) {
        UXES.logTrace(reportingFunctionArguments, "Entry");
    }
}

UXES.logError = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_ERROR) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "ERROR", s);
    }
}

UXES.logExit = function(reportingFunctionArguments) {
    if (UXES.S.LOG_ENTRY_EXIT) {
        UXES.logTrace(reportingFunctionArguments, "Exit");
    }
}

UXES.logNote = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_NOTE) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "NOTE", s);
    }
}

UXES.logTrace = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_TRACE) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "TRACE", s);
    }
}

UXES.logWarning = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_WARN) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "WARN", s);
    }
}

UXES.popLogLevel = function popLogLevel() {

    var retVal;

    retVal = UXES.S.LOG_LEVEL;
    if (logLevelStack.length > 0) {
        UXES.S.LOG_LEVEL = logLevelStack.pop();
    }
    else {
        UXES.S.LOG_LEVEL = UXES.C.LOG_NONE;
    }
    
    return retVal;
}

UXES.pushLogLevel = function pushLogLevel(newLogLevel) {

    var retVal;

    retVal = UXES.S.LOG_LEVEL;
    logLevelStack.push(UXES.S.LOG_LEVEL);
    UXES.S.LOG_LEVEL = newLogLevel;

    return retVal;
}

UXES.randomGUID = function randomGUID() 
{
    var retVal = "";

    UXES.logEntry(arguments);

    for (var wordIdx = 0; wordIdx < 8; wordIdx++)
    {
        var r = Math.round(Math.random() * 65536);
        var r = UXES.toHex(r,4);
        retVal = retVal + r;
        if (wordIdx >= 1 && wordIdx <= 4)
        {
            retVal = retVal + "-";
        }
    }
    
    UXES.logExit(arguments);

    return retVal;
}

UXES.rightPad = function rightPad(s, padChar, len) {

    var retVal = undefined;

    UXES.logEntry(arguments);

    do {
        try {

            retVal = s + "";

            if (retVal.length > len) {
                retVal = retVal.substring(0,len);
                break;
            }

            var padLength = len - retVal.length;

            var padding = new Array(padLength + 1).join(padChar)
            retVal += padding;
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.shallowClone = function shallowClone(obj) {

    var retVal = undefined;

    UXES.logEntry(arguments);

    do {
        try {

            if ("object" != typeof obj) {
                retVal = obj;
                break;
            }

            if (! obj) {
                retVal = obj;
                break;
            }

            var clone;
            if (obj instanceof Array) {
                clone = [];
            }
            else {
                clone = {};        
            }

            for (var x in obj) 
            {
                clone[x] = obj[x];
            }

            retVal = clone;
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.sQ = function(s) {
    return "'" + s.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r") + "'";
}

UXES.toHex = function toHex(value, numDigits) 
{
    var retVal = undefined;

    UXES.logEntry(arguments);

    do {
        try {

            if ("number" != typeof(value)) {
                UXES.logError(arguments, "value is not a number");
                break;
            }

            if (isNaN(value)) {
                UXES.logError(arguments, "value is NaN");
                break;
            }

            if (value < 0) {
                UXES.logError(arguments, "negative value");
                break;
            }

            if (Math.floor(value) != value) {
                UXES.logError(arguments, "value has decimals");
                break;
            }

            var hexString = value.toString(16);
            if (hexString.length > numDigits) {
                hexString = hexString.substring(hexString.length - numDigits);
            }
            else if (hexString.length < numDigits) {
                hexString = Array(numDigits - hexString.length + 1).join("0") + hexString;
            }

            retVal = hexString.toUpperCase();
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}
