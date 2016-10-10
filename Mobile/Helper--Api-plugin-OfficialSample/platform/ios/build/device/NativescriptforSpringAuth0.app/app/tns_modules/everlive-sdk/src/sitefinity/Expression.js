var utils = require('utils');

function ExpressionBase(type) {
    this.type = type;
}

ExpressionBase.prototype = {
    getType: function () {
        return this.type;
    }
}

function BinaryExpression(type, parameter, constant) {
    ExpressionBase.call(this, type);
    this.parameter = parameter;
    this.constant = constant;
}

utils.inheritsFrom(BinaryExpression, ExpressionBase);

BinaryExpression.prototype.getParameter = function () {
    return this.parameter;
}

BinaryExpression.prototype.getConstant = function () {
    return this.constant;
}

function ComplexExpression(type, expressions) {
    ExpressionBase.call(this, type);
    if (expressions)
        this.expressions = [].concat(expressions);
    else
        this.expressions = [];
}

utils.inheritsFrom(ComplexExpression, ExpressionBase);

ComplexExpression.prototype.getExpressions = function () {
    return this.expressions;
}

module.exports = {
    BinaryExpression: BinaryExpression,
    ComplexExpression: ComplexExpression
}
