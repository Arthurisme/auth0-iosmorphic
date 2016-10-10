var Expression = require('Expression');
var ComplexExpression = Expression.ComplexExpression;
var BinaryExpression = Expression.BinaryExpression;
var WhereQuery = require('query/WhereQuery');
var constants = require('constants');
var OrderProperty = require('OrderProperty');
var utils = require('utils');

function QueryBuilder(query) {
    this.query = query;
}

QueryBuilder.prototype = {
    build: function () {
        var queryParameters = {};
        this._buildODataQueryParams(this.query, queryParameters);
        return queryParameters;
    },

    _buildODataQueryParams: function (query, queryParameters) {
        var queryParams = constants.ODataParams;

        var whereClause = query._getFilter();
        if (whereClause instanceof WhereQuery) {
            var expression = whereClause._getExpression();
            if (expression instanceof ComplexExpression)
                queryParameters[queryParams.$filter] = this._buildComplexExpression(expression);
        }

        var selectClause = query._getSelect();
        if (selectClause instanceof Array) {
            queryParameters[queryParams.$select] = selectClause.join(', ');
        }

        var expandClause = query._getExpand();
        if (expandClause instanceof Array)
            queryParameters[queryParams.$expand] = expandClause.join(', ');

        var orderByClause = query._order;
        if (orderByClause instanceof Array) {
            var order = [];
            for (var i in orderByClause) {
                if (orderByClause[i] instanceof OrderProperty)
                    order.push(orderByClause[i].getValue());
            }
            queryParameters[queryParams.$orderby] = order.join(', ');
        }

        var take = query._take;
        if (utils.isNumber(take))
            queryParameters[queryParams.$top] = take;

        var skip = query._skip;
        if (utils.isNumber(skip))
            queryParameters[queryParams.$skip] = skip;

        var count = query._count;
        if (utils.isBoolean(count))
            queryParameters[queryParams.$count] = count;

        return queryParameters;
    },

    _buildComplexExpression: function(expression, parent) {
        if (!(expression instanceof ComplexExpression))
            throw new Error('Invalid complex expression');

        var OperatorType = constants.ExpressionType;
        var counter = 0;
        var result = '';
        var subExpressions = expression.getExpressions();
        while (true) {
            var currentExp = subExpressions[counter];
            if (currentExp instanceof BinaryExpression) {
                result += this._buildBinaryExpression(currentExp);
            }
            else if (currentExp instanceof ComplexExpression) {
                result += '(' + this._buildComplexExpression(currentExp, expression.type) + ')';
            }

            if (expression.getType() === OperatorType.not)
                result = expression.getType() + ' ' + result;
            // TODOSDK: Rethink this!
            if (expression.getType() === OperatorType.any) {
                var exprVal = [];
                for (var index = 0; index < subExpressions.length; index++) {
                    if (subExpressions[index].type == OperatorType.contains || subExpressions[index].type == OperatorType.startsWith || subExpressions[index].type == OperatorType.endsWith)
                        exprVal.push(subExpressions[index].type.toLowerCase() + "(x, '" + subExpressions[index].constant + "')");
                    else
                        exprVal.push('x ' + subExpressions[index].type.toLowerCase() + ' ' + this._checkType(subExpressions[index].constant));
                }
                result = currentExp.parameter + '/' + expression.getType() + '(x:' + exprVal.join(' ' + parent + ' ') + ')';
            }

            counter++;
            if (counter == subExpressions.length)
                break;

            result += ' ' + expression.getType() + ' ';
        }

        return result;
    },

    _buildBinaryExpression: function (expression) {
        if (!(expression instanceof BinaryExpression))
            throw new Error('Invalid binary expression');

        var ExpressionType = constants.ExpressionType;
        var result = null;
        var type = expression.getType();
        switch (type) {
            case ExpressionType.eq:
            case ExpressionType.ne:
            case ExpressionType.lt:
            case ExpressionType.le:
            case ExpressionType.gt:
            case ExpressionType.ge:
                var constant = expression.getConstant();
                /*var template = '({0} {1} \'{2}\')';
                if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(constant))
                    template = '({0} {1} {2})';*/

                var template = '({0} {1} {2})';
                result = template.format(expression.getParameter(), type, this._checkType(constant));
                break;
                // TODO contains is substringOf in Odata ?
            case ExpressionType.contains:
            case ExpressionType.startsWith:
            case ExpressionType.endsWith:
                result = '{0}({1}, \'{2}\')'.format(type.toLowerCase(), expression.getParameter(), expression.getConstant());
                break;
            default:
                var msg = 'Unsupported operator {0}'.format(type);
                throw new Error(msg);
        }

        return result;
    },

    _checkType: function (constant) {
        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(constant))
            return constant;
        return "'" + constant + "'";
    }
}

module.exports = QueryBuilder;