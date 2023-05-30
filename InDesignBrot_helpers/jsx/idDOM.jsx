UXES.instanceof = function _instanceof(object, domClassName) {
  
    var retVal;

    UXES.logEntry(arguments);

    var esScript = "object instanceof " + domClassName;

    try {
        retVal = eval(esScript);
    }
    catch (err) {
        UXES.logError(arguments, "throws " + err);
    }

    UXES.logExit(arguments);

    return retVal;
}
