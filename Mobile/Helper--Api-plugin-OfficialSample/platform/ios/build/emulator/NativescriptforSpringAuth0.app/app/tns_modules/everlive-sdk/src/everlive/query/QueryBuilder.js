import {
    maxDistanceConsts,
    radiusConsts,
    OperatorType
} from 'constants';
import _ from 'underscore';
import GeoPoint from 'GeoPoint';
import {EverliveError} from 'EverliveError';
import Expression from 'Expression';

module.exports = (function () {
    function QueryBuilder(query) {
        this.query = query;
        this.expr = query.expr;
    }

    QueryBuilder.prototype = {
        // TODO merge the two objects before returning them
        build: function () {
            var query = this.query;
            if (query.filter || query.fields || query.sort || query.toskip || query.totake || query.expandExpression){ // || query.aggregateExpression) {
                return {
                    $where: query.filter || null,
                    $select: query.fields || null,
                    $sort: query.sort || null,
                    $skip: query.toskip || null,
                    $take: query.totake || null,
                    $expand: query.expandExpression || null,
                    $aggregate: query.aggregateExpression || null
                };
            }
            return {
                $where: this._buildWhere(),
                $select: this._buildSelect(),
                $sort: this._buildSort(),
                $skip: this._getSkip(),
                $take: this._getTake(),
                $expand: this._getExpand(),
                $aggregate: this._getAggregate()
            };
        },
        _getSkip: function () {
            var skipExpression = _.find(this.expr.operands, function (value, index, list) {
                return value.operator === OperatorType.skip;
            });
            return skipExpression ? skipExpression.operands[0] : null;
        },
        _getTake: function () {
            var takeExpression = _.find(this.expr.operands, function (value, index, list) {
                return value.operator === OperatorType.take;
            });
            return takeExpression ? takeExpression.operands[0] : null;
        },
        _getExpand: function () {
            var expandExpression = _.chain(this.expr.operands)
                .filter(function (value) {
                    return value.operator === OperatorType.expand;
                })
                .reduce(function (result, expression) { //expression contains operands and has operator type expand
                    return _.extend(result, expression.operands[0]);
                }, {})
                .value();
            return _.isEmpty(expandExpression) ? null : expandExpression;
        },
        _getAggregate: function () {
            if (!this.query.aggregateExpression) {
                return null;
            }

            // build $aggregate, delete empty aggregates, fail no aggregates at all
            var aggregates = _.extend({}, this.query.aggregateExpression);
            if (_.isEmpty(aggregates.GroupBy)) {
                delete aggregates.GroupBy;
            }
            if (_.isEmpty(aggregates.Aggregate)) {
                delete aggregates.Aggregate;
            }

            return aggregates;
        },
        _buildSelect: function () {
            var selectExpression = _.find(this.expr.operands, function (value, index, list) {
                return value.operator === OperatorType.select;
            });
            var result = {};
            if (selectExpression) {
                _.reduce(selectExpression.operands, function (memo, value) {
                    memo[value] = 1;
                    return memo;
                }, result);
                return result;
            }
            else {
                return null;
            }
        },
        _buildSort: function () {
            var sortExpressions = _.filter(this.expr.operands, function (value, index, list) {
                return value.operator === OperatorType.order || value.operator === OperatorType.order_desc;
            });
            var result = {};
            if (sortExpressions.length > 0) {
                _.reduce(sortExpressions, function (memo, value) {
                    memo[value.operands[0]] = value.operator === OperatorType.order ? 1 : -1;
                    return memo;
                }, result);
                return result;
            }
            else {
                return null;
            }
        },
        _buildWhere: function () {
            var whereExpression = _.find(this.expr.operands, function (value, index, list) {
                return value.operator === OperatorType.where;
            });
            if (whereExpression) {
                return this._build(new Expression(OperatorType.and, whereExpression.operands));
            }
            else {
                var filterExpression = _.find(this.expr.operands, function (value, index, list) {
                    return value.operator === OperatorType.filter;
                });
                if (filterExpression) {
                    return filterExpression.operands[0];
                }
                return null;
            }
        },
        _build: function (expr) {
            if (this._isSimple(expr)) {
                return this._simple(expr);
            }
            else if (this._isRegex(expr)) {
                return this._regex(expr);
            }
            else if (this._isGeo(expr)) {
                return this._geo(expr);
            }
            else if (this._isAnd(expr)) {
                return this._and(expr);
            }
            else if (this._isOr(expr)) {
                return this._or(expr);
            }
            else if (this._isNot(expr)) {
                return this._not(expr);
            }
        },
        _isSimple: function (expr) {
            return expr.operator >= OperatorType.equal && expr.operator <= OperatorType.size;
        },
        _simple: function (expr) {
            var term = {}, fieldTerm = {};
            var operands = expr.operands;
            var operator = this._translateoperator(expr.operator);
            if (operator) {
                term[operator] = operands[1];
            }
            else {
                term = operands[1];
            }
            fieldTerm[operands[0]] = term;
            return fieldTerm;
        },
        _isRegex: function (expr) {
            return expr.operator >= OperatorType.regex && expr.operator <= OperatorType.endsWith;
        },
        _regex: function (expr) {
            var fieldTerm = {};
            var regex = this._getRegex(expr);
            var regexValue = this._getRegexValue(regex);
            var operands = expr.operands;
            fieldTerm[operands[0]] = regexValue;
            return fieldTerm;
        },
        _getRegex: function (expr) {
            var pattern = expr.operands[1];
            var flags = expr.operands[2] ? expr.operands[2] : '';
            switch (expr.operator) {
                case OperatorType.regex:
                    return pattern instanceof RegExp ? pattern : new RegExp(pattern, flags);
                case OperatorType.startsWith:
                    return new RegExp("^" + pattern, flags);
                case OperatorType.endsWith:
                    return new RegExp(pattern + "$", flags);
                default:
                    throw new EverliveError('Unknown operator type.');
            }
        },
        _getRegexValue: function (regex) {
            var options = '';
            if (regex.global) {
                options += 'g';
            }
            if (regex.multiline) {
                options += 'm';
            }
            if (regex.ignoreCase) {
                options += 'i';
            }
            return {$regex: regex.source, $options: options};
        },
        _isGeo: function (expr) {
            return expr.operator >= OperatorType.nearShpere && expr.operator <= OperatorType.withinShpere;
        },
        _geo: function (expr) {
            var fieldTerm = {};
            var operands = expr.operands;
            fieldTerm[operands[0]] = this._getGeoTerm(expr);
            return fieldTerm;
        },
        _getGeoTerm: function (expr) {
            switch (expr.operator) {
                case OperatorType.nearShpere:
                    return this._getNearSphereTerm(expr);
                case OperatorType.withinBox:
                    return this._getWithinBox(expr);
                case OperatorType.withinPolygon:
                    return this._getWithinPolygon(expr);
                case OperatorType.withinShpere:
                    return this._getWithinCenterSphere(expr);
                default:
                    throw new EverliveError('Unknown operator type.');
            }
        },
        _getNearSphereTerm: function (expr) {
            var operands = expr.operands;
            var center = this._getGeoPoint(operands[1]);
            var maxDistance = operands[2];
            var metrics = operands[3];
            var maxDistanceConst;
            var term = {
                '$nearSphere': center
            };
            if (typeof maxDistance !== 'undefined') {
                maxDistanceConst = maxDistanceConsts[metrics] || maxDistanceConsts.radians;
                term[maxDistanceConst] = maxDistance;
            }
            return term;
        },
        _getWithinBox: function (expr) {
            var operands = expr.operands;
            var bottomLeft = this._getGeoPoint(operands[1]);
            var upperRight = this._getGeoPoint(operands[2]);
            return {
                '$within': {
                    '$box': [bottomLeft, upperRight]
                }
            };
        },
        _getWithinPolygon: function (expr) {
            var operands = expr.operands;
            var points = this._getGeoPoints(operands[1]);
            return {
                '$within': {
                    '$polygon': points
                }
            };
        },
        _getWithinCenterSphere: function (expr) {
            var operands = expr.operands;
            var center = this._getGeoPoint(operands[1]);
            var radius = operands[2];
            var metrics = operands[3];
            var radiusConst = radiusConsts[metrics] || radiusConsts.radians;
            var sphereInfo = {
                'center': center
            };
            sphereInfo[radiusConst] = radius;
            return {
                '$within': {
                    '$centerSphere': sphereInfo
                }
            };
        },
        _getGeoPoint: function (point) {
            if (_.isArray(point)) {
                return new GeoPoint(point[0], point[1]);
            }
            return point;
        },
        _getGeoPoints: function (points) {
            var self = this;
            return _.map(points, function (point) {
                return self._getGeoPoint(point);
            });
        },
        _isAnd: function (expr) {
            return expr.operator === OperatorType.and;
        },
        _and: function (expr) {
            var i, l, term, result = {};
            var operands = expr.operands;
            for (i = 0, l = operands.length; i < l; i++) {
                term = this._build(operands[i]);
                result = this._andAppend(result, term);
            }
            return result;
        },
        _andAppend: function (andObj, newObj) {
            var i, l, key, value, newValue;
            var keys = _.keys(newObj);
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                value = andObj[key];
                if (typeof value === 'undefined') {
                    andObj[key] = newObj[key];
                }
                else {
                    newValue = newObj[key];
                    if (typeof value === 'object' && typeof newValue === 'object') {
                        value = _.extend(value, newValue);
                    } else {
                        value = newValue;
                    }
                    andObj[key] = value;
                }
            }
            return andObj;
        },
        _isOr: function (expr) {
            return expr.operator === OperatorType.or;
        },
        _or: function (expr) {
            var i, l, term, result = [];
            var operands = expr.operands;
            for (i = 0, l = operands.length; i < l; i++) {
                term = this._build(operands[i]);
                result.push(term);
            }
            return {$or: result};
        },
        _isNot: function (expr) {
            return expr.operator === OperatorType.not;
        },
        _not: function (expr) {
            return {$not: this._build(expr.operands[0])};
        },
        _translateoperator: function (operator) {
            switch (operator) {
                case OperatorType.equal:
                    return null;
                case OperatorType.not_equal:
                    return '$ne';
                case OperatorType.gt:
                    return '$gt';
                case OperatorType.lt:
                    return '$lt';
                case OperatorType.gte:
                    return '$gte';
                case OperatorType.lte:
                    return '$lte';
                case OperatorType.isin:
                    return '$in';
                case OperatorType.notin:
                    return '$nin';
                case OperatorType.all:
                    return '$all';
                case OperatorType.size:
                    return '$size';
            }
            throw new EverliveError('Unknown operator type.');
        }
    };

    return QueryBuilder;
}());