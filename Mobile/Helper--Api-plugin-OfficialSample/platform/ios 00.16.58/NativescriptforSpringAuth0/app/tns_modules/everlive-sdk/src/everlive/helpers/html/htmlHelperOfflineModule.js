'use strict';

import utils from 'utils';
import {EverliveErrors, EverliveError} from 'EverliveError';
import path from 'path';
import _ from 'underscore';

export default class HtmlHelperOfflineModule {
    constructor(htmlHelper) {
        this.htmlHelper = htmlHelper;
    }

    processOffline(url) {
        var self = this;

        if (!self.htmlHelper._everlive.offlineStorage.files) {
            return utils.rejectedPromise(new EverliveError('Offline storage must be enabled in order to use the offline features of the images component.'));
        }

        return self.htmlHelper._everlive.offlineStorage.files.downloadOffline(url)
            .then(function (localUrl) {
                return localUrl;
            })
            .catch(function (err) {
                if (err.code !== EverliveErrors.cannotDownloadOffline.code) {
                    throw err;
                }

                return self.htmlHelper._everlive.offlineStorage._offlineFilesProcessor
                    .getOfflineFilesData()
                    .then(function (offlineFilesData) {
                        var basename = path.basename(url);
                        var oldFile = _.find(offlineFilesData, function (entry) {
                            if (entry.onlineLocation && entry.offlineLocation) {
                                var onlineLocation = entry.onlineLocation;
                                var basenameIndex = onlineLocation.lastIndexOf(basename);
                                return basenameIndex !== -1;
                            }
                        });

                        if (oldFile) {
                            return oldFile.offlineLocation;
                        }

                        throw new EverliveError('Cannot find offline image ' + url, EverliveErrors.missingOrInvalidFileContent.code);
                    });
            });
    }
}