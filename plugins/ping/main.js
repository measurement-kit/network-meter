/* Example configuration file for OONI plugin
 */

/* info:
 * general metadata about the plugin
 */
exports.info = {
    "name": "ping",
    "short": "ICMP tool",
    "description": "Tool for displaying the route and measuring transit delays of packets across a network",
    "version": "1.0.0",
    "exec": "ping",
    "args": [
        {
            "name": "count",
            "type": "numberbox",
            "flag": "-c",
            "required": false,
            "min": "1",
            "hint": "number of ping requests to send"
        },
        {
            "name": "ipv6",
            "type": "checkbox",
            "flag": "-N ping6",
            "hint": "force IPv6 Node Information Queries"
        },
        {
            "name": "timeout",
            "type": "radio",
            "flag": "-W",
            "required": false,
            "options": [
                {
                    "display": "Short",
                    "value": "0.1"
                },
                {
                    "display": "Medium",
                    "value": "2.0"
                },
                {
                    "display": "Long",
                    "value": "10"
                }
            ],
            "hint": "timeout to wait in absence of responses"
        },
        {
            "name": "interval",
            "type": "slider",
            "flag": "-i",
            "min": "0.5",
            "max": "20",
            "sanedefault": "1",
            "hint": "time between pings"
        },
        {
            "name": "target",
            "type": "textbox",
            "required": true,
            "regex": "(^(?!\\-)(?:[a-zA-Z\\d\\-]{0,62}[a-zA-Z\\d]\\.){1,126}(?!\\d+)[a-zA-Z\\d]{2,63}$)|(^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$)",
            "hint": "target address to ping"
        }
    ],
    "command": "-v $ipv6 $timeout $count $interval $target"
}

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
