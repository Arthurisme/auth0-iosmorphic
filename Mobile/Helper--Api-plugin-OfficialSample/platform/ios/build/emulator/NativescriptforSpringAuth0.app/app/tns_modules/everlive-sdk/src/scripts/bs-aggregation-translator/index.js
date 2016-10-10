'use strict';

var AggregationTranslator = {};

function getFieldAggregation(aggregationDefinition) {
    var result;

    if (aggregationDefinition.hasOwnProperty('count')) {
        result = {'$sum': 1};
    } else if (aggregationDefinition.min) {
        result = {'$min': '$' + aggregationDefinition.min};
    } else if (aggregationDefinition.max) {
        result = {'$max': '$' + aggregationDefinition.max};
    } else if (aggregationDefinition.avg) {
        result = {'$avg': '$' + aggregationDefinition.avg};
    } else if (aggregationDefinition.sum) {
        result = {'$sum': '$' + aggregationDefinition.sum};
    } else {
        throw new Error('The aggregating function was not recognized or is not supported: ' + JSON.stringify(aggregationDefinition));
    }

    return result;
};

function addGroupingField(fieldName, _idObject, $project) {
    //Add the field in the _id object
    _idObject[fieldName] = '$' + fieldName;

    //Add projection so that the result contains the actual field e.g. is { fieldName: fieldValue } instead of { _id: { fieldName: fieldValue } }
    $project[fieldName] = '$_id.' + fieldName;
}


/*
 * aggregateDefinition = {
 *		Filter: object|null,
 *		GroupBy: string|array|null,
 *		Aggregate: object|null
 * }
 */
AggregationTranslator.translate = function (aggregateDefinition, options) {
    var $match;     //$match clause for the pipeline
    var $group;     //$group clause for the pipeline
    var $project;   //$project clause for the pipeline

    options = options || {};

    //Process the filter
    if (aggregateDefinition.Filter) {
        $match = aggregateDefinition.Filter;
    }

    //Process the GroupBy clause
    var _id;	//The required _id clause in the Mongo $group clause
    var groupByDefinition = aggregateDefinition.GroupBy;
    if (groupByDefinition) {
        //Mongo returns all the values of the grouping fields in an _id field, but we use projection to put the values of grouping fields on first level, thus we do not want the _id
        $project = {_id: 0};

        _id = {};
        if (Array.isArray(groupByDefinition)) {
            //The GroupBy value is an array of fields to group by
            var groupingFields = groupByDefinition;

            //Process each grouping field
            for (var i = 0; i < groupingFields.length; i++) {
                var groupingField = groupingFields[i];
                addGroupingField(groupingField, _id, $project);
            }
        } else {
            //TODO: check if the value is string, and if not - throw error

            //The GroupBy value is the name of the field to group by
            var groupingField = groupByDefinition;

            //Process the grouping field
            addGroupingField(groupingField, _id, $project);
        }
    } else {
        //No GroupBy clause, meaning we apply the aggregation to the whole resultset
        _id = null;

        //Adjust the $project definition so that the '_id' returned by Mongo is not included in the result.
        $project = {_id: 0};
    }
    $group = {'_id': _id};

    //Process the Aggregate clause
    var aggregateDefinition = aggregateDefinition.Aggregate;
    if (aggregateDefinition) {
        for (var outputFieldName in aggregateDefinition) {
            if (aggregateDefinition.hasOwnProperty(outputFieldName)) {
                var fieldAggregation = aggregateDefinition[outputFieldName];

                //Add the field aggregation to the Mongo $group clause
                $group[outputFieldName] = getFieldAggregation(fieldAggregation);

                //Add the field to the projection, so that it is included in the result
                $project[outputFieldName] = 1;
            }
        }
    }

    //Construct the pipeline
    var pipeline = [];

    if ($match) pipeline.push({$match: $match});

    if (options.maxDocumentsCount) {
        pipeline.push({$limit: options.maxDocumentsCount});
    }

    if ($group) pipeline.push({$group: $group});

    if ($project) pipeline.push({$project: $project});

    return pipeline;
};

module.exports = AggregationTranslator;