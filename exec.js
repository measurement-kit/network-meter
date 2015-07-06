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
}

document.getElementById("ooni_button").onclick = function(){
    args = document.getElementById("args").value;
    run();
}

document.getElementById("file_button").onclick = function(){
    fileName = dialog.showOpenDialog({ properties: [ 'openFile']});
}
