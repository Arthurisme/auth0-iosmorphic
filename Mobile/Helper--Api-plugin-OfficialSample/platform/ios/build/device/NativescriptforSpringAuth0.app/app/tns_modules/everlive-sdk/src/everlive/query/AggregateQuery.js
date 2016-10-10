import _ from 'underscore';
import Query from 'query/Query';
import util from 'util';
import{EverliveError} from 'EverliveError';

/**
 * @class AggregateQuery
 * @classdesc A query class used to describe a aggregation request that will be made to the {{site.TelerikBackendServices}} JavaScript API. Inherits from Query.
 */
var AggregateQuery = function () {
    Query.apply(this, arguments);
    this.aggregateExpression = {'GroupBy': [], 'Aggregate': {}};

    // the aggregate expression will be the last argument when initializing the query
    var aggregateExpression = arguments[6];
    var groupBy;
    var aggregate;
    if (aggregateExpression) {
        groupBy = aggregateExpression.GroupBy;
        aggregate = aggregateExpression.Aggregate;
    }

    this.aggregateExpression = {'GroupBy': groupBy || [], 'Aggregate': aggregate || {}};
};

util.inherits(AggregateQuery, Query);

// wrapper formatter to all aggregate functions, like min/max/sum/average/count
AggregateQuery.prototype._aggregateFunc = function _aggregateFunc(funcName, fieldName, destName) {
    if (typeof fieldName !== 'string' && funcName !== 'count' ) {
        throw new EverliveError(funcName + '() accepts only string as parameter.');
    }
    var aggregationObj = {};
    aggregationObj[funcName] = fieldName;
    this.aggregateExpression.Aggregate[destName || fieldName] = aggregationObj;
    return this;
};

/** Applies a groupBy to the current query. This allows you to group results by
 * @memberOf AggregateQuery.prototype
 * @method groupBy
 * @name groupBy
 * @param {String} field to group by
 * @param {Array} array of strings with fields to group by
 * @returns {AggregateQuery}
 */
AggregateQuery.prototype.groupBy = function (data) {
    if (_.isArray(data)) {
        Array.prototype.push.apply(this.aggregateExpression.GroupBy, data);
    } else {
        if (typeof data === 'string') {
            this.aggregateExpression.GroupBy.push(data);
        } else {
            throw new EverliveError('groupBy() accepts only array or string as parameter.');
        }
    }
    return this;
};
/** Adds aggregation function 'avg' (average) to the current query. Could set [resultFieldName]
 * @memberOf AggregateQuery.prototype
 * @method avg
 * @name avg
 * @param {String} field to apply aggregate function on
 * @param {String} [resultFieldName] (Optional) Name of resulting field
 * @returns {AggregateQuery}
 */
AggregateQuery.prototype.avg = function () {
    Array.prototype.unshift.call(arguments, 'avg');
    return this._aggregateFunc.apply(this, arguments);
};

/** Adds aggregation function 'count' to the current query. Could set [resultFieldName]
 * @memberOf AggregateQuery.prototype
 * @method count
 * @name count
 * @param {String} field to apply aggregate function on
 * @param {String} [resultFieldName] (Optional) Name of resulting field
 * @returns {AggregateQuery}
 */
AggregateQuery.prototype.count = function (resultFieldName) {
    return this._aggregateFunc('count', null, resultFieldName || 'Count');
};

/** Adds aggregation function 'max' to the current query. Could set [resultFieldName]
 * @memberOf AggregateQuery.prototype
 * @method max
 * @name max
 * @param {String} field to apply aggregate function on
 * @param {String} [resultFieldName] (Optional) Name of resulting field
 * @returns {AggregateQuery}
 */
AggregateQuery.prototype.max = function () {
    Array.prototype.unshift.call(arguments, 'max');
    return this._aggregateFunc.apply(this, arguments);
};

/** Adds aggregation function 'min' to the current query. Could set [resultFieldName]
 * @memberOf AggregateQuery.prototype
 * @method min
 * @name min
 * @param {String} field to apply aggregate function on
 * @param {String} [resultFieldName] (Optional) Name of resulting field
 * @returns {AggregateQuery}
 */
AggregateQuery.prototype.min = function () {
    Array.prototype.unshift.call(arguments, 'min');
    return this._aggregateFunc.apply(this, arguments);
};

/** Adds aggregation function 'sum' to the current query. Could set [resultFieldName]
 * @memberOf AggregateQuery.prototype
 * @method sum
 * @name sum
 * @param {String} field to apply aggregate function on
 * @param {String} [resultFieldName] (Optional) Name of resulting field
 * @returns {AggregateQuery}
 */
AggregateQuery.prototype.sum = function () {
    Array.prototype.unshift.call(arguments, 'sum');
    return this._aggregateFunc.apply(this, arguments);
};

AggregateQuery.prototype.select = undefined;
AggregateQuery.prototype.skip  = undefined;
AggregateQuery.prototype.take = undefined;
AggregateQuery.prototype.order = undefined;

AggregateQuery.prototype.average = AggregateQuery.prototype.avg;

module.exports = AggregateQuery;
