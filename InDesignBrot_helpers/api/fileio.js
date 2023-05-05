//
// This is the fileio API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

(function(){


function declareAPI() {

    if (! UXES.fileio) {
        UXES.fileio = {};
    }
    
    UXES.fileio.FILEIO_APPEND_NEWLINE      = UXES.VALUE_NOT_INITIALIZED;
    UXES.fileio.FILEIO_DONT_APPEND_NEWLINE = UXES.VALUE_NOT_INITIALIZED;

    UXES.fileio.appendUTF8TextFile         = UXES.IMPLEMENTATION_MISSING;
    UXES.fileio.readUTF8TextFile           = UXES.IMPLEMENTATION_MISSING;
    UXES.fileio.writeUTF8TextFile          = UXES.IMPLEMENTATION_MISSING;

}

//----------- Tests

if (! UXES.tests.fileio) {
    UXES.tests.fileio = {};
}

//-------------------

declareAPI();

})();