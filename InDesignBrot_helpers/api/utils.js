//
// This is the utils API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

UXES.alert        = UXES.IMPLEMENTATION_MISSING;
UXES.checkMac     = UXES.IMPLEMENTATION_MISSING;
UXES.checkWindows = UXES.IMPLEMENTATION_MISSING;
UXES.checkLinux   = UXES.IMPLEMENTATION_MISSING;

/**
* Make a copy of an object or array so it is equivalent, but does not share any references.
* Do this recursively on all nested objects 
* 
* @function UXES.deepClone
* 
* @param {any} obj - What we want to clone
* @return a deep clone of the object
*/

UXES.deepClone = function(obj) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Wrap a string in double quotes, so that eval(UXES.dQ(x)) == x 
* 
* @function UXES.dQ
* 
* @param {string} s - string to be quoted
* @return a copy of s wrapped in quotes
*/

UXES.dQ = function(s) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Pad a string with padChar by adding characters to the left
* until the desired length is reached. If the string is longer than
* the desired length, then the string is truncated on the left.
* 
* @function UXES.leftPad
* 
* @param {string} s - string to be quoted
* @param {string} padChar - single character used for padding
* @param {number} len - desired length
* @return {string} string of length len
*/

UXES.leftPad = function(s, padChar, len) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Call this function when entering any function. A typical usage is 
*   function myFunction()
*   {
*    var retVal = defaultValue;
*    UXES.logEntry(arguments);
* ...
*    UXES.logExit(arguments);
*    return retVal;
*   }
* 
* @function UXES.logEntry
* 
* @param {array} args - pass in the arguments of the calling function
*/
UXES.logEntry = function(args) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Call this function when reporting an error condition 
* ...
*    if (somethingBad) {
*      UXES.logError(arguments,"Something bad happened");
*    }
* 
* @function UXES.logError
* 
* @param {array} args - pass in the arguments of the calling function
* @param {string} msg - an error message
*/

UXES.logError = function(args, msg) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Call this function when exiting any function. A typical usage is 
*   function myFunction()
*   {
*    var retVal = defaultValue;
*    UXES.logEntry(arguments);
* ...
*    UXES.logExit(arguments);
*    return retVal;
*   }
* 
* @function UXES.logExit
* 
* @param {array} arguments - pass in the arguments of the calling function
*/

UXES.logExit      = function(args){};

UXES.logMessage   = UXES.IMPLEMENTATION_MISSING;

/**
* Call this function when reporting some interesting condition 
* ...
*    if (somethingNoteworthy) {
*      UXES.logNote(arguments,"Something bad happened");
*    }
* 
* @function UXES.logNote
* 
* @param {array} args - pass in the arguments of the calling function
* @param {string} msg - an note
*/

UXES.logNote      = function(args, msg) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Call this function when reporting some verbose, tracing info
*    
* ...
*    UXES.logTrace(arguments,"About to call some doodad");
* ...
* 
* @function UXES.logTrace
* 
* @param {array} args - pass in the arguments of the calling function
* @param {string} msg - an trace message
*/

UXES.logTrace     = function(args, msg) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Call this function when reporting an unexpected, non-lethal condition
*    
*    if (someStringIsUnexpectedlyEmpty) {
*      UXES.logWarning(arguments,"Did not expect to get an empty string");
*    }
* 
* @function UXES.logWarning
* 
* @param {array} args - pass in the arguments of the calling function
* @param {string} msg - an trace message
*/

UXES.logWarning   = function(args, msg) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Change the log level and restore what it was set to before the preceding call to pushLogLevel()
*
* @function UXES.popLogLevel
* 
* @return the previous log level before the popLogLevel()
*          
*/

UXES.popLogLevel  = function() { return UXES.IMPLEMENTATION_MISSING; };

/**
* Change the log level and save the previous log level on a
* stack.
*
* @function UXES.pushLogLevel
* 
* @param {number} newLogLevel  - new log level
* @return the previous log level
*          
*/

UXES.pushLogLevel = function(newLogLevel) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Generate some GUID. This is not really a 'proper' GUID generator, as Math.random() is not
* a very good generator, but in many cases it'll do.
*
* @function UXES.randomGUID
* 
* @return a random GUID in XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX format
* XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
*           111 1111 1222 222222333333
* 01234567 9012 4567 9012 456789012345
*          
*/

UXES.randomGUID   = function() { return UXES.IMPLEMENTATION_MISSING; };

/**
* Pad a string with padChar by adding characters to the right
* until the desired length is reached. If the string is longer than
* the desired length, then the string is truncated on the right.
* 
* @function UXES.rightPad
* 
* @param {string} s - string to be quoted
* @param {string} padChar - single character used for padding
* @param {number} len - desired length
* @return {string} string of length len
*/

UXES.rightPad = function(s, padChar, len) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Make a copy of an object so it is equivalent, but does not share any references. 
* Do not apply this on any nested objects
* 
* @function UXES.shallowClone
* 
* @param {any} obj - What we want to clone
* @return a shallow clone of the object
*/

UXES.shallowClone = function(obj) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Wrap a string in single quotes, so that eval(UXES.sQ(x)) == x 
* 
* @function UXES.sQ
* 
* @param {string} s - string to be quoted
* @return a copy of s wrapped in quotes
*/

UXES.sQ           = function(s) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Convert a positive integer to a fixed-length hexadecimal number
* 
* @function UXES.toHex
* 
* @param {number} value - value to be converted
* @param {number} numDigits - how many digits
* @return a hexadecimal string or undefined
*/

UXES.toHex        = function(value, numDigits) { return UXES.IMPLEMENTATION_MISSING; };

//--------- Tests

var GUID_REGEX = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

UXES.tests.checkMacWindowsLinux = function tests_checkMacWindowsLinux() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            var platformCount = 0;

            if (UXES.checkMac()) {
                platformCount++;
            }

            if (UXES.checkWindows()) {
                platformCount++;
            }

            if (UXES.checkLinux()) {
                platformCount++;
            }

            if (platformCount != 1) {
                UXES.logError(arguments, "check... methods result in indeterminate platform");
                break;
            }

            platformCount = 0;

            if (UXES.isMac) {
                platformCount++;
            }

            if (UXES.isWindows) {
                platformCount++;
            }

            if (UXES.isLinux) {
                platformCount++;
            }

            if (platformCount != 1) {
                UXES.logError(arguments, "status attributes cause indeterminate platform");
                break;
            }

            retVal = true;      
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

UXES.tests.deepClone = function tests_deepClone() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        try {

            if (UXES.deepClone(null) !== null) {
                UXES.logError(arguments, "null should clone to itself")
                break;
            }

            if (UXES.deepClone(undefined) !== undefined) {
                UXES.logError(arguments, "undefined should clone to itself")
                break;
            }

            if (UXES.deepClone(false) !== false) {
                UXES.logError(arguments, "false should clone to itself")
                break;
            }

            if (UXES.deepClone(true) !== true) {
                UXES.logError(arguments, "true should clone to itself")
                break;
            }

            if (UXES.deepClone(12) !== 12) {
                UXES.logError(arguments, "12 should clone to itself")
                break;
            }

            if (UXES.deepClone(12.12) !== 12.12) {
                UXES.logError(arguments, "12.12 should clone to itself")
                break;
            }
            
            if (! isNaN(UXES.deepClone(NaN))) {
                UXES.logError(arguments, "NaN should clone to itself")
                break;
            }

            var f = function f(x) {
                return x + 1;
            }

            if (UXES.deepClone(f) !== f) {
                UXES.logError(arguments, "function should clone to itself")
                retVal = false;
                break;
            }

            var obj1 = {
                a: "a", 
                b: {
                    c: 12,
                    dddd: null,
                    eee: undefined,
                    fff: "",
                    ggg: false
                },
                c: [ 1, 2, 3]
            };

            var obj2 = UXES.deepClone(obj1);

            if (obj2 == obj1) {
                UXES.logError(arguments, "objects should be different")
                break;
            }

            if (obj2.a !== obj1.a) {
                UXES.logError(arguments, "string member a should be the same")
                break;
            }

            if (obj2.b === obj1.b) {
                UXES.logError(arguments, "nested object b should be a different object")
                break;
            }

            if (obj2.b.c != obj1.b.c) {
                UXES.logError(arguments, "numeric member b.c should be the same")
                break;
            }

            if (obj2.b.dddd !== obj1.b.dddd) {
                UXES.logError(arguments, "numeric member b.dddd should be the same")
                break;
            }

            if (obj2.b.eee !== obj1.b.eee) {
                UXES.logError(arguments, "numeric member b.eee should be the same")
                break;
            }

            if (obj2.b.fff !== obj1.b.fff) {
                UXES.logError(arguments, "string member b.fff should be the same")
                break;
            }

            if (obj2.b.ggg !== obj1.b.ggg) {
                UXES.logError(arguments, "boolean member b.ggg should be the same")
                break;
            }

            if (obj2.c == obj1.c) {
                UXES.logError(arguments, "array member c should be different")
                break;
            }

            if (obj2.c.length != obj1.c.length) {
                UXES.logError(arguments, "array member c should be same length")
                break;
            }

            if (obj2.c[1] != obj1.c[1]) {
                UXES.logError(arguments, "array member c[1] should be the same")
                break;
            }

            var arr1 = [
                "a", 
                {
                    c: 12,
                    d: [ {x:1} ],
                    dddd: null,
                    eee: undefined,
                    fff: "",
                    ggg: false
                }
            ];

            var arr2 = UXES.deepClone(arr1);

            if (arr2 == arr1) {
                UXES.logError(arguments, "arrays should be different")
                break;
            }

            if (arr2[0] != arr1[0]) {
                UXES.logError(arguments, "string member [0] should be the same")
                break;
            }

            if (arr2[1] === arr2[0]) {
                UXES.logError(arguments, "nested object [1] should be a different object")
                break;
            }

            if (arr2[1].c != arr1[1].c) {
                UXES.logError(arguments, "numeric member [1].c should be the same")
                break;
            }

            if (arr2[1].d === arr1[1].d) {
                UXES.logError(arguments, "numeric member [1].d should be a different array")
                break;
            }

            if (arr2[1].d[0] === arr1[1].d[0]) {
                UXES.logError(arguments, "numeric member [1].d[0] should be a different object")
                break;
            }

            if (arr2[1].dddd !== arr1[1].dddd) {
                UXES.logError(arguments, "numeric member [1].dddd should be the same")
                break;
            }

            if (arr2[1].eee !== arr1[1].eee) {
                UXES.logError(arguments, "numeric member [1].eee should be the same")
                break;
            }

            if (arr2[1].fff !== arr1[1].fff) {
                UXES.logError(arguments, "string member [1].fff should be the same")
                break;
            }

            if (arr2[1].ggg !== arr1[1].ggg) {
                UXES.logError(arguments, "boolean member [1].ggg should be the same")
                break;
            }

            retVal = true;      

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

UXES.tests.randomGUID = function tests_randomGUID() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            var guid1 = UXES.randomGUID();
            var guid2 = UXES.randomGUID();
            if (guid1 == guid2) {
                UXES.logError(arguments, "guids should be different");
                break;                
            }

            if (! guid1.match(GUID_REGEX)) {
                UXES.logError(arguments, "guid1 wrong format");
                break;                
            }

            if (! guid2.match(GUID_REGEX)) {
                UXES.logError(arguments, "guid2 wrong format");
                break;                
            }

            retVal = true;      
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

UXES.tests.toHex = function tests_toHex() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            var tests = [
                {
                    value: 0,
                    digits: 0,
                    expected: ""
                },
                {
                    value: 0,
                    digits: 1,
                    expected: "0"
                },
                {
                    value: 0,
                    digits: 2,
                    expected: "00"
                },
                {
                    value: 0,
                    digits: 3,
                    expected: "000"
                },
                {
                    value: 0,
                    digits: 4,
                    expected: "0000"
                },
                {
                    value: 0,
                    digits: 16,
                    expected: "0000000000000000"
                },
                {
                    value: 12345678,
                    digits: 0,
                    expected: ""
                },
                {
                    value: 12345678,
                    digits: 1,
                    expected: "E"
                },
                {
                    value: 12345678,
                    digits: 2,
                    expected: "4E"
                },
                {
                    value: 12345678,
                    digits: 3,
                    expected: "14E"
                },
                {
                    value: 12345678,
                    digits: 4,
                    expected: "614E"
                },
                {
                    value: 12345678,
                    digits: 16,
                    expected: "0000000000BC614E"
                },
                {
                    value: -12345678,
                    digits: 16,
                    expected: undefined
                },
                {
                    value: 0.1,
                    digits: 4,
                    expected: undefined
                },
                {
                    value: NaN,
                    digits: 4,
                    expected: undefined
                },
                {
                    value: "123",
                    digits: 4,
                    expected: undefined
                },
                {
                    value: undefined,
                    digits: 4,
                    expected: undefined
                },
                {
                    value: null,
                    digits: 4,
                    expected: undefined
                },
                {
                    value: {a:1},
                    digits: 4,
                    expected: undefined
                }
            ];


            retVal = true;      
            for (var idx = 0; idx < tests.length; idx++) {
                var test = tests[idx];
                try {
                    UXES.pushLogLevel(UXES.C.LOG_NONE);
                    var calculated = UXES.toHex(test.value, test.digits);
                    UXES.popLogLevel();
                    if (calculated !== test.expected) {
                        UXES.logError(arguments, "test #" + idx + " fails");
                        retVal = false;
                        break;
                    }
                }
                catch (err) {
                    UXES.logError(arguments, "tests throw " + err);
                    retVal = false;
                }
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
