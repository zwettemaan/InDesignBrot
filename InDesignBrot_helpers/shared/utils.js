//
// This code can be shared between CEP/JavaScript, ExtendScript and UXPScript
//

(function(){

/**
* Make a copy of an object or array so it is equivalent, but does not share any references.
* Do this recursively on all nested objects 
* 
* @function UXES.deepClone
* 
* @param {any} obj - What we want to clone
* @return a deep clone of the object
*/

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

/**
* Wrap a string in double quotes, so that eval(UXES.dQ(x)) == x 
* 
* @function UXES.dQ
* 
* @param {string} s - string to be quoted
* @return a copy of s wrapped in quotes
*/

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

/**
* Call this function when entering any function. A typical usage is 
*   function myFunction()
*   {
*    var retVal = defaultValue;
*    UXES.logEntry(arguments);
* ...
*    UXES.logExit(arguments);
*    return retVal;
*   }
* 
* @function UXES.logEntry
* 
* @param {array} arguments - pass in the arguments of the calling function
*/

UXES.logEntry = function(reportingFunctionArguments) {
    if (UXES.S.LOG_ENTRY_EXIT) {
        UXES.logTrace(reportingFunctionArguments, "Entry");
    }
}

/**
* Call this function when reporting an error condition 
* ...
*    if (somethingBad) {
*      UXES.logError(arguments,"Something bad happened");
*    }
* 
* @function UXES.logError
* 
* @param {array} arguments - pass in the arguments of the calling function
* @param {string} message - an error message
*/

UXES.logError = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_ERROR) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "ERROR", s);
    }
}

/**
* Call this function when exiting any function. A typical usage is 
*   function myFunction()
*   {
*    var retVal = defaultValue;
*    UXES.logEntry(arguments);
* ...
*    UXES.logExit(arguments);
*    return retVal;
*   }
* 
* @function UXES.logExit
* 
* @param {array} arguments - pass in the arguments of the calling function
*/

UXES.logExit = function(reportingFunctionArguments) {
    if (UXES.S.LOG_ENTRY_EXIT) {
        UXES.logTrace(reportingFunctionArguments, "Exit");
    }
}

/**
* Call this function when reporting some interesting condition 
* ...
*    if (somethingNoteworthy) {
*      UXES.logNote(arguments,"Something bad happened");
*    }
* 
* @function UXES.logNote
* 
* @param {array} arguments - pass in the arguments of the calling function
* @param {string} message - an note
*/

UXES.logNote = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_NOTE) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "NOTE", s);
    }
}

/**
* Call this function when reporting some verbose, tracing info
*    
* ...
*    UXES.logTrace(arguments,"About to call some doodad");
* ...
* 
* @function UXES.logTrace
* 
* @param {array} arguments - pass in the arguments of the calling function
* @param {string} message - an trace message
*/

UXES.logTrace = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_TRACE) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "TRACE", s);
    }
}

/**
* Call this function when reporting an unexpected condition
*    
*    if (someStringIsUnexpectedlyEmpty) {
*      UXES.logWarning(arguments,"Did not expect to get an empty string");
*    }
* 
* @function UXES.logWarning
* 
* @param {array} arguments - pass in the arguments of the calling function
* @param {string} message - an trace message
*/

UXES.logWarning = function(reportingFunctionArguments, s) {
    if (UXES.S.LOG_LEVEL >= UXES.C.LOG_WARN) {
        if (! s) {
            s = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        UXES.logMessage(reportingFunctionArguments, "WARN", s);
    }
}

/**
* Change the log level and restore what it was set to before the preceding call to pushLogLevel()
*
* @function UXES.popLogLevel
* 
* @return the previous log level before the popLogLevel()
*          
*/

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

/**
* Change the log level and save the previous log level on a
* stack.
*
* @function UXES.pushLogLevel
* 
* @param {integer} newLogLevel  - new log level
* @return the previous log level
*          
*/

UXES.pushLogLevel = function pushLogLevel(newLogLevel) {

    var retVal;

    retVal = UXES.S.LOG_LEVEL;
    logLevelStack.push(UXES.S.LOG_LEVEL);
    UXES.S.LOG_LEVEL = newLogLevel;

    return retVal;
}

/**
* Generate some GUID. This is not really a 'proper' GUID generator, 
* but for our needs it'll do.
*
* @function UXES.randomGUID
* 
* @return a random GUID in XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX format
* XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
*           111 1111 1222 222222333333
* 01234567 9012 4567 9012 456789012345
*          
*/

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

/**
* Make a copy of an object so it is equivalent, but does not share any references. 
* Do not apply this on any nested objects
* 
* @function UXES.shallowClone
* 
* @param {any} obj - What we want to clone
* @return a shallow clone of the object
*/

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

/**
* Wrap a string in single quotes, so that eval(UXES.sQ(x)) == x 
* 
* @function UXES.sQ
* 
* @param {string} s - string to be quoted
* @return a copy of s wrapped in quotes
*/

UXES.sQ = function(s) {
    return "'" + s.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r") + "'";
}

/**
* Convert a positive integer to a fixed-length hexadecimal number
* 
* @function UXES.toHex
* 
* @param {number} value - value to be converted
* @param {number} numDigits - how many digits
* @return a hexadecimal string or undefined
*/

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

})();