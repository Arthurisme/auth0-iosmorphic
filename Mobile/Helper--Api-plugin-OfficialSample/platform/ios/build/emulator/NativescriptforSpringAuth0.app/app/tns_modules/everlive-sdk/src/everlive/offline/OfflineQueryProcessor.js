'use strict';

import utils from 'utils';
import offlineTransformations from 'offline/offlineTransformations';
import expandProcessor from 'ExpandProcessor';
import platform from 'everlive.platform';
import {EverliveError, EverliveErrors} from 'EverliveError';
import {buildPromise} from 'utils';
import _ from 'underscore';
import rsvp from 'rsvp';
import mingo from 'mingo';
import mongoQuery from 'mongo-query';
import aggregationTranslator from 'bs-aggregation-translator';
import path from 'path';
import constants, {Headers, offlineItemStates, DataQueryOperations} from 'constants';

const unsupportedOfflineHeaders = [Headers.powerFields];

const unsupportedUsersOperations = {
    [DataQueryOperations.Create]: true,
    [DataQueryOperations.Update]: true,
    [DataQueryOperations.Delete]: true,
    [DataQueryOperations.DeleteById]: true,
    [DataQueryOperations.RawUpdate]: true,
    [DataQueryOperations.SetAcl]: true,
    [DataQueryOperations.SetOwner]: true,
    [DataQueryOperations.UserLoginWithProvider]: true,
    [DataQueryOperations.UserLinkWithProvider]: true,
    [DataQueryOperations.UserUnlinkFromProvider]: true,
    [DataQueryOperations.UserLogin]: true,
    [DataQueryOperations.UserLogout]: true,
    [DataQueryOperations.UserChangePassword]: true,
    [DataQueryOperations.UserResetPassword]: true
};

function buildUsersErrorMessage(dataQuery) {
    var unsupportedUserSocialProviderOperations = [
        DataQueryOperations.UserLoginWithProvider,
        DataQueryOperations.UserLinkWithProvider,
        DataQueryOperations.UserUnlinkFromProvider
    ];

    var operation = dataQuery.operation;
    if (unsupportedUserSocialProviderOperations.indexOf(operation) !== -1) {
        operation += dataQuery.data.Provider || dataQuery.data.Identity.Provider;
    }

    return 'The Users operation ' + operation + ' is not supported in offline mode';
}

function buildFilesErrorMessage(dataQuery) {
    return 'The Files operation ' + dataQuery.operation + ' is not supported in offline mode';
}

function OfflineQueryProcessor(persister, encryptionProvider, offlineFilesProcessor, everlive, setup) {
    this._collectionCache = {};
    this.offlineFilesProcessor = offlineFilesProcessor;
    this._persister = persister;
    this._encryptionProvider = encryptionProvider;
    this.everlive = everlive;
    this.setup = setup;
}

OfflineQueryProcessor.prototype = {
    processQuery: function (dataQuery) {
        var collectionName = dataQuery.collectionName;
        if (utils.isContentType.pushDevices(collectionName) || utils.isContentType.pushNotifications(collectionName)) {
            if (this.everlive.isOnline()) {
                return utils.successfulPromise();
            } else {
                return utils.rejectedPromise(new EverliveError(EverliveErrors.pushNotSupportedOffline));
            }
        }

        var queryNotSupportedError = this.checkSupportedQuery(dataQuery);
        if (queryNotSupportedError && !dataQuery.isSync) {
            return new rsvp.Promise(function (resolve, reject) {
                reject(new EverliveError(queryNotSupportedError));
            });
        }

        var queryParams = dataQuery.getQueryParameters();
        var unsupportedOperators = utils.getUnsupportedOperators(queryParams.filter);
        var unsupportedOperatorCount = unsupportedOperators.length;
        if (unsupportedOperatorCount) {
            return new rsvp.Promise(function (resolve, reject) {
                var errorMessage;
                if (unsupportedOperatorCount === 1) {
                    errorMessage = 'The operator ' + unsupportedOperators[0] + ' is not supported in offline mode.';
                } else {
                    errorMessage = 'The operators ' + unsupportedOperators.join(',') + 'are not supported in offline mode.';
                }

                reject(new EverliveError(errorMessage, EverliveErrors.operationNotSupportedOffline.code));
            });
        }

        offlineTransformations.traverseAndTransformFilterId(queryParams.filter);

        switch (dataQuery.operation) {
            case DataQueryOperations.Read:
                return this.read(dataQuery, queryParams.filter, queryParams.sort, queryParams.skip, queryParams.limit, queryParams.select, queryParams.expand);
            case DataQueryOperations.ReadById:
                return this.readById(dataQuery, queryParams.expand);
            case DataQueryOperations.FilesGetDownloadUrlById:
                return this.getDownloadUrlById(dataQuery);
            case DataQueryOperations.Count:
                return this.count(dataQuery, queryParams.filter);
            case DataQueryOperations.Create:
                return this.create(dataQuery);
            case DataQueryOperations.RawUpdate:
            case DataQueryOperations.Update:
                return this.update(dataQuery, queryParams.filter);
            case DataQueryOperations.FilesUpdateContent:
                return this.updateFileContent(dataQuery, queryParams.filter);
            case DataQueryOperations.Delete:
                return this.remove(dataQuery, queryParams.filter);
            case DataQueryOperations.DeleteById:
                return this.remove(dataQuery, {
                    _id: dataQuery.additionalOptions.id
                });
            case DataQueryOperations.Aggregate:
                return this.aggregate(dataQuery, queryParams);
            default:
                return new rsvp.Promise(function (resolve, reject) {
                    if (dataQuery.isSync) {
                        resolve();
                    } else {
                        reject(new EverliveError(dataQuery.operation + ' is not supported in offline mode.'));
                    }
                });
        }
    },

    getDownloadUrlById: function (dataQuery) {
        var self = this;
        var id = dataQuery.additionalOptions.id;
        var offlineFilePath;
        var fileDirectUri;

        return self.everlive
            .files
            .useOffline(true)
            .isSync(dataQuery.isSync)
            .getById(id)
            .then(function (res) {
                var file = res.result;
                fileDirectUri = file.Uri;
                return self.everlive.offlineStorage.files._getFileUrlForId(file.Id, file.Filename);
            })
            .then(function (filePath) {
                offlineFilePath = filePath;
                return self.everlive.offlineStorage._offlineFilesProcessor.fileStore.getFileByAbsolutePath(filePath);
            })
            .then(function (fileEntry) {
                return {
                    result: {
                        Uri: fileEntry ? offlineFilePath : fileDirectUri
                    }
                };
            });
    },

    checkSupportedQuery: function (dataQuery) {
        for (var i = 0; i < unsupportedOfflineHeaders.length; i++) {
            var header = unsupportedOfflineHeaders[i];
            if (dataQuery.getHeader(header)) {
                return 'The header ' + header + ' is not supported in offline mode';
            }
        }

        if (utils.isContentType.users(dataQuery.collectionName) && unsupportedUsersOperations[dataQuery.operation]) {
            return buildUsersErrorMessage(dataQuery);
        }

        if (utils.isContentType.files(dataQuery.collectionName)) {
            if ((dataQuery.operation === DataQueryOperations.create && Array.isArray(dataQuery.data)) ||
                dataQuery.operation === DataQueryOperations.rawUpdate || dataQuery.operation === DataQueryOperations.update) {
                return EverliveErrors.invalidRequest;
            }
        }

        var isSingle = dataQuery.additionalOptions && dataQuery.additionalOptions.id;
        var isUpdateByFilter = dataQuery.operation === DataQueryOperations.Update && !isSingle;
        var isRawUpdate = dataQuery.operation === DataQueryOperations.RawUpdate;
        if (utils.isContentType.files(dataQuery.collectionName) && (isRawUpdate || isUpdateByFilter)) {
            return buildFilesErrorMessage(dataQuery);
        }
    },

    _getCreateResult: function (createdItems, returnFullItem) {
        if (createdItems.length === 1) {
            var result;
            if (returnFullItem) {
                var item = _.extend({}, createdItems[0]);
                result = offlineTransformations.idTransform(item);
            } else {
                result = {
                    CreatedAt: utils.cloneDate(createdItems[0].CreatedAt),
                    Id: createdItems[0]._id
                }
            }

            return {
                result: result
            };
        } else {
            var multipleCreateResult = [];
            _.each(createdItems, function (createdItem) {
                var item;
                if (returnFullItem) {
                    var itemCopy = _.extend({}, createdItem);
                    item = offlineTransformations.idTransform(itemCopy);
                } else {
                    item = {
                        CreatedAt: utils.cloneDate(createdItem.CreatedAt),
                        Id: createdItem._id
                    };
                }
                multipleCreateResult.push(item);
            });

            return {
                result: multipleCreateResult
            };
        }
    },

    create: function (dataQuery) {
        var self = this;

        return self._createItems(dataQuery.collectionName, dataQuery.data, dataQuery.isSync, dataQuery.preserveState)
            .then(function (createdItems) {
                var isFilesQuery = utils.isContentType.files(dataQuery.collectionName);
                return self._getCreateResult(createdItems, isFilesQuery);
            });
    },

    read: function (dataQuery, filter, sort, skip, limit, select, expand) {
        var self = this;
        var expandResult;

        return new rsvp.Promise(function (resolve, reject) {
            var collectionLength;

            self._prepareExpand(expand, dataQuery, true)
                .then(function (prepareExpandResult) {
                    expandResult = prepareExpandResult;
                    if (prepareExpandResult) {
                        select = prepareExpandResult.mainQueryFieldsExpression;
                    }

                    return self._getCollection(dataQuery.collectionName);
                })
                .then(function (collection) {
                    var result = self._readInternal(collection, filter, sort, skip, limit, select);

                    if (skip || limit) {
                        var all = self._readInternal(collection);
                        collectionLength = all.length;
                    }

                    if (!self._shouldAutogenerateIdForContentType(dataQuery.collectionName)) {
                        result = offlineTransformations.removeIdTransform(result, true);
                    } else {
                        result = offlineTransformations.idTransform(result);
                    }

                    return self._expandResult(expandResult, result);
                })
                .then(function (result) {
                    var response = self._transformOfflineResult(result, collectionLength, dataQuery);
                    resolve(response);
                })
                .catch(reject);
        });
    },

    _readInternal: function (collection, filter, sort, skip, limit, select) {
        var filterCopy = _.extend({}, filter);
        var actualFilter = this._getWithoutDeletedFilter(filterCopy);
        offlineTransformations.traverseAndTransformFilterId(actualFilter);
        var query = mingo.Query(actualFilter);
        var cursor = mingo.Cursor(collection, query, select);
        if (sort) {
            cursor = cursor.sort(sort);
        }

        if (skip) {
            cursor.skip(skip);
        }

        if (limit) {
            cursor.limit(limit);
        }

        return _.map(cursor.all(), function (item) {
            return _.extend({}, item);
        });
    },

    readById: function (dataQuery, expand) {
        var self = this;
        var expandResult;
        return self._prepareExpand(expand, dataQuery, false)
            .then(function (prepareExpandResult) {
                expandResult = prepareExpandResult;
                return self._getCollection(dataQuery.collectionName);
            })
            .then(function (collection) {
                return new rsvp.Promise(function (resolve, reject) {
                    var item = self._getById(collection, dataQuery.additionalOptions.id);

                    if (!item) {
                        return reject(new EverliveError(EverliveErrors.itemNotFound));
                    }

                    item = offlineTransformations.idTransform(item);
                    return self._expandResult(expandResult, item).then(resolve).catch(reject);
                });
            })
            .then(function (result) {
                return self._transformOfflineResult(result, null, dataQuery);
            });
    },

    _getById: function (collection, id) {
        if (!id) {
            throw new EverliveError('Id field is mandatory when using offline storage');
        }

        if (collection[id]) {
            var item = _.extend({}, collection[id]);
            var isDeleted = item && item[constants.offlineItemsStateMarker] === offlineItemStates.deleted;

            return isDeleted ? undefined : item;
        }
    },

    _prepareExpand: function (expand, dataQuery, isArray) {
        return new rsvp.Promise(function (resolve, reject) {
            if (expand) {
                expandProcessor.prepare(expand, dataQuery.collectionName, isArray, dataQuery.fields, null, null, function (err, prepareResult) {
                    if (err) {
                        if (err.name === 'ExpandError') {
                            err.code = EverliveErrors.invalidExpandExpression.code;
                        }
                        return reject(err);
                    }
                    resolve(prepareResult);
                });
            } else {
                resolve();
            }
        });
    },

    _expandResult: function (prepareExpandResult, result) {
        var self = this;
        return new rsvp.Promise(function (resolve, reject) {
            if (prepareExpandResult) {
                expandProcessor.expand(prepareExpandResult.relationsTree, result, {
                    offlineModule: self
                }, function (err, result) {
                    if (err) {
                        if (err.name === 'ExpandError') {
                            err.code = EverliveErrors.invalidExpandExpression.code;
                        }
                        return reject(err);
                    }
                    resolve(result);
                });
            } else {
                resolve(result);
            }
        });
    },

    _getWithoutDeletedFilter: function (filter) {
        var withoutDeletedFilter = {
            $and: []
        };
        withoutDeletedFilter.$and.push(filter);
        var deleteOfflineFilter = {};
        deleteOfflineFilter[constants.offlineItemsStateMarker] = {$ne: offlineItemStates.deleted};
        withoutDeletedFilter.$and.push(deleteOfflineFilter);
        return withoutDeletedFilter;
    },

    _getUpdateItemsResult: function (updateItems) {
        var updatedItemCount = updateItems.length;
        var modifiedAtResult = updatedItemCount ? updateItems[0].ModifiedAt : new Date();

        return {
            ModifiedAt: modifiedAtResult,
            result: updatedItemCount
        };
    },

    update: function (dataQuery, filter) {
        var self = this;

        return this._updateItems(dataQuery, dataQuery.data, filter, dataQuery.isSync).then(function (updateItems) {
            return self._getUpdateItemsResult(updateItems);
        });
    },

    remove: function (dataQuery, filter) {
        return this._removeItems(dataQuery, filter, dataQuery.isSync);
    },

    count: function (dataQuery, filter) {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            self._getCollection(dataQuery.collectionName)
                .then(function (collection) {
                    var filterResult = self._readInternal(collection, filter);
                    resolve({result: filterResult.length});
                }).catch(reject);
        });
    },

    _setItemDates: function (currentItem, itemToCreate, contentType) {
        // we need to manually clone the dates in order to dereference them from the original object as
        // _.extends will pass a reference to the original date instead of creating a new instance
        if (utils.isDate(currentItem.CreatedAt)) {
            itemToCreate.CreatedAt = utils.cloneDate(currentItem.CreatedAt);
        } else {
            itemToCreate.CreatedAt = new Date();
        }

        if (utils.isDate(currentItem.ModifiedAt)) {
            itemToCreate.ModifiedAt = utils.cloneDate(currentItem.ModifiedAt);
        } else {
            itemToCreate.ModifiedAt = utils.cloneDate(itemToCreate.CreatedAt);
        }

        itemToCreate.CreatedBy = itemToCreate.CreatedBy || this.everlive.setup.principalId || constants.guidEmpty;
        itemToCreate.ModifiedBy = itemToCreate.ModifiedBy || itemToCreate.CreatedBy;
        if (contentType === 'Users') {
            itemToCreate.Owner = itemToCreate._id;
        } else {
            itemToCreate.Owner = itemToCreate.CreatedBy || constants.guidEmpty;
        }
    },

    _mapCreateItem: function (currentItem, collection, isSync, preserveState, contentType) {
        var self = this;

        var itemToCreate = _.extend({}, currentItem);
        itemToCreate._id = itemToCreate.Id || utils.uuid();
        delete itemToCreate.Id;

        var existingItem = self._getById(collection, itemToCreate._id);
        var itemExists = !!existingItem;
        var state;
        if (itemExists && (!isSync && !preserveState)) {
            // TODO: [offline] return the same error as the server does
            throw new EverliveError('An item with the specified id already exists');
        } else {
            if (isSync && preserveState && itemExists) {
                state = existingItem[constants.offlineItemsStateMarker];
            } else {
                state = isSync ? undefined : offlineItemStates.created; // set the state to created only if not syncing
            }
        }

        function processItemResult() {
            self._setItemDates(currentItem, itemToCreate, contentType);
            self._setItem(collection, _.extend({}, itemToCreate), state);
            return itemToCreate;
        }

        if (utils.isContentType.files(contentType)) {
            return self.offlineFilesProcessor.upsertFileFromObject(itemToCreate, true, isSync).then(processItemResult);
        } else {
            return processItemResult();
        }
    },

    _createItems: function (contentType, items, isSync, preserveState) {
        var self = this;
        return this._getCollection(contentType)
            .then(function (collection) {
                var itemsForCreate = _.isArray(items) ? items : [items];
                var createdItems = _.map(itemsForCreate, function (currentItem) {
                    return self._mapCreateItem(currentItem, collection, isSync, preserveState, contentType);
                });

                return rsvp.all(createdItems)
                    .then(function (items) {
                        return self._persistData(contentType)
                            .then(function () {
                                // Ids are generated regardless of the autoGenerateId option. However the Id's are omitted when returning
                                // the items to the client if autoGenerateId is false
                                if (!self._shouldAutogenerateIdForContentType(contentType) && !isSync) {
                                    createdItems = offlineTransformations.removeIdTransform(items);
                                }

                                return items;
                            });
                    });
            });
    },

    _applyUpdateOperation: function (originalUpdateExpression, itemToUpdate, collection, isSync, modifiedAt) {
        var dbOperators = utils.getDbOperators(originalUpdateExpression, true);
        var hasDbOperator = dbOperators.length !== 0;

        var updateExpression;
        if (hasDbOperator) {
            updateExpression = originalUpdateExpression;
        } else {
            updateExpression = {
                $set: originalUpdateExpression
            };
        }
        var updateExpressionForUser = {
            ModifiedBy: this.everlive.setup.principalId || constants.guidEmpty
        };
        updateExpression.$set = _.extend(updateExpressionForUser, updateExpression.$set);

        if (isSync) {
            updateExpression.$set.ModifiedAt = utils.cloneDate(originalUpdateExpression.ModifiedAt || modifiedAt);
        }

        mongoQuery(itemToUpdate, {}, updateExpression, {strict: true}); // Setting strict to true so only exact matches would be updated

        itemToUpdate._id = itemToUpdate._id || updateExpression._id || updateExpression.Id;
        delete itemToUpdate.Id;

        var newState;
        if (isSync) {
            newState = undefined;
        } else if (itemToUpdate[constants.offlineItemsStateMarker] === offlineItemStates.created) {
            newState = offlineItemStates.created;
        } else {
            newState = offlineItemStates.modified;
        }

        this._setItem(collection, itemToUpdate, newState);
    },

    updateFileContent: function (dataQuery) {
        if (platform.isDesktop) {
            return utils.successfulPromise();
        }
        
        var isSync = dataQuery.isSync;
        var updateExpression = dataQuery.data;
        var self = this;
        var itemId = dataQuery.additionalOptions.id;
        var updateItems;
        var typeName = dataQuery.collectionName;
        return this._getCollection(typeName)
            .then(function (collection) {
                var singleItemForUpdate = self._getById(collection, itemId);
                updateItems = [singleItemForUpdate];
                singleItemForUpdate.base64 = updateExpression.base64;
                singleItemForUpdate.Filename = updateExpression.Filename;
                singleItemForUpdate.ContentType = updateExpression.ContentType;
                delete singleItemForUpdate.Uri;

                return self._overwriteFile(itemId, singleItemForUpdate, isSync)
                    .then(function () {
                        self._applyUpdateOperation(updateExpression, singleItemForUpdate, collection);
                        self._setItem(collection, singleItemForUpdate, constants.offlineItemStates.modified);
                        return self._persistData(typeName);
                    })
                    .then(function () {
                        return self._getUpdateItemsResult(updateItems);
                    })
            });
    },

    _overwriteFile: function (itemId, itemForUpdate, isSync) {
        var self = this;

        return self.everlive.offlineStorage.files.purge(itemId)
            .then(function () {
                return self.offlineFilesProcessor.upsertFileFromObject(itemForUpdate, true, isSync);
            })
    },

    _updateItems: function (dataQuery, updateExpression, filter, isSync) {
        var self = this;
        var collectionName = dataQuery.collectionName;

        return self._getCollection(collectionName)
            .then(function (collection) {
                var updateItems;

                if (dataQuery.additionalOptions && dataQuery.additionalOptions.id) {
                    var itemId = dataQuery.additionalOptions.id;
                    var singleItemForUpdate = self._getById(collection, itemId);
                    if (!singleItemForUpdate) {
                        throw new EverliveError(EverliveErrors.itemNotFound,
                            'Item with id :' + itemId + ' does not exist offline in the collection :' + collectionName);
                    }

                    updateItems = [singleItemForUpdate];

                    if (utils.isContentType.files(collectionName) && updateExpression.$set && updateExpression.$set.Filename || updateExpression.Filename) {
                        var filename = updateExpression.Filename || updateExpression.$set.Filename;
                        var extension = path.extname(filename);
                        return self.everlive.offlineStorage.files.changeFileExtensionById(itemId, extension)
                            .then(function () {
                                self._applyUpdateOperation(updateExpression, singleItemForUpdate, collection, isSync, dataQuery.ModifiedAt);
                                return self._persistData(collectionName);
                            })
                            .then(function () {
                                return updateItems;
                            });
                    } else {
                        self._applyUpdateOperation(updateExpression, singleItemForUpdate, collection, isSync, dataQuery.ModifiedAt);
                    }
                } else {
                    updateItems = self._readInternal(collection, filter);
                    for (var i = 0; i < updateItems.length; i++) {
                        var itemToUpdate = updateItems[i];
                        var itemExists = !!self._getById(collection, itemToUpdate._id.toString());

                        if (!itemExists && !isSync) {
                            // TODO: [offline] return the correct error
                            throw new EverliveError(EverliveErrors.itemNotFound);
                        }

                        self._applyUpdateOperation(updateExpression, itemToUpdate, collection, isSync, dataQuery.ModifiedAt);
                    }
                }

                return self._persistData(collectionName)
                    .then(function () {
                        return updateItems;
                    });
            });
    },

    _getAllCollections: function () {
        var self = this;
        return new rsvp.Promise(function (resolve, reject) {
            self._persister.getAllData(function (allData) {
                _.each(allData, function (value, key) {
                    var decryptedData = self._encryptionProvider.decrypt(value);
                    allData[key] = JSON.parse(decryptedData || '{}', utils.parseUtilities.getReviver());
                });

                resolve(allData);
            }, reject);
        });
    },

    _getCollection: function (contentType) {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            // check the persister if there is no data in the collection cache for this content type
            if (!self._collectionCache[contentType]) {
                self._persister.getData(contentType, function (data) {
                    var decryptedDataRaw = self._encryptionProvider.decrypt(data);
                    var decryptedData = JSON.parse(decryptedDataRaw || '{}', utils.parseUtilities.getReviver());
                    self._collectionCache[contentType] = decryptedData;

                    resolve(self._collectionCache[contentType]);
                }, reject);
            } else {
                resolve(self._collectionCache[contentType]);
            }
        });
    },

    _setItem: function (collection, item, state) {
        if (!state) {
            delete item[constants.offlineItemsStateMarker];
        } else {
            item[constants.offlineItemsStateMarker] = state;
        }

        collection[item._id] = item;
    },


    _getDirtyItems: function (collection) {
        var filter = {};
        filter[constants.offlineItemsStateMarker] = {$exists: true};
        var query = mingo.Query(filter);
        var cursor = mingo.Cursor(collection, query);
        return cursor.all();
    },

    _persistData: function (contentType) {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            var contentTypeData = self._collectionCache[contentType] || {};
            self._transformPersistedData(contentType, contentTypeData);
            var contentTypeDataRaw = JSON.stringify(contentTypeData);
            var contentTypeDataRawEncrypted = self._encryptionProvider.encrypt(contentTypeDataRaw);
            self._persister.saveData(contentType, contentTypeDataRawEncrypted, resolve, reject);
        });
    },

    _shouldAutogenerateIdForContentType: function (contentType) {
        return !(this.setup && this.setup.typeSettings && this.setup.typeSettings[contentType] && this.setup.typeSettings[contentType].autoGenerateId === false);
    },

    _clearItem: function (collection, item) {
        delete collection[item._id];
    },

    _mapRemoveItem: function (itemToRemove, collection, isSync, collectionName) {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            //we cannot remove files while in desktop mode
            if (utils.isContentType.files(collectionName) && !platform.isDesktop) {
                return self.everlive.offlineStorage.files.purge(itemToRemove._id).then(resolve, reject);
            } else {
                return resolve();
            }
        }).then(function () {
            itemToRemove._id = itemToRemove._id || itemToRemove.Id;

            var itemExists = !!self._getById(collection, itemToRemove._id.toString());
            if (!itemExists && !isSync) {
                throw new EverliveError('Cannot delete item - item with id ' + itemToRemove._id + ' does not exist.');
            }

            // if the item has existed only offline or the data is syncing
            // and the item was deleted by the conflict resolution strategy
            var removeFromMemory = itemToRemove[constants.offlineItemsStateMarker] === offlineItemStates.created || isSync;
            if (removeFromMemory) {
                self._clearItem(collection, itemToRemove);
            } else {
                self._setItem(collection, itemToRemove, offlineItemStates.deleted);
            }
        });
    },

    _removeItems: function (dataQuery, filter, isSync) {
        var self = this;
        var collectionName = dataQuery.collectionName;

        return self._getCollection(collectionName)
            .then(function (collection) {
                var itemsToRemove = self._readInternal(collection, filter);

                var removedItemsPromises = _.map(itemsToRemove, function (itemToRemove) {
                    return self._mapRemoveItem(itemToRemove, collection, isSync, collectionName);
                });

                return rsvp.all(removedItemsPromises);
            })
            .then(function (itemsToRemove) {
                return self._persistData(collectionName)
                    .then(function () {
                        return itemsToRemove;
                    });
            })
            .then(function (itemsToRemove) {
                return self._transformOfflineResult(itemsToRemove.length);
            });
    },

    _applyTransformations: function (transformedResult, transformations) {
        if (Array.isArray(transformedResult.result)) {
            _.each(transformations, function (transformation) {
                transformedResult.result.map(function (value, key) {
                    transformedResult.result[key] = transformation(value);
                });
            });
        } else {
            _.each(transformations, function (transformation) {
                transformedResult.result = transformation(transformedResult.result);
            });
        }
    },

    _transformOfflineResult: function (resultSet, count, dataQuery, additionalTransformations) {
        var transformedResult = {
            result: resultSet,
            count: count || (resultSet || []).length
        };

        if ((count !== undefined && count !== null) || Array.isArray(resultSet)) {
            transformedResult.count = count || resultSet.length;
        }

        var transformations = [];

        transformations.push(offlineTransformations.idTransform);
        transformations.push(offlineTransformations.removeMarkersTransform);

        if (dataQuery) {
            var includeCount = dataQuery.getHeader(Headers.includeCount);
            if (includeCount === false) {
                delete transformedResult.count;
            }

            var singleFieldExpression = dataQuery.getHeader(Headers.singleField);
            if (typeof singleFieldExpression === 'string') {
                transformations.push(offlineTransformations.singleFieldTransform.bind(this, singleFieldExpression));
            }
        }

        if (additionalTransformations) {
            transformations = transformations.concat(additionalTransformations);
        }

        this._applyTransformations(transformedResult, transformations);

        if (transformedResult.count === undefined) {
            delete transformedResult.count;
        }

        return transformedResult;
    },

    _transformPersistedData: function (contentType, contentTypeData) {
        var transformFields = [];

        if (contentType === 'Users') {
            transformFields = transformFields.concat(['Password', 'SecretQuestionId', 'SecretAnswer']);
        }

        if (transformFields.length) {
            _.each(contentTypeData, function (contentTypeObject) {
                offlineTransformations.removeFieldsTransform(contentTypeObject, transformFields);
            });
        }
    },

    aggregate: function (dataQuery, queryParams) {
        var self = this;

        return this._getCollection(dataQuery.collectionName).then(function (collection) {
            if (!queryParams || !queryParams.aggregate || _.isEmpty(queryParams.aggregate)) {
                throw new EverliveError('You must specify a valid aggregation definition. Either GroupBy or Aggregate is required.');
            }

            var aggregationQuery = _.extend({}, queryParams.aggregate);
            aggregationQuery.Filter = queryParams.filter;

            var translatedPipeline = aggregationTranslator.translate(aggregationQuery, {
                maxDocumentsCount: constants.Aggregation.MaxDocumentsCount
            });

            var collectionWithoutDeleted = _.filter(collection, function (item) {
                return item[constants.offlineItemsStateMarker] !== constants.offlineItemStates.deleted;
            });

            var result = mingo.aggregate(collectionWithoutDeleted, translatedPipeline);
            return self._transformOfflineResult(result, null, dataQuery);
        });
    },

    purgeAll: function (success, error) {
        var self = this;
        this._collectionCache = {};
        return buildPromise(function (success, error) {
            self._collectionCache = {};

            self._persister.purgeAll(function () {
                const cachingIsEnabled = self.everlive.setup.caching && self.everlive.setup.caching.enabled === true;
                if (cachingIsEnabled) {
                    self.everlive.cache.clearAll(success, error);
                } else {
                    success();
                }
            }, error);
        }, success, error);
    },

    purge: function (contentType, success, error) {
        var self = this;
        return buildPromise(function (success, error) {
            delete self._collectionCache[contentType];

            self._persister.purge(contentType, function () {
                const cachingIsEnabled = self.everlive.setup.caching && self.everlive.setup.caching.enabled === true;
                if (cachingIsEnabled) {
                    self.everlive.cache.clear(contentType, success, error);
                } else {
                    success();
                }
            }, error);
        }, success, error);
    }
};

module.exports = OfflineQueryProcessor;