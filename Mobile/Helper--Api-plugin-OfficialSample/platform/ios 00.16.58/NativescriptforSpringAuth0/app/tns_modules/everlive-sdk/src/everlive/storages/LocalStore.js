import {isNativeScript, isNodejs} from 'everlive.platform';

module.exports = (function () {
    'use strict';

    function initLocalStorage(options) {
        if (isNativeScript) {
            var localSettings;

            //workound for older nativescript versions
            try {
                localSettings = require('application-settings');
            } catch (e) {
                localSettings = require('local-settings');
            }

            return {
                getItem: function (key) {
                    return localSettings.getString(key);
                },

                removeItem: function (key) {
                    return localSettings.remove(key);
                },

                setItem: function (key, value) {
                    return localSettings.setString(key, value);
                }
            };
        } else {
            var localStorage;
            if (isNodejs) {
                var LocalStorage = require('node-localstorage').LocalStorage;
                localStorage = new LocalStorage(options.storage.storagePath);
            } else {
                localStorage = window.localStorage;
            }

            return {
                getItem: function (key) {
                    return localStorage.getItem(key);
                },

                removeItem: function (key) {
                    return localStorage.removeItem(key);
                },

                setItem: function (key, value) {
                    return localStorage.setItem(key, value);
                }
            };
        }
    }

    function LocalStore(options) {
        this.options = options;
        this._localStorage = initLocalStorage(this.options);
    }

    LocalStore.prototype = {
        getItem: function (key) {
            return this._localStorage.getItem(key);
        },

        removeItem: function (key) {
            return this._localStorage.removeItem(key);
        },

        setItem: function (key, value) {
            return this._localStorage.setItem(key, value);
        }
    };

    return LocalStore;
}());