import EventEmitter from 'events';

class DataQuery extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;
        this.data = config.data;
        this.query = config.query;
        this.originalParameters = config.originalParameters;
        this.operation = config.operation;
        this.additionalOptions = config.additionalOptions;
    }
}

module.exports = DataQuery;