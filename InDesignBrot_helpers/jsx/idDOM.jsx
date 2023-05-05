(function() {

// Don't use `var UXES`
// By using `var` we will end up defining this in the wrong scope

if ("undefined" == typeof UXES) {
    UXES = {};
}

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

})();
