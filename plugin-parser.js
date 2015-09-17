var path = require("path");
var fs  = require("fs");

exports.loadPlugins = function(callback) {
    var plugins = [];
    var pluginFolder = path.resolve(__dirname + path.sep + 'plugins');
    
    fs.readdir(pluginFolder, function(err, files) {
        if (err) {
            console.log(err);
            return;
        }

        files.forEach(function(f, index, array) {
            var fullFile = pluginFolder + path.sep + f;
            fs.stat(fullFile, function(err, stats){
                if (stats.isDirectory()) {
                    var mainFile = path.resolve(fullFile) + path.sep + 'main.json';
                    fs.access(mainFile, fs.R_OK, function(err) {
                        if (!err) {
                            plugins.push(loadJson(mainFile));
                        }
                        if (plugins.length > 0) {
                            callback(plugins);
                        }
                    });
                }
            });
        });
    });
};

var loadJson = function(file) {
    data = fs.readFileSync(file, 'utf-8');
    info = JSON.parse(data);
    return info;
};
