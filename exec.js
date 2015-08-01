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

exports.bindButtons = function () {
    document.getElementById("ooni_button").onclick = function(){
        args = document.getElementById("args").value;
        run();
    }

    document.getElementById("file_button").onclick = function(){
        fileName = dialog.showOpenDialog({ properties: [ 'openFile']});
    }
}

exports.bindPluginGrid = function(state){
    list = document.getElementsByClassName("plugin");
    for (var i = 0; i < list.length; i++) { // save us ES6!
        list[i].addEventListener('click', function(object){
            state.run.set("selected", object.currentTarget.id);
            toggleOverlay();
        }, true);
    }
}

var toggleOverlay = function() {
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    window.scrollTo(0,0);
};
