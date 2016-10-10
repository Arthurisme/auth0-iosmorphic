import DataQueryProcessor from 'common/dataQuery/Processor';
import ErrorProcessor from 'common/processors/ErrorProcessor';
import DataQueryBuilder from 'common/dataQuery/DataQueryBuilder';
import _, {extend} from 'underscore';

const MethodMustBeOverridenError = new Error('Method must be overriden');
export default class Sdk {
    constructor(options) {
        this.options = options;
        this.setup = this._getSetup(options);

        this.dataQueryProcessor = this._getDataQueryProcessor();
        this.dataQueryBuilder = this._getDataQueryBuilder();

        this.authentication = this._getAuthentication();

        this.registerErrorProcessor(new ErrorProcessor());
    }

    registerDataQueryPreProcessor(processor) {
        this.dataQueryProcessor.preProcessors.push(processor);
    }

    registerDataQueryProcessor(processor) {
        this.dataQueryProcessor.processors.push(processor);
    }

    registerDataQueryPostProcessor(processor) {
        this.dataQueryProcessor.postProcessors.push(processor);
    }

    registerErrorProcessor(processor) {
        this.dataQueryProcessor.errorProcessors.push(processor);
    }

    processDataQuery(query, data, success, error) {
        return this.dataQueryProcessor.process(query, data, success, error);
    }

    buildDataQuery(data = {}, op, meta) {
        return this.dataQueryBuilder.buildDataQuery(data, op, meta);
    }

    data(name) {
        return this._getData(name);
    }

    _getDataQueryProcessor() {
        return new DataQueryProcessor(this);
    }

    _getDataQueryBuilder() {
        return new DataQueryBuilder();
    }

    _getSetup(options) {
        throw MethodMustBeOverridenError;
    }

    _getData(name) {
        throw MethodMustBeOverridenError;
    }

    _getAuthentication() {
        throw MethodMustBeOverridenError;
    }
}