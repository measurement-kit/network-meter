var exec = require('child_process').execFile;
var remote = require('remote'); 
var dialog = remote.require('dialog'); 
var fs = require("fs");

var fileName = null;

document.getElementById("plugin_select").onclick = function(){
    fileName = dialog.showOpenDialog({ properties: [ 'openFile']}).toString();
    if (fileName)
        parsePlugin(fileName);
}

var parsePlugin = function(plugin){
    fs.readFile(plugin, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var pluginContents = data.toString();
        console.log(pluginContents);
        var jsonData = JSON.parse(pluginContents);

        // just a temporary test
        var temp = JSON.stringify(jsonData, null, 4);
        document.getElementById("plugin_metadata").value = temp;
    });
};
