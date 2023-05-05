(function() {

function declareAPI() {

    UXES.C.APP_ID               = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.APP_NAME             = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.DIRNAME_PREFERENCES  = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.FILENAME_PREFERENCES = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.LOG_NONE             = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.LOG_ERROR            = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.LOG_WARN             = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.LOG_NOTE             = UXES.VALUE_NOT_INITIALIZED;
    UXES.C.LOG_TRACE            = UXES.VALUE_NOT_INITIALIZED;

}

//------------------- Tests

UXES.tests.checkGlobals = function checkGlobals() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            if (! UXES.C) {
                UXES.logError(arguments, "UXES.C should exist");
                break;
            }

            retVal = true;  
            for (var constantName in UXES.C) {
                if (UXES.C[constantName] == UXES.VALUE_NOT_INITIALIZED) {
                    UXES.logError(arguments, "UXES.C." + constantName + " should exist");
                    retVal = false;                    
                }
            }

            if (! retVal) {
                break;
            }

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

if (! UXES.C) {
    UXES.C = {}; // stash constants here   
}

if (! UXES.IMPLEMENTATION_MISSING) {
    UXES.IMPLEMENTATION_MISSING = function IMPLEMENTATION_MISSING() {
        UXES.logError("Implementation is missing");        
    };
}

if (! UXES.VALUE_NOT_INITIALIZED) {
    UXES.VALUE_NOT_INITIALIZED = { VALUE_NOT_INITIALIZED: true };
}

declareAPI();

})();


