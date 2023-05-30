//
// This is the idDOM API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

UXES.instanceof = UXES.IMPLEMENTATION_MISSING;

//----------- Tests

UXES.tests.instanceof = function tests_instanceof() {

    var retVal = true;

    var tempDoc;

    do {
        try {

            if (! UXES.instanceof(app, "Application")) {
                retVal = false;
            }

            var tempDoc = UXES.G.app.documents.add(false);
            if (! UXES.instanceof(tempDoc, "Document")) {
                retVal = false;
            }

            var tf = tempDoc.textFrames.add();
            if (! UXES.instanceof(tf, "TextFrame")) {
                retVal = false;
            }

            var pi = tempDoc.pageItems.firstItem();
            if (! UXES.instanceof(pi, "PageItem")) {
                retVal = false;
            }

            // PageItem is not a JavaScript subclass, but it is an InDesign subclass 
            // of TextFrame
            if (UXES.instanceof(pi, "TextFrame")) {
                retVal = false;
            }

            if (! UXES.instanceof(pi.getElements()[0], "TextFrame")) {
                retVal = false;
            }
        }
        catch (err) {            
            retVal = false;
        }

    }
    while (false);

    if (tempDoc) {
        tempDoc.close(SaveOptions.NO);
    }
    
    return retVal;
}
