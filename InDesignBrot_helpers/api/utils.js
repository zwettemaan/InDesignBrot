//
// This is the utils API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

(function(){

function declareAPI() {

    UXES.alert        = UXES.IMPLEMENTATION_MISSING;
    UXES.checkMac     = UXES.IMPLEMENTATION_MISSING;
    UXES.checkWindows = UXES.IMPLEMENTATION_MISSING;
    UXES.deepClone    = UXES.IMPLEMENTATION_MISSING;
    UXES.dQ           = UXES.IMPLEMENTATION_MISSING;
    UXES.logError     = UXES.IMPLEMENTATION_MISSING;
    UXES.logExit      = UXES.IMPLEMENTATION_MISSING;
    UXES.logMessage   = UXES.IMPLEMENTATION_MISSING;
    UXES.logNote      = UXES.IMPLEMENTATION_MISSING;
    UXES.logTrace     = UXES.IMPLEMENTATION_MISSING;
    UXES.logWarning   = UXES.IMPLEMENTATION_MISSING;
    UXES.popLogLevel  = UXES.IMPLEMENTATION_MISSING;
    UXES.pushLogLevel = UXES.IMPLEMENTATION_MISSING;
    UXES.randomGUID   = UXES.IMPLEMENTATION_MISSING;
    UXES.shallowClone = UXES.IMPLEMENTATION_MISSING;
    UXES.sQ           = UXES.IMPLEMENTATION_MISSING;
    UXES.toHex        = UXES.IMPLEMENTATION_MISSING;

}

//--------- Tests

var GUID_REGEX = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

UXES.tests.checkMacWindows = function checkMacWindows() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            if (UXES.isMac && UXES.isWindows) {
                UXES.logError(arguments, "both isMac and isWindows are true");
                break;
            }

            if (! UXES.isMac && ! UXES.isWindows) {
                UXES.logError(arguments, "both isMac and isWindows are false");
                break;
            }

            if (UXES.checkMac() && UXES.checkWindows()) {
                UXES.logError(arguments, "both checkMac and checkWindows return true");
                break;
            }

            if (! UXES.checkMac() && ! UXES.checkWindows()) {
                UXES.logError(arguments, "neither checkMac nor checkWindows return true");
                break;
            }  

            retVal = true;      
            UXES.logNote(arguments, "test passed");
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

UXES.tests.deepClone = function deepClone() {

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
            UXES.logNote(arguments, "test passed");

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

UXES.tests.randomGUID = function randomGUID() {

    var retVal = false;

    UXES.logEntry(arguments);

    do {
        
        try {

            var guid1 = UXES.randomGUID();
            var guid2 = UXES.randomGUID();
            if (guid1 == guid2) {
                UXES.logError(arguments, "guids should be different")
                break;                
            }

            if (! guid1.match(GUID_REGEX)) {
                UXES.logError(arguments, "guid1 wrong format")
                break;                
            }

            if (! guid2.match(GUID_REGEX)) {
                UXES.logError(arguments, "guid2 wrong format")
                break;                
            }

            retVal = true;      
            UXES.logNote(arguments, "test passed");
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

UXES.tests.toHex = function toHex() {

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


            UXES.logNote(arguments, "test passed");
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
//------------

declareAPI();

})();