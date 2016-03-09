var remote = require('remote')
var fs = require('fs');
var path = require('path');
var BrowserWindow = remote.require('browser-window');
/* Handles the report output from a plugin */

/* processDiskReport(testContainer):
 * if the plugin writes reports to disk, reads appropriate file into memory
 */
exports.processDiskReport = function(testContainer, reportFile) {
    if (reportFile != null) {
        fs.readFile(reportFile), function (err, data) {
            if (err) throw err;
            testContainer.reportFile = data;
            return testContainer;
        }
    } else return testContainer;
}

exports.parse = function(testContainer) {
    results = collectOutput(testContainer);
}

/* displays results in new window
 *
 */
var mainWindow = null

exports.display = function() {
  mainWindow = new BrowserWindow({ width: 1000, height: 400, show: false })
 
  mainWindow.on('closed', function() {
    mainWindow = null
  })
 
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.show()
    console.log('window is now visible!')
  })
 
  mainWindow.loadUrl("google.com")
}

/* collectOutput(plugin, callback):
 * takes a plugin struct and a callback function.
 * calls the output of the plugin as a string with the
 * callback function
 */
var collectOutput = function(plugin) {
}
