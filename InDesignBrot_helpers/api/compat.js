//
// This is the compat API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

(function(){


function declareAPI() {

    UXES.clearImmediate         = UXES.IMPLEMENTATION_MISSING;
    UXES.clearInterval          = UXES.IMPLEMENTATION_MISSING;
    UXES.clearTimeout           = UXES.IMPLEMENTATION_MISSING;
    UXES.setImmediate           = UXES.IMPLEMENTATION_MISSING;
    UXES.setInterval            = UXES.IMPLEMENTATION_MISSING;
    UXES.setTimeout             = UXES.IMPLEMENTATION_MISSING;

}

//----------- Tests


//-------------------

declareAPI();

})();