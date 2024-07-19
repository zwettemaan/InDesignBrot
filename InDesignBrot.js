if ("undefined" == typeof UXES) {
    UXES = {};
}

var id = require("indesign");
UXES.G = id;

async function load() {
    await global.require(SCRIPT_PANEL_RELATIVE_FOLDER_PATH_PROJECT_ROOT + "/InDesignBrot_helpers/idjs/runtime.idjs").loadModules(UXES);
    await global.require(SCRIPT_PANEL_RELATIVE_FOLDER_PATH_PROJECT_ROOT + "/InDesignBrot_main").main();
}

load();