Network Meter Plugin Creation Guide
===================================
Early Draft

Introduction
------------
Plugins allow a great deal of customizability within Network Meter.

TODO

Arguments
---------
The arguments section is used to populate the options the user will see when
running a test.

    "args": [
    {
        "name": "timeout",
        "type": "parameter",
        "flag": "-W",
        "required": false,
        "regex": "",
        "default": "50",
        "hint": "seconds to wait if no response received"
    },
    {
        "name": "ipv6",
        "type": "flag",
        "flag": "-N ping6",
        "hint": "force IPv6 Node Information Queries"
    },
    {
        "name": "target",
        "type": "parameter",
        "required": true,
        "regex": "",
        "placeholder": "example.com",
        "hint": "target address to ping"
    }

###Name###
Required. Short name for the option.

###Type###
Required. Two "types" are supported: `parameter` and `flag`. Flag is used for options
that are a simple on/off toggle, whereas parameter indicates that the argument
requires some form of user input.

###Interface###
Required. Only to be used with "parameter" type. Can be any of `textbox`, `slider`, 
`dropdown`, `radio`.

####Textbox####
If textbox is chosen, no additional parameters are required. Optionally, `default`,
`placeholder` and `regex` fields may be populated.

####Slider####
If slider is chosen, a max, min and tickInterval must be specified. Optionally, 
a default value may also be specified.

####Dropdown####
For dropdown, a string array `options` must be provided listing the selection
options. A default value may be specified, otherwise the first option is selected.

####Radio####
For radio, a string array `options` must be provided listing the selection
options. A default value may be specified, otherwise the first option is selected.

###Flag###
Optional. Can only be used if "type" is set to "parameter". If the user populates this
field, the flag will be used as a suffix. For example, if the flag is "--input" and
the user enters "somefile.txt", the result will be concatendated to 
`--input somefile.txt`

###Required###
Applicable if "type" is set to "parameter". Indicates whether the user must input a value
for ths field. If not set, defaults to false.

###Regex###
Optional. Can only be used if "type" is set to "parameter" and "textbox" interface element
is used. User input is evaluated against this regex. Can be one of: "email", "IP", "domain",
"hostName" (IP or domain) and "URL".
###Default###
Optional. Sane value to use populate field with initially. If the argument is a flag,
set to `true` to check box by default.

###Placeholder###
Optional. Example text to help guide the user. The user is **not** expected to use this
value - placeholder is for illustrative value only. Otherwise, consider using the "default"
attribute.
