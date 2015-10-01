var exec = require('child_process').execFile;
var remote = require('remote'); 
var dialog = remote.require('dialog'); 
var fs = require("fs");
var path = require("path");
var AdmZip = require("adm-zip");
var events = require("events");
var rmdir = require("rimraf"); // I still don't believe this is really a thing
var pluginParser = require('./plugin-parser.js');
var configure = require('./configure.js');

var fileName = null;

exports.bindDeleteButtons = function(state){
    var array = document.getElementsByClassName("uninstall-button");
    var i = array.length - 1;
    array[i].addEventListener('click', function(object) {
        state.install.set("selected", object.currentTarget.id);
        deleteSelectedPlugin(state);
    });
}

exports.setupInstall = function() {
    document.getElementById("plugin_select").onclick = function(){
        dialog.showOpenDialog({ properties: [ 'openFile'],
        filters: [{name: 'Network Meter Plugins', extensions: ['nmp']}]}, function(data, errors){
            if (data != undefined) {
                var fileName = data.toString();
                fs.access(fileName, fs.R_OK, function(err) {
                    if (err) {
                        dialog.showErrorBox("File Error", "File you specified could not be accessed.");
                        return console.log(err);
                    }
                });
                installPlugin(fileName);
            }
        });
    };
}

// TODO implement callback and error handling
var installPlugin = function(pluginPath){
    var filename = path.basename(pluginPath, '.nmp');
    var installFolder = path.resolve('plugins') + path.sep + filename + path.sep;

    var zip = new AdmZip(pluginPath);
    zip.extractAllTo(installFolder);
    pluginParser.loadPlugins(function(data){
        // actions can only be bound to grid after full initialization
        configure.getState().install.set("plugins", data);
        configure.getState().install.update()
    });
};

var deleteSelectedPlugin = function(state) {
    var buttons = ["Delete", "Cancel"];

    dialog.showMessageBox( {"type": "warning",
    "title": "Delete Confirmation",
    "message": "Are you sure you want to delete?",
    "buttons": buttons}, function(result) {

    if (buttons[result] == "Delete") {
        var selectedInt = state.install.get("selected");
        var name = state.install.get("plugins[" + selectedInt + "].name");
        deletePlugin(name, function() {

        //TODO find more elegant way
        pluginParser.loadPlugins(function(data){
            // actions can only be bound to grid after full initialization
            state.install.set("plugins", data);
            state.install.update()
        });
        });
    }
    });
}

var deletePlugin = function(pluginName, callback){
    var pluginFolder = path.resolve('plugins') + path.sep + pluginName + path.sep;
    pluginFolder = fs.realpathSync(pluginFolder);

    // returns -1 if not a substring
    var index = pluginFolder.indexOf(path.resolve('plugins'));
    if (index != -1) {
        rmdir(pluginFolder, callback);
    }
}
