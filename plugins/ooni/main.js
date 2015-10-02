/* Example configuration file for OONI plugin
 */

/* info:
 * general metadata about the plugin
 */
exports.info = {
        "name": "ooni",
        "short": "Open Observatory of Network Interference",
        "description": "A free software, global observation network for detecting censorship, surveillance and traffic manipulation on the internet",
        "version": "1.0.0",
        "exec": "ooniprobe",
        "args": [],
        "output": "-o",
        "command": "-i example-deck/example.deck -o"
};

/* setup:
 * array of commands to be run at time of installation
 */
var setup = ["", "", ""];

/* regex(argName, val): 
 * provided an arugment name and value, this function returns true
 * if value passes the regex and false otherwise.
 *
 * stock regexes from TODO.js class are available for use.
 */
var regex = function(argName, val) {
    return bool
}

/* parsing(rawData, elementHTML):
 * function to visualize the data created by the test.
 * rawData provides the output of the tool and 
 * elementHTML provides an HTML element to draw inside.
 *
 * c3.js or d3.js libraries are available for use.
 */
var parsing = function(rawData, elementHTML) {
}
