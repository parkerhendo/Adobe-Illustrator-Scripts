// add exact path to folder;
var location = '';

// check for folder and return files
function getFiles() {
  var folder = new Folder(location);
  if (folder.exists) {
    return folder.getFiles('*.svg');
  } else {
    alert('Unable to find SVG Files Folder');
  }
}

// add all files to documents array
function openFiles(files) {
  var documents = [];
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    documents.push(file);
  }
  return documents;
}

// creates new folder and export options
function saveFile(destination, name) {
  var folder = new Folder(destination);
  if (!folder.exists) folder.create();
  var destFile = new File(destination + name);
  var type = ExportType.SVG;
  var exportOptions = new ExportOptionsSVG();
  exportOptions.artboardRange = '';
  (exportOptions.compressed = false), app.activeDocument.exportFile(destFile, type, exportOptions);
}

// create new document swatch and assign to stroke.
function setFillAndStroke() {
  var docRef = app.activeDocument;
  var pathList = docRef.pathItems;
  var docRef = app.activeDocument;
  var col = new RGBColor();
  col.red = 255;
  col.green = 255;
  col.blue = 255;
  var swatch = docRef.swatches.add();
  swatch.color = col;
  swatch.name = 'col';

  for (var i = 0; i < pathList.length; i++) {
    pathList[i].filled = false;
    pathList[i].stroked = true;
    pathList[i].fillColor = swatch.color;
    pathList[i].strokeColor = swatch.color;
    pathList[i].strokeWidth = 6;
  }
}

// execute menu commands
function executeActions() {
  app.executeMenuCommand('selectall');
  app.executeMenuCommand('group');
  app.executeMenuCommand('copy');
  app.executeMenuCommand('Live Pathfinder Add');
  app.executeMenuCommand('expandStyle');
  setFillAndStroke();
  app.executeMenuCommand('Live Outline Stroke');
  app.executeMenuCommand('expandStyle');
  app.executeMenuCommand('pasteInPlace');
}

function openAndExpand() {
  try {
    var files = getFiles();
    alert(files);
    if (files.length > 0) {
      var documents = openFiles(files);
      if (documents.length > 0) {
        for (var i = 0; i < documents.length; i++) {
          var doc = documents[i];
          app.open(doc);
          executeActions();
          saveFile(location + '/_output/', doc.name);
          app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        }
      }
    }
  } catch (err) {
    alert('Error Processing:');
    alert(err);
  }
}

// RUN SCRIPT
openAndExpand();
