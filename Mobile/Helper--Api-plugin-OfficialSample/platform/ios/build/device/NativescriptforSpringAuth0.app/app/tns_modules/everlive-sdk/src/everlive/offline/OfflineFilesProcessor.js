'use strict';

import { EverliveError, EverliveErrors } from 'EverliveError';
import FileStore from 'storages/FileStore';
import platform from 'everlive.platform';
import _ from 'underscore';
import rsvp from 'rsvp';
import utils from 'utils';
import path from 'path';

const FILES_METADATA_FILE_NAME = 'filesMetadataMap';

const OfflineFilesProcessor = function (setup, everlive) {
    this.fileStore = new FileStore(setup.files.storagePath, setup);
    this.filesMetaStore = new FileStore(setup.files.metaPath, setup);
    this._everlive = everlive;
};

OfflineFilesProcessor.prototype = {
    validateFileCreateObject: function (obj, isSync) {
        return new rsvp.Promise(function (resolve, reject) {
            if (!obj.base64 && !isSync) {
                return reject(new EverliveError(EverliveErrors.missingOrInvalidFileContent));
            } else if (!obj.ContentType) {
                return reject(new EverliveError(EverliveErrors.missingContentType));
            } else if (!obj.Filename) {
                //TODO: [offline] add an appropriate error
                return reject(new EverliveError(EverliveErrors.invalidRequest));
            }

            resolve();
        });
    },

    getOfflineFilesData: function () {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            if (!self._offlineFilesData) {
                return self.filesMetaStore.getFile(FILES_METADATA_FILE_NAME)
                    .then(function (metadataFileHandle) {
                        return self.filesMetaStore.readFileAsText(metadataFileHandle);
                    })
                    .then(function (metadataText) {
                        if (!metadataText) {
                            metadataText = '[]';
                        }

                        self._offlineFilesData = JSON.parse(metadataText);
                        resolve(self._offlineFilesData);
                    }).catch(reject);
            } else {
                resolve(self._offlineFilesData);
            }
        });
    },

    saveOfflineFilesData: function () {
        var self = this;

        return self.getOfflineFilesData()
            .then(function (offlineFilesData) {
                return self.filesMetaStore.writeText(FILES_METADATA_FILE_NAME, JSON.stringify(offlineFilesData));
            });
    },

    upsertFileFromObject: function (obj, isCreate, isSync) {
        //TODO: make separate offline files processors when we start supporting nativescript
        if (platform.isDesktop || platform.isNativeScript) {
            //we will not support files in desktop and nativescript, only their metadata
            return utils.successfulPromise();
        }

        var self = this;

        if (!isSync) {
            if (isCreate) {
                if (!obj.base64) {
                    return utils.rejectedPromise(new EverliveError(EverliveErrors.missingOrInvalidFileContent));
                }

                if (!obj.ContentType) {
                    return utils.rejectedPromise(new EverliveError(EverliveErrors.missingContentType));
                }
            } else {
                if (!obj.base64) {
                    return utils.successfulPromise();
                }
            }
        }

        if (!obj.base64) {
            var id = utils.getId(obj);
            var uri;
            var downloadFilePromise = obj.Uri ? utils.successfulPromise(obj.Uri) :
                self._everlive.files
                    .isSync(isSync)
                    .applyOffline(false)
                    .getDownloadUrlById(id);

            return downloadFilePromise.then(function (_uri) {
                uri = _uri;
                return self._everlive.offlineStorage.files.existsOffline(id);
            }).then(function (exists) {
                if (!exists) {
                    return self._everlive.offlineStorage.files._saveFile(uri, obj.Filename);
                }
            });
        }

        obj.Storage = 'internal';
        return utils.successfulPromise().then(function () {
            if (!isSync) {
                return self.validateFileCreateObject(obj, isSync);
            }
        }).then(function () {
            var onlineLocation = obj.Uri;
            var filename = self.getFilenameForObject(obj);

            var offlineFileInfo;
            var base64Contents = obj.base64;
            delete obj.base64;

            var contents = utils.b64toBlob(base64Contents, obj.ContentType);

            return self.writeFile(filename, contents)
                .then(function (fileInfo) {
                    offlineFileInfo = fileInfo;
                    return self.getOfflineFilesData();
                })
                .then(function (offlineFilesData) {
                    offlineFilesData.push({
                        offlineLocation: offlineFileInfo.offlineLocation,
                        onlineLocation: onlineLocation,
                        id: obj._id
                    });

                    obj.Length = offlineFileInfo.size;
                    return self.saveOfflineFilesData();
                });
        });
    },

    purge: function (localLocation) {
        var self = this;

        return this.getOfflineFilesData()
            .then(function (offlineFilesData) {
                var offlineFile = _.where(offlineFilesData, {offlineLocation: localLocation});

                // TODO: [offline] check if the length of offlineFile === 0
                var offlineInfoIndex = offlineFilesData.indexOf(offlineFile[0]);
                if (offlineInfoIndex !== -1) {
                    offlineFilesData.splice(offlineInfoIndex, 1);
                }

                return self.saveOfflineFilesData();
            })
            .then(function () {
                return self.fileStore.getFileByAbsolutePath(localLocation);
            }).then(function (file) {
                if (file) {
                    return self.fileStore.removeFile(file);
                }
            });
    },

    writeFile: function (filename, contents, folder) {
        var self = this;
        var offlineLocation;

        return self.fileStore.writeText(filename, contents, folder)
            .then(function (locationOnDisk) {
                offlineLocation = locationOnDisk;
                return self.saveOfflineFilesData();
            })
            .then(function () {
                return self.fileStore.getFileSize(filename, folder);
            })
            .then(function (size) {
                return {
                    size: size,
                    offlineLocation: offlineLocation
                };
            });
    },

    getFilenameForObject: function (obj) {
        var extension = path.extname(obj.Filename);
        return obj._id + extension;
    },

    getOfflineLocation: function (url, id) {
        return this.getOfflineFilesData()
            .then(function (offlineFilesData) {
                if (!url && !id) {
                    return;
                }

                for (var i = 0; i < offlineFilesData.length; i++) {
                    var fileEntry = offlineFilesData[i];
                    var urlMatches = (url && (fileEntry.offlineLocation === url || fileEntry.onlineLocation === url));
                    var idMatches = (id && fileEntry.id === id);
                    if (urlMatches || idMatches) {
                        return fileEntry.offlineLocation;
                    }
                }
            });
    }
};

module.exports = OfflineFilesProcessor;