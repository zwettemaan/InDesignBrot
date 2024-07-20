/**
 * Creative Developer Tools (CRDT) is a growing suite of tools aimed at script developers and plug-in developers for the Adobe Creative Cloud eco-system.
 *
 * There are two different versions of CRDT: one for UXP/UXPScript and another for ExtendScript.
 *
 * For downloading and installation info, visit
 *
 * https://CreativeDeveloperTools.com
 *
 *  `crdtuxp` contains a number of useful functions. Some of these functions
 * are implemented in JavaScript in `crdtux.js` and are synchronous.
 *
 * Other functions are delegated to a daemon process, and are always asynchronous.
 *
 * The list of endpoints is further down
 *
 * `crdtuxp` steps out of the UXP security sandbox - which means that as a developer,
 * you need to be judicious when using this.
 *
 * Every solution operates in a unique context. The UXP security measures are
 * helpful in keeping things secure, but in many situations, they are a massive overkill.
 *
 * It should be up to the user/developer/IT department to decide how to handle security.
 *
 * Sometimes the whole workflow can live inside walled garden, on a disconnected network, 
 * without any contact with the outside world and not be allowed to run any
 * unvetted software.
 *
 * Or sometimes the OS security is safe enough for the workflow at hand.
 *
 * In those cases, the UXP security measures are counter-productive: they represent
 * unnessary hurdles to the software development, or make the user interace clunky and
 * user-unfriendly.
 *
 * Using the UXP sandboxing should be a developer-selectable option, not an enforced requirement, and it should
 * be up to the developer and/or the IT department to decide what is appropriate and what not.
 *
 * @module crdtuxp
 */

var appType = undefined;
const APP_TYPE_PHOTOSHOP = "PHSH";
const APP_TYPE_INDESIGN = "IDSN";

var app;
try {
    app = require("indesign").app;
    appType = APP_TYPE_INDESIGN;
}
catch (err) {
}

try {
    app = require("photoshop").app;
    appType = APP_TYPE_PHOTOSHOP;
}
catch (err) {    
}

function getPlatformGlobals() {
    return global;
}

global.app = app;

var platformGlobals = getPlatformGlobals();
platformGlobals.getPlatformGlobals = getPlatformGlobals;
platformGlobals.defineGlobalObject = function defineGlobalObject(globalName) {
    if (! platformGlobals[globalName]) {
        platformGlobals[globalName] = {};
    }
    return platformGlobals[globalName];
}

/**
 * `localhost.tgrg.net` resolves to `127.0.0.1`
 *
 * The Tightener daemon manages the necessary certificate for https
 *
 * @constant {string} DNS_NAME_FOR_LOCALHOST
 */

const DNS_NAME_FOR_LOCALHOST = "localhost.tgrg.net";

/**
 * The Tightener daemon listens for HTTPS connections on port `18888`.
 *
 * @constant {number} PORT_TIGHTENER_DAEMON
 */
const PORT_TIGHTENER_DAEMON = 18888;

const LOCALHOST_URL = "https://" + DNS_NAME_FOR_LOCALHOST+ ":" + PORT_TIGHTENER_DAEMON;

/**
 * The Tightener daemon provides persistent named scopes (similar to persistent ExtendScript engines).
 *
 * When executing multiple TQL scripts in succession a named scope will retain any globals that
 * were defined by a previous script.
 *
 * @constant {string} TQL_SCOPE_NAME_DEFAULT
 */
const TQL_SCOPE_NAME_DEFAULT = "defaultScope";

const PLATFORM_MAC_OS_X = "darwin";

if (! module.exports) {
    module.exports = {};
}
var crdtuxp = module.exports;

module.exports.IS_MAC = require('os').platform() == PLATFORM_MAC_OS_X;
module.exports.IS_WINDOWS = ! module.exports.IS_MAC;

/**
 * Setting log level to `LOG_LEVEL_OFF` causes all log output to be suppressed.
 *
 * @constant {number} LOG_LEVEL_OFF
 */
const LOG_LEVEL_OFF = 0;
module.exports.LOG_LEVEL_OFF = LOG_LEVEL_OFF;

/**
 * Setting log level to `LOG_LEVEL_ERROR` causes all log output to be suppressed,
 * except for errors.
 *
 * @constant {number} LOG_LEVEL_ERROR
 */
const LOG_LEVEL_ERROR = 1;
module.exports.LOG_LEVEL_ERROR = LOG_LEVEL_ERROR;

/**
 * Setting log level to `LOG_LEVEL_WARNING` causes all log output to be suppressed,
 * except for errors and warnings.
 *
 * @constant {number} LOG_LEVEL_WARNING
 */
const LOG_LEVEL_WARNING = 2;
module.exports.LOG_LEVEL_WARNING = LOG_LEVEL_WARNING;

/**
 * Setting log level to `LOG_LEVEL_NOTE` causes all log output to be suppressed,
 * except for errors, warnings and notes.
 *
 * @constant {number} LOG_LEVEL_NOTE
 */
const LOG_LEVEL_NOTE = 3;
module.exports.LOG_LEVEL_NOTE = LOG_LEVEL_NOTE;

/**
 * Setting log level to `LOG_LEVEL_TRACE` causes all log output to be output.
 *
 * @constant {number} LOG_LEVEL_TRACE
 */
const LOG_LEVEL_TRACE = 4;
module.exports.LOG_LEVEL_TRACE = LOG_LEVEL_TRACE;

// Symbolic params to `getDir()`

/**
 * Pass `DESKTOP_DIR` into `getDir()` to get the path of the user's Desktop folder.
 *
 * @constant {string} DESKTOP_DIR
 */
module.exports.DESKTOP_DIR    = "DESKTOP_DIR";

/**
 * Pass `DOCUMENTS_DIR` into `getDir()` to get the path of the user's Documents folder.
 *
 * @constant {string} DOCUMENTS_DIR
 */
module.exports.DOCUMENTS_DIR  = "DOCUMENTS_DIR";

/**
 * Pass `HOME_DIR` into `getDir()` to get the path of the user's home folder.
 *
 * @constant {string} HOME_DIR
 */
module.exports.HOME_DIR       = "HOME_DIR";

/**
 * Pass `LOG_DIR` into `getDir()` to get the path of the Tightener logging folder.
 *
 * @constant {string} LOG_DIR
 */
module.exports.LOG_DIR        = "LOG_DIR";

/**
 * Pass `SYSTEMDATA_DIR` into `getDir()` to get the path of the system data folder
 * (`%PROGRAMDATA%` or `/Library/Application Support`).
 *
 * @constant {string} SYSTEMDATA_DIR
 */
module.exports.SYSTEMDATA_DIR = "SYSTEMDATA_DIR";

/**
 * Pass `TMP_DIR` into `getDir()` to get the path of the temporary folder.
 *
 * @constant {string} TMP_DIR
 */
module.exports.TMP_DIR        = "TMP_DIR";

/**
 * Pass `USERDATA_DIR` into `getDir()` to get the path to the user data folder
 * (`%APPDATA%` or `~/Library/Application Support`).
 *
 * @constant {string} USERDATA_DIR
 */
module.exports.USERDATA_DIR   = "USERDATA_DIR";

/**
 * `UNIT_NAME_NONE` represents unit-less values.
 */
module.exports.UNIT_NAME_NONE     = "NONE";

/**
 * `UNIT_NAME_INCH` for inches.
 */
module.exports.UNIT_NAME_INCH     = "\"";

/**
 * `UNIT_NAME_CM` for centimeters
 */
module.exports.UNIT_NAME_CM       = "cm";

/**
 * `UNIT_NAME_MM` for millimeters
 */
module.exports.UNIT_NAME_MM       = "mm";

/**
 * `UNIT_NAME_CICERO` for ciceros
 */
module.exports.UNIT_NAME_CICERO   = "cicero";

/**
 * `UNIT_NAME_PICA` for picas
 */
module.exports.UNIT_NAME_PICA     = "pica";

/**
 * `UNIT_NAME_PIXEL` for pixels
 */
module.exports.UNIT_NAME_PIXEL    = "px";

/**
 * `UNIT_NAME_POINT` for points
 */
module.exports.UNIT_NAME_POINT    = "pt";

// INI parser states
const STATE_IDLE                               =  0;
const STATE_SEEN_OPEN_SQUARE_BRACKET           =  1;
const STATE_SEEN_NON_WHITE                     =  2;
const STATE_AFTER_NON_WHITE                    =  3;
const STATE_SEEN_EQUAL                         =  4;
const STATE_ERROR                              =  5;
const STATE_SEEN_CLOSE_SQUARE_BRACKET          =  6;
const STATE_IN_COMMENT                         =  7;

// INI value string processing helpers
const REGEXP_TRIM                              = /^\s*(\S?.*?)\s*$/;
const REGEXP_TRIM_REPLACE                      = "$1";
const REGEXP_DESPACE                           = /\s+/g;
const REGEXP_DESPACE_REPLACE                   = "";
const REGEXP_ALPHA_ONLY                        = /[^-a-zA-Z0-9_$]+/g;
const REGEXP_ALPHA_ONLY_REPLACE                = "";
const REGEXP_SECTION_NAME_ONLY                 = /[^-a-zA-Z0-9_$:]+/g;
const REGEXP_SECTION_NAME_ONLY_REPLACE         = "";
const REGEXP_NUMBER_ONLY                       = /^([\d\.]+).*$/;
const REGEXP_NUMBER_ONLY_REPLACE               = "$1";
const REGEXP_UNIT_ONLY                         = /^[\d\.]+\s*(.*)$/;
const REGEXP_UNIT_ONLY_REPLACE                 = "$1";
const REGEXP_PICAS                             = /^([\d]+)p(([\d]*)(\.([\d]+)?)?)?$/;
const REGEXP_PICAS_REPLACE                     = "$1";
const REGEXP_PICAS_POINTS_REPLACE              = "$2";
const REGEXP_CICEROS                           = /^([\d]+)c(([\d]*)(\.([\d]+)?)?)?$/;
const REGEXP_CICEROS_REPLACE                   = "$1";
const REGEXP_CICEROS_POINTS_REPLACE            = "$2";

//
// UXP internally caches responses from the server - we need to avoid this as each script
// run can return different results. `HTTP_CACHE_BUSTER` will be incremented after each use.
//
var HTTP_CACHE_BUSTER         = Math.floor(Math.random() * 1000000);

var LOG_LEVEL_STACK           = [];
var LOG_ENTRY_EXIT            = false;
var LOG_LEVEL                 = LOG_LEVEL_OFF;
var IN_LOGGER                 = false;
var LOG_TO_UXPDEVTOOL_CONSOLE = true;
var LOG_TO_CRDT               = false;
var LOG_TO_FILEPATH           = undefined;

var SYS_INFO;

/**
 * (async) Show an alert.
 *
 * @function alert
 *
 * @param {string} message - string to display
 */

async function alert(message) {

    do {

        if (appType == APP_TYPE_INDESIGN) {
            var dlg = app.dialogs.add();
            var col = dlg.dialogColumns.add();
            var stText = col.staticTexts.add();
            stText.staticLabel = "" + message;
            dlg.canCancel = false;
            dlg.show();
            dlg.destroy();
            break;
        }
        
        if (appType == APP_TYPE_PHOTOSHOP) {
            app.showAlert(message);
            break;
        }

        throw "Unsupported app type";
    }
    while (false);
}
module.exports.alert = alert;

/**
 * (async) Decode a string that was encoded using base64.
 *
 * This function has not been speed-tested;
 * I suspect it might only be beneficial for very large long strings, if that. The overheads might be
 * larger than the speed benefit.
 *
 * @function base64decode
 *
 * @param {string} base64Str - base64 encoded string
 * @returns {string|undefined} decoded string
 */
async function base64decode(base64Str) {

    var retVal;

    var response = await evalTQL("base64decode(" + dQ(base64Str) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.base64decode = base64decode;

/**
 * (async) Encode a string or an array of bytes using Base 64 encoding.
 *
 * This function has not been speed-tested.
 *
 * I suspect it might only be beneficial for very large long strings, if that. The overheads might be
 * larger than the speed benefit.
 *
 * @function base64encode
 *
 * @param {string} s_or_ByteArr - either a string or an array containing bytes (0-255).
 * @returns {string|undefined} encoded string
 *
 */
async function base64encode(s_or_ByteArr) {

    var retVal;

    var response = await evalTQL("base64encode(" + dQ(s_or_ByteArr) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.base64encode = base64encode;

/**
 * (sync) Decode an array of bytes that contains a UTF-8 encoded string.
 *
 * @function binaryUTF8ToStr
 *
 * @param {array} in_byteArray - an array containing bytes (0-255)
 * for a string using UTF-8 encoding.
 * @returns {string|undefined} a string or undefined if the UTF-8 is not valid
 */
function binaryUTF8ToStr(in_byteArray) {

    var retVal = undefined;

    try {
        var idx = 0;
        var len = in_byteArray.length;
        var c;
        while (idx < len) {
            var byte = in_byteArray[idx];
            idx++;
            var bit7 = byte >> 7;
            if (! bit7) {
                // U+0000 - U+007F
                c = String.fromCharCode(byte);
            }
            else {
                var bit6 = (byte & 0x7F) >> 6;
                if (! bit6) {
                    // Invalid
                    retVal = undefined;
                    break;
                }
                else {
                    var byte2 = in_byteArray[idx];
                    idx++;
                    var bit5 = (byte & 0x3F) >> 5;
                    if (! bit5) {
                        // U+0080 - U+07FF
                        c = String.fromCharCode(((byte & 0x1F) << 6) | (byte2 & 0x3F));
                    }
                    else {
                        var byte3 = in_byteArray[idx];
                        idx++;
                        var bit4 = (byte & 0x1F) >> 4;
                        if (! bit4) {
                            // U+0800 - U+FFFF
                            c = String.fromCharCode(((byte & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
                        }
                        else {
                            // Not handled U+10000 - U+10FFFF
                            retVal = undefined;
                            break;
                        }
                    }
                }
            }
            if (! retVal) {
                retVal = "";
            }
            retVal += c;
        }
    }
    catch (err) {
        retVal = undefined;
    }

    return retVal;
}
module.exports.binaryUTF8ToStr = binaryUTF8ToStr;

// (sync) charCodeToUTF8__: internal function: convert a Unicode character code to a 1 to 3 byte UTF8 byte sequence
// returns undefined if invalid in_charCode

function charCodeToUTF8__(in_charCode) {

    var retVal = undefined;

    try {

        if (in_charCode <= 0x007F) {
            retVal = [];
            retVal.push(in_charCode);
        }
        else if (in_charCode <= 0x07FF) {
            var hi = 0xC0 + ((in_charCode >> 6) & 0x1F);
            var lo = 0x80 + ((in_charCode      )& 0x3F);
            retVal = [];
            retVal.push(hi);
            retVal.push(lo);
        }
        else {
            var hi =  0xE0 + ((in_charCode >> 12) & 0x1F);
            var mid = 0x80 + ((in_charCode >>  6) & 0x3F);
            var lo =  0x80 + ((in_charCode      ) & 0x3F);
            retVal = [];
            retVal.push(hi);
            retVal.push(mid);
            retVal.push(lo);
        }
    }
    catch (err) {
        // anything weird, we return undefined
        retVal = undefined;
    }

    return retVal;
}

/**
 * (sync) Configure the logger
 *
 * @function configLogger
 *
 * @param {object} logInfo - object with logger setup info
 *     logLevel: 0-4
 *     logEntryExit: boolean
 *     logToUXPConsole: boolean
 *     logToCRDT: boolean
 *     logToFilePath: undefined or a file path for logging
 * 
 * @returns {boolean} success/failure
 */
function configLogger(logInfo) {

    var retVal = false;
    try {
        if (logInfo) {
            if ("logLevel" in logInfo) {
                LOG_LEVEL = logInfo.logLevel;
            }
            if ("logEntryExit" in logInfo) {
                LOG_ENTRY_EXIT = logInfo.logEntryExit;
            }
            if ("logToUXPConsole" in logInfo) {
                LOG_TO_UXPDEVTOOL_CONSOLE = logInfo.logToUXPConsole;
            }
            if ("logToCRDT" in logInfo) {
                LOG_TO_CRDT = logInfo.logToCRDT;
            }
            if ("logToFilePath" in logInfo) {
                LOG_TO_FILEPATH = logInfo.logToFilePath;
            }
            retVal = true;
        }
    }
    catch (err) {        
    }

    return retVal;
}
module.exports.configLogger = configLogger;

/**
 * (async) Reverse the operation of the `encrypt()` function.
 *
 * Only available to paid developer accounts
 *
 * @function decrypt
 *
 * @param {string} s_or_ByteArr - a string or an array of bytes
 * @param {string} aesKey - a string or an array of bytes
 * @returns {array|undefined} an array of bytes
 */

async function decrypt(s_or_ByteArr, aesKey, aesIV) {

    var retVal;

    if (! aesIV) {
        aesIV = "";
    }

    var response = await evalTQL("decrypt(" + dQ(s_or_ByteArr) + ", " + dQ(aesKey) + ", " + dQ(aesIV) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.decrypt = decrypt;

/**
 * (sync) Reverse the operation of `dQ()` or `sQ()`.
 *
 * @function deQuote
 *
 * @param {string} quotedString - a quoted string
 * @returns {array} a byte array. If the quoted string contains any `\uHHHH`` codes,
 * these are first re-encoded using UTF-8 before storing them into the byte array.
 */
function deQuote(quotedString) {

    var retVal = [];

    do {

        var qLen = quotedString.length;
        if (qLen < 2) {
            break;
        }

        var quoteChar = quotedString.charAt(0);
        qLen -= 1;
        if (quoteChar != quotedString.charAt(qLen)) {
            break;
        }

        if (quoteChar != '"' && quoteChar != "'") {
            break;
        }

        var buffer = [];
        var state = 0;
        var cCode = 0;
        for (charIdx = 1; charIdx < qLen; charIdx++) {

            if (state == -1) {
                break;
            }

            var c = quotedString.charAt(charIdx);
            switch (state) {
            case 0:
                if (c == '\\') {
                    state = 1;
                }
                else {
                    buffer.push(c.charCodeAt(0));
                }
                break;
            case 1:
                if (c == 'x') {
                    // state 2->3->0
                    state = 2;
                }
                else if (c == 'u') {
                    // state 4->5->6->7->0
                    state = 4;
                }
                else if (c == 't') {
                    buffer.push(0x09);
                    state = 0;
                }
                else if (c == 'r') {
                    buffer.push(0x0D);
                    state = 0;
                }
                else if (c == 'n') {
                    buffer.push(0x0A);
                    state = 0;
                }
                else {
                    buffer.push(c.charCodeAt(0));
                    state = 0;
                }
                break;
            case 2:
            case 4:
                if (c >= '0' && c <= '9') {
                    cCode = c.charCodeAt(0)      - 0x30;
                    state++;
                }
                else if (c >= 'A' && c <= 'F') {
                    cCode = c.charCodeAt(0) + 10 - 0x41;
                    state++;
                }
                else if (c >= 'a' && c <= 'f') {
                    cCode = c.charCodeAt(0) + 10 - 0x61;
                    state++;
                }
                else {
                    state = -1;
                }
                break;
            case 3:
            case 5:
            case 6:
            case 7:

                if (c >= '0' && c <= '9') {
                    cCode = (cCode << 4) + c.charCodeAt(0)      - 0x30;
                }
                else if (c >= 'A' && c <= 'F') {
                    cCode = (cCode << 4) + c.charCodeAt(0) + 10 - 0x41;
                }
                else if (c >= 'a' && c <= 'f') {
                    cCode = (cCode << 4) + c.charCodeAt(0) + 10 - 0x61;
                }
                else {
                    state = -1;
                }

                if (state == 3)  {
                    // Done with \xHH
                    buffer.push(cCode);
                    state = 0;
                }
                else if (state == 7) {
                    // Done with \uHHHHH - convert using UTF-8
                    var bytes = charCodeToUTF8__(cCode);
                    if (! bytes) {
                        state = -1
                    }
                    else {
                        for (var byteIdx = 0; byteIdx < bytes.length; byteIdx++) {
                            buffer.push(bytes[byteIdx]);
                        }
                        state = 0;
                    }
                }
                else {
                    // Next state: 2->3, 4->5->6->7
                    state++;
                }
                break;
            }
        }
    }
    while (false);

    if (state == 0) {
        retVal = buffer;
    }

    return retVal;
}
module.exports.deQuote = deQuote;

/**
 * (async) Delete a directory.
 *
 * Not restricted by the UXP security sandbox.
 *
 * Be very careful with the `recurse` parameter! It is very easy to delete the wrong directory.
 *
 * @function dirDelete
 *
 * @param {string} filePath
 * @param {boolean} recurse
 * @returns {boolean} success or failure
 */

async function dirDelete(filePath, recurse) {

    var retVal = false;

    var response = await evalTQL("dirDelete(" + dQ(filePath) + "," + (recurse ? "true" : "false") + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.dirDelete = dirDelete;

/**
 * (async) Verify whether a directory exists. Will return `false` if the path points to a file (instead of a directory).
 *
 * Also see `fileExists()`.
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function dirExists
 *
 * @param {string} dirPath - a path to a directory
 * @returns {boolean} true or false
 */

async function dirExists(dirPath) {

    var retVal = false;

    var response = await evalTQL("dirExists(" + dQ(dirPath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.dirExists = dirExists;

/**
 * (async) Create a directory.
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function dirCreate
 *
 * @param {string} filePath
 * @returns {boolean} true or false
 */

async function dirCreate(filePath) {

    var retVal = false;

    var response = await evalTQL("dirCreate(" + dQ(filePath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.dirCreate = dirCreate;

/**
 * (async) Scan a directory.
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function dirScan
 *
 * @param {string} filePath
 * @returns {array|undefined} list of items in directory
 */

async function dirScan(filePath) {

    var retVal;

    var response = await evalTQL("enquote(dirScan(" + dQ(filePath) + ").toString())");
    if (response && ! response.error) {
        retVal = JSON.parse(binaryUTF8ToStr(deQuote(response.text)));
    }

    return retVal;
}
module.exports.dirScan = dirScan;

/**
 * (sync) Wrap a string or a byte array into double quotes, encoding any
 * binary data as a string. Knows how to handle Unicode characters
 * or binary zeroes.
 *
 * When the input is a string, high Unicode characters are
 * encoded as `\uHHHH`.
 *
 * When the inoput is a byte array, all bytes are encoded
 * as characters or as `\xHH` escape sequences.
 *
 * @function dQ
 *
 * @param {string} s_or_ByteArr - a Unicode string or an array of bytes
 * @returns {string} a string enclosed in double quotes. This string is pure 7-bit
 * ASCII and can be used into generated script code
 * Example:
 * `var script = "a=b(" + dQ(somedata) + ");";`
 */
function dQ(s_or_ByteArr) {
    return enQuote__(s_or_ByteArr, "\"");
}
module.exports.dQ = dQ;

/**
 * (async) Encrypt a string or array of bytes using a key. A random salt
 * is added into the mix, so even when passing in the same parameter values, the result will
 * be different every time.
 *
 * Only available to paid developer accounts
 *
 * @function encrypt
 *
 * @param {string} s_or_ByteArr - a string or an array of bytes
 * @param {string} aesKey - a string or an array of bytes, key
 * @param {string=} aesIV - a string or an array of bytes, initial vector
 * @returns {string|undefined} a base-64 encoded encrypted string.
 */

async function encrypt(s_or_ByteArr, aesKey, aesIV) {
    var retVal;

    if (! aesIV) {
        aesIV = "";
    }

    var response = await evalTQL("encrypt(" + dQ(s_or_ByteArr) + ", "+ dQ(aesKey) + ", " + dQ(aesIV) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.encrypt = encrypt;

//
// (sync) enQuote__: Internal helper function. Escape and wrap a string in quotes
//
function enQuote__(s_or_ByteArr, quoteChar) {

    var retVal = "";

    var quoteCharCode = quoteChar.charCodeAt(0);

    var isString = ("string" == typeof s_or_ByteArr);
    var escapedS = "";
    var sLen = s_or_ByteArr.length;
    for (var charIdx = 0; charIdx < sLen; charIdx++) {
        var cCode;
        if (isString) {
            cCode = s_or_ByteArr.charCodeAt(charIdx);
        }
        else {
            cCode = s_or_ByteArr[charIdx];
        }
        if (cCode == 0x5C) {
            escapedS += '\\\\';
        }
        else if (cCode == quoteCharCode) {
            escapedS += '\\' + quoteChar;
        }
        else if (cCode == 0x0A) {
            escapedS += '\\n';
        }
        else if (cCode == 0x0D) {
            escapedS += '\\r';
        }
        else if (cCode == 0x09) {
            escapedS += '\\t';
        }
        else if (cCode < 32 || cCode == 0x7F || (! isString && cCode >= 0x80)) {
            escapedS += "\\x" + toHex(cCode, 2);
        }
        else if (isString && cCode >= 0x80) {
            escapedS += "\\u" + toHex(cCode, 4);
        }
        else {
            escapedS += String.fromCharCode(cCode);
        }

    }

    retVal = quoteChar + escapedS + quoteChar;

    return retVal;
}

/**
 * (async) Send a TQL script to the daemon and wait for the result
 *
 * @function evalTQL
 *
 * @param {string} tqlScript - a script to run
 * @param {string=} tqlScopeName - a scope name to use. Scopes are persistent for the duration of the daemon process and can
 * be used to pass data between different processes
 * @param {boolean=} resultIsRawBinary - whether the resulting data is raw binary, or can be decoded as a string
 * @returns {any} a string or a byte array
 */
async function evalTQL(tqlScript, tqlScopeName, resultIsRawBinary) {

    var retVal = {
        error: true
    };

    try {

        if (! tqlScopeName) {
            tqlScopeName = TQL_SCOPE_NAME_DEFAULT;
        }

        const init = {
            method: "POST",
            body: tqlScript
        };

        const response = await fetch(LOCALHOST_URL + "/" + tqlScopeName + "?" + HTTP_CACHE_BUSTER, init);
        HTTP_CACHE_BUSTER = HTTP_CACHE_BUSTER + 1;

        const responseText = await response.text();
        var responseTextUnwrapped;
        if (resultIsRawBinary) {
            responseTextUnwrapped = responseText;
        }
        else {
            responseTextUnwrapped = binaryUTF8ToStr(deQuote(responseText));
        }

        retVal = {
            error: false,
            text: responseTextUnwrapped
        };

    } catch (e) {
        throw "CRDT daemon is probably not running. Use PluginInstaller to verify CRDT is activated, then use the Preferences screen to start it";
    }

    return retVal;
}
module.exports.evalTQL = evalTQL;

/**
 * (async) Close a currently open file
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function fileClose
 *
 * @param {number} fileHandle - a file handle as returned by `fileOpen()`.
 * @returns {boolean} success or failure
 */

async function fileClose(fileHandle) {

    var retVal = false;

    var response = await evalTQL("fileClose(" + fileHandle + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileClose = fileClose;

/**
 * (async) Delete a file
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function fileDelete
 *
 * @param {string} filePath
 * @returns {boolean} success or failure
 */

async function fileDelete(filePath) {

    var retVal = false;

    var response = await evalTQL("fileDelete(" + dQ(filePath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileDelete = fileDelete;

/**
 * (async) Check if a file exists. Will return `false` if the file path points to a directory.
 *
 * Also see `dirExists()`.
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function fileExists
 *
 * @param {string} filePath
 * @returns {boolean} existence of file
 */

async function fileExists(filePath) {

    var retVal = false;

    var response = await evalTQL("fileExists(" + dQ(filePath) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileExists = fileExists;

/**
 * (async) Open a binary file and return a handle
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function fileOpen
 *
 * @param {string} fileName - a native full file path to the file
 * @param {string} mode - one of `'a'`, `'r'`, `'w'` (append, read, write)
 * @returns {number|undefined} file handle
 */

async function fileOpen(fileName, mode) {

    var retVal;

    var response;
    if (mode) {
        response = await evalTQL("enquote(fileOpen(" + dQ(fileName) + "," + dQ(mode) + "))");
    }
    else {
        response = await evalTQL("enquote(fileOpen(" + dQ(fileName) + "))");
    }
    if (response && ! response.error) {
        retVal = parseInt(binaryUTF8ToStr(deQuote(response.text)), 10);
    }

    return retVal;
}
module.exports.fileOpen = fileOpen;

/**
 * (async) Read a file into memory
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function fileRead
 *
 * @param {number} fileHandle - a file handle as returned by `fileOpen()`.
 * @param {boolean} isBinary - whether the file is considered a binary file (as opposed to a UTF-8 text file)
 * @returns {any} either a byte array or a string
 */

async function fileRead(fileHandle, isBinary) {

    var retVal;

    var response = await evalTQL("enquote(fileRead(" + fileHandle + "))", undefined, true);
    if (response && ! response.error) {
        var byteArray = deQuote(response.text);
        if (isBinary) {
            retVal = deQuote(binaryUTF8ToStr(byteArray));
        }
        else {
            retVal = binaryUTF8ToStr(deQuote(binaryUTF8ToStr(byteArray)));
        }
    }

    return retVal;
}
module.exports.fileRead = fileRead;

/**
 * (async) Binary write to a file. Strings are written as UTF-8
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function fileWrite
 *
 * @param {number} fileHandle - a file handle as returned by `fileOpen()`.
 * @param {string} s_or_ByteArr - data to write to the file
 * @returns {boolean} success or failure
 */

async function fileWrite(fileHandle, s_or_ByteArr) {

    var retVal = false;

    var byteArray;
    if ("string" == typeof s_or_ByteArr) {
        byteArray = strToUTF8(s_or_ByteArr);
    }
    else {
        byteArray = s_or_ByteArr;
    }

    var response = await evalTQL("fileWrite(" + fileHandle + "," + dQ(byteArray) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.fileWrite = fileWrite;

/**
 * (sync) Interpret a value extracted from some INI data as a boolean. Things like y, n, yes, no, true, false, t, f, 0, 1
 *
 * @function getBooleanFromINI
 *
 * @param {string} in_value - ini value
 * @returns {boolean} value
 */

function getBooleanFromINI(in_value) {

    var retVal = false;

    if (in_value) {
        var value = (in_value + "").replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
        var firstChar = value.charAt(0).toLowerCase();
        var firstValue = parseInt(firstChar, 10);
        retVal = firstChar == "y" || firstChar == "t" || (! isNaN(firstValue) && firstValue != 0);
    }

    return retVal;
}
module.exports.getBooleanFromINI = getBooleanFromINI;

/**
 * (async) Query the daemon to see whether some software is currently activated or not
 *
 * @function getCapability
 *
 * @param {string} issuer - a GUID identifier for the developer account as seen in the PluginInstaller
 * @param {string} capabilityCode - a code for the software features to be activated (as determined by the developer who owns the account).
 * `capabilityCode` is not the same as `orderProductCode` - there can be multiple `orderProductCode` associated with 
 * a single `capabilityCode` (e.g. `capabilityCode` 'XYZ', `orderProductCode` 'XYZ_1YEAR', 'XYZ_2YEAR'...).
 * @param {string} encryptionKey - the secret encryption key (created by the developer) needed to decode the capability data. You want to make
 * sure this password is obfuscated and contained within encrypted script code.
 * @returns {string} a JSON-encoded object with meta object (containing customer GUID, seatIndex, decrypted developer-provided data from the activation file).
 * The decrypted developer data is embedded as a string, so might be two levels of JSON-encoding to be dealt with to get to any JSON-encoded decrypted data
 */
async function getCapability(issuer, capabilityCode, encryptionKey) {

    var retVal;

    var response = await evalTQL("getCapability(" + dQ(issuer) + ", " + dQ(capabilityCode) + ", " + dQ(encryptionKey) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.getCapability = getCapability;

/**
 * (async) Determine the license level for CRDT: 0 = not, 1 = basic, 2 = full
 *
 * Some functions, marked with "Only available to paid developer accounts" 
 * will only work with level 2. Licensing function only work with level 1
 *
 * @function getCreativeDeveloperToolsLevel
 *
 * @returns {number} - 0, 1 or 2. -1 means: error
 */
async function getCreativeDeveloperToolsLevel() {

    var retVal = -1;

    var response = await evalTQL("getCreativeDeveloperToolsLevel()");
    if (response && ! response.error) {
        retVal = parseInt(response.text, 10);
    }

    return retVal;
}
module.exports.getCreativeDeveloperToolsLevel = getCreativeDeveloperToolsLevel;

/**
 * (async) Get the path of a system directory
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function getDir
 *
 * @param {string} dirTag - a tag representing the dir:
 * ```
 *    DESKTOP_DIR
 *    DOCUMENTS_DIR
 *    HOME_DIR
 *    LOG_DIR
 *    SYSTEMDATA_DIR
 *    TMP_DIR
 *    USERDATA_DIR
 * ```
 * @returns {string} file path of dir or undefined. Directory paths include a trailing slash or backslash.
 */
async function getDir(dirTag) {

    var retVal;

    var sysInfo = await getSysInfo__();
    if (dirTag in sysInfo) {
        retVal = sysInfo[dirTag];
    }

    return retVal;
}
module.exports.getDir = getDir;

/**
 * (async) Access the environment as available to the daemon program
 *
 * Not restricted by the UXP security sandbox.
 *
 * @function getEnvironment
 *
 * @param {string} envVarName - name of environment variable
 * @returns {string} environment variable value
 */
async function getEnvironment(envVarName) {

    var retVal;

    var response = await evalTQL("getEnv(" + dQ(envVarName) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.getEnvironment = getEnvironment;

/**
 * (sync) Interpret a string extracted from some INI data as a floating point value, followed by an optional unit
 * If there is no unit, then no conversion is performed.
 *
 * @function getFloatWithUnitFromINI
 *
 * @param {string} in_valueStr - ini value
 * @param {string} in_convertToUnit - default to use if no match is found
 * @returns {number} value
 */

function getFloatWithUnitFromINI(in_valueStr, in_convertToUnit) {

    var retVal = 0.0;

    do {

        if (! in_valueStr) {
            break;
        }

        var convertToUnit;
        if (in_convertToUnit) {
            convertToUnit = in_convertToUnit;
        }
        else {
            convertToUnit = crdtuxp.UNIT_NAME_NONE;
        }

        var sign = 1.0;

        var valueStr = in_valueStr.replace(REGEXP_DESPACE, REGEXP_DESPACE_REPLACE).toLowerCase();

        var firstChar = valueStr.charAt(0);
        if (firstChar == '-') {
            valueStr = valueStr.substring(1);
            sign = -1.0;
        }
        else if (firstChar == '+') {
            valueStr = valueStr.substring(1);
        }

        var picas = undefined;
        var ciceros = undefined;
        if (valueStr.match(REGEXP_PICAS)) {
            picas = parseInt(valueStr.replace(REGEXP_PICAS, REGEXP_PICAS_REPLACE), 10);
            valueStr = valueStr.replace(REGEXP_PICAS, REGEXP_PICAS_POINTS_REPLACE);
        }
        else if (valueStr.match(REGEXP_CICEROS)) {
            ciceros = parseInt(valueStr.replace(REGEXP_CICEROS, REGEXP_CICEROS_REPLACE), 10);
            valueStr = valueStr.replace(REGEXP_CICEROS, REGEXP_CICEROS_POINTS_REPLACE);
        }

        var numberOnlyStr = valueStr.replace(REGEXP_NUMBER_ONLY, REGEXP_NUMBER_ONLY_REPLACE);
        var numberOnly = parseFloat(numberOnlyStr);
        if (isNaN(numberOnly)) {
            numberOnly = 0.0;
        }

        var fromUnit;
        if (picas !== undefined) {
            fromUnit = crdtuxp.UNIT_NAME_PICA;
            numberOnly = picas + numberOnly / 6.0;
        }
        else if (ciceros !== undefined) {
            fromUnit = crdtuxp.UNIT_NAME_CICERO;
            numberOnly = ciceros + numberOnly / 6.0;
        }
        else {
            var unitOnly = valueStr.replace(REGEXP_UNIT_ONLY, REGEXP_UNIT_ONLY_REPLACE);
            fromUnit = getUnitFromINI(unitOnly, crdtuxp.UNIT_NAME_NONE);
        }

        var conversion = 1.0;
        if (fromUnit != crdtuxp.UNIT_NAME_NONE && convertToUnit != crdtuxp.UNIT_NAME_NONE) {
            conversion = unitToInchFactor(fromUnit) / unitToInchFactor(convertToUnit);
        }

        retVal = sign * numberOnly * conversion;
    }
    while (false);

    return retVal;
}
module.exports.getFloatWithUnitFromINI = getFloatWithUnitFromINI;

/**
 * (sync) Interpret a string extracted from some INI data as an array with float values (e.g. "[ 255, 128.2, 1.7]" )
 *
 * @function getFloatValuesFromINI
 *
 * @param {string} in_valueStr - ini value
 * @returns {array|undefined} array of numbers or undefined
 */

function getFloatValuesFromINI(in_valueStr) {

    var retVal = undefined;

    do {

        if (! in_valueStr) {
            break;
        }

        var floatValues = undefined;
        var values = in_valueStr.split(",");
        for (var idx = 0; idx < values.length; idx++) {
            var value = values[idx].replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
            var numValue = 0;
            if (value) {
                numValue = parseFloat(values[idx]);
                if (isNaN(numValue)) {
                    floatValues = undefined;
                    break;
                }
            }

            if (! floatValues) {
                floatValues = [];
            }
            floatValues.push(numValue);
        }

        retVal = floatValues;
    }
    while (false);

    return retVal;
}
module.exports.getFloatValuesFromINI = getFloatValuesFromINI;

/**
 * (sync) Interpret a string extracted from some INI data as an array with int values (e.g. "[ 255, 128, 1]" )
 *
 * @function getIntValuesFromINI
 *
 * @param {string} in_valueStr - ini value
 * @returns {array|undefined} array of ints or undefined
 */

function getIntValuesFromINI(in_valueStr) {

    var retVal = undefined;

    do {

        if (! in_valueStr) {
            break;
        }

        var intValues = undefined;
        var values = in_valueStr.split(",");
        for (var idx = 0; idx < values.length; idx++) {
            var value = values[idx].replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
            if (! value) {
                value = 0;
            }
            else {
                value = parseInt(values[idx], 10);
                if (isNaN(value)) {
                    intValues = undefined;
                    break;
                }
            }
            if (! intValues) {
                intValues = [];
            }
            intValues.push(value);
        }

        retVal = intValues;
    }
    while (false);

    return retVal;
}
module.exports.getIntValuesFromINI = getIntValuesFromINI;

/**
 * (sync) Interpret a string extracted from some INI data as a unit name
 *
 * @function getUnitFromINI
 *
 * @param {string} in_value - ini value
 * @param {string} in_defaultUnit - default to use if no match is found
 * @returns {string} value
 */

function getUnitFromINI(in_value, in_defaultUnit) {

    var defaultUnit = (in_defaultUnit !== undefined) ? in_defaultUnit : crdtuxp.UNIT_NAME_NONE;

    var retVal = defaultUnit;

    var value = (in_value + "").replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE).toLowerCase();

    if (value == "\"" || value.substring(0,2) == "in") {
        retVal = crdtuxp.UNIT_NAME_INCH;
    }
    else if (value == "cm" || value == "cms" || value.substr(0,4) == "cent") {
        retVal = crdtuxp.UNIT_NAME_CM;
    }
    else if (value == "mm" || value == "mms" || value.substr(0,4) == "mill") {
        retVal = crdtuxp.UNIT_NAME_MM;
    }
    else if (value.substring(0,3) == "cic") {
        retVal = crdtuxp.UNIT_NAME_CICERO;
    }
    else if (value.substring(0,3) == "pic") {
        retVal = crdtuxp.UNIT_NAME_PICA;
    }
    else if (value.substring(0,3) == "pix" || value == "px") {
        retVal = crdtuxp.UNIT_NAME_PIXEL;
    }
    else if (value.substring(0,3) == "poi" || value == "pt") {
        retVal = crdtuxp.UNIT_NAME_POINT;
    }

    return retVal;
}
module.exports.getUnitFromINI = getUnitFromINI;

/**
 * (async) Get file path to PluginInstaller if it is installed
 *
 * @function getPluginInstallerPath
 * @returns {string} file path
*/

async function getPluginInstallerPath() {

    var retVal;

    var response = await evalTQL("getPluginInstallerPath()");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;

}
module.exports.getPluginInstallerPath = getPluginInstallerPath;

/**
 * (async) Query the daemon for persisted data
 *
 * Only available to paid developer accounts
 *
 * @function getPersistData
 *
 * @param {string} issuer - a GUID identifier for the developer account as seen in the PluginInstaller
 * @param {string} attribute - an attribute name for the data
 * @param {string} password - the password (created by the developer) needed to decode the persistent data
 * @returns {any} whatever persistent data is stored for the given attribute
 */
async function getPersistData(issuer, attribute, password) {

    var retVal;

    var response = await evalTQL("getPersistData(" + dQ(issuer) + "," + dQ(attribute) + "," + dQ(password) + ")");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.getPersistData = getPersistData;

// Internal function getSysInfo__: fetch the whole Tightener sysInfo structure

async function getSysInfo__() {

    var retVal;

    if (! SYS_INFO) {
        var response = await evalTQL("enquote(sysInfo())");
        if (response && ! response.error) {
            SYS_INFO = JSON.parse(binaryUTF8ToStr(deQuote(response.text)));
        }
    }

    retVal = SYS_INFO;

    return retVal;
}

/**
 * (sync) Calculate an integer power of an int value. Avoids using floating point, so
 * should not have any floating-point round-off errors. `Math.pow()` will probably
 * give the exact same result, but I am doubtful that some implementations might internally use `log` and `exp`
 * to handle `Math.pow()`
 *
 * @function intPow
 *
 * @param {number} i - Integer base
 * @param {number} intPower - integer power
 * @returns {number} i ^ intPower
 */

function intPow(i, intPower) {

    var retVal;
    if (Math.floor(intPower) != intPower) {
        // Must be integer
        retVal = undefined;
    }
    else if (intPower == 0) {
        // Handle power of 0: 0^0 is not a number
        if (i == 0) {
            retVal = NaN;
        }
        else {
            retVal = 1;
        }
    }
    else if (i == 1) {
        // Multiplying 1 with itself is 1
        retVal = 1;
    }
    else if (intPower == 1) {
        // i ^ 1 is i
        retVal = i;
    }
    else if (intPower < 0) {
        // i^-x is 1/(i^x)
        retVal = 1/intPow(i, -intPower);
    }
    else {
        // Divide and conquer
        var halfIntPower = intPower >> 1;
        var otherHalfIntPower = intPower - halfIntPower;
        var part1 = intPow(i, halfIntPower);
        var part2;
        if (halfIntPower == otherHalfIntPower) {
            part2 = part1;
        }
        else {
            part2 =  intPow(i, otherHalfIntPower);
        }
        retVal = part1 * part2;
    }

    return retVal;
}
module.exports.intPow = intPow;

/**
 * (sync) Extend or shorten a string to an exact length, adding `padChar` as needed
 *
 * @function leftPad
 *
 * @param {string} s - string to be extended or shortened
 * @param {string} padChar - string to append repeatedly if length needs to extended
 * @param {number} len - desired result length
 * @returns {string} padded or shortened string
 */

function leftPad(s, padChar, len) {

    var retVal = undefined;

    do {
        try {

            retVal = s + "";
            if (retVal.length == len) {
                break;
            }

            if (retVal.length > len) {
                retVal = retVal.substring(retVal.length - len);
                break;
            }

            var padLength = len - retVal.length;

            var padding = new Array(padLength + 1).join(padChar)
            retVal = padding + retVal;
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}
module.exports.leftPad = leftPad;

/**
 * (async) Launch the PluginInstaller if it is installed and configured
 *
 * @function pluginInstaller
 * 
 * @returns {boolean} success/failure
*/

async function pluginInstaller() {

    var retVal;

    var response = await evalTQL("pluginInstaller()");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;

}
module.exports.pluginInstaller = pluginInstaller;

/**
 * (async) Make a log entry of the call of a function. Pass in the `arguments` keyword as a parameter.
 *
 * @function logEntry
 *
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 */

async function logEntry(reportingFunctionArguments) {
    if (LOG_ENTRY_EXIT) {
        await logTrace(reportingFunctionArguments, "Entry");
    }
}
module.exports.logEntry = logEntry;

/**
 * (async) Make a log entry of an error message. Pass in the `arguments` keyword as the first parameter
 * If the error level is below `LOG_LEVEL_ERROR` nothing happens
 *
 * @function logError
 *
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - error message
 */
async function logError(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_ERROR) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage(reportingFunctionArguments, LOG_LEVEL_ERROR, message);
    }
}
module.exports.logError = logError;

/**
 * (async) Make a log entry of the exit of a function. Pass in the `arguments` keyword as a parameter.
 *
 * @function logExit
 *
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 */

async function logExit(reportingFunctionArguments) {
    if (LOG_ENTRY_EXIT) {
        logTrace(reportingFunctionArguments, "Exit");
    }
}
module.exports.logExit = logExit;

/**
 * (sync) Extract the function name from its arguments
 *
 * @function functionNameFromArguments
 *
 * @param {object} functionArguments - pass in the current `arguments` to the function. This is used to determine the function's name
 * @returns {string} function name
 */

function functionNameFromArguments(functionArguments) {

    var functionName;
    try {
        functionName = functionArguments.callee.toString().match(/function ([^\(]+)/)[1];
    }
    catch (err) {
        functionName = "[anonymous function]";
    }

    return functionName;

}
module.exports.functionNameFromArguments = functionNameFromArguments;


/**
 * (async) Output a log message. Pass in the `arguments` keyword as the first parameter.
 * 
 * @function logMessage
 *
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {logLevel} int - log level 0 - 4
 * @param {string} message - the note to output
 */

async function logMessage(reportingFunctionArguments, logLevel, message) {

    var savedInLogger = IN_LOGGER;

    do {
        try {

            if (IN_LOGGER) {
                break;
            }

            IN_LOGGER = true;

            var functionPrefix = "";
            var functionName = "";

            if (! message) {

                message = reportingFunctionArguments;
                reportingFunctionArguments = undefined;

            }
            else if (reportingFunctionArguments) {

                if ("string" == typeof reportingFunctionArguments) {
                    functionName = reportingFunctionArguments;
                }
                else {
                    functionName = functionNameFromArguments(reportingFunctionArguments);
                }

                functionPrefix += functionName + ": ";
                
            }

            var now = new Date();
            var timePrefix =
                leftPad(now.getUTCDate(), "0", 2) +
                "-" +
                leftPad(now.getUTCMonth() + 1, "0", 2) +
                "-" +
                leftPad(now.getUTCFullYear(), "0", 4) +
                " " +
                leftPad(now.getUTCHours(), "0", 2) +
                ":" +
                leftPad(now.getUTCMinutes(), "0", 2) +
                ":" +
                leftPad(now.getUTCSeconds(), "0", 2) +
                "+00 ";

            var platformPrefix = "U ";

            switch (logLevel) {
                case LOG_LEVEL_ERROR:
                    logLevelPrefix = "ERROR";
                    break;
                case LOG_LEVEL_WARNING:
                    logLevelPrefix = "WARN ";
                    break;
                case LOG_LEVEL_NOTE:
                    logLevelPrefix = "NOTE ";
                    break;
                case LOG_LEVEL_TRACE:
                    logLevelPrefix = "TRACE";
                    break;
                default:
                    logLevelPrefix = "     ";
                    break;
            }

            var logLine = platformPrefix + timePrefix + "- " + logLevelPrefix + ": " + functionPrefix + message;

            if (LOG_TO_CRDT) {
                await evalTQL("logMessage(" + logLevel + "," + dQ(functionName) + "," + dQ(message) + ")");                
            }

            if (LOG_TO_UXPDEVTOOL_CONSOLE) {
                console.log(logLine);
            }

            if (LOG_TO_FILEPATH) {
                var fileHandle = await fileOpen(LOG_TO_FILEPATH, "a");
                await fileWrite(fileHandle, logLine + "\n");
                await fileClose(fileHandle);
            }

        }
        catch (err) {
        }
    }
    while (false);

    IN_LOGGER = savedInLogger;
}
module.exports.logMessage = logMessage;

/**
 * (async) Make a log entry of a note. Pass in the `arguments` keyword as the first parameter.
 * If the error level is below `LOG_LEVEL_NOTE` nothing happens
 *
 * @function logNote
 *
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - the note to output
 */
async function logNote(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_NOTE) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage(reportingFunctionArguments, LOG_LEVEL_NOTE, message);
    }
}
module.exports.logNote = logNote;

/**
 * (async) Emit a trace messsage into the log. Pass in the `arguments` keyword as the first parameter.
 * If the error level is below `LOG_LEVEL_TRACE` nothing happens
 *
 * @function logTrace
 *
 * @param {array} reportingFunctionArguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - the trace message to output
 */
async function logTrace(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_TRACE) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage(reportingFunctionArguments, LOG_LEVEL_TRACE, message);
    }
}
module.exports.logTrace = logTrace;

/**
 * (async) Emit a warning messsage into the log. Pass in the `arguments` keyword as the first parameter.
 * If the error level is below `LOG_LEVEL_WARNING` nothing happens
 *
 * @function logWarning
 *
 * @param {array} arguments - pass in the current `arguments` to the function. This is used to determine the function's name for the log
 * @param {string} message - the warning message to output
 */
async function logWarning(reportingFunctionArguments, message) {
    if (LOG_LEVEL >= LOG_LEVEL_WARNING) {
        if (! message) {
            message = reportingFunctionArguments;
            reportingFunctionArguments = undefined;
        }
        await logMessage(reportingFunctionArguments, LOG_LEVEL_WARNING, message);
    }
}
module.exports.logWarning = logWarning;

/**
 * (async) The unique `GUID` of this computer
 *
 * Only available to paid developer accounts
 * 
 * @function machineGUID
 *
 * @returns {string} a `GUID` string
 */
async function machineGUID() {

    var retVal;

    var response = await evalTQL("machineGUID()");
    if (response && ! response.error) {
        retVal = response.text;
    }

    return retVal;
}
module.exports.machineGUID = machineGUID;

/**
 * (sync) Restore the log level to what it was when pushLogLevel was called
 *
 * @function popLogLevel
 *
 * @returns {number} log level that was popped off the stack
 */

function popLogLevel() {

    var retVal;

    retVal = LOG_LEVEL;
    if (LOG_LEVEL_STACK.length > 0) {
        LOG_LEVEL = LOG_LEVEL_STACK.pop();
    }
    else {
        LOG_LEVEL = LOG_LEVEL_NONE;
    }

    return retVal;
}
module.exports.popLogLevel = popLogLevel;

/**
 * (sync) Save the previous log level and set a new log level
 *
 * @function pushLogLevel
 *
 * @param {number} newLogLevel - new log level to set
 * @returns {number} previous log level
 */

function pushLogLevel(newLogLevel) {

    var retVal;

    retVal = LOG_LEVEL;
    LOG_LEVEL_STACK.push(LOG_LEVEL);
    LOG_LEVEL = newLogLevel;

    return retVal;
}
module.exports.pushLogLevel = pushLogLevel;

/**
 * (sync) Read a bunch of text and try to extract structured information in .INI format
 *
 * This function is lenient and is able to extract slightly mangled INI data from the text frame
 * content of an InDesign text frame.
 *
 * This function knows how to handle curly quotes should they be present.
 *
 * The following flexibilities have been built-in:
 *
 * - Attribute names are case-insensitive and anything not `a-z 0-9` is ignored.
 * Entries like `this or that = ...` or `thisOrThat = ...` or `this'orThat = ...` are
 * all equivalent. Only letters and digits are retained, and converted to lowercase.
 *
 * - Attribute values can be quoted with either single, double, curly quotes.
 * This often occurs because InDesign can be configured to convert normal quotes into
 * curly quotes automatically.
 * Attribute values without quotes are trimmed (e.g. `bla =    x  ` is the same as `bla=x`)
 * Spaces are retained in quoted attribute values.
 *
 * - Any text will be ignore if not properly formatted as either a section name or an attribute-value
 * pair with an equal sign
 *
 * - Hard and soft returns are equivalent
 *
 * The return value is an object with the section names at the top level, and attribute names
 * below that. The following .INI
 * ```
 * [My data]
 * this is = " abc "
 * that =      abc
 * ```
 * returns
 * ```
 * {
 *   "mydata": {
 *      "__rawSectionName": "My data",
 *      "thisis": " abc ",
 *      "that": "abc"
 *   }
 * }
 * ```
 *
 * Duplicated sections and entries are automatically suffixed with a counter suffix - e.g.
 * 
 * [main]
 * a=1
 * a=2
 * a=3
 * 
 * is equivalent with 
 * 
 * [main]
 * a=1
 * a_2=2
 * a_3=3
 * 
 * [a]
 * a=1
 * [a]
 * a=2
 * 
 * is equivalent with
 * 
 * [a]
 * a=1
 * [a_2]
 * a=2
 * 
 * @function readINI
 *
 * @param {string} in_text - raw text, which might or might not contain some INI-formatted data mixed with normal text
 * @returns {object} either the ini data or `undefined`.
 */

function readINI(in_text) {

    var retVal = undefined;

    do {
        try {

            if (! in_text) {
                break;
            }

            if ("string" != typeof in_text) {
                break;
            }

            var text = in_text + "\r";
            var state = STATE_IDLE;
            var attr = "";
            var value = "";
            var attrSpaceCount = 0;
            var rawSectionName = "";
            var sectionName = "";
            var section = undefined;
            var attrCounters = {};
            var sectionCounters = {};

            for (var idx = 0; state != STATE_ERROR && idx < text.length; idx++) {
                var c = text.charAt(idx);
                switch (state) {
                    default:
                        state = STATE_ERROR;
                        break;
                    case STATE_IDLE:
                        if (c == '[') {
                            state = STATE_SEEN_OPEN_SQUARE_BRACKET;
                            rawSectionName = "";
                        }
                        else if (c == '#') {
                            state = STATE_IN_COMMENT;
                        }
                        else if (c > ' ') {
                            attr = c;
                            attrSpaceCount = 0;
                            state = STATE_SEEN_NON_WHITE;
                        }
                        break;
                    case STATE_IN_COMMENT:
                    case STATE_SEEN_CLOSE_SQUARE_BRACKET:
                        if (c == '\r' || c == '\n') {
                            state = STATE_IDLE;
                        }
                        break;
                    case STATE_SEEN_OPEN_SQUARE_BRACKET:
                        if (c == ']') {
                            state = STATE_SEEN_CLOSE_SQUARE_BRACKET;
                            sectionName = rawSectionName.toLowerCase();
                            sectionName = sectionName.replace(REGEXP_DESPACE, REGEXP_DESPACE_REPLACE);
                            sectionName = sectionName.replace(REGEXP_SECTION_NAME_ONLY, REGEXP_SECTION_NAME_ONLY_REPLACE);
                            if (sectionName) {

                                if (! retVal) {
                                    retVal = {};
                                }

                                var sectionSuffix = "";
                                var sectionCounter = 1;
                                if (sectionName in sectionCounters) {
                                    sectionCounter = sectionCounters[sectionName];
                                    sectionCounter++;
                                    sectionSuffix = "_" + sectionCounter;
                                }
                                sectionCounters[sectionName] = sectionCounter;
                                sectionName += sectionSuffix;
                                section = {};
                                retVal[sectionName] = section;
                                section.__rawSectionName = rawSectionName;
                                attrCounters = {};
                            }
                        }
                        else {
                            rawSectionName += c;
                        }
                        break;
                    case STATE_SEEN_NON_WHITE:
                        if (c == "=") {
                            value = "";
                            state = STATE_SEEN_EQUAL;
                        }
                        else if (c == '\r' || c == '\n') {
                            state = STATE_IDLE;
                        }
                        else if (c != " ") {
                            while (attrSpaceCount > 0) {
                                attr += " ";
                                attrSpaceCount--;
                            }
                            attr += c;
                        }
                        else {
                            attrSpaceCount++;
                        }
                        break;
                    case STATE_SEEN_EQUAL:
                        if (c != '\r' && c != '\n') {
                            value += c;
                        }
                        else {
                            value = value.replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
                            if (value.length >= 2) {
                                var firstChar = value.charAt(0);
                                var lastChar = value.charAt(value.length - 1);
                                if (
                                    (firstChar == "\"" || firstChar == "“" || firstChar == "”")
                                &&
                                    (lastChar == "\"" || lastChar == "“" || lastChar == "”")
                                ) {
                                    value = value.substring(1, value.length - 1);
                                }
                                else if (
                                    (firstChar == "'" || firstChar == "‘" || firstChar == "’")
                                &&
                                    (lastChar == "'" || lastChar == "‘" || lastChar == "’")
                                ) {
                                    value = value.substring(1, value.length - 1);
                                }
                            }

                            if (section) {
                                attr = attr.replace(REGEXP_DESPACE, REGEXP_DESPACE_REPLACE).toLowerCase();
                                attr = attr.replace(REGEXP_ALPHA_ONLY, REGEXP_ALPHA_ONLY_REPLACE);
                                if (attr) {

                                    var attrSuffix = "";
                                    var attrCounter = 1;
                                    if (attr in attrCounters) {
                                        attrCounter = attrCounters[attr];
                                        attrCounter++;
                                        attrSuffix = "_" + attrCounter;
                                    }
                                    attrCounters[attr] = attrCounter;
                                    attr += attrSuffix;

                                    section[attr] = value;
                                }
                            }

                            state = STATE_IDLE;
                        }
                        break;
                }
            }
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}
module.exports.readINI = readINI;

/**
 * (sync) Extend or shorten a string to an exact length, adding `padChar` as needed
 *
 * @function rightPad
 *
 * @param {string} s - string to be extended or shortened
 * @param {string} padChar - string to append repeatedly if length needs to extended
 * @param {number} len - desired result length
 * @returns {string} padded or shortened string
 */

function rightPad(s, padChar, len) {

    var retVal = undefined;

    do {
        try {

            retVal = s + "";

            if (retVal.length == len) {
                break;
            }

            if (retVal.length > len) {
                retVal = retVal.substring(0, len);
                break;
            }

            var padLength = len - retVal.length;

            var padding = new Array(padLength + 1).join(padChar)
            retVal = retVal + padding;
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}
module.exports.rightPad = rightPad;

/**
 * (async) Send in activation data so the daemon can determine whether some software is currently activated or not.
 *
 * Needs to be followed by a `sublicense()` call
 *
 * @function setIssuer
 *
 * @param {string} issuerGUID - a GUID identifier for the developer account as seen in the PluginInstaller
 * @param {string} issuerEmail - the email for the developer account as seen in the PluginInstaller
 * @returns { boolean } - success or failure
 */
async function setIssuer(issuerGUID, issuerEmail) {

    var retVal;

    var response = await evalTQL("setIssuer(" + dQ(issuerGUID) + "," + dQ(issuerEmail) + ")");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.setIssuer = setIssuer;

/**
 * (sync) Wrap a string or a byte array into single quotes, encoding any
 * binary data as a string. Knows how to handle Unicode characters
 * or binary zeroes.
 *
 * When the input is a string, high Unicode characters are
 * encoded as `\uHHHH`
 *
 * When the input is a byte array, all bytes are encoded as `\xHH` escape sequences.
 *
 * @function sQ
 *
 * @param {string} s_or_ByteArr - a Unicode string or an array of bytes
 * @returns {string} a string enclosed in double quotes. This string is pure 7-bit
 * ASCII and can be used into generated script code
 * Example:
 * `var script = "a=b(" + sQ(somedata) + ");";`
 */
function sQ(s_or_ByteArr) {
    return enQuote__(s_or_ByteArr, "'");
}
module.exports.sQ = sQ;

/**
 * (async) Store some persistent data (e.g. a time stamp to determine a demo version lapsing)
 *
 * Only available to paid developer accounts
 *
 * @function setPersistData
 *
 * @param {string} issuer - a GUID identifier for the developer account as seen in the PluginInstaller
 * @param {string} attribute - an attribute name for the data
 * @param {string} password - the password (created by the developer) needed to decode the persistent data
 * @param {string} data - any data to persist
 * @returns {boolean} success or failure
 */
async function setPersistData(issuer, attribute, password, data) {

    var response = await evalTQL("setPersistData(" + dQ(issuer) + "," + dQ(attribute) + "," + dQ(password) + "," + dQ(data) + ") ? \"true\" : \"false\"");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.setPersistData = setPersistData;

/**
 * (sync) Encode a string into an byte array using UTF-8
 *
 * @function strToUTF8
 *
 * @param {string} in_s - a string
 * @returns { array } a byte array
 */
function strToUTF8(in_s) {

    var retVal = [];

    var idx = 0;
    var len = in_s.length;
    var cCode;
    while (idx < len) {
        cCode = in_s.charCodeAt(idx);
        idx++;
        var bytes = charCodeToUTF8__(cCode);
        if (! bytes) {
            retVal = undefined;
            break;
        }
        else {
            for (var byteIdx = 0; byteIdx < bytes.length; byteIdx++) {
                retVal.push(bytes[byteIdx]);
            }
        }
    }

    return retVal;
}
module.exports.strToUTF8 = strToUTF8;

/**
 * (async) Send in sublicense info generated in the PluginInstaller so the daemon can determine whether some software is currently activated or not.
 *
 * Needs to be preceded by a `setIssuer()` call.
 *
 * @function sublicense
 *
 * @param {string} key - key needed to decode activation data
 * @param {string} activation - encrypted activation data
 * @returns { boolean } success or failure
 */
async function sublicense(key, activation) {

    var retVal;

    var response = await evalTQL("sublicense(" + dQ(key) + "," + dQ(activation) + ")");
    if (response && ! response.error) {
        retVal = response.text == "true";
    }

    return retVal;
}
module.exports.sublicense = sublicense;

/**
 * (sync) Convert an integer into a hex representation with a fixed number of digits.
 * Negative numbers are converted using 2-s complement (so `-15` results in `0x01`)
 *
 * @function toHex
 *
 * @param {number} i - integer to convert to hex
 * @param {number} numDigits - How many digits. Defaults to 4 if omitted.
 * @returns { string } hex-encoded integer
 */
function toHex(i, numDigits) {

    if (! numDigits) {
        numDigits = 4;
    }

    if (i < 0) {
        var upper = intPow(2, numDigits*4);
        // Calculate 2's complement with numDigits if negative
        i = (intPow(2, numDigits*4) + i) & (upper - 1);
    }

    // Calculate and cache a long enough string of zeroes
    var zeroes = toHex.zeroes;
    if (! zeroes) {
        zeroes = "0";
    }
    while (zeroes.length < numDigits) {
        zeroes += zeroes;
    }
    toHex.zeroes = zeroes;

    var retVal = i.toString(16).toLowerCase(); // Probably always lowercase by default, but just in case...
    if (retVal.length > numDigits) {
        retVal = retVal.substring(retVal.length - numDigits);
    }
    else if (retVal.length < numDigits) {
        retVal = zeroes.substr(0, numDigits - retVal.length) + retVal;
    }

    return retVal;
}
module.exports.toHex = toHex;

/**
 * (sync) Conversion factor from a length unit into inches
 *
 * @function unitToInchFactor
 *
 * @param {string} in_unit - unit name (`crdtes.UNIT_NAME...`)
 * @returns { number } conversion factor or 1.0 if unknown/not applicable
 */

function unitToInchFactor(in_unit) {

    var retVal = 1.0;

    switch (in_unit) {
        case crdtuxp.UNIT_NAME_CM:
            retVal = 1.0/2.54;
            break;
        case crdtuxp.UNIT_NAME_MM:
            retVal = 1.0/25.4;
            break;
        case crdtuxp.UNIT_NAME_CICERO:
            retVal = 0.17762;
            break;
        case crdtuxp.UNIT_NAME_PICA:
            retVal = 1.0/12.0;
            break;
        case crdtuxp.UNIT_NAME_PIXEL:
            retVal = 1.0/72.0;
            break;
        case crdtuxp.UNIT_NAME_POINT:
            retVal = 1.0/72.0;
            break;
    }

    return retVal;
}
module.exports.unitToInchFactor = unitToInchFactor;