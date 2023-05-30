if (! UXES.fs) {
    UXES.fs = require("fs");
}

if (! UXES.os) {
    UXES.os = require("os");
}

const express = require('express');

if (! UXES.app) {
    UXES.app = express();
}

UXES.C.HOST                 = UXES.VALUE_NOT_INITIALIZED;
UXES.C.PORT                 = UXES.VALUE_NOT_INITIALIZED;


