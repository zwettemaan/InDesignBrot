UXES.S.LOG_ENTRY_EXIT                = UXES.VALUE_NOT_INITIALIZED;
UXES.S.LOG_CRITICAL_ERRORS           = UXES.VALUE_NOT_INITIALIZED;
UXES.S.LOG_LEVEL                     = UXES.VALUE_NOT_INITIALIZED;
UXES.S.LOG_TO_NODE_CONSOLE           = UXES.VALUE_NOT_INITIALIZED;
UXES.S.LOG_TO_CHROME_CONSOLE         = UXES.VALUE_NOT_INITIALIZED;
UXES.S.LOG_TO_ESTK_CONSOLE           = UXES.VALUE_NOT_INITIALIZED;
UXES.S.LOG_TO_UXPDEVTOOL_CONSOLE     = UXES.VALUE_NOT_INITIALIZED;
UXES.S.RUN_TESTS                     = UXES.VALUE_NOT_INITIALIZED;

//--------------- Tests

UXES.tests.checkTweakableSettings = function test_checkTweakableSettings() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            if (! UXES.S) {
                UXES.logError(arguments, "UXES.S should exist");
                break;
            }

            retVal = true;  
            for (var settingName in UXES.S) {
                if (UXES.S[settingName] == UXES.VALUE_NOT_INITIALIZED) {
                    UXES.logError(arguments, "UXES.S." + settingName + " should exist");
                    retVal = false;                    
                }
            }

            if (! retVal) {
                break;
            }
            
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
