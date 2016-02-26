 /* Manages tests running in parallel
 */
var child_process = require('child_process');
var configure = require('./configure.js');
var results = require('./results.js');

var tests = [];
var finished = [];

exports.startTest = function(name_, command, directory, reportFile) {
    var process = child_process.exec(command, { cwd : directory });
    var container = { 
        name : name_,
        test: process,
        pid: process.pid,
        stdout: "",
        stderr: "",
        reportFile: "",
        start: new Date().getTime(),
        finish: null
    };

    process.stdout.on('data', function (data) {
        var test = pidToTest(process.pid);
        test.stdout = test.stdout + data;
    });

    process.stderr.on('data', function (data) {
        var test = pidToTest(process.pid);
        test.stderr = test.stderr + data;
    });

    process.on('close', function(code, signal) {
        var test = pidToTest(process.pid);
        // TODO implement disk file reading
        test = results.processDiskReport(test, null)
        processCompleted(test);
    });

    // no need to run updateTests since it will be refreshed once
    // the user clicks on 'status'
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
    return finished;
}

exports.updateTests = function(state) {
    state.status_.set("runningTests", tests);
    state.status_.set("finishedTests", finished);
}

/* processCompleted(test):
 * adds test to completed tests array, adds finished time stamp and invokes post
 * post processing for visualization and such
 */
var processCompleted = function(test) {
    test.finish = new Date().getTime();
    finished.push(test);
    // remove process from tests array
    tests.splice( tests.indexOf(test), 1 );
    // update Ractive 'status' page
    exports.updateTests(configure.getState());
    results.parse(test);
}

/* pidToTests(pid):
 * taskes a pid int and returns a test container
 */
var pidToTest = function(pid) {
    var index = null;
    for (i = 0; i < tests.length; i++) {
        if (tests[i].pid == pid) {
            index = i;
            break
        }
    }

    if (index == null)
        throw("Not able to find PID of running test!");
    
    return tests[index];
}
