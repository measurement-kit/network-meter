/* Example configuration file for OONI plugin
 */

/* info:
 * general metadata about the plugin
 */
exports.info = {
    "name": "traceroute",
    "short": "network diagnostic tool",
    "description": "Tool for displaying the route and measuring transit delays of packets across a network",
    "version": "1.0.0",
    "exec": "traceroute",
    "args": [
    {
        "name": "host",
        "type": "textbox",
        "required": true,
        "regex": "(^(?!\\-)(?:[a-zA-Z\\d\\-]{0,62}[a-zA-Z\\d]\\.){1,126}(?!\\d+)[a-zA-Z\\d]{2,63}$)|(^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$)",
        "hint": "IP address of destination"
    },
    {
        "name": "ipv6",
        "type": "checkbox",
        "required": false,
        "flag": "-6",
        "regex": "",
        "hint": "force IPv6 tracerouting"
    },
    {
        "name": "max_ttl",
        "type": "numberbox",
        "required": false,
        "flag": "-m",
        "hint": "maximum number of hops (default 30)",
        "min": "1",
        "sanedefault": "30"
    },
    {
        "name": "protocol",
        "type": "dropdown",
        "required": false,
        "flag": "",
        "hint": "may require root privledges",
        "options": [
            { "value": "-T",
              "display": "TCP"
            },
            { "value": "-U",
              "display": "UDP"
            },
            { "value" : "-I",
              "display": "ICMP"
            } 
        ]
    }
    ],
    "command": "--verbose $ipv6 $max_ttl $protocol $host"
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
