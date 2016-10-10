'use strict';

/**
 * @class Helpers
 * @classdesc Everlive helper classes
 */

import platform from 'everlive.platform';
import htmlHelper from 'helpers/html/htmlHelper';

const helpers = [];
if (platform.isCordova || platform.isDesktop) {
    helpers.push({
        name: 'html',
        ctor: htmlHelper
    });
}

module.exports = helpers;