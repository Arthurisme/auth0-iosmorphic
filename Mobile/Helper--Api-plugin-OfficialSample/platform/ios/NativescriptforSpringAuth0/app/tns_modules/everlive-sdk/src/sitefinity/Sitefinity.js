import Sdk from 'common/Sdk';

import Data from 'types/Data';
import Authentication from 'Authentication';
import utils from 'utils';
import BatchRequest from 'BatchRequest';
import RequestFactory from 'RequestFactory';
import OnlineQueryProcessor from 'processors/OnlineQueryProcessor';
import QueryRequestPreprocessor from 'processors/preProcessors/QueryRequestPreprocessor';
import DataQueryBuilder from 'dataQuery/DataQueryBuilder';

class Sitefinity extends Sdk {
    /**
     * @class Sitefinity
     * @classdesc The constructor of the Sitefinity JavaScript SDK. This is the entry point for the SDK.
     * @property {Object} authentication - The authentication object used for authenticating to Sitefinity. See {@link Authentication}
     * @param {object} options - An object containing configuration options for the Setup object.
     * @param {string} options.serviceUrl - Your service url that points to the configured instance of Sitefinity service.
     */
    constructor(options) {
        super(options);

        this.registerDataQueryPreProcessor(new QueryRequestPreprocessor());

        this.registerDataQueryProcessor(new OnlineQueryProcessor());
    }

    _getSetup(options) {
        return {
            profileUrl: utils.addTrailingSlash(options.serviceUrl)
        }
    }

    _getAuthentication() {
        return new Authentication(this.options);
    }

    _getDataQueryBuilder() {
        return new DataQueryBuilder();
    }

    /**
     * Creates a new {@link Data} class.
     * @memberOf Sitefinity
     * @instance
     * @param {object} options - An object containing configuration options for the Setup object.
     * @param {string} options.urlName - The URL name of the type..
     * @param {string} [options.providerName] - The name of the provider. If empty the default provider for the site will be used.
     * @param {string} [options.cultureName] - The name of the culture. If empty the default culture for the site will be used.
     * @example
     * var data = sf.data({
    *     urlName: "newsitems",
    *     providerName: "OpenAccessDataProvider",
    *     cultureName: "en"
    * });
     * @returns {Data}
     */
    _getData(options) {
        var dataOptions = {
            baseUrl: this.setup.profileUrl,
            SFParams: {
                provider: options.providerName,
                culture: options.cultureName
            },
            token: this.authentication.getToken(),
            entitySet: options.urlName
        };

        return new Data(this, dataOptions);
    }

    /**
     * Creates a new {@link BatchRequest} class. OData batch requests -> {@link http://docs.oasis-open.org/odata/odata/v4.0/os/part1-protocol/odata-v4.0-os-part1-protocol.html#_Toc372793748}
     * @memberOf Sitefinity
     * @instance
     * @param {Function} success - The success callback of the batch execution.
     * @param {string} options.urlName - The URL name of the type..
     * @param {string} [options.providerName] - The name of the provider. If empty the default provider for the site will be used.
     * @param {string} [options.cultureName] - The name of the culture. If empty the default culture for the site will be used.
     * @example
     * var sf = new Sitefinity({
    *   serviceUrl: 'http://mydomain/route/service/'
    * });
     *
     * var batch = sf.batch(successCbBatch, failureCb);
     * batch.get({
    *     entitySet: entitySet,
    *     query: query8
    * });
     *
     * var transaction = batch.beginTransaction();
     * var createId = transaction.create({
    *     entitySet: entitySet,
    *     data: newsItem
    * });
     *
     * batch.endTransaction(transaction);
     *
     * var transaction2 = batch.beginTransaction();
     * var createId2 = transaction2.create({
    *     entitySet: entitySet,
    *     data: newsItem
    * });
     *
     * var updateId2 = transaction2.update({
    *     entitySet: entitySet,
    *     key: createId2,
    *     data: newsItemUpdate
    * });
     *
     * batch.endTransaction(transaction2);
     *
     * batch.get({
    *     entitySet: entitySet
    * });
     *
     * batch.execute();
     * @returns {BatchRequest}
     */
    batch(success, failure) {
        var factory = new RequestFactory();
        return factory.batch({
            successCb: success,
            failureCb: failure,
            urlOptions: {
                baseUrl: this.profileUrl,
                token: this.authentication.getToken()
            }
        });
    }
}

module.exports = Sitefinity;
