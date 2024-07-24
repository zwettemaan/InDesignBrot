// Mandelbrot set visualization in Adobe InDesign 
//
// (c) 2015-2024 Kris Coppieters, kris@rorohiko.com
//
// No rhyme nor reason - no practical value, just for fun. Free to use for educational
// purposes.
//
// Start Adobe InDesign, run the script. Go get coffee.
//

const indesign = require("indesign");
const app = indesign.app;

// The following defaults can be overridden by settings in a document text frame in INI format

//
// Default. How many steps before we bail out and decide the complex point is not going to reach
// distance 2 from the origin. The higher, the more accurate, but also the slower
//
const kDefaultMaxSteps = 35;

//
// Default. How large a pixel grid (numPixels x numPixels). The larger, the slower.
//
const kDefaultNumPixels = 19;

//
// Default: show dialog with elapsed time
//
const kDefaultShowElapsedTimeDialog = true;

//
// Default: delete previously calculated mandelbrot
//
const kDefaultDeletePreviousResult = true;

const kSectionNameConfig = "indesignbrot";
const kScriptLabel_FinishedSet = "Calculated_Mandelbrot";

function main() {

    crdtuxp.logEntry(arguments);

    do {
        
        try {

            const context = {};   

            const config = {};
            const doc = getTargetDoc(config);
            if (! doc) {
                crdtuxp.logError(arguments, "failed to get target doc");
                break;
            }

            context.doc = doc;
            context.config = config;

            if (! configureInDesign(context)) {
                crdtuxp.logError(arguments, "failed to configure InDesign");
                break;
            }

            if (! configureDocument(context)) {
                crdtuxp.logError(arguments, "failed to configure document");
                break;
            }

            if (! calculateMandelbrot(context)) {
                crdtuxp.logError(arguments, "failed to calculate Mandelbrot");
                break;
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }        
    }
    while (false);

    crdtuxp.logExit(arguments);

}
module.exports.main = main;

function calculateMandelbrot(context) {

    let retVal = false;

    crdtuxp.logEntry(arguments);

    do {

        try {

            if (! context) {
                crdtuxp.logError(arguments, "context missing");
                break;
            }

            const doc = context.doc;
            if (! doc || doc.constructor.name !== "Document" || ! doc.isValid) {
                crdtuxp.logError(arguments, "need valid document");
                break;
            }

            const config = context.config;
            if (! config) {
                crdtuxp.logError(arguments, "config missing");
                break;
            }

            //
            // For applying swatches we apply a logarithmic scale; pre-calculate this value because
            // we'll need it a lot
            //
            const logOfMaxSteps = Math.log(config.maxSteps);

            const swatches = {};
    
            //
            // Do a bit of benchmarking: record the start and end times, and subtract them
            //
            const startDate = new Date();

            const rects = createSquareOfNxN(context.firstPage, config.numPixels, 0, 0, context.pixelRectWidth);
            const halfNumPixels = Math.floor(config.numPixels / 2 + 1);
            for (let px = 0; px < config.numPixels; px++) {
                for (let py = 0; py < halfNumPixels; py++) {
                    const rect1 = rects[py][px];
                    const pySymmetric = config.numPixels - py - 1;
                    if (pySymmetric == py) {
                        rect2 = undefined;
                    }
                    else {
                        rect2 = rects[pySymmetric][px];
                    }

                    //
                    // Convert [0 , config.numPixels[ into interval [-2, 2[
                    //
                    // (x,y) are the values on the frog's back
                    //
                    const x = 4 * px / config.numPixels - 2;
                    const y = 4 * py / config.numPixels - 2;
                    const lambda = new complex(x, y);

                    const n = numSteps(lambda, config.maxSteps);

                    //
                    // Grab a swatch for that number of steps. If the swatch is not available yet, create it
                    //
                    let swatch = swatches[n];
                    if (! swatch) {
                        const swatchName = "N=" + n;
                        // 
                        // Try to get the swatch by name. If it ain't there, make it
                        //
                        swatch = doc.colors.itemByName(swatchName);
                        if (! swatch || ! swatch.isValid) {
                            //
                            // Make a gray RGB swatch, and use a logartihmic scale to calculate the grayscale value
                            //
                            swatch = doc.colors.add(
                                { 
                                    name: swatchName, 
                                    model: indesign.ColorModel.PROCESS, 
                                    space: indesign.ColorSpace.RGB
                                }
                            );
                            const grayScaleValue = 255 * Math.log(n) / logOfMaxSteps;
                            swatch.colorValue = [grayScaleValue, grayScaleValue, grayScaleValue];
                        }
                        swatches[n] = swatch;
                    }
                    rect1.fillColor = swatch;
                    if (rect2) {
                        rect2.fillColor = swatch;        
                    }
                }
            }

            // 
            // ...and we're done!
            //
            const endDate = new Date();

            if (config.showElapsedTimeDialog) {
                crdtuxp.alert("Time elapsed:" + (endDate.getTime() - startDate.getTime()) / 1000.0);
            }
            
            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

function collectionToArray(in_collection) {

    let retVal;

    crdtuxp.logEntry(arguments);

    retVal = in_collection.everyItem().getElements().slice(0);

    crdtuxp.logExit(arguments);

    return retVal;
}

function configureDocument(context) {

    let retVal = false;

    crdtuxp.logEntry(arguments);

    do {
        
        try {

            if (! context) {
                crdtuxp.logError(arguments, "context missing");
                break;
            }

            const doc = context.doc;
            if (! doc || doc.constructor.name !== "Document" || ! doc.isValid) {
                crdtuxp.logError(arguments, "need valid document");
                break;
            }

            const config = context.config;
            if (! config) {
                crdtuxp.logError(arguments, "config missing");
                break;
            }

            if (config.deletePreviousResult) {

                const deleteGroupIDs = [];

                const groups = collectionToArray(doc.groups);
                for (let idx = 0; idx < groups.length; idx++) {
                    const group = groups[idx];
                    if (group.label == kScriptLabel_FinishedSet) {
                        deleteGroupIDs.push(group.id);
                    }
                }

                while (deleteGroupIDs.length > 0) {
                    const groupId = deleteGroupIDs.pop();
                    const group = doc.groups.itemByID(groupId);
                    group.remove();
                }

            }

            doc.viewPreferences.horizontalMeasurementUnits = indesign.MeasurementUnits.POINTS;
            doc.viewPreferences.verticalMeasurementUnits = indesign.MeasurementUnits.POINTS;
            
            const firstPage = doc.pages.item(0);
            context.firstPage = firstPage;

            const firstPageWidth = firstPage.bounds[3] - firstPage.bounds[1];
            context.firstPageWidth = firstPageWidth;

            const firstPageHeight = firstPage.bounds[2] - firstPage.bounds[0];
            context.firstPageHeight = firstPageHeight;
            
            let gridWidth;
            if (firstPageHeight > firstPageWidth) {
                gridWidth = firstPageWidth;
            }
            else {
                gridWidth = firstPageHeight;
            }
            context.gridWidth = gridWidth;

            context.pixelRectWidth = gridWidth / config.numPixels;
                        
            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }        
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

function configureInDesign(context) {

    let retVal = false;

    crdtuxp.logEntry(arguments);

    do {
        
        try {
            app.scriptPreferences.enableRedraw = false;
            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }        
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

function createDefaultDocument(config) {

    let retVal = undefined;

    crdtuxp.logEntry(arguments);

    do {
        
        try {

            doc = app.documents.add();

            let configIniText = "";
            configIniText += "[" + kSectionNameConfig + "]\n";
            configIniText += "\n";
            configIniText += "max steps =" + config.maxSteps + "\n";
            configIniText += "num pixels =" + config.numPixels + "\n";
            configIniText += "show elapsed time dialog = " + (config.showElapsedTimeDialog ? "yes" : "no") + "\n";
            configIniText += "delete previous result = " + (config.deletePreviousResult ? "yes" : "no") + "\n";

            const configFrame = doc.textFrames.add();

            const firstPage = doc.pages.item(0);
            const firstPageWidth = firstPage.bounds[3] - firstPage.bounds[1];

            const configFrameWidth = firstPageWidth / 3;
            const gutterWidth = firstPageWidth / 10;

            const xPosOnPasteboard = firstPage.bounds[1] - configFrameWidth - gutterWidth;
            
            configFrame.geometricBounds = [ firstPage.bounds[0], xPosOnPasteboard, firstPage.bounds[2], xPosOnPasteboard + configFrameWidth];
            configFrame.contents = configIniText;

            retVal = doc;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }        
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

function defaultConfig(config) {

    let retVal = false;

    crdtuxp.logEntry(arguments);

    do {

        try {

            if (! config) {
                crdtuxp.logError(arguments, "need config");
                break;
            }

            // Default values - can be overridden by user config extracted from doc INI            
            config.maxSteps                = kDefaultMaxSteps;
            config.numPixels               = kDefaultNumPixels;
            config.showElapsedTimeDialog   = kDefaultShowElapsedTimeDialog;
            config.deletePreviousResult    = kDefaultDeletePreviousResult;
            
            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

function extractDocINIConfig(doc, config) {

    let retVal = false;

    crdtuxp.logEntry(arguments);

    do {

        try {

            if (! doc || doc.constructor.name !== "Document" || ! doc.isValid) {
                crdtuxp.logError(arguments, "need valid document");
                break;
            }

            if (! config) {
                crdtuxp.logError(arguments, "need config");
                break;
            }

            if (! defaultConfig(config)) {
                crdtuxp.logError(arguments, "failed to set defaults");
                break;
            }
            
            let docINIConfig = findINIConfig(doc);
            if (! docINIConfig) {
                break;
            }

            let docConfig = docINIConfig[kSectionNameConfig];
            if (! docConfig) {
                break;
            }

            // Note: the raw attributes in docConfig are all lowercase (e.g. maxsteps vs maxSteps)
            if (docConfig.maxsteps) {
                let maxSteps = parseInt(docConfig.maxsteps, 10);
                if (maxSteps && ! isNaN(maxSteps)) {
                    config.maxSteps = maxSteps;
                }
            }

            if (docConfig.numpixels) {
                let numPixels = parseInt(docConfig.numpixels, 10);
                if (numPixels && ! isNaN(numPixels)) {
                    config.numPixels = numPixels;
                }
            }

            if (docConfig.showelapsedtimedialog) {
                config.showElapsedTimeDialog = crdtuxp.getBooleanFromINI(docConfig.showelapsedtimedialog);
            }

            if (docConfig.deletepreviousresult) {
                config.deletePreviousResult = crdtuxp.getBooleanFromINI(docConfig.deletepreviousresult);
            }

            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

function findINIConfig(doc) {

    let retVal = undefined;

    crdtuxp.logEntry(arguments);

    do
    {
        try
        {
            if (! doc || doc.constructor.name !== "Document" || ! doc.isValid) {
                crdtuxp.logError(arguments, "need valid document");
                break;
            }

            let stories = collectionToArray(doc.stories);
            for (let idx = 0; idx < stories.length; idx++) {
                const story = stories[idx];
                const contents = story.contents;
                if (contents.toLowerCase().indexOf("[" + kSectionNameConfig + "]") >= 0) {
                    const config = crdtuxp.readINI(contents);
                    if (config && config[kSectionNameConfig]) {
                        retVal = config;
                    }
                }
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

function getTargetDoc(config) {

    let retVal = undefined;

    crdtuxp.logEntry(arguments);

    do {
        
        try {

            if (! config) {
                crdtuxp.logError(arguments, "need config");
                break;
            }

            let doc = undefined;
            try {
                doc = app.activeDocument;
                if (doc && (! doc.isValid || doc.constructor.name !== "Document")) {
                    doc = undefined;
                }
                else {
                    if (! extractDocINIConfig(doc, config)) {
                        doc = undefined;
                    }
                }
            }
            catch (err) {                
            }

            if (! doc) {

                if (! defaultConfig(config)) {
                    crdtuxp.logError(arguments, "failed to set defaults");
                    break;
                }

                doc = createDefaultDocument(config);
            }

            retVal = doc;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }        
    }
    while (false);

    crdtuxp.logExit(arguments);

    return retVal;
}

//
// Class 'complex' with some basic methods for calculating 
// Mandelbrot set
//
function complex(x, y) {

    if (x instanceof complex) {
        this.x = x.x;
        this.y = x.y;
    }
    else {
        this.x = x;
        if (y === undefined) {
            y = 0;
        }
        this.y = y;
    }

}

complex.prototype.add = function(c) {
    this.x += c.x;
    this.y += c.y;
}

complex.prototype.mul = function(c) {
    let x = this.x * c.x - this.y * c.y;
    this.y = this.x * c.y + this.y * c.x;
    this.x = x;
}

complex.prototype.sqr = function() {
    let x = this.x * this.x - this.y * this.y;
    this.y *= 2 * this.x;
    this.x = x;
}

complex.prototype.distSqr = function () {
    return this.x*this.x + this.y * this.y;
}

// 
// Utility functions
//
// jump: take a complex value z, and using the complex value lambda, 'jump' to the next
// iteration point, which is zNext = z^2 + lambda
//
function jump(z, lambda) {
    z = new complex(z);
    z.sqr();
    z.add(lambda);
    return z;
 }

//
// numSteps: calculate how many steps it takes to jump from (0,0) to a distance of
// 2 or more. We don't calculate the real distance, but the square of the distance and
// compare this to 4 (the square of 2). That saves us taking a square root.
//
function numSteps(lambda, maxSteps) {
    let n = 0;

    // Start at z = (0,0)
    let z = new complex(0,0);

    // Now iterate until we reach a distance of 2 or more, or until we 
    // tried for maxSteps times
    let distSqr = 0;
    do {
        n++;
        z = jump(z,lambda);
        distSqr = z.distSqr();
    }
    while (distSqr < 4 && n < maxSteps);

    return n;
}

//
// Creating rects in InDesign is slow. By duplicating a starter rect
// horizontally, then vertically we can speed up things a bit
//
function createSquareOfNxN(firstPage, n, x, y, pixelRectWidth) {

    const rect = firstPage.rectangles.add();
    rect.strokeWeight = 0;
    rect.strokeColor = "None";
    rect.visibleBounds = [ y, x, y + pixelRectWidth, x + pixelRectWidth ];
    const rowRectList = [rect];
    let dupeRectXPos = x;
    for (let copyIdx = 1; copyIdx < n; copyIdx++) {
        dupeRectXPos += pixelRectWidth;
        let dupeRect = rect.duplicate();
        dupeRect.strokeWeight = 0;
        dupeRect.strokeColor = "None";
        dupeRect.visibleBounds = [ y, dupeRectXPos, y + pixelRectWidth, dupeRectXPos + pixelRectWidth ];
        rowRectList.push(dupeRect);
    }

    //
    // Create a group with all rects of this first row. Then duplicate it as needed.
    //
    const rects = rowRectList.slice(0);
    const firstRowRectGroup = firstPage.groups.add(rects);

    let neededRows = n - 1;
    let dupeRowYPos = y + pixelRectWidth;
    let allRows = [ firstRowRectGroup ];
    let rows = allRows;
    let rowsGroup;
    let dupeRows;
    while (neededRows > 0) {
        let rowCount = rows.length;
        if (rowCount > 1) {
            rowsGroup = firstPage.groups.add(rows);
        }
        else {
            rowsGroup = rows[0];
        }
        let dupeRowGroup = rowsGroup.duplicate();
        if (rowCount > 1) {
            rowsGroup.ungroup();
        }
        
        dupeRowGroup.move([x, dupeRowYPos]);
        dupeRowYPos += pixelRectWidth * rowCount;
        
        //
        // Get the rows out of the group
        //
        if (rows.length > 1) {
            dupeRows = dupeRowGroup.groups.everyItem().getElements().slice(0);
            dupeRowGroup.ungroup();
            // Rows are badly sorted. Bother. Re-sort them
            dupeRows.sort(function(a,b) { return a.geometricBounds[0] - b.geometricBounds[0]; });
        }
        else {
            dupeRows = [ dupeRowGroup ];
        }
        
        allRows = allRows.concat(dupeRows);        
        neededRows -= rowCount;

        rows = allRows;
        rowCount += rowCount;
        if (rowCount > neededRows) {
            rowCount = neededRows;
            rows = rows.slice(0, neededRows);
        }
    }

    const rects_by_XxY = [];
    const allRects = [];
    for (let rowIdx = 0; rowIdx < allRows.length; rowIdx++) {
        const row = allRows[rowIdx];
        const rects = row.rectangles.everyItem().getElements().slice(0);
        row.ungroup();
        const yPos = Math.floor((rects[0].geometricBounds[0] - y)/pixelRectWidth + 0.5);
        for (let idx = 0; idx < rects.length; idx++) {
            const rect = rects[idx];
            const xPos = Math.floor((rect.geometricBounds[1] - x)/pixelRectWidth + 0.5);
            if (! rects_by_XxY[yPos]) {
                rects_by_XxY[yPos] = [];
            }
            rects_by_XxY[yPos][xPos] = rect;
            allRects.push(rect);
        }
    }

    const mandelBrot = firstPage.groups.add(allRects);
    mandelBrot.label = kScriptLabel_FinishedSet;
    mandelBrot.name = kScriptLabel_FinishedSet;

    return rects_by_XxY;
}

