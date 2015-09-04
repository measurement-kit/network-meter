var exec = require('child_process').execFile;
var remote = require('remote'); 
var dialog = remote.require('dialog'); 

var fileName = null;
var args     = null;

var run = function() {
    exec(fileName.toString(), [args],  function(err, data) {
        console.log(err);
        console.log(data.toString());
    });
};

exports.bindPluginGrid = function(state){
    list = document.getElementsByClassName("plugin");
    for (var i = 0; i < list.length; i++) { // save us ES6!
        list[i].addEventListener('click', function(object){
            state.run.set("selected", object.currentTarget.id);
            toggleOverlay();
            bindRunButton(state);
        }, true);
    }
}

var bindRunButton = function(state) {
    document.getElementById("run-button").addEventListener("click", 
        function() { 
            if (formValid())
                collectArgs(state) 
        });
};

/* Reads arguments from the modal and generates a command
 * to be run. Uses the template from plugins[x].command
 * and replaces flags as appropriate */
var collectArgs = function(state) {
    var containers = document.getElementsByClassName("argument-container");
    var args = [];
    var selectedIndex = state.run.get("selected");

    for(var i = 0; i < containers.length; i++) {
        // activation refers to a checkbox that signifies if the user has activated
        // the argument (only for optional arguments)
        var activation = containers[i].getElementsByClassName("activation")[0];
        if (activation && activation.checked || !activation) {
            var option = containers[i].getElementsByTagName("input");
            // to handle dialog boxes
            if (option.length == 1 && activation) {
                var option = containers[i].getElementsByTagName("select")[0];
            }
            // to handle radio buttons
            else if (option.length > 2) {
                for(var k = 0; k < option.length; k++) {
                    if (option[k].checked && k != 0) {
                        var option = option[k]
                        break;
                    }
                }
            }
            else
            // for all other inputs, relevant input is always the last one
                option = option[option.length - 1];

            var optionName = option.name.replace("arg-", "");
            optionName = optionName.replace("-activated", "");
            var optionValue;
            
            // if the arg has a flag, prepend the flag
            var flagArray = state.run.get("plugins[" + selectedIndex + "].args");
            var flagIndex;
            for(var z = 0; z < flagArray.length; z++) {
                if (flagArray[z].name == optionName) {
                    flagIndex = z;
                    break;
                }
            }
            var flag = flagArray[flagIndex].flag;

            if (option.value == "on" && option.type == "checkbox") {
                optionValue = flag? flag + " " + option.value.replace("on", "") : null;
            } else 
                optionValue = flag ? flag + " " + option.value : option.value;

            args.push([optionName, optionValue]);
        }
    }

    var command = state.run.get("plugins[" + selectedIndex + "].command");

    for(var x = 0; x < args.length; x++) {
        // args is an array of (flag name, flag value) tuples
        command = command.replace("$" + args[x][0], args[x][1]);
    }

    // gets rid of any variables that have not been specified
    command = command.replace(new RegExp(/\$[a-z][a-z0-9_]*\s/g), "");

    dialog.showMessageBox({"type": "info", "message": command, "buttons": ["close"]});
};

/* Toggles an overlay display with arguments for the user
 * to enter */
var toggleOverlay = function() {
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    window.scrollTo(0,0);
};

var formValid = function() {
    var argForm = document.getElementById("arg-form");
    for(var i = 0; i < argForm.length; i++) {
        if (!argForm[i].validity.valid)
            return false;
    }
    return true;
}
