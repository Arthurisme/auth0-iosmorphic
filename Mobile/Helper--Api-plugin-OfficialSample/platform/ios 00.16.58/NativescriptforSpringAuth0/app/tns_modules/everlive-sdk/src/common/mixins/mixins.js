import _ from 'underscore';
import deepExtend from 'common/mixins/underscoreDeepExtend';
import compactObject from 'common/mixins/underscoreCompactObject';
import isObjectEmpty from 'common/mixins/underscoreIsObjectEmpty';

_.mixin({'deepExtend': deepExtend});
_.mixin({'compactObject': compactObject});
_.mixin({'isEmptyObject': isObjectEmpty});