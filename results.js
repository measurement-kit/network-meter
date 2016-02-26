/* Handles the report output from a plugin */
var fs = require('fs');

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

/* collectOutput(plugin, callback):
 * takes a plugin struct and a callback function.
 * calls the output of the plugin as a string with the
 * callback function
 */
var collectOutput = function(plugin) {
}
