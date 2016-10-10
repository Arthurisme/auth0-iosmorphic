import _ from 'underscore';
import commonConstants from 'common/constants';

const constants = {
    ExpressionType: {
        query: 1,
        where: 100,
        and: 'and',
        or: 'or',
        not: 'not',
        eq: 'eq',
        ne: 'ne',
        lt: 'lt',
        le: 'le',
        gt: 'gt',
        ge: 'ge',
        any: 'any',
        /*isin: 126,
        notin: 127,
        all: 128,
        size: 129,
        regex: 130,*/
        contains: 'contains',
        startsWith: 'startsWith',
        endsWith: 'endsWith'
    },
    ODataParams: {
        $filter: '$filter',
        $select: '$select',
        $expand: '$expand',
        $orderby: '$orderby',
        $skip: '$skip',
        $top: '$top',
        $count: '$count'
    },
    SfParams: {
        provider: 'sf_provider',
        culture: 'sf_culture'
    },
    DataQueryOperations: {
        Read: 'read',
        ReadSingle: 'readSingle'
    }
};

_.deepExtend(constants, commonConstants);

module.exports = constants;