import {buildPromise} from 'utils';
import {EverliveError} from 'EverliveError';
import {Platform} from 'constants';
import {jstz} from 'jstimezonedetect';
import _ from 'underscore';
import tnsPlatform from 'platform';
import {lazyRequire} from 'utils';

const tnsPushPluginLazy = lazyRequire('nativescript-push-notifications', 'tnsPushPlugin');

module.exports = (function () {
    /**
     * @class CurrentDevice
     * @deprecated
     * @protected
     * @param pushHandler
     * @constructor
     */
    var CurrentDevice = function (pushHandler) {
        this._pushHandler = pushHandler;
        this._initSuccessCallback = null;
        this._initErrorCallback = null;

        //Suffix for the global callback functions
        this._globalFunctionSuffix = null;

        this.pushSettings = null;
        this.pushToken = null;
        this.isInitialized = false;
        this.isInitializing = false;

        this.emulatorMode = false;
    };

    CurrentDevice.ensurePushIsAvailable = function() {
        // NativeScript will throw an error when the TNS Push Plugin cannot be required. So this is actually unreachable.
    };

    CurrentDevice.prototype = {

        /**
         * Initializes the current device for push notifications. This method requests a push token from the device vendor and enables the push notification functionality on the device. Once this is done, you can register the device in {{site.TelerikBackendServices}} using the register() method.
         * @method enableNotifications
         * @name enableNotifications
         * @memberOf CurrentDevice.prototype
         * @param {PushSettings} pushSettings An object specifying various settings for the initialization.
         * @returns {Object} The promise for the request.
         */
        /**
         * Initializes the current device for push notifications. This method requests a push token from the device vendor and enables the push notification functionality on the device. Once this is done, you can register the device in Everlive using the register() method.
         * @method enableNotifications
         * @name enableNotifications
         * @memberOf CurrentDevice.prototype
         * @param {PushSettings} pushSettings An object specifying various settings for the initialization.
         * @param {Function} [success] Callback to invoke on success.
         * @param {Function} [error] Callback to invoke on error.
         */
        enableNotifications: function (pushSettings, success, error) {
            this.pushSettings = this._cleanPlatformsPushSettings(pushSettings);

            return buildPromise(_.bind(this._initialize, this), success, error);
        },

        /**
         * Disables push notifications for the current device. This method invalidates any push tokens that were obtained for the device from the current application.
         * @method disableNotifications
         * @name disableNotifications
         * @memberOf CurrentDevice.prototype
         * @returns {Object} The promise for the request.
         */
        /**
         * Disables push notifications for the current device. This method invalidates any push tokens that were obtained for the device from the current application.
         * @method disableNotifications
         * @name disableNotifications
         * @memberOf CurrentDevice.prototype
         * @param {Function} [success] Callback to invoke on success.
         * @param {Function} [error] Callback to invoke on error.
         */
        disableNotifications: function (successCb, errorCb) {
            var self = this;

            return this.unregister().then(
                function () {
                    return buildPromise(
                        function (success, error) {
                            var successCallback = function successCallback() {
                                    self.isInitialized = false;
                                    success();
                                };


                            var platformType = self._getPlatformType();
                            if(platformType === Platform.Android) {
                                return tnsPushPluginLazy.tnsPushPlugin.unregister(successCallback, error, self.pushSettings.android);
                            }

                            tnsPushPluginLazy.tnsPushPlugin.unregister(successCallback, error);
                        },
                        successCb,
                        errorCb
                    );
                },
                errorCb
            );
        },

        /**
         * Returns the push registration for the current device.
         * @memberOf CurrentDevice.prototype
         * @method getRegistration
         * @name getRegistration
         * @returns {Object} The promise for the request.
         */
        /**
         * Returns the push registration for the current device.
         * @memberOf CurrentDevice.prototype
         * @method getRegistration
         * @name getRegistration
         * @param {Function} success Callback to invoke on success.
         * @param {Function} error Callback to invoke on error.
         */
        getRegistration: function (success, error) {
            var deviceId = encodeURIComponent(this._getDeviceId());
            return this._pushHandler.devices.getById('HardwareId/' + deviceId, success, error);
        },

        /**
         * Registers the current device for push notifications in {{site.TelerikBackendServices}}. This method can be called only after [enableNotifications()]{@link currentDevice.enableNotifications} has completed successfully.
         * @memberOf CurrentDevice.prototype
         * @method register
         * @name register
         * @param {Object} customParameters Custom parameters for the registration.
         * @returns {Object} The promise for the request.
         */
        /**
         * Registers the current device for push notifications in {{site.TelerikBackendServices}}. This method can be called only after [enableNotifications()]{@link currentDevice.enableNotifications} has completed successfully.
         * @memberOf CurrentDevice.prototype
         * @method register
         * @name register
         * @param {Object} customParameters Custom parameters for the registration.
         * @param {Function} [success] Callback to invoke on success.
         * @param {Function} [error] Callback to invoke on error.
         */
        register: function (customParameters, success, error) {
            var self = this;

            var deviceRegistration = {};
            if (customParameters !== undefined) {
                deviceRegistration.Parameters = customParameters;
            }

            return this._populateRegistrationObject(deviceRegistration).then(
                function () {
                    return self._pushHandler.devices.create(deviceRegistration, success, error);
                },
                error
            );
        },

        /**
         * Unregisters the current device from push notifications in {{site.TelerikBackendServices}}. After this call completes successfully, {{site.bs}} will no longer send notifications to this device. Note that this does not prevent the device from receiving notifications and does not invalidate push tokens.
         * @memberOf CurrentDevice.prototype
         * @method unregister
         * @name unregister
         * @returns {Object} The promise for the request.
         */
        /**
         * Unregisters the current device from push notifications in {{site.TelerikBackendServices}}. After this call completes successfully, {{site.bs}} will no longer send notifications to this device. Note that this does not prevent the device from receiving notifications and does not invalidate push tokens.
         * @memberOf CurrentDevice.prototype
         * @method unregister
         * @name unregister
         * @param {Function} [success] Callback to invoke on success.
         * @param {Function} [error] Callback to invoke on error.
         */
        unregister: function (success, error) {
            var deviceId = encodeURIComponent(this._getDeviceId());
            return this._pushHandler.devices.destroySingle({Id: 'HardwareId/' + deviceId}, success, error);
        },

        /**
         * Updates the registration of the current device.
         * @memberOf CurrentDevice.prototype
         * @method updateRegistration
         * @name updateRegistration
         * @param {Object} customParameters Custom parameters for the registration. If undefined, customParameters are not updated.
         * @returns {Object} The promise for the request.
         */
        /**
         * Updates the registration for the current device.
         * @memberOf CurrentDevice.prototype
         * @method updateRegistration
         * @name updateRegistration
         * @param {Object} customParameters Custom parameters for the registration. If undefined, customParameters are not updated.
         * @param {Function} [success] Callback to invoke on success.
         * @param {Function} [error] Callback to invoke on error.
         */
        updateRegistration: function (customParameters, success, error) {
            var self = this;

            var deviceRegistration = {};
            if (customParameters !== undefined) {
                deviceRegistration.Parameters = customParameters;
            }

            return this._populateRegistrationObject(deviceRegistration).then(
                function () {
                    deviceRegistration.Id = 'HardwareId/' + encodeURIComponent(deviceRegistration.HardwareId);
                    return self._pushHandler.devices.updateSingle(deviceRegistration, success, error);
                },
                error
            );
        },

        /**
         * This method provides a different operation on each supported platform:
         *
         * - On iOS: Checks if Notifications is enabled for this application in the device's Notification Center.
         * - On Windows Phone: Checks if the application has an active open channel for communication with the Microsoft Push Notification Service. The outcome does not depend on the device's notification settings.
         * - On Android: Checks if the application has established a connection with Google Cloud Messaging. The outcome does not depend on the device's notification settings.
         * @method areNotificationsEnabled
         * @name areNotificationsEnabled
         * @memberOf Push.prototype
         * @param {Object} options An object passed to the Push Notification plugin's areNotificationsEnabled method
         * @returns {Promise} The promise for the request.
         */
        /**
         * iOS: Checks if the Notifications are enabled for this Application in the Device's Notification Center.
         * Windows Phone: Checks if the Application has an active opened Channel for communication with the Notification Service. Not relying on the device notification settings.
         * Android: Checks if the Application has established connection with the Notification Service. Not relying on the device notification settings.
         * @method areNotificationsEnabled
         * @name areNotificationsEnabled
         * @memberOf Push.prototype
         * @param {Object} options an object passed to the Push Notification plugin's areNotificationsEnabled method.
         * @param {Function} [onSuccess] Callback to invoke on successful check. Passes a single boolean value: true or false.
         * @param {Function} [onError] Callback to invoke when an error in the push plugin has occurred.
         */
        areNotificationsEnabled: function (options, onSuccess, onError) {
            options = options || {};
            
            return buildPromise(function (successCb, errorCb) {
                tnsPushPluginLazy.tnsPushPlugin.areNotificationsEnabled(successCb, errorCb, options);
            }, onSuccess, onError);
        },

        _initializeInteractivePush: function (iOSSettings, success, error) {
            tnsPushPluginLazy.tnsPushPlugin.registerUserNotificationSettings(
                // the success callback which will immediately return (APNs is not contacted for this)
                success,
                // called in case the configuration is incorrect
                error
            );
        },

        //Initializes the push functionality on the device.
        _initialize: function (success, error) {
            if (this.isInitializing) {
                error(new EverliveError('Push notifications are currently initializing.'));
                return;
            }

            this._initSuccessCallback = success;
            this._initErrorCallback = error;

            if (this.isInitialized) {
                this._deviceRegistrationSuccess(this.pushToken);
                return;
            }

            this.isInitializing = true;

            var suffix = this._globalFunctionSuffix;
            if (!suffix) {
                suffix = Date.now().toString();
                this._globalFunctionSuffix = suffix;
            }

            var platformType = this._getPlatformType();
            if (platformType === Platform.iOS) {
                //Construct registration options object and validate iOS settings
                var apnRegistrationOptions = this.pushSettings.iOS;

                apnRegistrationOptions.notificationCallbackIOS = this.pushSettings.notificationCallbackIOS;
                //Register for APN
                tnsPushPluginLazy.tnsPushPlugin.register(
                    apnRegistrationOptions,
                    _.bind(this._successfulRegistrationAPN, this),
                    _.bind(this._failedRegistrationAPN, this)                    
                );
            } else if (platformType === Platform.Android) {
                // Ensure the required fields are present in the Android Settings
                var gcmRegistrationOptions = this.pushSettings.android;
                this._validateAndroidSettings(gcmRegistrationOptions);

                gcmRegistrationOptions.notificationCallbackAndroid = this.pushSettings.notificationCallbackAndroid;

                //Register for GCM
                tnsPushPluginLazy.tnsPushPlugin.register(
                    gcmRegistrationOptions,
                    _.bind(this._successSentRegistrationGCM, this),
                    _.bind(this._errorSentRegistrationGCM, this)
                );
            } else {
                throw new EverliveError('The current platform is not supported: ' + tnsPlatform.device.os);
            }
        },

        _validateAndroidSettings: function (androidSettings) {
            if (!androidSettings.senderID) {
                throw new EverliveError('Sender ID (project number) is not set in the android settings.');
            }
        },
        _cleanPlatformsPushSettings: function (pushSettings) {
            var cleanSettings = {};
            pushSettings = pushSettings || {};

            var addSettingsForPlatform = function addSettingsForPlatform(newSettingsObject, platform, allowedFields) {
                if (!pushSettings[platform]) {
                    return;
                }

                newSettingsObject[platform] = newSettingsObject[platform] || {};
                var newPlatformSettings = pushSettings[platform];
                var settings = newSettingsObject[platform];
                _.each(allowedFields, function (allowedField) {
                    if (newPlatformSettings.hasOwnProperty(allowedField)) {
                        settings[allowedField] = newPlatformSettings[allowedField];
                    }
                });
            };

            addSettingsForPlatform(cleanSettings, 'iOS', ['badge', 'sound', 'alert', 'interactiveSettings']);
            addSettingsForPlatform(cleanSettings, 'android', ['senderID', 'projectNumber']);

            var callbackFields = ['notificationCallbackAndroid', 'notificationCallbackIOS'];
            _.each(callbackFields, function (callbackField) {
                var callback = pushSettings[callbackField];
                if (callback) {
                    if (typeof callback !== 'function') {
                        throw new EverliveError('The "' + callbackField + '" of the push settings should be a function');
                    }

                    cleanSettings[callbackField] = pushSettings[callbackField];
                }
            });

            if (pushSettings.customParameters) {
                cleanSettings.customParameters = pushSettings.customParameters;
            }

            return cleanSettings;
        },

        _populateRegistrationObject: function (deviceRegistration, success, error) {
            var self = this;

            return buildPromise(
                function (success, error) {
                    if (!self.pushToken) {
                        throw new EverliveError('Push token is not available.');
                    }

                    self._getLocaleName(
                        function (locale) {
                            var deviceId = self._getDeviceId();
                            var hardwareModel = tnsPlatform.device.model;
                            var platformType = self._getPlatformType();
                            var timeZone = jstz.determine().name();
                            var pushToken = self.pushToken;
                            var language = 'en_US'; //TODO
                            var platformVersion = tnsPlatform.device.osVersion;

                            deviceRegistration.HardwareId = deviceId;
                            deviceRegistration.HardwareModel = hardwareModel;
                            deviceRegistration.PlatformType = platformType;
                            deviceRegistration.PlatformVersion = platformVersion;
                            deviceRegistration.TimeZone = timeZone;
                            deviceRegistration.PushToken = pushToken;
                            deviceRegistration.Locale = language;

                            success();
                        },
                        error
                    );
                },
                success,
                error
            );
        },

        _getLocaleName: function (success, error) {
            return success(); // TODO            
            /* TODO: Must translate somehow to NativeScript to get the current locale
            if (this.emulatorMode) {
                success({value: 'en_US'});
            } else {
                navigator.globalization.getLocaleName(
                    function (locale) {
                        success(locale);
                    },
                    error
                );
                navigator.globalization.getLocaleName(
                    function (locale) {
                    },
                    error
                );
            }*/
        },

        _getDeviceId: function () {
            return tnsPlatform.device.uuid;
        },

        //Returns the Everlive device platform constant given a value aquired from cordova's device.platform.
        _getPlatformType: function () {
            var psLower = tnsPlatform.device.os.toLowerCase();
            switch (psLower) {
                case 'ios':
                case 'iphone':
                case 'ipad':
                    return Platform.iOS;
                case 'android':
                    return Platform.Android;
                default:
                    return Platform.Unknown;
            }
        },

        _deviceRegistrationFailed: function (error) {
            this.pushToken = null;
            this.isInitializing = false;
            this.isInitialized = false;

            if (this._initErrorCallback) {
                this._initErrorCallback({error: error});
            }
        },

        _deviceRegistrationSuccess: function (token) {
            this.pushToken = token;
            this.isInitializing = false;
            this.isInitialized = true;

            if (this._initSuccessCallback) {
                this._initSuccessCallback({token: token});
            }
        },

        //Occurs when the device registration in APN succeeds
        _successfulRegistrationAPN: function (token) {
            var self = this;
            if (this.pushSettings.iOS && this.pushSettings.iOS.interactiveSettings) {
                this._initializeInteractivePush(
                    this.pushSettings.iOS,
                    function () {
                        self._deviceRegistrationSuccess(token);
                    },
                    function (err) {
                        throw new EverliveError('The interactive push configuration is incorrect: ' + err);
                    }
                );
            } else {
                this._deviceRegistrationSuccess(token);
            }
        },

        //Occurs if the device registration in APN fails
        _failedRegistrationAPN: function (error) {
            this._deviceRegistrationFailed(error);
        },

        //Occurs when device registration has been successfully sent to GCM
        _successSentRegistrationGCM: function (token) {
            //console.log("Successfully sent request for registering with GCM.");

            // set on message received.
            tnsPushPluginLazy.tnsPushPlugin.onMessageReceived(this.pushSettings.notificationCallbackAndroid);

            this._deviceRegistrationSuccess(token);
        },

        //Occurs when an error occured when sending registration request to GCM
        _errorSentRegistrationGCM: function (error) {
            this._deviceRegistrationFailed(error);
        },

        notificationProcessed: function () {
            throw new Error('Not implemented');
        },

        //This function receives all notification events from APN
        _onNotificationAPN: function (e) {
            this._raiseNotificationEventIOS(e);
        },

        //This function receives all notification events from GCM
        _onNotificationGCM: function onNotificationGCM(e) {
            switch (e.event) {
                case 'registered':
                    if (e.regid.length > 0) {
                        this._deviceRegistrationSuccess(e.regid);
                    }
                    break;
                case 'message':
                    this._raiseNotificationEventAndroid(e);
                    break;
                case 'error':
                    if (!this.pushToken) {
                        this._deviceRegistrationFailed(e);
                    } else {
                        this._raiseNotificationEventAndroid(e);
                    }
                    break;
                default:
                    this._raiseNotificationEventAndroid(e);
                    break;
            }
        },

        _raiseNotificationEventAndroid: function (e) {
            if (this.pushSettings.notificationCallbackAndroid) {
                this.pushSettings.notificationCallbackAndroid(e);
            }
        },
        _raiseNotificationEventIOS: function (e) {
            if (this.pushSettings.notificationCallbackIOS) {
                this.pushSettings.notificationCallbackIOS(e);
            }
        }
    };

    return CurrentDevice;
}());
