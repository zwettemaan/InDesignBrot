//
// This code is exclusively ExtendScript. It provides ExtendScript-specific 
// implementations of the utils API.
//

var timedFunctionList = undefined;
var nextIdleAfter = undefined;
var cancelledTaskIds = {};
var taskIdCounter = 0;

UXES.clearImmediate = function _clearImmediate(taskId) {

    UXES.logEntry(arguments);

    clearTimedFunction(taskId);

    UXES.logExit(arguments);

}

UXES.clearInterval = function _clearInterval(taskId) {

    UXES.logEntry(arguments);

    clearTimedFunction(taskId);

    UXES.logExit(arguments);

}

UXES.clearTimeout = function _clearTimeout(taskId) {

    UXES.logEntry(arguments);

    clearTimedFunction(taskId);

    UXES.logExit(arguments);

}

function clearTimedFunction(taskId) {

    UXES.logEntry(arguments);

    try {
        cancelledTaskIds[taskId] = true;
    }
    catch (err) {
        UXES.logError(arguments, "throws " + err);
    }

    UXES.logExit(arguments);

}

UXES.setImmediate = function _setImmediate(taskFtn) {

    var retVal;

    UXES.logEntry(arguments);

    retVal = timedFunction(taskFtn, 0, false);

    UXES.logExit(arguments);

    return retVal;
}

UXES.setInterval = function _setInterval(taskFtn, timeoutMilliseconds) {

    var retVal;

    UXES.logEntry(arguments);

    retVal = timedFunction(taskFtn, timeoutMilliseconds, true);

    UXES.logExit(arguments);

    return retVal;
}

UXES.setTimeout = function _setTimeout(taskFtn, timeoutMilliseconds) {

    var retVal;

    UXES.logEntry(arguments);

    retVal = timedFunction(taskFtn, timeoutMilliseconds, false);

    UXES.logExit(arguments);

    return retVal;
}

function timedFunction(taskFtn, timeOutMilliseconds, isRepeat) {

    var retVal;

    UXES.logEntry(arguments);

    do {
        try {

            taskIdCounter++;

            if (! timeOutMilliseconds) {
                timeOutMilliseconds = 0;
            }

            var now = (new Date()).getTime();
            var callAfter = now + timeOutMilliseconds;

            var taskEntry = {
                taskFtn: taskFtn, 
                taskId: taskIdCounter,
                timeOutMilliseconds: timeOutMilliseconds,
                callAfter: callAfter
            };

            if (! timedFunctionList) 
            {          
                timedFunctionList = [];

                timedFunctionIdleTask = UXES.G.app.idleTasks.add();
                timedFunctionIdleTask.addEventListener(
                    IdleTask.ON_IDLE,
                    function() {

                        var activeTaskList = timedFunctionList ? timedFunctionList : [];
                        timedFunctionList = [];
                        nextIdleAfter = undefined;

                        var activeCancelledTasks = cancelledTaskIds;
                        cancelledTaskIds = {};

                        for (var taskIdx = 0; taskIdx < activeTaskList.length; taskIdx++) {

                            var now = (new Date()).getTime();

                            var task = activeTaskList[taskIdx];
                            var taskFinished = false;

                            if (task.taskId in activeCancelledTasks) {
                                taskFinished = true;
                            }
                            else if (task.callAfter < now) {

                                task.taskFtn();

                                taskFinished = ! isRepeat;
                                if (! isRepeat) {
                                    taskFinished = true;
                                }
                                else {
                                    now = (new Date()).getTime();
                                    task.callAfter = now + task.timeOutMilliseconds;
                                }
                            }

                            if (! taskFinished) {
                                timedFunctionList.push(task);
                            }
                        }

                        if (timedFunctionList.length == 0) {
                            timedFunctionList = undefined;
                            if (timedFunctionIdleTask) {
                                timedFunctionIdleTask.sleep = 0;
                            }
                            timedFunctionIdleTask = undefined;
                        }
                        else if (nextIdleAfter === undefined || nextIdleAfter > soonestCallAfter) {

                            var soonestCallAfter = undefined;
                            for (var taskIdx = 0; taskIdx < timedFunctionList.length; taskIdx++) {
                                if (soonestCallAfter === undefined || soonestCallAfter > task.callAfter) {
                                    soonestCallAfter = task.callAfter;
                                }
                            }

                            var now = (new Date()).getTime();
                            var sleepTime = soonestCallAfter - now;
                            if (sleepTime < 1) {
                                sleepTime = 1;
                            }
                            timedFunctionIdleTask.sleep  = sleepTime;
                            nextIdleAfter = now + sleepTime;
                        }
                    }
                );

            }

            timedFunctionList.push(taskEntry);
            retVal = taskEntry.taskId;

            if (nextIdleAfter !== undefined && (nextIdleAfter < callAfter)) {
                break;
            }

            var sleepTime = timeOutMilliseconds;
            if (sleepTime < 1) {
                sleepTime = 1; // That's the lowest we can go
            }

            timedFunctionIdleTask.sleep = sleepTime; 
            nextIdleAfter = now + sleepTime;

        }
        catch (err) {
            UXES.logError(arguments, "throws " + err);
        }
    }
    while (false);

    UXES.logExit(arguments);

    return retVal;
}
