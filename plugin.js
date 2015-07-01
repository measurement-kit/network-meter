var exec = require('child_process').execFile;
var remote = require('remote'); 
var dialog = remote.require('dialog'); 
var fs = require("fs");
var path = require("path");
var AdmZip = require("adm-zip");
var events = require("events");

var fileName = null;

document.getElementById("plugin_select").onclick = function(){
    dialog.showOpenDialog({ properties: [ 'openFile'],
    filters: [{name: 'Network Meter Plugins', extensions: ['nmp']}]}, function(data, err){
        var fileName = data.toString();
        fs.access(fileName, fs.R_OK, function(err) {
            if (err) {
                dialog.showErrorBox("File Error", "File you specified could not be accessed.");
                return console.log(err);
            }
        });
        installPlugin(fileName);
    });
};

var installPlugin = function(pluginPath){
    var filename = path.basename(pluginPath, '.nmp');
    var installFolder = path.resolve('plugins') + path.sep + filename + path.sep;

    var zip = new AdmZip(pluginPath);
    zip.extractAllTo(installFolder);
};