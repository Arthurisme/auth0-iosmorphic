'use strict';

import {EverliveError} from 'EverliveError';
import _ from 'underscore';
import rsvp from 'rsvp';

var BasePersister = (function () {

    /**
     * @class BasePersister
     * @classdesc An abstraction layer for all persisters. Every persister can write/read
     * data to/from a specific place. The data is saved as key-value pairs where the keys are
     * content types.
     */
    function BasePersister(key, options) {
        this.key = key;
        this.options = options;
        this.contentTypesStoreKey = this.key + '@ContentTypes';
    }

    BasePersister.prototype = {
        /**
         * Gets all the saved data.
         * @method getAllData
         * @memberof BasePersister
         * @param {Function} success A success callback.
         * @param {Function} error An error callback.
         * @returns {Object} The keys are the content types and the values are the corresponding data items.
         */
        getAllData: function (success, error) {
            var self = this;
            var promises = {};
            this._getContentTypes(function (contentTypes) {
                _.each(contentTypes, function (contentType) {
                    promises[contentType] = new rsvp.Promise(function (resolve, reject) {
                        self.getData(contentType, resolve, reject);
                    });
                });

                rsvp.hash(promises)
                    .then(success)
                    .catch(error);
            }, error);
        },

        /**
         * Returns the saved data for a specific content type.
         * @method getData
         * @param {string} contentType The content type for which to retrieve the data.
         * @param {Function} success A success callback.
         * @param {Function} error An error callback.
         * @memberof BasePersister
         * @returns {string} The retrieved data.
         */
        getData: function (contentType, success, error) {
            throw new EverliveError('The method getData is not implemented');
        },

        /**
         * Saves data for a specific content type.
         * @method saveData
         * @param {string} contentType The content for which to save the data.
         * @param {string} data The data corresponding to the specified content type.
         * @param {Function} success A success callback.
         * @param {Function} error An error callback.
         * @memberof BasePersister
         */
        saveData: function (contentType, data, success, error) {
            throw new EverliveError('The method saveData is not implemented');
        },

        /**
         * Clears the persisted data for a specific content type.
         * @method purge
         * @param {string} contentType The content type for which to clear the data.
         * @param {Function} success A success callback.
         * @param {Function} error An error callback.
         * @memberof BasePersister
         */
        purge: function (contentType, success, error) {
            throw new EverliveError('The method clear is not implemented');
        },

        /**
         * Clears all persisted data in the offline store.
         * @method purgeAll
         * @memberof BasePersister
         * @param {Function} success A success callback.
         * @param {Function} error An error callback.
         */
        purgeAll: function (success, error) {
            throw new EverliveError('The method clearAll is not implemented');
        },

        _getKey: function (contentType) {
            return this.key + '_' + contentType;
        },

        _getContentTypes: function (success, error) {
            throw new EverliveError('The method _getContentTypes is not implemented');
        }
    };

    return BasePersister;
}());

module.exports = BasePersister;