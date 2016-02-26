var exec = require('child_process').execFile;
var remote = require('remote'); 
var dialog = remote.require('dialog'); 
var run = require('./handler.js').startTest;
var path = require("path");

var fileName = null;
var args     = null;

exports.bindPluginGrid = function(state){
    list = document.getElementsByClassName("plugin");
    var i = list.length - 1;
    list[i].addEventListener('click', function(object){
        state.run.set("selected", object.currentTarget.id);
        toggleOverlay();
        bindRunButton(state);
        exports.bindAccordion();
    }, true);
}

exports.bindAccordion = function() {
    var toggleLink = document.getElementById("toggleLink");
    toggleLink.addEventListener("click", function() {
        var content = document.getElementById("content");    
        if (content.className == "invisibleContent")
            content.className = "visibleContent";
        else
            content.className = "invisibleContent";
    });
}

var bindRunButton = function(state) {
    document.getElementById("run-button").addEventListener("click", 
        function() { 
            if (formValid(state)) {
                var arguments = collectArgs(state);
                execute(arguments, state);
                toggleOverlay();
            }
        });
};

/**
 * Reads arguments from the modal and generates a command
 * to be run. Uses the template from plugins[x].command
 * and replaces flags as appropriate.
 * Return list of supplied arguments.
 */
var collectArgs = function(state) {
    var selectedIndex = state.run.get("selected");
    
    var containers = document.getElementsByClassName("argument-container");
    var args = [];
    
    for(var i = 0; i < containers.length; i++) {
        // activation refers to a checkbox that signifies if the user has activated
        // the argument (only for optional arguments)
        var activation = containers[i].getElementsByClassName("activation")[0];
        if ((activation && activation.checked) || !activation) {
            var option = containers[i].getElementsByClassName("arg-buttons")[0]
                                        .getElementsByTagName("input");
            // to handle drop down menu
            if (!option.length) {
                if (containers[i].getElementsByTagName("select")) {
                    var option = containers[i].getElementsByTagName("select")[0];
                } else {
                    throw "No input tags found and object is not a select dialog"
                }
            }
            // to handle radio buttons
            else if (option[0].type == "radio") {
                for(var k = 0; k < option.length; k++) {
                    if (option[k].checked) {
                        var option = option[k]
                        break;
                    }
                }
            }
            else
            // for all other inputs, relevant input is always the last one
                option = option[option.length - 1];

            var optionName = getRNameFromElement(option);
            var optionValue;
            
            // if the arg has a flag, prepend the flag
            var flagArray = state.run.get("plugins[" + selectedIndex + "].args");
            var flagIndex = getIndexFromArgName(optionName, state);
            var flag = flagArray[flagIndex].flag;

            if (option.value == "on" && option.type == "checkbox") {
                optionValue = flag? flag + " " + option.value.replace("on", "") : null;
            } else 
                optionValue = flag ? flag + " " + option.value : option.value;

            args.push([optionName, optionValue]);
        }
    }
    
    return args
};

/** 
 * Returns name Ractive can understand from
 * DOM element
 */
var getRNameFromElement = function(element) {
    var result = element.name.replace("arg-", "");
    result = result.replace("-activated", "");
    return result;
}

var getIndexFromArgName = function(elementName, state) {
    var selectedIndex = state.run.get("selected");
    var flagArray = state.run.get("plugins[" + selectedIndex + "].args");

    for(var z = 0; z < flagArray.length; z++) {
        if (flagArray[z].name == elementName)
            return z
    }
}

/**
 * Takes arguments and reference to state, executes
 * plugin with given values
 */
var execute = function(args, state) {
    var selectedIndex = state.run.get("selected");
   
    var name = state.run.get("plugins[" + selectedIndex + "].name");
    var executable = state.run.get("plugins["+ selectedIndex + "].exec");
    var command = state.run.get("plugins[" + selectedIndex + "].command");

    for(var x = 0; x < args.length; x++) {
        // args is an array of (flag name, flag value) tuples
        command = command.replace("$" + args[x][0], args[x][1]);
    }

    // gets rid of any variables that have not been specified
    command = executable + " " + command.replace(new RegExp(/\$[a-z][a-z0-9_]*\s/g), "");

    run(name, command, path.resolve("plugins") + path.sep + name, state);
}

/* Toggles an overlay display with arguments for the user
 * to enter */
var toggleOverlay = function() {
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    window.scrollTo(0,0);
};

var formValid = function(state) {
    var selectedIndex = state.run.get("selected");
    var elements = document.getElementsByClassName("argument-container");

    for(var i = 0; i < elements.length; i++) {
        var textElement = elements[i].getElementsByTagName("input")[0];
        if (textElement.type == "text") {
            var textName = getRNameFromElement(textElement);
            var textIndex = getIndexFromArgName(textName, state);
            var regexType = state.run.get("plugins[" + selectedIndex +
                            "].args[" + textIndex + "].regex");
            var regex = placeholderToRegex(regexType);
            if (regex.test(textElement.value) == false) 
                return false;
        }
    }

    return true
}

var placeholderToRegex = function(input) {
    switch (input) {
        case "email":
            return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
            break;
        case "IP":
            return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            break;
        case "domain":
            return /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i
            break;
        case "hostname":
            return /(^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|(^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$)/i
            break;
        case "URL":
            return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
            break;
        default:
            if (input != "")
                console.warn("Invalid regex found");
            return
    }
}
