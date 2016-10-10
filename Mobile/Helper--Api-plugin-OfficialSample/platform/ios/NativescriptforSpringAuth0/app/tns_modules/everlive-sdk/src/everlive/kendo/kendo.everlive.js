import QueryBuilder from 'query/QueryBuilder';
import Query from 'query/Query';
import AggregateQuery from 'query/AggregateQuery';
import constants from 'constants';
import _ from 'underscore';
import Everlive from 'Everlive';
import {EverliveError} from 'EverliveError';

const operations = {
    read: 'read',
    update: 'update',
    destroy: 'destroy',
    create: 'create'
};

(function () {
    'use strict';

    if (typeof window !== 'undefined' && typeof window.jQuery === 'undefined' || typeof window.kendo === 'undefined' || _.isEmpty(window.kendo.data)) {
        return;
    }

    var $ = window.jQuery;
    var kendo = window.kendo;

    var extend = $.extend;
    var aggrSeparator = '_';

    var everliveTransport = kendo.data.RemoteTransport.extend({
        init: function (options) {
            this.everlive$ = options.dataProvider || Everlive.$;

            this._subscribeToSdkEvents(options);
            if (!this.everlive$) {
                throw new Error('An instance of the Backend services sdk must be provided.');
            }

            if (!options.typeName) {
                throw new Error('A type name must be provided.');
            }

            this.headers = options.headers;

            this.dataCollection = this.everlive$.data(options.typeName);
            kendo.data.RemoteTransport.fn.init.call(this, options);
        },
        read: function (options) {
            var methodOption = this.options['read'];
            var self = this;
            if (methodOption && methodOption.url) {
                return kendo.data.RemoteTransport.fn.read.call(this, options);
            }
            var methodHeaders;
            if (methodOption && methodOption.headers) {
                methodHeaders = methodOption.headers;
            }
            var query = translateKendoQuery(options.data);
            var everliveQuery = new Query(query.$where, null, query.$sort, query.$skip, query.$take);
            var id = options.data.Id;

            if (id) {
                this.dataCollection.withHeaders(this.headers).withHeaders(methodHeaders).getById(id).then(options.success, options.error);
            } else {
                this.dataCollection.withHeaders(this.headers).withHeaders(methodHeaders).get(everliveQuery)
                    .then(function (getResult) {
                        return self._readServAggregates(getResult, query, options, methodHeaders);
                    })
                    .then(options.success).catch(options.error);
            }
        },
        update: function (options) {
            var methodOption = this.options['update'];
            if (methodOption && methodOption.url) {
                return kendo.data.RemoteTransport.fn.read.call(this, options);
            }
            var methodHeaders;
            if (methodOption && methodOption.headers) {
                methodHeaders = methodOption.headers;
            }
            var isMultiple = _.isArray(options.data.models);
            if (isMultiple) {
                throw new Error('Batch update is not supported.');
            } else {
                var itemForUpdate = options.data;
                return this.dataCollection.withHeaders(this.headers).withHeaders(methodHeaders).updateSingle(itemForUpdate)
                    .then(options.success.bind(this, itemForUpdate), options.error).catch(options.error);
            }
        },
        create: function (options) {
            var methodOption = this.options['create'];
            if (methodOption && methodOption.url) {
                return kendo.data.RemoteTransport.fn.read.call(this, options);
            }
            var methodHeaders;
            if (methodOption && methodOption.headers) {
                methodHeaders = methodOption.headers;
            }
            var isMultiple = _.isArray(options.data.models);
            var createData = isMultiple ? options.data.models : options.data;

            return this.dataCollection.withHeaders(this.headers).withHeaders(methodHeaders).create(createData)
                .then(options.success.bind(this, createData), options.error).catch(options.error);
        },
        destroy: function (options) {
            var methodOption = this.options['destroy'];
            if (methodOption && methodOption.url) {
                return kendo.data.RemoteTransport.fn.read.call(this, options);
            }
            var methodHeaders;
            if (methodOption && methodOption.headers) {
                methodHeaders = methodOption.headers;
            }
            var isMultiple = _.isArray(options.data.models);
            if (isMultiple) {
                throw new Error('Batch destroy is not supported.');
            }

            var removeFilter = {
                Id: options.data.Id
            };

            return this.dataCollection.withHeaders(this.headers).withHeaders(methodHeaders).destroySingle(removeFilter)
                .then(options.success, options.error).catch(options.error);
        },
        _subscribeToSdkEvents: function (options) {
            var self = this;

            _.map(operations, function (op) {
                if (options && options[op] && typeof options[op].beforeSend === 'function') {
                    var listener = options[op].beforeSend;
                    self.everlive$.on(Everlive.Constants.Events.BeforeExecute, listener);
                }
            });
        },
        _readServAggregates: function (result, query, options, methodHeaders) {
            if (options.data.aggregate) {
                if (!options.data.hasOwnProperty('filter') && !query.$where) {
                    throw new Error("The serverFiltering option must be enabled, when using serverAggregates.");
                }
                var aggregateQuery = new AggregateQuery(query.$where, null, query.$sort, query.$skip, query.$take);
                _transformAggregatesKendoToEverlive(options.data.aggregate, aggregateQuery);
                return this.dataCollection.withHeaders(this.headers).withHeaders(methodHeaders).aggregate(aggregateQuery)
                    .then(function (data) {  // merge aggregation into the result
                        var aggrResult = _transformAggregatesEverliveToKendo(options.data.aggregate, data.result[0]); // only 1 result is expected from server for aggregates, as KendoAggregates are actually totals
                        $.extend(true, result, {aggregates: aggrResult});
                        return result;
                    })
                    .catch(options.error);
            } else {
                return result;
            }
        }
    });

    $.extend(true, kendo.data, {
        transports: {
            everlive: everliveTransport
        },
        schemas: {
            everlive: {
                type: 'json',
                total: function (data) {
                    return data.hasOwnProperty('count') ? data.count : data.Count;
                },
                data: function (data) {
                    return data.result || Everlive._traverseAndRevive(data.Result) || data;
                },
                model: {
                    id: constants.idField
                },
                aggregates: 'aggregates'
            }
        }
    });

    function translateKendoQuery(data) {
        var result = {};
        if (data) {
            if (data.skip) {
                result.$skip = data.skip;
                delete data.skip;
            }
            if (data.take) {
                result.$take = data.take;
                delete data.take;
            }
            if (data.sort) {
                var sortExpressions = data.sort;
                var sort = {};
                if (!$.isArray(sortExpressions)) {
                    sortExpressions = [sortExpressions];
                }
                $.each(sortExpressions, function (idx, value) {
                    sort[value.field] = value.dir === 'asc' ? 1 : -1;
                });
                result.$sort = sort;
                delete data.sort;
            }
            if (data.filter) {
                result.$where = filterBuilder.build(data.filter);
                delete data.filter;
            }
        }
        return result;
    }

    var regexOperations = ['startswith', 'startsWith', 'endswith', 'endsWith', 'contains'];

    var filterBuilder = {
        build: function (filter) {
            return filterBuilder._build(filter);
        },
        _build: function (filter) {
            if (filterBuilder._isRaw(filter)) {
                return filterBuilder._raw(filter);
            }
            else if (filterBuilder._isSimple(filter)) {
                return filterBuilder._simple(filter);
            }
            else if (filterBuilder._isRegex(filter)) {
                return filterBuilder._regex(filter);
            }
            else if (filterBuilder._isAnd(filter)) {
                return filterBuilder._and(filter);
            }
            else if (filterBuilder._isOr(filter)) {
                return filterBuilder._or(filter);
            }
        },
        _isRaw: function (filter) {
            return filter.operator === '_raw';
        },
        _raw: function (filter) {
            var fieldTerm = {};
            fieldTerm[filter.field] = filter.value;
            return fieldTerm;
        },
        _isSimple: function (filter) {
            return typeof filter.logic === 'undefined' && !filterBuilder._isRegex(filter);
        },
        _simple: function (filter) {
            var term = {}, fieldTerm = {};
            var operator = filterBuilder._translateoperator(filter.operator);
            if (operator) {
                term[operator] = filter.value;
            }
            else {
                term = filter.value;
            }
            fieldTerm[filter.field] = term;
            return fieldTerm;
        },
        _isRegex: function (filter) {
            return $.inArray(filter.operator, regexOperations) !== -1;
        },
        _regex: function (filter) {
            var fieldTerm = {};
            var regex = filterBuilder._getRegex(filter);
            fieldTerm[filter.field] = filterBuilder._getRegexValue(regex);
            return fieldTerm;
        },
        _getRegex: function (filter) {
            var pattern = filter.value;
            var filterOperator = filter.operator;
            switch (filterOperator) {
                case 'contains':
                    return new RegExp(".*" + pattern + ".*", "i");
                case 'startsWith': // removing the camel case operators will be a breaking change
                case 'startswith': // the Kendo UI operators are in lower case
                    return new RegExp("^" + pattern, "i");
                case 'endsWith':
                case 'endswith':
                    return new RegExp(pattern + '$', 'i');
            }
            throw new Error('Unknown operator type.');
        },
        _getRegexValue: function (regex) {
            return QueryBuilder.prototype._getRegexValue.call(this, regex);
        },
        _isAnd: function (filter) {
            return filter.logic === 'and';
        },
        _and: function (filter) {
            var i, l, term, result = { $and: []};
            var operands = filter.filters;
            for (i = 0, l = operands.length; i < l; i++) {
                term = filterBuilder._build(operands[i]);
                result.$and.push(term);
            }
            return result;
        },
        _isOr: function (filter) {
            return filter.logic === 'or';
        },
        _or: function (filter) {
            var i, l, term, result = [];
            var operands = filter.filters;
            for (i = 0, l = operands.length; i < l; i++) {
                term = filterBuilder._build(operands[i]);
                result.push(term);
            }
            return {$or: result};
        },
        _translateoperator: function (operator) {
            switch (operator) {
                case 'eq':
                    return null;
                case 'neq':
                    return '$ne';
                case 'gt':
                    return '$gt';
                case 'lt':
                    return '$lt';
                case 'gte':
                    return '$gte';
                case 'lte':
                    return '$lte';
            }
            throw new Error('Unknown operator type.');
        }
    };

    /**
     * Creates a new Kendo UI [DataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/datasource) that manages a certain Backend Services content type.
     * Kendo UI [DataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/datasource) is used in conjunction with other Kendo UI widgets (such as [ListView](http://docs.telerik.com/kendo-ui/web/listview/overview) and [Grid](http://docs.telerik.com/kendo-ui/web/grid/overview)) to provide an easy way to render data from Backend Services.
     * *including Kendo UI scripts is required*.
     * @param options data source options. See the Kendo UI documentation for [DataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/datasource) for more information.
     * @param options.transport.typeName The content type name in Backend Services that will be managed.
     * @returns {DataSource} A new instance of Kendo UI DataSource. See the Kendo UI documentation for [DataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/datasource) for more information.
     * @example ```js
     * var booksDataSource = Everlive.createDataSource({
         *   transport: {
         *     typeName: 'Books'
         *   }
         * });
     * ```
     */
    var createDataSource = function (options) {
        options = options || {};
        return everlive$.getKendoDataSource(options.typeName, options);
    };

    /**
     * Creates a new Kendo UI [HierarchicalDataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/hierarchicaldatasource) that manages a certain Backend Services content type and can expand a chain of relations.
     * Kendo UI [HierarchicalDataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/hierarchicaldatasource) is used in conjunction with other Kendo UI widgets (such as [TreeView](http://docs.telerik.com/kendo-ui/web/treeview/overview)) to render data from Backend Services in a structured way.
     * The chain of relations is defined by specifying the field names that contain the relation on each level. For example a generic hierarchy chain is a content type 'Continents' with relation to 'Countries', which in turn contains a relation to 'Towns'.
     * *including Kendo UI scripts is required*.
     * @param options data source Options for [HierarchicalDataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/hierarchicaldatasource).
     * @param options.typeName Name of the main content type for the data source.
     * @param {ExpandDefinition[]} options.expand An array of expand definitions. It defines the levels of hierarchy by specifying the relation fields. An expand definition can either be the field name as a **string**, or an **object** that allows additional options.
     * @param {string} ExpandDefinition - The field name of the relation that will be expanded. Only supported in online mode.
     * @param {string} ExpandDefinition.relation - *Required*. The field name of the relation that will be expanded.
     * @param {string} ExpandDefinition.typeName - *Required in offline mode*. The type name of the relation that will be expanded.
     * @param {object} ExpandDefinition.filter - An object specifying the filter expression.
     * @param {object} ExpandDefinition.sort - An object specifying the sort expression.
     * @param {object} ExpandDefinition.skip - A number specifying the skip value.
     * @param {object} ExpandDefinition.take - A number specifying the take value.
     * @param {object} ExpandDefinition.fields - An object specifying the fields expression.
     * @returns {HierarchicalDataSource} A new instance of Kendo UI HierarchicalDataSource. See the Kendo UI documentation for [HierarchicalDataSource](http://docs.telerik.com/kendo-ui/api/javascript/data/hierarchicaldatasource).
     * @example ```js
     * var el = new Everlive('your-api-key-here');
     * var continents = Everlive.createHierarchicalDataSource({
     *   'typeName': 'Continents',
     *   'expand': ['Countries', 'Towns']
     * });
     *
     * ...
     * ('#treeview').kendoTreeView({
     *   dataSource: continents,
     *   dataTextField: ['ContinentName', 'CountryName', 'TownName']
     * });
     * ```
     */
    var createHierarchicalDataSource = function (options) {
        var typeName = options.typeName;
        var everlive$ = options.dataProvider || Everlive.$;
        if (!everlive$) {
            throw new Error('You need to instantiate an Everlive instance in order to create a Kendo UI DataSource.');
        }
        if (!typeName) {
            throw new Error("You need to specify a 'typeName' in order to create a Kendo UI DataSource.");
        }
        return everlive$.getHierarchicalDataSource(typeName, options);

    };

    /**
     * Get a Kendo UI DataSource that is attached to the current instance of the SDK with default options.
     * @method getKendoDataSource
     * @memberOf Everlive.prototype
     * @param {String} typeName The corresponding type name for the DataSource.
     * @param {Object} [options] Additional DataSource options.
     * @returns {DataSource}
     */
    Everlive.prototype.getKendoDataSource = function (typeName, options) {
        options = options || {};
        var everlive$ = options.dataProvider || Everlive.$;
        if (!everlive$) {
            throw new Error('You need to instantiate an Everlive instance in order to create a Kendo UI DataSource.');
        }
        if (!typeName) {
            throw new Error("You need to specify a 'typeName' in order to create a Kendo UI DataSource.");
        }
        if (options.serverGrouping) {
            throw new Error("serverGrouping is not supported.");
        }
        if (options.serverAggregates && !options.serverFiltering) {
            throw new Error("The serverFiltering option must be enabled, when using serverAggregates.");
        }

        var defaultEverliveOptions = {
            type: 'everlive',
            transport: {
                typeName: typeName,
                dataProvider: this
            }
        };

        var options = _.defaults(defaultEverliveOptions, options);
        return new kendo.data.DataSource(options);
    };

    /**
     * Get a Kendo UI HierarchicalDataSource that is attached to the current instance of the SDK with default options.
     * @method getHierarchicalDataSource
     * @memberOf Everlive.prototype
     * @param {String} typeName The corresponding type name for the DataSource.
     * @param {Object} dataSourceOptions Additional DataSource options that describe the hierarchical structure.
     * @returns {HierarchicalDataSource}
     */
    Everlive.prototype.getHierarchicalDataSource = function (typeName, dataSourceOptions) {
        dataSourceOptions = dataSourceOptions || {};
        var expand = dataSourceOptions.expand || dataSourceOptions;
        delete dataSourceOptions.expand;
        if (!typeName) {
            throw new Error("You need to specify a 'typeName' in order to create a Kendo UI HierarchicalDataSource.");
        }
        if (!$.isArray(expand)) {
            throw new Error("You need to set 'expand' array option in order to create a Kendo UI HierarchicalDataSource");
        }
        var baseUrl = this.buildUrl() + typeName;

        var expandSchema;
        var isOfflineStorageEnabled = this._isOfflineStorageEnabled();
        for (var i = expand.length - 1; i >= 0; i--) { //recursively build the hierarchical data source
            var expandNode = expand[i];
            if (isOfflineStorageEnabled) {
                if (!$.isPlainObject(expandNode)) {
                    throw new Error('When offline is enabled, each member of the expand array option must be an object. (Expand node index: ' + i + ')');
                }
                if (!expandNode.relation) {
                    throw new Error('When offline is enabled, each member of the expand array option must have a `relation` option set.  (Expand node index: ' + i + ')');
                }
                if (!expandNode.typeName) {
                    throw new Error('When offline is enabled, each member of the expand array option must have a `typeName` option set.  (Expand node index: ' + i + ')');
                }

                var headers;
                var expandExpression = {};
                expandExpression[expandNode.relation] = {
                    TargetTypeName: expandNode.typeName,
                    Filter: expandNode.filter,
                    Sort: expandNode.sort,
                    Take: expandNode.take,
                    Skip: expandNode.skip,
                    Fields: expandNode.fields,
                    SingleField: expandNode.singleField
                };
                headers = {
                    'X-Everlive-Expand': JSON.stringify(expandExpression),
                    'X-Everlive-Single-Field': expandNode.relation
                };
                var parentType;
                if (i === 0) {
                    parentType = typeName;
                } else {
                    parentType = expand[i - 1].typeName;
                }
                expandSchema = {
                    model: {
                        hasChildren: expandNode.relation,
                        children: {
                            type: 'everlive',
                            transport: {
                                typeName: parentType,
                                read: {
                                    headers: headers
                                }
                            },
                            schema: expandSchema
                        }
                    }
                };
            } else {
                expandSchema = {
                    model: {
                        hasChildren: getRelationFieldForExpandNode(expandNode),
                        children: {
                            type: 'everlive',
                            transport: {
                                read: {
                                    url: getUrlGeneratorForNode(baseUrl, expand.slice(0, i + 1)),
                                    headers: getHeadersForExpandNode(expandNode)
                                }
                            },
                            schema: expandSchema
                        }
                    }
                }
            }
        }
        var options = {};
        options.type = 'everlive';
        options.transport = {
            typeName: typeName,
            dataProvider: this
        };
        options.schema = expandSchema;
        if ($.isPlainObject(dataSourceOptions)) {
            extend(true, options, dataSourceOptions);
        }
        return new kendo.data.HierarchicalDataSource(options);
    };

    var getUrlGeneratorForNode = function (baseUrl, expandArray) {
        var expandField = getRelationFieldForExpandNode(expandArray[expandArray.length - 1]);
        var pathArray = expandArray.slice(0, expandArray.length - 1);
        var pathUrl = '/_expand';
        for (var i = 0; i < pathArray.length; i++) {
            pathUrl += '/' + getRelationFieldForExpandNode(pathArray[i]);
        }
        return (function (pathUrl, expandField) {
            return function (options) {
                var url = baseUrl + '';
                if (options.Id && expandField) {//if we are expanding
                    url += pathUrl + '/' + options.Id + '/' + expandField;
                }
                return url;
            }
        }(pathUrl, expandField));
    };

    var getHeadersForExpandNode = function (expandNode) {
        if (typeof expandNode === 'string') {
            return {};
        } else {
            return {
                'X-Everlive-Filter': JSON.stringify(expandNode.filter),
                'X-Everlive-Sort': JSON.stringify(expandNode.sort),
                'X-Everlive-Single-Field': expandNode.singleField,
                'X-Everlive-Skip': expandNode.skip,
                'X-Everlive-Take': expandNode.take,
                'X-Everlive-Fields': JSON.stringify(expandNode.fields)
            }
        }
    };

    var getRelationFieldForExpandNode = function (expandNode) {
        if (typeof expandNode === 'string') {
            return expandNode;
        } else {
            if (expandNode.relation) {
                return expandNode.relation;
            } else {
                throw new Error("You need to specify a 'relation' for an expand node when using the object notation");
            }
        }
    };

    /** * passes Kendo-format aggregations to JS SDK */
    var _transformAggregatesKendoToEverlive = function (kendoAggregates, aggregateQuery) {
        _.each(kendoAggregates, function (element) {
            if (element.aggregate === 'count'){
                aggregateQuery[element.aggregate](element.aggregate + aggrSeparator + element.field);
            } else {
                aggregateQuery[element.aggregate](element.field, element.aggregate + aggrSeparator + element.field);
            }
        });
    };

    /** * reformat server-response aggregations from Everlive API format to Kendo*/
    var _transformAggregatesEverliveToKendo = function (kendoAggregates, data) {
        var aggrData = {};
        _.each(kendoAggregates, function (element) {
            if (!aggrData[element.field]) {
                aggrData[element.field] = {};
            }
            aggrData[element.field][element.aggregate] = data[element.aggregate + aggrSeparator + element.field];
        });
        return _.isEmpty(aggrData) ? null : aggrData;
    };

    module.exports = {
        createDataSource: createDataSource,
        createHierarchicalDataSource: createHierarchicalDataSource
    };
}());
