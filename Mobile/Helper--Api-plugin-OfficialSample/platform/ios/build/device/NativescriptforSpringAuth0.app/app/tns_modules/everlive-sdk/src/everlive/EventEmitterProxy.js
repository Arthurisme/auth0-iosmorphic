'use strict';

import EventEmitter from 'events';

var apply = function apply(obj) {
    obj._emitter = new EventEmitter();

    obj._emitterProxy = function (event, args) {
        obj._emitter[event].apply(obj._emitter, args);
    };

    obj.addListener = function () {
        obj._emitterProxy('addListener', arguments);
    };

    obj.on = obj.addListener;

    obj.removeListener = function () {
        obj._emitterProxy('removeListener', arguments);
    };

    obj.off = obj.removeListener;

    obj.once = function () {
        obj._emitterProxy('once', arguments);
    };

    obj.removeAllListeners = function () {
        obj._emitterProxy('removeAllListeners', arguments);
    };
};

module.exports = {
    apply: apply
};