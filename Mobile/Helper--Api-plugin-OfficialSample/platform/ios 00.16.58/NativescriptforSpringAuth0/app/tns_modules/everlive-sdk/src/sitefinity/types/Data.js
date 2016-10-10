import {extend, defaults} from 'underscore';
import CommonData from 'common/Data';
import {DataQueryOperations} from 'constants';

class Data extends CommonData {
    /**
     * @class Data
     * @classdesc The constructor of the Data object. This object is used for requesting data from Sitefinity.
     * @param {object} sdk - The Sitefinity sdk object
     * @param {object} options - An object containing configuration options for the {@link Data} object.
     * @param {string} options.baseUrl - Your service url that points to the configured instance of Sitefinity service.
     * @param {string} options.token - The token with which to authenticate to the service.
     * @param {string} options.entitySet - The url name of the type.
     * @param {object} options.SFParams - An object containing configuration options for requests.
     * @param {string} options.SFParams.provider - The provider name to use in each request.
     * @param {string} options.SFParams.culture - The culture name to use in each request.
     */
    constructor(sdk, options) {
        super(sdk, options);
    }

    buildDataQuery(data, op) {
        return super.buildDataQuery(data, op, {});
    }

    /**
     * Executes a GET request to retrieve a collection of items.
     * @memberOf Data
     * @instance
     */
    get(query, success, error) {
        const dataQuery = this.buildDataQuery(query, DataQueryOperations.Read);
        return this.processDataQuery(dataQuery, success, error);
    }

    /**
     * Executes a GET request for a single item.
     * @memberOf Data
     * @instance
     * @param {object} parameters - The parameters for the request.
     * @param {object} parameters.query - The {@link QueryBase} object containing the OData query options that should be sent to the server.
     * @param {string} parameters.key - The identifier of the item to be retrieved.
     * @param {Function} success - The success callback function.
     * @param {Function} error - The error callback function.
     */
    getSingle(parameters, success, error) {
        if (!parameters.key) {
            throw "Parameter 'key' is required!";
        }

        const data = {};
        if (parameters.query) {
            data.ODataParams = parameters.query;
        }

        data.key = parameters.key;
        const dataQuery = this.buildDataQuery(data, DataQueryOperations.ReadSingle);
        return this.processDataQuery(dataQuery, success, error);
    }
}

module.exports = Data;

// module.exports = (function () {

//     function Data(sdk, options) {
//         this.urlOptions = urlOptions;
//         this.factory = new RequestFactory();
//     }
//
//     Data.prototype = {
//         // TODO: rethink this
//
//         get: function (query) {
//             const request = this.factory.get(query);
//             return request._execute();
//         },

//         getSingle: function (parameters) {
//             var request = this.factory.getSingle({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             return request._execute();
//         },
//
//         /**
//         * Executes a POST request to create a single item.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {object} parameters.data - The payload of the request.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         create: function (query) {
//             var request = this.factory.create(query);
//             return request._execute();
//         },
//
//         /**
//         * Executes a PATCH request to update a single item.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item to be updated.
//         * @param {object} parameters.data - The payload of the request.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         * @example
//         * var data = sf.data({
//         *     urlName: "newsitems",
//         *     providerName: "OpenAccessDataProvider",
//         *     cultureName: "en"
//         * });
//         *
//         * var newsItemUpdate =  {
//         *    "Title": 'updated news title'
//         * };
//         *
//         * data.update({
//         *   key: '00000000-0000-0000-0000-000000000000', // key of item to update
//         *   data: newsItemUpdate,
//         *   successCb: successCb,
//         *   failureCb: failureCb
//         * });
//         */
//         update: function (parameters) {
//             if (!(parameters.key || parameters.data))
//                 throw "Parameters: 'data' and 'key' are required!";
//
//             var request = this.factory.update({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 data: parameters.data,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a DELETE request to delete a single item.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item to be deleted.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         destroy: function (parameters) {
//             if (!(parameters.key))
//                 throw "Parameter 'key' is required!";
//
//             var request = this.factory.destroy({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a GET request to get the property of a single item.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item.
//         * @param {string} parameters.property - The name of the property to be retrieved.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         getProperty: function (parameters) {
//             if (!(parameters.key || parameters.property))
//                 throw "Parameters: 'data' and 'property' are required!";
//
//             var request = this.factory.getProperty({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 navigationProperty: parameters.property,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a GET request to get the related property value of a single item.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item.
//         * @param {string} parameters.navigationProperty - The name of the navigation property to be retrieved.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         getRelated: function (parameters) {
//             if (!(parameters.key || parameters.navigationProperty))
//                 throw "Parameters: 'data' and 'navigationProperty' are required!";
//
//             var request = this.factory.getRelated({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 navigationProperty: parameters.navigationProperty,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a GET request to retrieve the related property value of a single item by the id of the related item.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item.
//         * @param {string} parameters.navigationProperty - The name of the navigation property to be retrieved.
//         * @param {string} parameters.relatedKey - The identifier of the related item.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         getRelatedById: function (parameters) {
//             if (!(parameters.key || parameters.navigationProperty || parameters.relatedKey))
//                 throw "Parameters: 'data', 'relatedKey' and 'navigationProperty' are required!";
//
//             var request = this.factory.getRelatedById({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 relatedKey: parameters.relatedKey,
//                 navigationProperty: parameters.navigationProperty,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a DELETE request to retrieve the delete all of the associated members in the relation property.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item.
//         * @param {string} parameters.navigationProperty - The name of the navigation property.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         destroyRelated: function (parameters) {
//             if (!(parameters.key || parameters.navigationProperty))
//                 throw "Parameters: 'data' and 'navigationProperty' are required!";
//
//             var request = this.factory.destroyRelated({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 navigationProperty: parameters.navigationProperty,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a DELETE request to retrieve the a single entry of the associated members in the relation property.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item.
//         * @param {string} parameters.navigationProperty - The name of the navigation property.
//         * @param {string} parameters.relatedKey - The identifier of the related item.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         destroyRelatedById: function (parameters) {
//             if (!(parameters.key || parameters.navigationProperty || parameters.relatedKey))
//                 throw "Parameters: 'data', 'relatedKey' and 'navigationProperty' are required!";
//
//             var request = this.factory.destroyRelatedById({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 relatedKey: parameters.relatedKey,
//                 navigationProperty: parameters.navigationProperty,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a POST request to add a related item to the property collection.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.key - The identifier of the item.
//         * @param {string} parameters.navigationProperty - The name of the navigation property.
//         * @param {string} parameters.link - The URL of the related item.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         */
//         createRelated: function (parameters) {
//             if (!(parameters.key || parameters.navigationProperty || parameters.link))
//                 throw "Parameters: 'data', 'link' and 'navigationProperty' are required!";
//
//             var data = {
//                 '@odata.id': parameters.link
//             }
//
//             var request = this.factory.createRelated({
//                 urlOptions: this.urlOptions,
//                 key: parameters.key,
//                 navigationProperty: parameters.navigationProperty,
//                 data: data,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             });
//
//             request._execute();
//         },
//
//         /**
//         * Executes a POST request to upload a media item.
//         * @memberOf Data
//         * @instance
//         * @param {object} parameters - The parameters for the request.
//         * @param {string} parameters.data - The data to be uploaded.
//         * @param {string} parameters.data.content - The base64 representation of the media item.
//         * @param {string} parameters.data.contentType - The content type of the item. E.g. image/jpeg.
//         * @param {string} parameters.data.name - The name of the media item.
//         * @param {string} parameters.data.payload - Holds the JSON metadata about the image. E.g. Title, Urlname etc.
//         * @param {string} parameters.library - The name of the navigation property.
//         * @param {string} parameters.link - The URL of the related library item.
//         * @param {Function} parameters.successCb - The success callback function.
//         * @param {Function} parameters.failureCb - The error callback function.
//         * @example
//         *
//         * var data = sf.data({
//         *     urlName: "images"
//         * });
//         * data.upload({
//         *     data: {
//         *         content: "base 64 representation of the file",
//         *         contentType: "image/jpeg",
//         *         name: "test.jpg",
//         *         payload: {
//         *             Title: "Test",
//         *             UrlName: "test"
//         *         }
//         *     },
//         *     library: "Parent",
//         *     link: "http://localhost/api/default/albums(8818c109-3515-4a74-bf3f-d5f1d5e201a3)",
//         *     successCb: successCb,
//         *     failureCb: failureCb
//         * });
//         */
//         upload: function (parameters) {
//             if (!(parameters || parameters.data || parameters.data.content || parameters.data.contentType || parameters.data.payload || parameters.data.name || parameters.library || parameters.link))
//                 throw "parameters: entitySet, data, file, library and link are required!";
//
//             var options = {
//                 urlOptions: this.urlOptions,
//                 _factory: this.factory,
//                 successCb: parameters.successCb,
//                 failureCb: parameters.failureCb
//             }
//
//             var batch = this.factory.batch(options);
//             var transaction = batch.beginTransaction();
//
//             var uploadedFile = transaction.upload({
//                 entitySet: this.urlOptions.entitySet,
//                 data: parameters.data.content,
//                 contentType: parameters.data.contentType,
//                 fileName: parameters.data.name
//             });
//
//             transaction.update({
//                 entitySet: this.urlOptions.entitySet,
//                 key: uploadedFile,
//                 data: parameters.data.payload
//             });
//
//             transaction.createRelated({
//                 entitySet: this.urlOptions.entitySet,
//                 key: uploadedFile,
//                 navigationProperty: parameters.library,
//                 link: parameters.link
//             });
//
//             batch.endTransaction(transaction);
//             batch.execute();
//         }
//     }
//
//     return Data;
// }())