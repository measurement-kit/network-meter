var path = require("path");
var fs  = require("fs");
var chokidar = require('chokidar'); // node fs.watch doesn't work recursively

var plugins = [];
var pluginModifications = [];

chokidar.watch(path.resolve(__dirname + path.sep + 'plugins'),
            {ignored: /[\/\\]\./}).on('all', function(event, path) {
      pluginModifications.push(event);
});

exports.loadPlugins = function(callback) {
    var pluginFolder = path.resolve(__dirname + path.sep + 'plugins');

    if (plugins.length == 0 || pluginModifications.length != 0) {
        // cache miss
        plugins = []; // reset in case changes made to filesystem
        pluginModifications = [];

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
                                var json = loadJson(mainFile);
                                plugins.push(json);
                                callback(json);
                            }
                        });
                    }
                });
            });
        });
    } else {
        // cache hit
        for (var i = 0; i < plugins.length; i++) {
            callback(plugins[i]);
        }
    }
};

var loadJson = function(file) {
    data = fs.readFileSync(file, 'utf-8');
    info = JSON.parse(data);
    return info;
};
