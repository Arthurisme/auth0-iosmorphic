import EventEmitter from 'events';
import {last, without} from 'underscore';

class EventArgs {
    canceled = false;

    cancel() {
        this.canceled = true;
    }
}

/*
Adds extended functionality to the event emitter:
    * Cancelable event arguments - the event arguments are always passed as last argument,
      calling cancel will stop other event listeners in the chain from being invoked
    * prependOnceListener - Prepend a listener to the start of the chain - useful if you want
      it to be able to cancel the event
 */
export default class EventEmitterExtended extends EventEmitter {
    emit(type, ...args) {
        args.push(new EventArgs());

        return super.emit(type, ...args);
    }

    addListener(type, listener) {
        const wrappedListener = (...args) => {
            const ev = last(args);
            if (ev.canceled) {
                return;
            }

            return listener.apply(this, args);
        };

        return super.addListener(type, wrappedListener);
    }

    prependOnceListener(type, listener) {
        this.once(type, listener);

        if (!Array.isArray(this._events[type])) {
            return this;
        }

        const lastListener = last(this._events[type]);
        const allListeners = without(this._events[type], lastListener);
        this._events[type] = [lastListener].concat(allListeners);
        return this;
    }

    once(...args) {
        return super.once(...args);
    }

    on(...args) {
        return this.addListener(...args);
    }
}