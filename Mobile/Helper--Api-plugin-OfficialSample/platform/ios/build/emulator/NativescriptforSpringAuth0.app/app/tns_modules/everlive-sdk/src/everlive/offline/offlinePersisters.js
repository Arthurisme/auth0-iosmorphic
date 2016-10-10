import BasePersister from 'offline/persisters/BasePersister';
import LocalStoragePersister from 'offline/persisters/LocalStoragePersister';
import FileSystemPersister from 'offline/persisters/FileSystemPersister';
import constants from 'constants';
import {EverliveError} from 'EverliveError';
import _ from 'underscore';

module.exports = {
    BasePersister: BasePersister,
    LocalStoragePersister: LocalStoragePersister,
    FileSystemPersister: FileSystemPersister,
    getPersister: function (storageKey, options) {
        var persister;

        var storageProvider = options.storage.provider;
        var storageProviderImplementation = options.storage.implementation;
        if (_.isObject(storageProviderImplementation) && storageProvider === constants.StorageProvider.Custom) {
            persister = storageProviderImplementation;
        } else {
            switch (storageProvider) {
                case constants.StorageProvider.LocalStorage:
                    persister = new LocalStoragePersister(storageKey, options);
                    break;
                case constants.StorageProvider.FileSystem:
                    persister = new FileSystemPersister(storageKey, options);
                    break;
                case constants.StorageProvider.Custom:
                    throw new EverliveError('Custom storage provider requires an implementation object');
                default:
                    throw new EverliveError('Unsupported storage type ' + storageProvider);
            }
        }

        return persister;
    }
};