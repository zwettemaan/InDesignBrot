//
// This is the fileio API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

if (! UXES.fileio) {
    UXES.fileio = {};
}

// Symbolic constants for text file IO functions

UXES.fileio.FILEIO_APPEND_NEWLINE      = "APPEND_NL";
UXES.fileio.FILEIO_DONT_APPEND_NEWLINE = "DONT_APPEND_NL";

/**
* Append some text to a text file. If the file does not exist, it is created.
* This function is async in idjs, but sync in ExtendScript and Node/JS
* 
* @function UXES.fileio.appendUTF8TextFile
* 
* @param {string} filePath - location of file
* @param {string} text - data to append to file
* @param {string} handleNewLine - either UXES.fileio.FILEIO_APPEND_NEWLINE or UXES.fileio.FILEIO_DONT_APPEND_NEWLINE
*/

UXES.fileio.appendUTF8TextFile = function(filePath, text, handleNewLine) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Read a text file into memory. If the file does not exist, "" is returned.
* This function is async in idjs, but sync in ExtendScript and Node/JS
* 
* @function UXES.fileio.readUTF8TextFile
* 
* @param {string} filePath - location of file
* @return {string} file contents
*/

UXES.fileio.readUTF8TextFile = function(filePath) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Write out a string. 
* This function is async in idjs, but sync in ExtendScript and Node/JS
* 
* @function UXES.fileio.writeUTF8TextFile
* 
* @param {string} filePath - location of file
* @param {string} text - data to append to file
* @param {string} handleNewLine - either UXES.fileio.FILEIO_APPEND_NEWLINE or UXES.fileio.FILEIO_DONT_APPEND_NEWLINE
*/

UXES.fileio.writeUTF8TextFile = function(filePath, text, handleNewLine) { return UXES.IMPLEMENTATION_MISSING; };

//----------- Tests

if (! UXES.tests.fileio) {
    UXES.tests.fileio = {};
}
