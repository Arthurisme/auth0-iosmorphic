'use strict';

import rsvp from 'rsvp';

function NativeScriptFileStore(storagePath, options) {
    this.options = options;
    this.fs = require('file-system');
    this.dataDirectoryPath = this.fs.knownFolders.documents().path;
    this.filesDirectoryPath = this.fs.path.join(this.dataDirectoryPath, storagePath);
}

NativeScriptFileStore.prototype = {
    getErrorHandler: function (callback) {
        return function (e) {
            callback && callback(e);
        }
    },

    removeFilesDirectory: function () {
        var self = this;

        return self.getFilesDirectory()
            .then(function (filesDirectory) {
                return filesDirectory.remove();
            });
    },

    removeFile: function (fileEntry) {
        return fileEntry.remove();
    },

    readFileAsText: function (fileEntry) {
        return fileEntry.readText();
    },

    writeTextToFile: function (fileEntry, content) {
        return fileEntry.writeText(content);
    },

    getFile: function (path) {
        var self = this;
        return new rsvp.Promise(function (resolve, reject) {
            self.resolveDataDirectory()
                .then(function (directoryEntry) {
                    var fullFilePath = self.fs.path.join(directoryEntry.path, path);
                    var file = self.fs.File.fromPath(fullFilePath);
                    resolve(file);
                })
                .catch(reject);
        });
    },

    getFilesDirectory: function () {
        var self = this;

        return new rsvp.Promise(function (resolve) {
            var filesDirectory = self.fs.Folder.fromPath(self.filesDirectoryPath);
            resolve(filesDirectory);
        });
    },

    resolveDataDirectory: function () {
        var self = this;

        return new rsvp.Promise(function (resolve) {
            var dataDirectory = self.fs.Folder.fromPath(self.dataDirectoryPath);
            resolve(dataDirectory);
        });
    },

    ensureFilesDirectory: function () {
        var self = this;

        return new rsvp.Promise(function (resolve, reject) {
            self.resolveDataDirectory()
                .then(function (directoryEntry) {
                    var fileDirectoryPath = self.fs.path.join(directoryEntry.path, self.filesDirectoryPath);
                    self.fs.Folder.fromPath(fileDirectoryPath);
                    resolve();
                })
                .catch(reject);
        });
    },

    getFilesDirectoryPath: function () {
        return this.filesDirectoryPath;
    },

    // TODO: [offline] Implement
    writeText: function (fileName, text) {
        throw new Error('Not implemented');
    },

    // TODO: [offline] Implement
    createDirectory: function () {
        throw new Error('Not implemented');
    },

    // TODO: [offline] Implement
    getFileSize: function (file, getFileSize) {
        throw new Error('Not implemented');
    },

    // TODO: [offline] Implement
    getFileByAbsolutePath: function (path) {
        throw new Error('Not implemented');
    },

    readFileAsBase64: function (file) {
        throw new Error('Not implemented');
    },

    renameFile: function () {
        throw new Error('Not implemented');
    },
};

module.exports = NativeScriptFileStore;