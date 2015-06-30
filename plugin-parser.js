var path = require("path");
var fs  = require("fs");

exports.loadPlugins = function() {
    var plugins = [];
    var pluginFolder = path.resolve(__dirname + path.sep + 'plugins');
    
    fs.readdir(pluginFolder, function(err, files) {
        if (err) {
            console.log(err);
            return;
        }

        files.forEach(function(f) {
            var fullFile = pluginFolder + path.sep + f;
            fs.stat(fullFile, function(err, stats){
                if (stats.isDirectory()) {
                    var mainFile = path.resolve(fullFile) + path.sep + 'main.json';
                    fs.access(mainFile, fs.R_OK, function(err) {
                        if (!err)
                            plugins.push(loadJson(mainFile));
                    });
                }
            });
        });
    });

    return plugins;
};

var loadJson = function(file) {
    fs.readFile(file, 'utf-8', function(err, data){
        info = JSON.parse(data);
        return info;
    });
};
