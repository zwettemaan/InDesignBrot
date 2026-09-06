//ImageCatalog.idjs
//An InDesign UXPScript 
//18.0.0  October 2022

//Creates an image catalog from the graphic files in a selected folder.
//Each file can be labeled with the file name, and the labels are placed on
//a separate layer and formatted using a paragraph style ("label") you can
//modify to change the appearance of the labels.
//
//For more on InDesign/InCopy scripting see the documentation included in the Scripting SDK
//available at http://www.adobe.com/go/id_uxp_scripting 
//Or visit the InDesign Scripting User to User forum at http://www.adobeforums.com .
//
//The myExtensions array contains the extensions of the graphic file types you want
//to include in the catalog. You can remove extensions from or add extensions to this list.
//myExtensions is a global. Mac OS users should also look at the file types in the myFileFilter function.

let myInDesign = require("indesign");
let app = myInDesign.app;

function alert(msg) {
    theDialog = app.dialogs.add();
    col = theDialog.dialogColumns.add();
    colText = col.staticTexts.add();
    colText.staticLabel = "" + msg;
    theDialog.canCancel = false;
    theDialog.show();
    theDialog.destroy();
    return;
}

async function main() {
    return new Promise(async(resolve, reject) => {
        var myFilteredFiles;
        //Make certain that user interaction (display of dialogs, etc.) is turned on.
        app.scriptPreferences.userInteractionLevel = myInDesign.UserInteractionLevels.interactWithAll;
        myExtensions = ['.jpg', '.jpeg', '.eps', '.ps', '.pdf', '.tif', '.tiff', '.gif', '.psd', '.ai'];
        const uxpfs = require('uxp').storage;
        const ufs = uxpfs.localFileSystem;
        var filteredFiles;
        var myFolder = await ufs.getFolder();
        if(myFolder != null)
        {
            myFilteredFiles = myFolder.getEntries();
            myFilteredFiles.then((value) => {
                if (value.length != 0) {
                    var filteredFiles = new Array;
                    filteredFiles = commonFilter(value);
                    myDisplayDialog(filteredFiles, myFolder);
                    resolve();
                }
                else {
                    resolve();
                }
            })
        }
        else {
          resolve();
        }
    });
}

function commonFilter(files){
    var myFilteredFiles = new Array; 
    var hashmap = new Map();
    for(var myFileCounter = 0; myFileCounter < files.length; myFileCounter++)
    {
        var myFile = files[myFileCounter];
        var filePath = myFile.nativePath;
        var indexOfExtension = filePath.indexOf(".");
        if(indexOfExtension > 0)
        {
            var extension = filePath.substring(indexOfExtension);
            if(hashmap.has(extension))
            {
                var myFiles = hashmap.get(extension);
                myFiles.push(myFile);
                hashmap.delete(extension);
                hashmap.set(extension, myFiles);
            }
            else
            {
                var myFiles = new Array;
                myFiles.push(myFile);
                hashmap.set(extension, myFiles);
            }
        } 
    }
    for (var myCounter = 0; myCounter < myExtensions.length; myCounter++)
    {
        if(hashmap.has(myExtensions[myCounter]))
        {
            var myExtensionFiles = hashmap.get(myExtensions[myCounter]);
            for(var myFileCounter = 0; myFileCounter < myExtensionFiles.length; myFileCounter++)
            {
                myFilteredFiles.push(myExtensionFiles[myFileCounter]);
            }
        }
    }
    return myFilteredFiles;
}

function myDisplayDialog(myFiles, myFolder) {
    var myLabelWidth = 112;
    var myStyleNames = myGetParagraphStyleNames(app);
    var myLayerNames = ['Layer 1', 'Labels'];
    var myDialog = app.dialogs.add({ name: 'Image Catalog' });
    with (myDialog.dialogColumns.add()) {
          with (dialogRows.add()) {
              staticTexts.add({ staticLabel: 'Information:' });
        }
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                with (dialogRows.add()) {
                    staticTexts.add({ staticLabel: 'Source Folder:', minWidth: myLabelWidth });
                    staticTexts.add({ staticLabel: myFolder.nativePath });
                }
                with (dialogRows.add()) {
                    staticTexts.add({ staticLabel: 'Number of Images:', minWidth: myLabelWidth });
                    staticTexts.add({ staticLabel: myFiles.length  + '' });
                }
            }
        }
        with (dialogRows.add()) {
            staticTexts.add({ staticLabel: 'Options:' });
        }
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                with (dialogRows.add()) {
                    staticTexts.add({ staticLabel: 'Number of Rows:', minWidth: myLabelWidth });
                    var myNumberOfRowsField = integerEditboxes.add({ editValue: 3 });
                }
                with (dialogRows.add()) {
                    staticTexts.add({ staticLabel: 'Number of Columns:', minWidth: myLabelWidth });
                    var myNumberOfColumnsField = integerEditboxes.add({ editValue: 3 });
                }
                with (dialogRows.add()) {
                    staticTexts.add({ staticLabel: 'Horizontal Offset:', minWidth: myLabelWidth });
                    var myHorizontalOffsetField = measurementEditboxes.add({ editValue: 12, editUnits: myInDesign.MeasurementUnits.points });
                }
                with (dialogRows.add()) {
                    staticTexts.add({ staticLabel: 'Vertical Offset:', minWidth: myLabelWidth });
                    var myVerticalOffsetField = measurementEditboxes.add({ editValue: 24, editUnits: myInDesign.MeasurementUnits.points });
                }
                with (dialogRows.add()) {
                    with (dialogColumns.add()) {
                        staticTexts.add({ staticLabel: 'Fitting:', minWidth: myLabelWidth });
                    }
                    with (dialogColumns.add()) {
                        var myFitProportionalCheckbox = checkboxControls.add({ staticLabel: 'Proportional', checkedState: true });
                        var myFitCenterContentCheckbox = checkboxControls.add({ staticLabel: 'Center Content', checkedState: true });
                        var myFitFrameToContentCheckbox = checkboxControls.add({ staticLabel: 'Frame to Content', checkedState: true });
                    }
                }
                with (dialogRows.add()) {
                    var myRemoveEmptyFramesCheckbox = checkboxControls.add({ staticLabel: 'Remove Empty Frames:', checkedState: true });
                }
            }
        }
        with (dialogRows.add()) {
            staticTexts.add({ staticLabel: '' });
        }
        var myLabelsGroup = enablingGroups.add({ staticLabel: 'Labels', checkedState: true });
        with (myLabelsGroup) {
            with (dialogColumns.add()) {
                //Label type
                with (dialogRows.add()) {
                    with (dialogColumns.add()) {
                        staticTexts.add({ staticLabel: 'Label Type:', minWidth: myLabelWidth });
                    }
                    with (dialogColumns.add()) {
                        var myLabelTypeDropdown = dropdowns.add({ stringList: ['File name', 'File path', 'XMP description', 'XMP author'], selectedIndex: 0 });
                    }
                }
                //Text frame height
                with (dialogRows.add()) {
                    with (dialogColumns.add()) {
                        staticTexts.add({ staticLabel: 'Label Height:', minWidth: myLabelWidth });
                  }
                    with (dialogColumns.add()) {
                        var myLabelHeightField = measurementEditboxes.add({ editValue: 24, editUnits: myInDesign.MeasurementUnits.points });
                    }
                }
                //Text frame offset
                with (dialogRows.add()) {
                    with (dialogColumns.add()) {
                        staticTexts.add({ staticLabel: 'Label Offset:', minWidth: myLabelWidth });
                    }
                    with (dialogColumns.add()) {
                        var myLabelOffsetField = measurementEditboxes.add({ editValue: 0, editUnits: myInDesign.MeasurementUnits.points });
                    }
                }
                //Style to apply
                with (dialogRows.add()) {
                    with (dialogColumns.add()) {
                        staticTexts.add({ staticLabel: 'Label Style:', minWidth: myLabelWidth });
                    }
                    with (dialogColumns.add()) {
                        var myLabelStyleDropdown = dropdowns.add({ stringList: myStyleNames, selectedIndex: 0 });
                    }
                }
                //Layer
                with (dialogRows.add()) {
                    with (dialogColumns.add()) {
                        staticTexts.add({ staticLabel: 'Layer:', minWidth: myLabelWidth });
                    }
                    with (dialogColumns.add()) {
                        var myLayerDropdown = dropdowns.add({ stringList: myLayerNames, selectedIndex: 0 });
                    }
                }
            }
        }
        var myResult = myDialog.show();
        if (myResult == true) {
            var myNumberOfRows = myNumberOfRowsField.editValue;
            var myNumberOfColumns = myNumberOfColumnsField.editValue;
            var myRemoveEmptyFrames = myRemoveEmptyFramesCheckbox.checkedState;
            var myFitProportional = myFitProportionalCheckbox.checkedState;
            var myFitCenterContent = myFitCenterContentCheckbox.checkedState;
            var myFitFrameToContent = myFitFrameToContentCheckbox.checkedState;
            var myHorizontalOffset = myHorizontalOffsetField.editValue;
            var myVerticalOffset = myVerticalOffsetField.editValue;
            var myMakeLabels = myLabelsGroup.checkedState;
            var myLabelType = myLabelTypeDropdown.selectedIndex;
            var myLabelHeight = myLabelHeightField.editValue;
            var myLabelOffset = myLabelOffsetField.editValue;
            var myLabelStyle = myStyleNames[myLabelStyleDropdown.selectedIndex];
            var myLayerName = myLayerNames[myLayerDropdown.selectedIndex];
            myDialog.destroy();
            myMakeImageCatalog(
                myFiles,
                myNumberOfRows,
                myNumberOfColumns,
                myRemoveEmptyFrames,
                myFitProportional,
                myFitCenterContent,
                myFitFrameToContent,
                myHorizontalOffset,
                myVerticalOffset,
                myMakeLabels,
                myLabelType,
                myLabelHeight,
                myLabelOffset,
                myLabelStyle,
                myLayerName
            );
        } 
        else {
            myDialog.destroy();
        }
    }
}

function myGetParagraphStyleNames(myDocument) {
    var myStyleNames = new Array();
    var myAddLabelStyle = true;
    for (var myCounter = 0; myCounter < myDocument.paragraphStyles.length; myCounter++) {
        myStyleNames.push(myDocument.paragraphStyles.item(myCounter).name);
        if (myDocument.paragraphStyles.item(myCounter).name == 'Labels') {
            myAddLabelStyle = false;
        }
    }
    if (myAddLabelStyle == true) {
        myStyleNames.push('Labels');
    }
    return myStyleNames;
}

function myMakeImageCatalog(
    myFiles,
    myNumberOfRows,
    myNumberOfColumns,
    myRemoveEmptyFrames,
    myFitProportional,
    myFitCenterContent,
    myFitFrameToContent,
    myHorizontalOffset,
    myVerticalOffset,
    myMakeLabels,
    myLabelType,
    myLabelHeight,
    myLabelOffset,
    myLabelStyle,
    myLayerName
)   
{
    var myPage, myFile, myCounter, myX1, myY1, myX2, myY2, myRectangle, myLabelStyle, myLabelLayer;
    var myParagraphStyle, myError;
    var myFramesPerPage = myNumberOfRows * myNumberOfColumns;
    var myDocument = app.documents.add();
    myDocument.viewPreferences.horizontalMeasurementUnits = myInDesign.MeasurementUnits.points;
    myDocument.viewPreferences.verticalMeasurementUnits = myInDesign.MeasurementUnits.points;
    var myDocumentPreferences = myDocument.documentPreferences;
    var myNumberOfFrames = myFiles.length;
    var myNumberOfPages = Math.round(myNumberOfFrames / myFramesPerPage);
    if (myNumberOfPages * myFramesPerPage < myNumberOfFrames) {
        myNumberOfPages++;
    }
    //If myMakeLabels is true, then add the label style and layer if they do not already exist.
    if (myMakeLabels == true) {
        try {
            myLabelLayer = myDocument.layers.item(myLayerName);
            //if the layer does not exist, trying to get the layer name will cause an error.
            myLabelLayer.name;
        } catch (myError) {
            myLabelLayer = myDocument.layers.add({ name: myLayerName });
        }
        //If the paragraph style does not exist, create it.
        try {
            myParagraphStyle = myDocument.paragraphStyles.item(myLabelStyle);
            myParagraphStyle.name;
        } catch (myError) {
            myDocument.paragraphStyles.add({ name: myLabelStyle });
        }
    }
    myDocumentPreferences.pagesPerDocument = myNumberOfPages;
    myDocumentPreferences.facingPages = false;
    var myPage = myDocument.pages.item(0);
    var myMarginPreferences = myPage.marginPreferences;
    var myLeftMargin = myMarginPreferences.left;
    var myTopMargin = myMarginPreferences.top;
    var myRightMargin = myMarginPreferences.right;
    var myBottomMargin = myMarginPreferences.bottom;
    var myLiveWidth = myDocumentPreferences.pageWidth - (myLeftMargin + myRightMargin) + myHorizontalOffset;
    var myLiveHeight = myDocumentPreferences.pageHeight - (myTopMargin + myBottomMargin);
    var myColumnWidth = myLiveWidth / myNumberOfColumns;
    var myFrameWidth = myColumnWidth - myHorizontalOffset;
    var myRowHeight = myLiveHeight / myNumberOfRows;
    var myFrameHeight = myRowHeight - myVerticalOffset;
    var myPages = myDocument.pages;
    // Construct the frames in reverse order. Don't laugh--this will
    // save us time later (when we place the graphics).
    for (myCounter = myDocument.pages.length - 1; myCounter >= 0; myCounter--) {
        myPage = myPages.item(myCounter);
        for (var myRowCounter = myNumberOfRows; myRowCounter >= 1; myRowCounter--) {
            myY1 = myTopMargin + myRowHeight * (myRowCounter - 1);
            myY2 = myY1 + myFrameHeight;
            for (var myColumnCounter = myNumberOfColumns; myColumnCounter >= 1; myColumnCounter--) {
                myX1 = myLeftMargin + myColumnWidth * (myColumnCounter - 1);
                myX2 = myX1 + myFrameWidth;
                myRectangle = myPage.rectangles.add(myDocument.layers.item(-1), undefined, undefined, {
                    geometricBounds: [myY1, myX1, myY2, myX2],
                    strokeWeight: 0,
                    strokeColor: myDocument.swatches.item('None')
                });
            }
        }
    }
    // Because we constructed the frames in reverse order, rectangle 1
    // is the first rectangle on page 1, so we can simply iterate through
    // the rectangles, placing a file in each one in turn. myFiles = myFolder.Files;
    for (myCounter = 0; myCounter < myNumberOfFrames; myCounter++) {
        myFile = myFiles[myCounter];
        console.log("lenght of myfile " +myFiles.length);
        myRectangle = myDocument.rectangles.item(myCounter);
        myRectangle.place(myFile);
        myRectangle.label = myFile;
        //Apply fitting options as specified.
        console.log("line 368");
        if (myFitProportional) {
            myRectangle.fit(myInDesign.FitOptions.proportionally);
        }
        if (myFitCenterContent) {
            myRectangle.fit(myInDesign.FitOptions.centerContent);
        }
        if (myFitFrameToContent) {
            myRectangle.fit(myInDesign.FitOptions.frameToContent);
        }
        console.log("line 378");
        //Add the label, if necessary.
        if (myMakeLabels == true) {
            myAddLabel(myRectangle, myLabelType, myLabelHeight, myLabelOffset, myLabelStyle, myLayerName);
        }
        console.log("line 382");
    }
    if (myRemoveEmptyFrames == 1) {
        for (var myCounter = myDocument.rectangles.length - 1; myCounter >= 0; myCounter--) {
            if (myDocument.rectangles.item(myCounter).contentType.equals(myInDesign.ContentType.unassigned)) {
                myDocument.rectangles.item(myCounter).remove();
            } 
            else {
                //As soon as you encounter a rectangle with content, exit the loop.
                console.log("exiting the loop");
                break;
            }
        }
    }
}

//Function that adds the label.
function myAddLabel(myFrame, myLabelType, myLabelHeight, myLabelOffset, myLabelStyleName, myLayerName) {
    var myDocument = app.documents.item(0);
    var myLabel;
    var myLabelStyle = myDocument.paragraphStyles.item(myLabelStyleName);
    var myLabelLayer = myDocument.layers.item(myLayerName);
    var myLink = myFrame.graphics.item(0).itemLink;
    //Label type defines the text that goes in the label.
    switch (myLabelType) {
        //File name
        case 0:
            myLabel = myLink.name;
            break;
        //File path
        case 1:
            myLabel = myLink.filePath;
            break;
        //XMP description
        case 2:
            try {
                myLabel = myLink.linkXmp.description;
                if (myLabel.replace(/^\s*$/gi, '') == '') {
                    throw myError;
                }
            } 
            catch (myError) {
                myLabel = 'No description available.';
            }
            break;
        //XMP author
        case 3:
            try {
                myLabel = myLink.linkXmp.author;
                if (myLabel.replace(/^\s*$/gi, '') == '') {
                    throw myError;
                }
            } 
            catch (myError) {
                myLabel = 'No author available.';
            }
            break;
    }
    var myX1 = myFrame.geometricBounds[1];
    var myY1 = myFrame.geometricBounds[2] + myLabelOffset;
    var myX2 = myFrame.geometricBounds[3];
    var myY2 = myY1 + myLabelHeight;
    var myTextFrame = myFrame.parent.textFrames.add(myLabelLayer, undefined, undefined, { geometricBounds: [myY1, myX1, myY2, myX2], contents: myLabel });
    myTextFrame.textFramePreferences.firstBaselineOffset = myInDesign.FirstBaseline.leadingOffset;
    myTextFrame.parentStory.texts.item(0).appliedParagraphStyle = myLabelStyle;
}

module.exports.main = main;
