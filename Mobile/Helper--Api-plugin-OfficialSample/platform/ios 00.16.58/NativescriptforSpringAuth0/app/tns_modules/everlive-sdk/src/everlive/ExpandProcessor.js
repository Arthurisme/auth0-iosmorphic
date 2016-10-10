import Processor from 'bs-expand-processor';
import DataQuery from 'dataQuery/DataQuery';
import Query from 'query/Query';
import AggregateQuery from 'query/AggregateQuery';
import constants from 'constants';

module.exports = (function () {
    return new Processor({
        executionNodeFunction: function (node, expandContext, done) {
            var targetTypeName = node.targetTypeName.toLowerCase() === constants.FilesTypeNameLegacy ? constants.FilesTypeName : node.targetTypeName;
            var query;
            if (node.aggregate) {
                query = new DataQuery({
                    operation: DataQuery.operations.Aggregate,
                    meta: {
                        collectionName: targetTypeName
                    },
                    query: new AggregateQuery(node.filter, node.select, node.sort, node.skip, node.take, null, node.aggregate)
                });
            } else {
                query = new DataQuery({
                    operation: DataQuery.operations.Read,
                    meta: {
                        collectionName: targetTypeName
                    },
                    query: new Query(node.filter, node.select, node.sort, node.skip, node.take)
                });
            }

            expandContext.offlineModule.processQuery(query).then(function (data) {
                done(null, data.result);
            }, done);
        }
    });
}());
