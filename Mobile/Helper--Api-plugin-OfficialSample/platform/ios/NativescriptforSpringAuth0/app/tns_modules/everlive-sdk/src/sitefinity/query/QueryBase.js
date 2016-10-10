import {
    default as CommonQuery
} from 'common/query/Query';
import utils from 'utils';

export default class QueryBase extends CommonQuery {
    constructor() {
        super();

        this._select = null;
        this._expand = null;
    }

    /**
     * Selects which fields will be returned when querying the service.
     * @memberOf QueryBase
     * @instance
     * @param {string} arguments - an array of fields to include in the $select statement.
     * @returns {QueryBase}
     */
    select() {
        var selectPropPaths = this._extractArguments(arguments);

        this._validatePropertyPaths(selectPropPaths);

        return this._clone(function (newObj) {
            newObj._select = selectPropPaths;
        });
    }

    /**
     * Selects which navigation properties will be returned when querying the service.
     * @memberOf QueryBase
     * @instance
     * @param {string} arguments - an array of fields to include in the $expand statement.
     * @returns {QueryBase}
     */
    expand() {
        var propPaths = this._extractArguments(arguments);
        this._validatePropertyPaths(propPaths);

        return this._clone(function (newObj) {
            newObj._expand = propPaths;
        });
    }

    _extractArguments(arg) {
        var values = [];
        for (var index = 0; index < arg.length; index++) {
            values.push(arg[index]);
        }

        return values;
    }

    _getSelect() {
        return this._select;
    }

    _getExpand() {
        return this._expand;
    }

    _validatePropertyPaths(propPaths, allowNested) {
        allowNested = allowNested || false;
        for (var i = 0; i < propPaths.length; i++) {
            var member = propPaths[i];
            if (!utils.isString(member)) {
                throw new Error('Invalid argument in clause');
            }

            if (!allowNested && member.indexOf('.') > -1) {
                throw new Error('Invalid argument in clause');
            }
        }
    }

    _clone(setter) {
        var newObj = utils.clone(this, new QueryBase(), setter);

        return newObj;
    }
}

