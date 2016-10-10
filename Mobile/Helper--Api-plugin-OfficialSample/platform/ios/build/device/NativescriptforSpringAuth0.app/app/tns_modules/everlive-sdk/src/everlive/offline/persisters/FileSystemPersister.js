'use strict';

import FileStore from 'storages/FileStore';
import BasePersister from 'offline/persisters/BasePersister';
import _ from 'underscore';
import util from 'util';

var FileSystemPersister = (function () {
    /**
     * @class FileSystemPersister
     * @protected
     * @extends BasePersister
     */
    function FileSystemPersister(key, options) {
        BasePersister.apply(this, arguments);
        this.fileStore = new FileStore(options.storage.storagePath, options);
    }

    util.inherits(FileSystemPersister, BasePersister);

    FileSystemPersister.prototype.getAllData = function (success, error) {
        var errorHandler = this._fileSystemErrorHandler(error);
        FileSystemPersister.super_.prototype.getAllData.call(this, success, errorHandler);
    };

    FileSystemPersister.prototype.getData = function (contentType, success, error) {
        var self = this;
        var errorHandler = this._fileSystemErrorHandler(error);
        this.getFileHandle(contentType, function (fileEntry) {
            self._readFileContent(fileEntry, success, errorHandler);
        }, error);
    };

    FileSystemPersister.prototype.saveData = function (contentType, data, success, error) {
        var self = this;
        var errorHandler = this._fileSystemErrorHandler(error);
        this.getFileHandle(contentType, function (fileEntry) {
            self._writeFileContent(fileEntry, data, function () {
                self._saveContentTypes(contentType, success, errorHandler);
            }, errorHandler);
        }, errorHandler);
    };

    FileSystemPersister.prototype.purge = function (contentType, success, error) {
        var self = this;
        var errorHandler = this._fileSystemErrorHandler(error);
        this.getFileHandle(contentType, function (fileEntry) {
            self.fileStore.removeFile(fileEntry).then(function () {
                success();
            }).catch(error);
        }, errorHandler);
    };

    FileSystemPersister.prototype.purgeAll = function (success, error) {
        var errorHandler = this._fileSystemErrorHandler(error);
        this.fileStore.removeFilesDirectory()
            .then(function () {
                success();
            })
            .catch(errorHandler);
    };

    FileSystemPersister.prototype._getContentTypes = function (success, error) {
        this.getData(this.contentTypesStoreKey, function (savedContentTypesRaw) {
            var savedContentTypes = JSON.parse(savedContentTypesRaw || '[]');
            success(savedContentTypes);
        }, error);
    };

    FileSystemPersister.prototype._saveContentTypes = function (contentType, success, error) {
        var self = this;
        this._getContentTypes(function (savedContentTypes) {
            if (!_.contains(savedContentTypes, contentType)) {
                savedContentTypes.push(contentType);
            }

            self.getFileHandle(self.contentTypesStoreKey, function (contentTypesFile) {
                self._writeFileContent(contentTypesFile, JSON.stringify(savedContentTypes), success, error);
            }, error);
        });
    };

    FileSystemPersister.prototype.getFileHandle = function (contentType, success, error) {
        var self = this;
        var path = self._getFilePath(contentType);
        this.fileStore.getFilesDirectory()
            .then(function () {
                return self.fileStore.getFile(path);
            })
            .then(function (fileHandle) {
                success(fileHandle);
            })
            .catch(error);
    };

    FileSystemPersister.prototype._readFileContent = function (fileEntry, success, error) {
        this.fileStore.readFileAsText(fileEntry).then(function (content) {
            success(content);
        }).catch(error);
    };

    FileSystemPersister.prototype._writeFileContent = function (fileEntry, content, success, error) {
        this.fileStore.writeTextToFile(fileEntry, content)
            .then(success)
            .catch(error);
    };

    FileSystemPersister.prototype._getFilePath = function (contentType) {
        return this._getKey(contentType);
        //return utils.joinPath(this.fileStore.filesDirectoryPath, this._getKey(contentType));
    };

    FileSystemPersister.prototype._fileSystemErrorHandler = function (callback) {
        return this.fileStore.getErrorHandler(callback);
    };

    return FileSystemPersister;
}());

module.exports = FileSystemPersister;