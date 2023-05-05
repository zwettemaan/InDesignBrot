//
// This code is exclusively ExtendScript. It provides ExtendScript-specific 
// implementations of the utils API.
//
// utils.js depends on these functions being implemented
// When adding new functionality here, make sure to also 
// add corresponding tests to the utils_verifyDependencies()
//

(function() {

UXES.alert = function _alert(msg) {  // Use `_alert`, instead of `alert` to avoid infinite recursion

    UXES.logEntry(arguments);

    alert(msg); // Built-in should not match function name of this function - that's why we use `_alert`
    
    UXES.logExit(arguments);

}

UXES.checkMac = function checkMac() {    

    UXES.logEntry(arguments);

    var retVal = $.os.substr(0,3) == "Mac";

    UXES.logExit(arguments);

    return retVal;
};

UXES.checkWindows = function checkWindows() {    

    var retVal = undefined;

    UXES.logEntry(arguments);

    retVal = $.os.substr(0,3) == "Win";

    UXES.logExit(arguments);

    return retVal;
}

UXES.logMessage = function(reportingFunctionArguments, levelPrefix, message) {

    var savedInLogger = UXES.inLogger;

    do {
        try {

            if (UXES.inLogger) {
                break;
            }
            
            UXES.inLogger = true;
            
            var functionPrefix = "";

            if (! message) {

                  message = reportingFunctionArguments;
                  reportingFunctionArguments = undefined;

            }
            else if (reportingFunctionArguments) {

                if ("string" == typeof reportingFunctionArguments) {

                    functionPrefix += reportingFunctionArguments + ": ";
                    
                }
                else {

                    var reportingFunctionName;
                    try {
                        reportingFunctionName = reportingFunctionArguments.callee.toString().match(/function ([^\(]+)/)[1];
                    }
                    catch (err) {
                        reportingFunctionName = "[anonymous function]";
                    }
                    functionPrefix += reportingFunctionName + ": ";

                }
            }
            
            var now = new Date();
            var timePrefix = 
                UXES.leftPad(now.getUTCDate(), "0", 2) + 
                "-" + 
                UXES.leftPad(now.getUTCMonth() + 1, "0", 2) + 
                "-" + 
                UXES.leftPad(now.getUTCFullYear(), "0", 4) + 
                " " + 
                UXES.leftPad(now.getUTCHours(), "0", 2) + 
                ":" + 
                UXES.leftPad(now.getUTCMinutes(), "0", 2) + 
                ":" + 
                UXES.leftPad(now.getUTCSeconds(), "0", 2) + 
                "+00 ";

            var platformPrefix = "E ";

            var logLine = platformPrefix + timePrefix + "- " + levelPrefix + ": " + functionPrefix + message;

            if (UXES.S.LOG_TO_FILEPATH) {
                UXES.fileio.appendUTF8TextFile(
                    UXES.S.LOG_TO_FILEPATH, 
                    logLine, 
                    UXES.fileio.FILEIO_APPEND_NEWLINE);
            }
                    
            if (UXES.S.LOG_TO_ESTK_CONSOLE) {
                $.writeln(logLine); 
            }

        }
        catch (err) {
        }
    }
    while (false);

    UXES.inLogger = savedInLogger;
}

})();