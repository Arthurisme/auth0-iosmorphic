import QueryBase from 'query/QueryBase';
import WhereQuery from 'query/WhereQuery';
import QueryBuilder from 'query/QueryBuilder';
import OrderProperty from 'OrderProperty';

export default class Query extends QueryBase {
    /**
     * @classdesc The query class is used for constructing queries.
     * @class Query
     * @augments QueryBase
     * @example
     * var query = new Sitefinity.Query();
     * var query0 = query.where().and().endsWith("Title", "Record").done().or().startsWith('Title', 'asd').done().done();
     * var query1 = query.where().or().endsWith("Record", "Title").ne('age', '15').eq('Content', 'test').done().done();
     * var query2 = query.where().and().endsWith("Title", "Record").done().done();
     * var query3 = query.where().endsWith("Record", "Title").or().ne('age', '15').eq('Content', 'test').done().done();
     * var query4 = query.where().not().endsWith("Record", "Title").done().and().not().eq('Content', 'test').done().done().done();
     * var query5 = query.where().not().and().endsWith("Record", "Title").eq('Content', 'test').done().done().done();
     * var query6 = query.select("Id", "Title", "Content").expand('Tags').order("Title desc").where().ne('Title', 'zzz').eq('Title', 'newTitle').done()//.count();
     * var query7 = query.order("Title desc").where().eq('Title', 'newTitleUPDATE1').done().select("Title", "Content");
     * var query8 = query.where().eq('Title', 'newTitleN11').done();
     */
    constructor() {
        super();

        this._order = null;
        this._skip = null;
        this._take = null;
        this._count = null;
        this.expr = null;
    }

    /**
     * Begins a where clause for filtering the items.
     * @memberOf Query
     * @returns {@link WhereQuery}
     */
    where() {
        var clone = this._clone(function (newObj) {
            newObj.expr = new WhereQuery(newObj);
        });

        return clone.expr;
    }

    /**
     * Specifies the order by clause.
     * @memberOf Query
     * @example
     * // filter by single field
     * order("Title desc")
     * @example
     * // filter by multiple fields
     * order("Title desc", "Description asc")
     * @returns {@link Query}
     */
    order() {
        var orderPropPaths = this._extractArguments(arguments);
        this._validatePropertyPaths(orderPropPaths);

        return this._clone(function (newObj) {
            var orderItems = [];
            for (var i = 0; i < orderPropPaths.length; i++) {
                var member = orderPropPaths[i];
                var orderProp = new OrderProperty(member);
                orderItems.push(orderProp);
            }
            newObj._order = orderItems;
        });
    }

    /** Skips a certain number of items from the beginning before returning the rest of the items. Used for paging.
     * @memberOf Query.prototype
     * @method skip
     * @see [query.take]{@link query.take}
     * @param {number} value The number of items to skip.
     * @returns {Query}
     */
    skip() {
        //validate
        return this._clone(function (newObj) {
            newObj._skip = value;
        });
    }

    /** Takes a specified number of items from the query result. Used for paging.
     * @memberOf Query.prototype
     * @param {number} value The number of items to take.
     * @returns {Query}
     */
    take() {
        return this._clone(function (newObj) {
            newObj._take = value;
        });
    }

    /** Returns the total item count with the result. Used for paging.
     * @memberOf Query.prototype
     * @returns {Query}
     */
    count() {
        return this._clone(function (newObj) {
            newObj._count = true;
        });
    }

    _getFilter() {
        return this.expr;
    }

    _getOrderBy() {
        return this._order;
    }

    build() {
        return new QueryBuilder(this).build();
    }
}