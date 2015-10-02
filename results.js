/* Handles the report output from a plugin */


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
