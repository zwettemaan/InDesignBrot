(function() {

if (UXES.checkMac()) {
    UXES.path.SEPARATOR = "/";
    UXES.isMac = true;
    UXES.isWindows = false;
}
else {
    UXES.path.SEPARATOR = "\\";
    UXES.isMac = false;
    UXES.isWindows = true;
}
UXES.path.GUESS_SEPARATOR = "?";

UXES.sharedInitScript = function sharedInitScript() {

    do {
        try {

            UXES.C.APP_NAME = UXES.mapAppId(UXES.C.APP_ID);

            if (! UXES.dirs.HOME) {
                UXES.criticalError("sharedInitScript needs dirs.HOME");
                break;
            }

            if (! UXES.dirs.TEMP) {
                UXES.criticalError("sharedInitScript needs dirs.TEMP");
                break;
            }

            // Do a quick check if the home directory is plausible

            if (UXES.isMac) {
                if (! UXES.path.exists(UXES.dirs.HOME + "Library")) {
                    UXES.criticalError("Could not find ~/Library");
                    break;
                }
            }
            else {
                if (! UXES.path.exists(UXES.dirs.HOME + "Application Data")) {
                    UXES.criticalError("Could not find ~/Application Data");
                    break;
                }
            }

            if (! UXES.dirs.DESKTOP) {
                UXES.dirs.DESKTOP = 
                    UXES.dirs.HOME + 
                    "Desktop" + 
                    UXES.path.SEPARATOR;
            }


            if (! UXES.dirs.DOCUMENTS) {
                UXES.dirs.DOCUMENTS = 
                    UXES.dirs.HOME + 
                    "Documents" + 
                    UXES.path.SEPARATOR;
            }

            if (! UXES.dirs.ADOBE_SCRIPTS) {
                UXES.dirs.ADOBE_SCRIPTS = 
                    UXES.dirs.DOCUMENTS + 
                    "Adobe Scripts" + 
                    UXES.path.SEPARATOR;
            }

            if (! UXES.dirs.APP_SCRIPTS) {
                UXES.dirs.APP_SCRIPTS = 
                    UXES.dirs.ADOBE_SCRIPTS + 
                    UXES.C.APP_NAME + 
                    UXES.path.SEPARATOR;
            }
        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);


}

})();
