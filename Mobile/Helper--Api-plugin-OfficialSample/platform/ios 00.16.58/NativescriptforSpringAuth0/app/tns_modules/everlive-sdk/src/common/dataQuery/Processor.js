import rsvp from 'rsvp';
import QueryProcessorIterator from 'common/dataQuery/QueryProcessorIterator';
import commonErrors from 'common/errors';
import { buildPromise } from 'common/utils';

class QueryProcessor {
    constructor(sdk) {
        this.sdk = sdk;

        this.preProcessors = [];
        this.processors = [];
        this.postProcessors = [];
        this.errorProcessors = [];
    }

    _iterate(query, processors, data, value) {
        return new rsvp.Promise((resolve, reject) => {
            const iterator = new QueryProcessorIterator(processors, query);

            let iteratorTimeout = null;
            const onNext = (processor, value) => {
                clearTimeout(iteratorTimeout);
                iteratorTimeout = setTimeout(() => {
                    return iterator.error(new Error(`Iterator timed out. Processor: ${processor.constructor.name}. Value - ${JSON.stringify(value)}`));
                }, 10 * 6000); //throw error if somewhere the chain hangs for more than 10 seconds

                try {
                    return processor.processDataQuery(query, iterator, data, value);
                } catch (e) {
                    return iterator.error(e);
                }
            };

            const cleanUp = () => {
                iterator.removeListener('next', onNext);
                clearTimeout(iteratorTimeout);
            };

            iterator
                .on('next', onNext)
                .once('end', value => {
                    cleanUp();
                    return resolve(value);
                })
                .once('error', err => {
                    cleanUp();
                    const processedError = this._processError(query, data, err);
                    const error = processedError || err;
                    return reject(error);
                })
                .once('cancel', reason => {
                    cleanUp();
                    return reject({
                        reason,
                        error: commonErrors.cancelled
                    });
                })
                .start(value);
        });
    }

    _preProcess(query, data) {
        return this._iterate(query, this.preProcessors, data);
    }

    _process(query, data, value) {
        return this._iterate(query, this.processors, data, value);
    }

    _postProcess(query, data, value) {
        return this._iterate(query, this.postProcessors, data, value);
    }

    _processError(query, data, err) {
        let error = err;
        this.errorProcessors.forEach(p => {
            error = p.processError(query, data, error);
        });

        return error;
    }

    process(query, data, success, error) {
        return buildPromise((resolve, reject) => {
            return this._preProcess(query, data)
                .then(value => {
                    return this._process(query, data, value);
                })
                .then(value => {
                    return this._postProcess(query, data, value);
                })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        }, success, error);
    }
}

module.exports = QueryProcessor;
