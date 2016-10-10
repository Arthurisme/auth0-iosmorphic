module.exports = (function () {
    function Expression(operator, operands) {
        this.operator = operator;
        this.operands = operands || [];
    }

    Expression.prototype = {
        addOperand: function (operand) {
            this.operands.push(operand);
        }
    };

    return Expression;
}());