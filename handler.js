 /* Manages tests running in parallel
 */
var child_process = require('child_process');
var configure = require('./configure.js');

var tests = [];

exports.startTest = function(name_, command, directory) {
    var process = child_process.exec(command, { cwd : directory });
    var container = { name : name_,
        test: process 
    };

    process.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });


    process.on('close', function(container) {
        var index = tests.indexOf(container);
        tests.splice( index, 1 );
        exports.updateTests(configure.getState());
    });

    tests.push(container);
    return process;
}

exports.killTest = function(test) {
    test.kill('SIGINT');
}

exports.getRunningTests = function() {
    return tests;
}

exports.getFinishedTests = function() {
}

exports.updateTests = function(state) {
    state.status_.set("runningTests", tests);
}

