'use strict';

import utils, {buildPromise} from 'utils';
import _ from 'underscore';
import rsvp from 'rsvp';
import reqwest from 'reqwest.everlive';
import path from 'path';
import {CryptoJS} from 'node-cryptojs-aes';
import { EverliveErrors, EverliveError } from 'EverliveError';
import AutoQueue from 'AutoQueue';

var OfflineFilesModule = function (offlineFilesProcessor, everlive, downloadsConcurrency) {
    this._offlineFilesProcessor = offlineFilesProcessor;
    this._everlive = everlive;
    this._downloadsQueue = new AutoQueue(downloadsConcurrency);
};

/**
 * @class OfflineFilesModule
 * @classdesc A class that provides the means to operate with files in offline mode.
 * @protected
 */
OfflineFilesModule.prototype = {
    _getFilenameMetadata: function (location, offlineFileInfo) {
        return new rsvp.Promise((resolve, reject) => {
            reqwest({
                url: location,
                method: 'HEAD',
                async: true,
                crossDomain: true
            }).then(xmlResponse => {
                var contentDispositionHeader = xmlResponse.getResponseHeader('Content-Disposition');
                if (contentDispositionHeader) {
                    var matches = /filename="?([^"\\]*(?:\\.[^"\\]*)*)"?/i.exec(contentDispositionHeader);
                    if (_.isArray(matches)) {
                        offlineFileInfo.filename = matches[1];
                    }
                } else {
                    offlineFileInfo.filename = path.basename(xmlResponse.responseURL);
                }

                resolve(xmlResponse.responseURL);
            }).catch(err => {
                return reject(err);
            });
        });
    },

    /**
     * Updates a file's content.
     * @memberof OfflineFilesModule.prototype
     * @method downloadOffline
     * @param {string} location A file location or the id of a file stored in Backend Services.
     * @param {boolean} overwrite Boolean option that indicates whether the file should be overwritten if it already exists offline.
     * @returns {Promise} The promise for the request
     */
    /**
     * Updates a file's content.
     * @memberof OfflineFilesModule.prototype
     * @method downloadOffline
     * @param {string} location A file location or the id of a file stored in Backend Services.
     * @param {boolean} overwrite Boolean option that indicates whether the file should be overwritten if it already exists offline.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    downloadOffline: function (location, overwrite, success, error) {
        var self = this;

        return buildPromise(function (success, error) {
            self._downloadsQueue.enqueue(function (cb) {
                var offlineFileInfo;
                return self._getOfflineFileInfo(location)
                    .then(function (_offlineFileInfo) {
                        offlineFileInfo = _offlineFileInfo;
                        if (overwrite) {
                            return false;
                        }

                        return self.existsOffline(location);
                    })
                    .then(function (exists) {
                        if (!exists) {
                            if (self._everlive.isOnline()) {
                                return utils.successfulPromise()
                                    .then(function () {
                                        if (!offlineFileInfo.filename) {
                                            return self._getFilenameMetadata(location, offlineFileInfo);
                                        }
                                    })
                                    .then(function (locationAfterRedirect) {
                                        var location = locationAfterRedirect || offlineFileInfo.location;
                                        return self._saveFile(location, offlineFileInfo.filename, null, offlineFileInfo.location);
                                    });
                            }

                            error(new EverliveError(EverliveErrors.cannotDownloadOffline));
                        } else {
                            return self._getOfflineFileInfo(location)
                                .then(function (fileInfo) {
                                    return self._getOfflineLocation(fileInfo);
                                });
                        }
                    })
                    .then(function (result) {
                        cb(null, result);
                    })
                    .catch(cb);
            }, success, error);
        }, success, error);
    },

    _saveFile: function (location, filename, id, cacheKey) {
        var self = this;
        var actualLocation;

        return self._downloadFile(location, filename)
            .then(function (_actualLocation) {
                actualLocation = _actualLocation;
                return self._offlineFilesProcessor.getOfflineFilesData();
            })
            .then(function (offlineFilesData) {
                offlineFilesData.push({
                    offlineLocation: actualLocation,
                    onlineLocation: cacheKey || location,
                    id: id
                });

                return self._offlineFilesProcessor.saveOfflineFilesData();
            })
            .then(function () {
                return actualLocation;
            });
    },

    /**
     * Physically deletes the offline copies of all files.
     * @memberof OfflineFilesModule.prototype
     * @method purgeAll
     * @returns {Promise} The promise for the request.
     */
    /**
     * Physically deletes the offline copies of all files.
     * @memberof OfflineFilesModule.prototype
     * @method purgeAll
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    purgeAll: function (success, error) {
        var self = this;

        return utils.buildPromise(function (success, error) {
            self._offlineFilesProcessor.fileStore.removeFilesDirectory()
                .then(function () {
                    return self._offlineFilesProcessor.filesMetaStore.removeFilesDirectory();
                })
                .then(function () {
                    self._offlineFilesProcessor._offlineFilesData = null;
                })
                .then(success)
                .catch(error);
        }, success, error);
    },

    _getOfflineLocation: function (fileInfo) {
        var self = this;
        var url = fileInfo.location;
        var filename = fileInfo.filename;
        var id = fileInfo.Id;

        return self._offlineFilesProcessor.getOfflineLocation(url, id)
            .then(function (offlineUrl) {
                if (offlineUrl) {
                    return offlineUrl;
                }

                // if no url is provided this means that the file exists only offline
                // the Uri field has not been populated by the server
                if (id && !url) {
                    return self._getFileUrlForId(id, filename);
                }

                return null;
            });
    },

    _downloadFile: function (url, name) {
        var self = this;

        // TODO: [offline] this will not work in NativeScript at the moment
        return new rsvp.Promise(function (resolve, reject) {
            var fileTransfer = new FileTransfer();
            var sanitizedUrl = self._sanitizeUrl(url);
            var fileId = path.basename(sanitizedUrl);
            var extension = path.extname(name);
            var filename = fileId;
            if (path.extname(sanitizedUrl) !== extension) {
                filename += extension;
            }

            var fileParentDirectory = '';
            if (!utils.isGuid(url)) {
                var fileIdIndex = url.lastIndexOf(fileId);
                var baseUrl = url.substr(0, fileIdIndex);
                fileParentDirectory = CryptoJS.MD5(baseUrl).toString();
            }

            return self._offlineFilesProcessor.fileStore.getDataDirectory()
                .then(function (dataDir) {
                    return utils.joinPath(dataDir.nativeURL, self._offlineFilesProcessor.fileStore.filesDirectoryPath,
                        fileParentDirectory, filename);
                })
                .then(function (location) {
                    fileTransfer.download(url, location, function () {
                        resolve(location);
                    }, reject, true, {
                        headers: self._everlive.buildAuthHeader()
                    });
                })
                .catch(reject);
        });
    },

    _sanitizeUrl: function (url) {
        if (!url) {
            return url;
        }

        var sanitizedUrl = encodeURI(url);
        var questionMarkIndex = sanitizedUrl.lastIndexOf('?');
        if (questionMarkIndex !== -1) {
            sanitizedUrl = sanitizedUrl.substr(0, questionMarkIndex); //linux does not allow question marks in its filenames
        }

        return sanitizedUrl;
    },

    _getFileUrlForId: function (fileId, filename) {
        var self = this;

        return this._offlineFilesProcessor.fileStore.getDataDirectory()
            .then(function (dataDirectory) {
                var fileExtension = path.extname(filename);
                return utils.joinPath(dataDirectory.nativeURL, self._offlineFilesProcessor.fileStore.filesDirectoryPath, fileId + fileExtension);
            });
    },

    /**
     * Checks if a file exists offline.
     * @memberof OfflineFilesModule.prototype
     * @method exists
     * @param {String} location The location or file id to check.
     * @returns {Promise} The promise for the request
     */
    /**
     * Checks if a file exists offline.
     * @memberof OfflineFilesModule.prototype
     * @method exists
     * @param {String} location The location or file id to check.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    existsOffline: function (location, success, error) {
        var self = this;

        return buildPromise(function (success, error) {
            self._getOfflineFileInfo(location)
                .then(function (fileInfo) {
                    return self._getOfflineLocation(fileInfo);
                })
                .then(function (offlineUrl) {
                    if (offlineUrl) {
                        return self._offlineFilesProcessor.fileStore.getFileByAbsolutePath(offlineUrl);
                    }
                })
                .then(function (offlineFile) {
                    return !!offlineFile;
                })
                .then(success)
                .catch(function (err) {
                    if (err.code === EverliveErrors.itemNotFound.code) {
                        return success(false);
                    }

                    return error.apply(this, arguments);
                });
        }, success, error);
    },


    /**
     * Physically deletes the offline copy of a file.
     * @memberof OfflineFilesModule.prototype
     * @method purge
     * @param {String} location The location or file id to remove.
     * @returns {Promise} The promise for the request.
     */
    /**
     * Physically deletes the offline copy of a file.
     * @memberof OfflineFilesModule.prototype
     * @method purge
     * @param {String} location The location or file id to check.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    purge: function (location, success, error) {
        var self = this;

        return buildPromise(function (success, error) {
            self._getOfflineFileInfo(location)
                .then(function (fileInfo) {
                    return self._getOfflineLocation(fileInfo);
                })
                .then(function (location) {
                    if (location) {
                        return self._offlineFilesProcessor.purge(location);
                    }
                })
                .then(success)
                .catch(error);
        }, success, error);
    },

    /**
     * Gets the native URL for a file that is stored offline.
     * @memberof OfflineFilesModule.prototype
     * @method getOfflineLocation
     * @param {String} location The location or file id to process.
     * @returns {Promise} The promise for the request
     */
    /**
     * Gets the native URL for a file that is stored offline.
     * @memberof OfflineFilesModule.prototype
     * @method getOfflineLocation
     * @param {String} location The location or file id to process.
     * @param {Function} [success] A success callback.
     * @param {Function} [error] An error callback.
     */
    getOfflineLocation: function (location, success, error) {
        var self = this;

        return buildPromise(function (success, error) {
            self._getOfflineFileInfo(location)
                .then(self._getOfflineLocation.bind(self))
                .then(function (offlineLocation) {
                    if (offlineLocation) {
                        return self.existsOffline(offlineLocation)
                            .then(function (exists) {
                                if (exists) {
                                    return offlineLocation;
                                }

                                return null;
                            });
                    }

                    return null;
                })
                .then(success)
                .catch(error);
        }, success, error);
    },

    _getOfflineFileInfo: function (location) {
        var self = this;
        var sanitizedUrl = this._sanitizeUrl(location);

        return new rsvp.Promise(function (resolve, reject) {
            self._everlive.Files
                .isSync(true)
                .useOffline(true)
                .getById(sanitizedUrl)
                .then(function (response) {
                    var file = response.result;
                    resolve({
                        location: file.Uri,
                        filename: file.Filename,
                        Id: sanitizedUrl
                    });
                })
                .catch(function (err) {
                    if (err && err.code === EverliveErrors.itemNotFound.code) {
                        resolve({
                            location: location
                        });
                    } else {
                        reject(err);
                    }
                });
        });
    },

    changeFileExtensionById: function (id, extension) {
        var self = this;

        if (typeof extension !== 'string') {
            return new rsvp.Promise(function (resolve) {
                resolve();
            });
        }

        return self._changeExtension(id, extension);
    },

    _changeExtension: function (id, newExtension) {
        var self = this;

        var dataDir;

        var fileStore = self._offlineFilesProcessor.fileStore;
        var fileName = id + newExtension;
        return fileStore.getFilesDirectory()
            .then(function (directoryEntry) {
                dataDir = directoryEntry;
                return self.getOfflineLocation(id);
            })
            .then(function (localPath) {

                var existingFileName = path.basename(localPath);
                if (existingFileName !== fileName) {
                    return fileStore.getFileByAbsolutePath(localPath)
                        .then(function (fileEntry) {
                            return fileStore.renameFile(dataDir, fileEntry, fileName);
                        })
                        .then(function () {
                            return self._offlineFilesProcessor.getOfflineFilesData();
                        })
                        .then(function (offlineFilesData) {
                            var mappedEntry = _.findWhere(offlineFilesData, {offlineLocation: localPath});
                            if (!mappedEntry) {
                                throw new EverliveError('Could not find a cached location for the specified file.');
                            }

                            var previousLocation = mappedEntry.offlineLocation;
                            var previousExtension = path.extname(previousLocation);
                            var actualLocation = previousLocation.slice(0, previousLocation.length - previousExtension.length) + newExtension;
                            mappedEntry.offlineLocation = actualLocation;

                            return self._offlineFilesProcessor.saveOfflineFilesData();
                        });
                }
            });
    }
};

module.exports = OfflineFilesModule;