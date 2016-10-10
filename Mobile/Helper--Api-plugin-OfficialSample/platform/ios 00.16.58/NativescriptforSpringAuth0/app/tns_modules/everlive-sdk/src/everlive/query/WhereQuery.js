import Expression from 'Expression';
import {OperatorType} from 'constants';

module.exports = (function () {
    /**
     * @classdesc A fluent API operation for creating a filter for a query by chaining different rules.
     * @class WhereQuery
     * @protected
     * @borrows WhereQuery#eq as WhereQuery#equal
     * @borrows WhereQuery#ne as WhereQuery#notEqual
     * @borrows WhereQuery#gt as WhereQuery#greaterThan
     * @borrows WhereQuery#gte as WhereQuery#greaterThanEqual
     * @borrows WhereQuery#lt as WhereQuery#lessThan
     * @borrows WhereQuery#lte as WhereQuery#lessThanEqual
     */
    function WhereQuery(parentQuery, exprOp, singleOperand) {
        this.parent = parentQuery;
        this.single = singleOperand;
        this.expr = new Expression(exprOp || OperatorType.where);
        this.parent.expr.addOperand(this.expr);
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
         * Adds a `not` clause to the current condition and returns it for further chaining.
         * @method not
         * @memberOf WhereQuery.prototype
         * @returns {WhereQuery}
         */
        not: function () {
            return new WhereQuery(this, OperatorType.not, true);
        },
        _simple: function (operator) {
            var args = [].slice.call(arguments, 1);
            this.expr.addOperand(new Expression(operator, args));
            return this._done();
        },
        /**
         * Adds a condition that a field must be equal to a specific value.
         * @method eq
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name.
         * @param {*} value Comparison value (to which the fields must be equal).
         * @returns {WhereQuery}
         */
        eq: function (field, value) {
            return this._simple(OperatorType.equal, field, value);
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
            return this._simple(OperatorType.not_equal, field, value);
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
         * Adds a condition that a field must be in a set of values.
         * @method isin
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name.
         * @param {Array} value An array of the values that the field should be in.
         * @returns {WhereQuery}
         */
        isin: function (field, value) {
            return this._simple(OperatorType.isin, field, value);
        },
        /**
         * Adds a condition that a field must *not* be in a set of values.
         * @method notin
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name.
         * @param {Array} value An array of values that the field should not be in.
         * @returns {WhereQuery}
         */
        notin: function (field, value) {
            return this._simple(OperatorType.notin, field, value);
        },
        /**
         * Adds a condition that a field must include *all* of the specified values. Applicable to Array fields.
         * @method all
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name.
         * @param {Array} value An array of values that the field must include.
         * @returns {WhereQuery}
         */
        all: function (field, value) {
            return this._simple(OperatorType.all, field, value);
        },
        /**
         * Adds a condition that a field must contain an array whose length is larger than a specified value. Applicable to Array fields.
         * @method size
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name.
         * @param {number} value The size that the array must be bigger than.
         * @returns {WhereQuery}
         */
        size: function (field, value) {
            return this._simple(OperatorType.size, field, value);
        },
        /**
         * Adds a condition that a field must satisfy a specified regex.
         * @method regex
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name.
         * @param {string} regularExpression Regular expression in PCRE format.
         * @param {string} [options] A string of regex options to use. See [specs](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_options) for a description of available options.
         * @returns {WhereQuery}
         */
        regex: function (field, value, flags) {
            return this._simple(OperatorType.regex, field, value, flags);
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
         * Adds a Geospatial condition that a specified geopoint must be within a certain distance from another geopoint. Applicable to GeoPoint fields only.
         * @method nearSphere
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
         * @param {Everlive.GeoPoint} point Comparison geopoint value.
         * @param {number} distance Distance value.
         * @param {string} [metrics=radians] A string representing what unit of measurement is used for distance. Possible values: radians, km, miles.
         * @returns {WhereQuery}
         */
        nearSphere: function (field, point, distance, metrics) {
            return this._simple(OperatorType.nearShpere, field, point, distance, metrics);
        },
        /**
         * Adds a Geospatial condition that a specified geopoint must be within a specified coordinate rectangle. Applicable to GeoPoint fields only.
         * @method withinBox
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
         * @param {Everlive.GeoPoint} pointBottomLeft Value representing the bottom left corner of the box.
         * @param {Everlive.GeoPoint} pointUpperRight Value representing the upper right corner of the box.
         * @example ```js
         var query = new Everlive.Query();
         query.where().withinBox('Location',
         new Everlive.GeoPoint(23.317871, 42.687709),
         new Everlive.GeoPoint(23.331346, 42.707075));
         ```
         * @returns {WhereQuery}
         */
        withinBox: function (field, pointBottomLeft, pointUpperRight) {
            return this._simple(OperatorType.withinBox, field, pointBottomLeft, pointUpperRight);
        },
        /**
         * Adds a Geospatial condition that a specified geopoint must be within a specified coordinate polygon. The polygon is specified as an array of geopoints. The last point in the array is implicitly connected to the first point thus closing the shape. Applicable to GeoPoint fields only.
         * @method withinPolygon
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
         * @param {Everlive.GeoPoint[]} points Comparison value in the form of an array of geopoints defining the polygon.
         * @example ```js
         var point1 = new Everlive.GeoPoint(23.317871, 42.687709);
         var point2 = new Everlive.GeoPoint(42.698749, 42.698749);
         var point3 = new Everlive.GeoPoint(23.331346, 42.702282);

         var query = new Everlive.Query();
         query.where().withinPolygon("location", [point1, point2, point3]);
         * ```
         * @returns {WhereQuery}
         */
        withinPolygon: function (field, points) {
            return this._simple(OperatorType.withinPolygon, field, points);
        },
        /**
         * Adds a Geospatial condition that a specified geopoint must be within a coordinate circle. Applicable to GeoPoint fields only.
         * @method withinCenterSphere
         * @memberOf WhereQuery.prototype
         * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
         * @param {Everlive.GeoPoint} center Comparison value specifying the center of the coordinate circle.
         * @param {number} radius Value specifying the radius length.
         * @param {string} [metrics=radians] A string representing what unit of measurement is used for radius length. Possible values: radians, km, miles.
         * @returns {WhereQuery}
         */
        withinCenterSphere: function (field, center, radius, metrics) {
            return this._simple(OperatorType.withinShpere, field, center, radius, metrics);
        },
        /**
         * Ends the definition of the current WhereQuery. You need to call this method in order to continue with the definition of the parent `Query`. All other `WhereQuery` methods return the current instance of `WhereQuery` to allow chaining.
         * @method done
         * @memberOf WhereQuery.prototype
         * @returns {Query}
         */
        done: function () {
            if (this.parent instanceof WhereQuery) {
                return this.parent._done();
            } else {
                return this.parent;
            }
        },
        _done: function () {
            if (this.single) {
                return this.parent;
            } else {
                return this;
            }
        }
    };

    WhereQuery.prototype.equal = WhereQuery.prototype.eq;
    WhereQuery.prototype.notEqual = WhereQuery.prototype.ne;
    WhereQuery.prototype.greaterThan = WhereQuery.prototype.gt;
    WhereQuery.prototype.greaterThanEqual = WhereQuery.prototype.gte;
    WhereQuery.prototype.lessThan = WhereQuery.prototype.lt;
    WhereQuery.prototype.lessThanEqual = WhereQuery.prototype.lte;

    return WhereQuery;
}());