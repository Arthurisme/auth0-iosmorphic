'use strict';

import {EverliveError} from 'EverliveError';
import rsvp from 'rsvp';
import _ from 'underscore';
import utils from 'utils';
import platform from 'everlive.platform';

var deviceReadyPromise = function () {
    return new rsvp.Promise(function (resolve) {
        document.addEventListener('deviceready', resolve);
    });
};

function WebFileStore(storagePath, options) {
    this.options = options;

    var filesDirectoryPath;

    if (platform.isWindowsPhone || platform.isInAppBuilderSimulator()) {
        //windows phone does not handle leading or trailing slashes very well :(
        filesDirectoryPath = storagePath.replace(new RegExp('/', 'g'), '');
    } else {
        if (storagePath.lastIndexOf('/') === -1) {
            filesDirectoryPath = storagePath + '/';
        }
    }

    filesDirectoryPath = filesDirectoryPath || storagePath;

    var self = this;

    deviceReadyPromise()
        .then(function () {
            self.filesDirectoryPath = filesDirectoryPath;
            self._requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            self._resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
            self._PERSISTENT_FILE_SYSTEM = window.LocalFileSystem ? window.LocalFileSystem.PERSISTENT : window.PERSISTENT;
        });
}

WebFileStore.prototype = {
    getErrorHandler: function getErrorHandler(callback) {
        var errorsMap = {
            '1000': 'NOT_FOUND'
        };

        _.each(Object.keys(FileError), function (error) {
            errorsMap[FileError[error]] = error;
        });

        return function (e) {
            if (!e.message) {
                e.message = errorsMap[e.code];
            }

            callback && callback(e);
        }
    },

    getDataDirectory: (function () {
        var fileSystemRoot;

        return function getDataDirectory() {
            var self = this;

            return deviceReadyPromise()
                .then(function () {
                    var requestFileSystem = function (bytes, success, error) {
                        self._requestFileSystem.call(window, self._PERSISTENT_FILE_SYSTEM, bytes, function (fileSystem) {
                            fileSystemRoot = fileSystem.root;
                            fileSystemRoot.nativeURL = fileSystemRoot.nativeURL || fileSystemRoot.toURL();
                            success(fileSystemRoot);
                        }, error);
                    };

                    return new rsvp.Promise(function (resolve, reject) {
                        if (fileSystemRoot) {
                            return resolve(fileSystemRoot);
                        }

                        if (platform.isDesktop) {
                            if (navigator && !navigator.webkitPersistentStorage) {
                                return reject(new EverliveError('FileSystemStorage can be used only with browsers supporting it. Consider using localStorage.'))
                            }

                            navigator.webkitPersistentStorage.requestQuota(self.options.storage.requestedQuota, function (grantedBytes) {
                                requestFileSystem(grantedBytes, resolve, reject);
                            }, reject);
                        } else {
                            requestFileSystem(0, resolve, reject);
                        }
                    });
                });
        };
    }()),

    getFilesDirectory: function getFilesDirectory() {
        var self = this;
        return new rsvp.Promise(function (resolve, reject) {
            self.getDataDirectory()
                .then(function (dataDirectory) {
                    dataDirectory.getDirectory(self.filesDirectoryPath, {
                        create: true,
                        exclusive: false
                    }, resolve, reject);
                })
                .catch(reject);
        });
    },

    removeFilesDirectory: function () {
        var self = this;

        return this.getFilesDirectory()
            .then(function (filesDirectory) {
                return self._removeFolderWrap(filesDirectory);
            });
    },

    removeFile: function (fileEntry) {
        return new rsvp.Promise(function (resolve, reject) {
            fileEntry.remove(function () {
                resolve();
            }, reject);
        });
    },

    readFileAsText: function (fileEntry) {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            self.getFilesDirectory().then(function () {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var result = this.result;

                        //windows phone returns an object....
                        if (typeof this.result === 'object') {
                            result = JSON.stringify(this.result);
                        }

                        resolve(result);
                    };
                    reader.onerror = reject;
                    reader.readAsText(file);
                }, reject);
            }).catch(reject);
        });
    },

    writeTextToFile: function (fileEntry, content) {
        var self = this;

        return self.getFilesDirectory()
            .then(function () {
                return self._getWriterWrap(fileEntry, content);
            });
    },

    getFileSize: function (filename, folder) {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            var fileLocation = utils.joinPath(folder, filename);

            return self.getFile(fileLocation)
                .then(function (fileEntry) {
                    fileEntry.file(function (file) {
                        resolve(file.size);
                    }, reject);
                })
        });
    },

    getFile: function (fileName, dirEntry) {
        return this.getFilesDirectory()
            .then(function (directoryEntry) {
                var fileDirectory;
                if (dirEntry) {
                    fileDirectory = dirEntry;
                } else {
                    fileDirectory = directoryEntry;
                }

                return new rsvp.Promise(function (resolve, reject) {
                    fileDirectory.getFile(fileName, {
                        create: true,
                        exclusive: false
                    }, resolve, reject);
                });
            });
    },

    getFileByAbsolutePath: function (path) {
        var self = this;
        path = utils.transformPlatformPath(path);

        return new rsvp.Promise(function (resolve, reject) {
            self._resolveLocalFileSystemURL.call(window, path, resolve, function (err) {
                if (err && err.code === FileError.NOT_FOUND_ERR) {
                    return resolve();
                }

                return reject(err);
            });
        });
    },

    createDirectory: function (directory) {
        var self = this;

        return this.getFilesDirectory()
            .then(function (directoryEntry) {
                return self._getDirectoryWrap(directory, directoryEntry, {
                    create: true,
                    exclusive: false
                });
            });
    },

    renameFile: function (directoryEntry, fileEntry, filename) {
        return new rsvp.Promise(function (resolve, reject) {
            fileEntry.moveTo(directoryEntry, filename, resolve, reject);
        });
    },

    _getDirectoryWrap: function (directory, directoryEntry, options) {
        return new rsvp.Promise(function (resolve, reject) {
            directoryEntry.getDirectory(directory, options, resolve, reject);
        });
    },

    _removeFolderWrap: function (filesDirEntry) {
        return new rsvp.Promise(function (resolve, reject) {
            filesDirEntry.removeRecursively(function () {
                resolve();
            }, reject);
        });
    },

    _getWriterWrap: function (fileEntry, content) {
        return new rsvp.Promise(function (resolve, reject) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function () {
                    resolve();
                };

                fileWriter.onerror = reject;

                var bb = new Blob([content]);
                fileWriter.write(bb);
            }, reject);
        });
    },

    writeText: function (fileName, text, path) {
        var self = this;
        var fileHandle;

        return this.getFilesDirectory()
            .then(function (directoryEntry) {
                if (path) {
                    return self.createDirectory(path);
                } else {
                    return directoryEntry;
                }
            })
            .then(function (directoryEntry) {
                return self.getFile(fileName, directoryEntry);
            })
            .then(function (fileEntry) {
                fileHandle = fileEntry;
                return self.writeTextToFile(fileEntry, text);
            })
            .then(function () {
                // there  is a difference between the cordova implementation and the standard FileTransfer fileEntry
                return fileHandle.nativeURL || fileHandle.toURL();
            });
    },

    // http://stackoverflow.com/questions/9583363/get-base64-from-imageuri-with-phonegap
    readFileAsBase64: function (fileEntry) {
        return new rsvp.Promise(function (resolve, reject) {
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (evt) {
                    resolve(utils.arrayBufferToBase64(evt.target.result));
                };

                reader.readAsArrayBuffer(file);
            }, reject);
        });
    }
};

module.exports = WebFileStore;