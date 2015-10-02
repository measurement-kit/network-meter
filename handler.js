 /* Manages tests running in parallel
 */
var child_process = require('child_process');
var configure = require('./configure.js');
var results = require('./results.js');

var tests = [];
var finished = [];

exports.startTest = function(name_, command, directory) {
    var process = child_process.exec(command, { cwd : directory });
    var container = { 
        name : name_,
        test: process,
        pid: process.pid,
        stdout: "",
        stderr: "",
        start: new Date().getTime(),
        finish: null
    };

    process.stdout.on('data', function (data) {
        // TODO more efficient way of doing this
        var index = null;
        for (i = 0; i < tests.length; i++) {
            if (tests[i].pid == process.pid) {
                index = i;
                break
            }
        }
        if (index == null) {
            throw("invalid PID");
        }
        tests[index].stdout = tests[index].stdout + data;
    });

    process.stderr.on('data', function (data) {
        // TODO more efficient way of doing this
        var index = null;
        for (i = 0; i < tests.length; i++) {
            if (tests[i].pid == process.pid) {
                index = i;
                break
            }
        }
        if (index == null) {
            throw("invalid PID");
        }
        tests[index].stderr = tests[index].stderr + data;
    });

    process.on('close', function(code, signal) {
        deletePid(process.pid);
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

/* deletePid(pid)
 * given a process id, remove from list of running
 * tests and start post processing
 */
var deletePid = function(pid) {
    var index = null;
    for (i = 0; i < tests.length; i++) {
        if (tests[i].pid == pid) {
            index = i;
            break
        }
    }

    if (index == null)
        throw("Not able to find PID of running test!");

    processCompleted(tests[index], index);
}

/* processCompleted(test):
 * adds test to completed tests array, adds finished time stamp and invokes post
 * post processing for visualization and such
 */
var processCompleted = function(test, originalIndex) {
    test.finish = new Date().getTime();
    finished.push(test);
    // remove process from tests array
    tests.splice( originalIndex, 1 );
    // update Ractive 'status' page
    exports.updateTests(configure.getState());
    results.parse(test);
}
