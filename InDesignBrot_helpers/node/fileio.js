if (! UXES.fileio) {
    UXES.fileio = {};
}

// No logging in these functions - they are themselves used by the logging functions

UXES.fileio.appendUTF8TextFile = function appendUTF8TextFile(filePath, text, handleNewLine) {

    var retVal;

    try {
        retVal = UXES.fs.appendFileSync(filePath, text + (handleNewLine ? "\n" : ""), { encoding: "utf8" });
    }
    catch (err) {       
    }
}

UXES.fileio.readUTF8TextFile = function readUTF8TextFile(filePath) {

    var retVal;

    try {
        retVal = UXES.fs.readFileSync(filePath,{ encoding: "utf8" });
    }
    catch (err) {        
    }

    return retVal;
}

UXES.fileio.writeUTF8TextFile = function writeUTF8TextFile(filePath, text, handleNewLine) {

    try {
        UXES.fs.writeFileSync(filePath, text + (handleNewLine ? "\n" : ""), { encoding: "utf8" });
    }
    catch (err) {        
    }
}
