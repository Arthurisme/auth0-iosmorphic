import {EverliveError} from 'EverliveError';
import constants from 'constants';
import _ from 'underscore';

module.exports = (function () {

    function AutoQueue(maxConcurrentTasks) {
        maxConcurrentTasks = parseInt(maxConcurrentTasks || constants.MaxConcurrentDownloadTasks);

        if (isNaN(maxConcurrentTasks) || maxConcurrentTasks <= 0) {
            throw new EverliveError('The maxConcurrentTasks must be a number larger than 0');
        }

        this.maxConcurrentTasks = maxConcurrentTasks;
        this.runningTasksCount = 0;
        this.tasks = [];
    }

    AutoQueue.prototype = {
        /**
         * @param {Function} task
         * @param {Function} taskSuccess
         * @param {Function} taskError
         */
        enqueue: function (task, taskSuccess, taskError) {
            if (!_.isFunction(taskSuccess) || !_.isFunction(taskError)) {
                throw new EverliveError('taskSuccess and taskError functions must be provided');
            }

            var args = [].splice.call(arguments, 3);

            this.tasks.push({
                task: task,
                args: args,
                success: taskSuccess,
                error: taskError
            });

            this._runNext();
        },

        _runNext: function () {
            var self = this;

            if (self.runningTasksCount === self.maxConcurrentTasks || !self.tasks.length) {
                return;
            }

            self.runningTasksCount++;

            var nextTask = this.tasks.shift();
            var task = nextTask.task;
            var args = nextTask.args;
            var taskSuccess = nextTask.success;
            var taskError = nextTask.error;

            args.unshift(function executedCallback(err) {
                self.runningTasksCount--;

                if (err) {
                    taskError(err);
                } else {
                    taskSuccess.apply(null, [].splice.call(arguments, 1));
                }

                self._runNext();
            });

            task.apply(null, args);
        }
    };

    return AutoQueue;
}());