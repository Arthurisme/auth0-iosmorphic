'use strict';

import _ from 'underscore';
import rsvp from 'rsvp';
import {EverliveError} from 'EverliveError';
import utils from 'utils';

const DEFAULT_RESPONSIVE_OPERATIONS = {
    params: {
        resize: {}
    },
    isUserResize: false
};

module.exports = (function () {
    function HtmlHelperResponsiveModule(htmlHelper) {
        this.htmlHelper = htmlHelper;
    }

    HtmlHelperResponsiveModule.prototype = {
        getBackgroundWidth: function getBackgroundWidth(el) {
            return Math.ceil(el.offsetWidth);
        },

        getBackgroundHeight: function (el) {
            return Math.ceil(el.offsetHeight);
        },

        parseParamsString: function parseParamsString(str) {
            if (!str || typeof str === 'undefined' || str.length <= 1) {
                return DEFAULT_RESPONSIVE_OPERATIONS;
            }

            var params = str.split('/');

            var result = {};
            var isUserResize = false;

            //TODO: Perhaps the conversion from query string to object and vice versa could go in utils, since it may be useful in other places?
            _.chain(params)
                .filter(function (param) {
                    return !!param;
                }) //TODO: I think there's a function in lodash called "compact", which does this.
                .each(function (param) {
                    var paramPair = param.split('=');
                    var paramName = paramPair[0];
                    var paramValues = paramPair[1];
                    paramValues = unescape(paramValues.replace(/\+/g, ' '));
                    result[paramName] = paramValues;

                    if (paramName === 'resize') {
                        isUserResize = true;
                    }
                });

            return {
                params: result,
                isUserResize: isUserResize
            };
        },

        getImgParams: function getImgParams(src, el) {
            var self = this;

            var operations;
            var imgUrl = src.replace(/.*?resize=[^//]*\//gi, '');
            var protocolRe = new RegExp('https?://', 'gi');
            var serverRe = new RegExp(this.htmlHelper._settings.server, 'gi');
            var apiIdRe = new RegExp(this.htmlHelper._everlive.appId + '/', 'gi');

            var operationsRaw = src.replace(imgUrl, '').replace(protocolRe, '').replace(serverRe, '').replace(apiIdRe, '').toLowerCase();
            if (operationsRaw !== '') {
                var operationsToParse = operationsRaw.indexOf('/') ? operationsRaw.substring(0, operationsRaw.length - 1) : operationsRaw;
                //TODO: I'm hazy on the context, but... If operationsToParse starts with "/", we parse it "as is",
                //if not, I guess it's expected to have it in the end and it's truncated? Is it
                //impossible to not have a "/" at all and cut the last symbol when maybe it shouldn't be cut?
                operations = this.parseParamsString(operationsToParse);
            } else if (el.dataset.responsiveParams) {
                operations = DEFAULT_RESPONSIVE_OPERATIONS;
                _.each(el.dataset.responsiveParams.split(','), function (key) {
                    var pair = key.split(':');
                    var param = pair[0];
                    var value = pair[1];
                    operations.params.resize[param] = value;
                });
            } else {
                operations = DEFAULT_RESPONSIVE_OPERATIONS;
            }

            _.chain(this.htmlHelper.options.responsiveParams).keys().each(function (key) {
                var value = self.htmlHelper.options.responsiveParams[key];
                operations.params.resize[key] = value;
            });

            // If it's a user resize operation, use the passed url in the data-src property
            if (operations.isUserResize) {
                imgUrl = src;
            }

            return {
                imgUrl: imgUrl,
                operations: operations.params,
                isUserResize: operations.isUserResize
            };
        },

        hasClass: function hasClass(el, cl) {
            var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
            return !!el.className.match(regex);
        },

        getImageWidth: function getImageWidth(el) {
            var parentEl = el.parentNode;
            if (parentEl) {
                var parentWidth = parentEl.offsetWidth;
                var itemStyle = window.getComputedStyle(parentEl, null);
                var pl = parseFloat(itemStyle.getPropertyValue('padding-left'));
                var pr = parseFloat(itemStyle.getPropertyValue('padding-right'));
                var bl = parseFloat(itemStyle.getPropertyValue('border-left-width'));
                var br = parseFloat(itemStyle.getPropertyValue('border-right-width'));

                return Math.abs(parentWidth - Math.ceil(pl + pr + bl + br));
            }

            return 0;
        },

        getImageHeight: function (el) {
            var parentEl = el.parentNode;
            if (parentEl) {
                var parentHeight = parentEl.offsetHeight;
                var itemStyle = window.getComputedStyle(parentEl, null);
                var pt = parseFloat(itemStyle.getPropertyValue('padding-top'));
                var pb = parseFloat(itemStyle.getPropertyValue('padding-bottom'));
                var bt = parseFloat(itemStyle.getPropertyValue('border-top-width'));
                var bb = parseFloat(itemStyle.getPropertyValue('border-bottom-width'));

                return Math.abs(parentHeight - Math.ceil(pt + pb + bt + bb));
            }

            return 0;
        },

        getDevicePixelRatio: function getDevicePixelRatio() {
            return window.devicePixelRatio ? window.devicePixelRatio : 1;
        },

        getPixelRatio:function getPixelRatio(el) {
            var pixelDensity = el.getAttribute(this.htmlHelper.options.attributes.dpi) || '';
            return pixelDensity !== '' ? _.isNumber(pixelDensity) ? parseFloat(pixelDensity) : false : this.getDevicePixelRatio();
        },

        getImgParamsString: function getImgParamsString(params) {
            var paramsStr = 'resize=';

            _.chain(params.resize).keys().each(function (paramName, index, arr) {
                paramsStr += (paramName + ':' + params.resize[paramName]);
                if (index < arr.length - 1) {
                    paramsStr += ',';
                } else {
                    paramsStr += '/';
                }
            });

            return paramsStr;
        },

        responsiveImage: function responsiveImage(item, dataSrc) {
            var self = this;
            var image = _.extend({}, item);
            var element = image.item;
            var tag = image.tag;

            var isImage = utils.isElement.image(tag);
            var imgWidth;

            image = _.extend({}, image, self.getImgParams(dataSrc, item.item));

            if (!image.isUserResize) {
                imgWidth = isImage ? self.getImageWidth(element) : self.getBackgroundWidth(element);
            }

            imgWidth = imgWidth ? imgWidth : false;
            var src = image.isUserResize ? image.imgUrl : self.getImgSrc(image, imgWidth);

            return new rsvp.Promise(function (resolve) {
                if (!imgWidth && !image.isUserResize) { // we don't have the width of the user image either.
                    // if this element is not visible, we don't have to process it.

                    return resolve();
                }

                return resolve(src);
            });
        },

        getImgSrc: function getImgSrc(image, imgWidth) {
            var protocol = this.htmlHelper._everlive.setup.scheme + '://';
            var appId = this.htmlHelper._everlive.setup.appId;
            var server = this.htmlHelper._settings.server;
            var url = this.htmlHelper._settings.urlTemplate;
            var pixelDensity = this.getPixelRatio(image.item);

            url = url.replace('[protocol]', protocol);
            url = url.replace('[appid]', appId || '');
            url = url.replace('[hostname]', server);

            var params = image.operations || false;
            var paramsString;
            if (params) {
                var operations = '';
                params.resize = params.resize || {};
                params.resize.w = imgWidth;
                params.resize.pd = pixelDensity;
                var fill = params.resize.fill;
                if (fill === 'cover' || fill === 'contain') {
                    //for fill:cover, we need both the width and height of the image
                    params.resize.h = this.getImageHeight(image.item) || this.getBackgroundHeight(image.item);
                }

                paramsString = this.getImgParamsString(params);
            } else {
                var defaultParams = {
                    resize: {
                        w: imgWidth,
                        pd: pixelDensity
                    }
                };
                paramsString = this.getImgParamsString(defaultParams);
            }

            url = url.replace('[operations]', paramsString);
            url = url.replace('[url]', image.imgUrl);
            return url;
        }
    };

    return HtmlHelperResponsiveModule;
}());
