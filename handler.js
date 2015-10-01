/* handler.js
 * Manages tests running in parallel
 */
var child_process = require('child_process');

exports.startTest = function(command, directory) {
    var process = child_process.exec(command, { cwd : directory });
    tests.push(process);


    process.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
    });
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

var tests = [];
