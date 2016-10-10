var OperatorType = require('constants').ExpressionType;
var ComplexExpression = require('Expression').ComplexExpression;
var BinaryExpression = require('Expression').BinaryExpression;
/**
 * @classdesc A fluent API operation for creating a filter for a query by chaining different rules.
 * @class WhereQuery
 * @protected
 */
function WhereQuery(parentQuery, expression /*, singleOperand*/) {
    this.parent = parentQuery;
    this.expressionObj = new ComplexExpression(expression || OperatorType.and);
}

WhereQuery.prototype = {
    /**
     * Adds an `and` clause to the current condition and returns it for further chaining.
     * @method and
     * @memberOf WhereQuery.prototype
     * @returns {WhereQuery}
     */
    and: function () {
        return new WhereQuery(this, OperatorType.and);
    },
    /**
     * Adds an `or` clause to the current condition and returns it for further chaining.
     * @method or
     * @memberOf WhereQuery.prototype
     * @returns {WhereQuery}
     */
    or: function () {
        return new WhereQuery(this, OperatorType.or);
    },

    /**
     * Adds an `any` clause to the current condition and returns it for further chaining.
     * @method any
     * @memberOf WhereQuery.prototype
     * @returns {WhereQuery}
     */
    any: function (/*parameter*/) {
        return new WhereQuery(this, OperatorType.any);
    },
    /**
     * Adds a `not` clause to the current condition and returns it for further chaining.
     * @method not
     * @memberOf WhereQuery.prototype
     * @returns {WhereQuery}
     */
    not: function () {
        return new WhereQuery(this, OperatorType.not);
    },

    _simple: function (type, parameter, constant) {
        var currentExpr = new BinaryExpression(type, parameter, constant);
        var subExpressions = this.expressionObj.getExpressions();
        subExpressions.push(currentExpr);

        if (this.expressionObj.getType() === OperatorType.not && subExpressions.length > 1)
            throw new Error("Invalid operators count!");

        return this;
    },

    /**
     * Adds a condition that a field must be equal to a specific value.
     * @method eq
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (to which the fields must be equal).
     * @returns {WhereQuery}
     */
    eq: function (parameter, constant) {
        return this._simple(OperatorType.eq, parameter, constant);
    },
    /**
     * Adds a condition that a field must *not* be equal to a specific value.
     * @method ne
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (to which the field must not be equal).
     * @returns {WhereQuery}
     */
    ne: function (field, value) {
        return this._simple(OperatorType.ne, field, value);
    },
    /**
     * Adds a condition that a field must be `greater than` a certain value. Applicable to Number, String, and Date fields.
     * @method gt
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be greater than).
     * @returns {WhereQuery}
     */
    gt: function (field, value) {
        return this._simple(OperatorType.gt, field, value);
    },
    /**
     * Adds a condition that a field must be `greater than or equal` to a certain value. Applicable to Number, String, and Date fields.
     * @method gte
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be greater than or equal to).
     * @returns {WhereQuery}
     */
    gte: function (field, value) {
        return this._simple(OperatorType.gte, field, value);
    },
    /**
     * Adds a condition that a field must be `less than` a certain value. Applicable to Number, String, and Date fields.
     * @method lt
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be less than).
     * @returns {WhereQuery}
     */
    lt: function (field, value) {
        return this._simple(OperatorType.lt, field, value);
    },
    /**
     * Adds a condition that a field must be `less than or equal` to a certain value. Applicable to Number, String, and Date fields.
     * @method lte
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be less than or equal to).
     * @returns {WhereQuery}
     */
    lte: function (field, value) {
        return this._simple(OperatorType.lte, field, value);
    },
    /**
     * Adds a condition that a field value must *start* with a specified string.
     * @method startsWith
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {string} value The string that the field should start with.
     * @param {string} [options] A string of regex options to use. See [specs](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_options) for a description of available options.
     * @returns {WhereQuery}
     */
    startsWith: function (field, value, flags) {
        return this._simple(OperatorType.startsWith, field, value, flags);
    },

    /**
     * Adds a condition that a field value must *contain* a specified string.
     * @method startsWith
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {string} value The string that the field should start with.
     * @param {string} [options] A string of regex options to use. See [specs](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_options) for a description of available options.
     * @returns {WhereQuery}
     */
    contains: function (field, value, flags) {
        return this._simple(OperatorType.contains, field, value, flags);
    },

    /**
     * Adds a condition that a field value must *end* with a specified string.
     * @method endsWith
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {string} value The string that the field should end with.
     * @param {string} [options] A string of  regex options to use. See [specs](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_options) for a description of available options.
     * @returns {WhereQuery}
     */
    endsWith: function (field, value, flags) {
        return this._simple(OperatorType.endsWith, field, value, flags);
    },

    /**
     * Ends the definition of the current WhereQuery. You need to call this method in order to continue with the definition of the parent {@link QueryBase}. All other `WhereQuery` methods return the current instance of `WhereQuery` to allow chaining.
     * @method done
     * @memberOf WhereQuery.prototype
     * @returns {Query}
     */
    done: function () {
        if (this.parent instanceof WhereQuery) {
            this.parent._addComplexExpression(this);
            // TODO: If has and() || or() must call done() twice
            if (this.expressionObj.getType() === OperatorType.not)
                return this.parent;
        }

        return this.parent;
    },

    _addComplexExpression: function (subQuery) {
        var subExpression = subQuery._getExpression();
        this.expressionObj.getExpressions().push(subExpression);
    },

    _getExpression: function () {
        return this.expressionObj;
    }
};

WhereQuery.prototype.equal = WhereQuery.prototype.eq;
WhereQuery.prototype.notEqual = WhereQuery.prototype.ne;
WhereQuery.prototype.greaterThan = WhereQuery.prototype.gt;
WhereQuery.prototype.greaterThanEqual = WhereQuery.prototype.gte;
WhereQuery.prototype.lessThan = WhereQuery.prototype.lt;
WhereQuery.prototype.lessThanEqual = WhereQuery.prototype.lte;

module.exports = WhereQuery;