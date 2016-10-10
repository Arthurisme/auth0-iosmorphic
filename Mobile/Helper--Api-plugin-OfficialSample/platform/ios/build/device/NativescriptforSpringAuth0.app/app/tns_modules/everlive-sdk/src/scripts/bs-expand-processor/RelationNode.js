'use strict';
var Constants = require('./Constants');
var _ = require('underscore');
var ExpandError = require('./ExpandError');

function RelationNode(options) {
    this.parentPath = options.parent;
    this.relationField = options.relationField;
    this.path = options.path || options.parent + '.' + options.relationField;
    this.fieldsExpression = options.fieldsExpression || {};
    this.targetTypeName = options.targetTypeName;
	//An array containing the paths(strings) of the child relations for this node
    this.children = [];
    this.isInvertedRelation = options.isInvertedRelation;
    this.isArrayRoot = options.isArrayRoot; //used for validation of cases where various expand features are disabled for a GetAll scenario.
    this.hasArrayValues = false;//set when we have executed the query. Used in validation scenarios where we do not have metadata about whether the relation is an array or not.

    var expandExpression = options.expandExpression || {};

    this.parentRelationField = expandExpression[Constants.ParentRelationFieldName] || Constants.IdFieldNameClient;
    var relationField = this.isInvertedRelation ? this.path : this.relationField; //inverted relations appear with the full path - ContentType.Field - in the result when expanding.
    this.userDefinedName = expandExpression[Constants.ReturnAsFieldName] || relationField;
    _.extend(this.fieldsExpression, expandExpression[Constants.FieldsExpressionName]);
    this.originalFieldsExpression = {};
    _.extend(this.originalFieldsExpression, this.fieldsExpression);
    this.singleFieldName = expandExpression[Constants.SingleFieldExpressionName];
    this.filterExpression = expandExpression[Constants.FilterExpressionName];
    this.sortExpression = expandExpression[Constants.SortExpressionName];
    this.skip = expandExpression[Constants.SkipExpressionName];
    this.take = this._getTakeLimit(expandExpression[Constants.TakeExpressionName], options.maxTakeValue);
	this.returnItemsCount = expandExpression[Constants.ReturnItemsCountFieldName];
	this.aggregateExpression = expandExpression[Constants.AggregateExpressionFieldName];
}


/**
 * Gets the take limit depending on the application and the take value that the user has provided.
 * @param clientTakeValue
 * @param maxTakeValue
 * @returns {number}
 */
RelationNode.prototype._getTakeLimit = function (clientTakeValue, maxTakeValue) {
    maxTakeValue = maxTakeValue || Constants.DefaultTakeItemsCount;
    if (clientTakeValue) {
        if (clientTakeValue > maxTakeValue) {
            throw new ExpandError('The maximum allowed take value when expanding relations is ' + maxTakeValue + '!');
        }
        return clientTakeValue;
    } else {
        return maxTakeValue;
    }
};

/**
 * Anyone using the bs-expand-processor module can set whether the relation is a multiple relation in the prepare phase.
 * This will allow for certain restrictions to be enforced directly on the prepare phase instead of the execution phase.
 */
RelationNode.prototype.setIsArrayFromMetadata = function () {
    this.isArrayFromMetadata = true;
};

RelationNode.prototype.isArray = function () {
    // We can find out if a relation is an array in the following cases:
    // From metadata in the API Server.
    // All inverted relations are array.
    // Once values have been received we can find out. This is used for scenarios where we do not have metadata about the relation (offline storage in SDK).
    return this.isArrayFromMetadata || this.isInvertedRelation || this.hasArrayValues;
};

/**
 * Creates a RelationNode object representing an external(inverted) relation.
 * @param relationPath - A path to the external relation field (example: "Comments.ActivityId")
 * @param expandExpression - The expand expression that contains all information about the relation
 * @param parentRelationPath - Name of the parent relation.
 * @returns {RelationNode}
 */
RelationNode.createInverted = function (relationPath, expandExpression, parentRelationPath, maxTakeValue) {
    var relationNameParts = relationPath.split('.');
	var targetTypeName = relationNameParts[0];
	var relationField = relationNameParts[1];
	
	return RelationNode._create(relationPath, targetTypeName, relationField, parentRelationPath, maxTakeValue, expandExpression, true);
};

/**
 * Creates a RelationNode object representing a regular relation.
 * @param relationField - The field to expand (example: "Likes")
 * @param expandExpression - The expand expression that contains all information about the relation
 * @param parentRelationPath - Name of the parent relation.
 * @returns {RelationNode}
 */
RelationNode.createRegular = function (relationField, expandExpression, parentRelationPath, maxTakeValue) {
    var options = {};
	
	var relationPath = parentRelationPath + '.' + relationField;
	var targetTypeName = expandExpression[Constants.TargetTypeNameFieldName];
	
	return RelationNode._create(relationPath, targetTypeName, relationField, parentRelationPath, maxTakeValue, expandExpression, false);
};

RelationNode._create = function(relationPath, targetTypeName, releationField, parentRelationPath, maxTakeValue, expandExpression, isInvertedRelation) {
	var options = {};
	
	options.parent = parentRelationPath;
    options.path = relationPath;
    options.maxTakeValue = maxTakeValue;
    options.validated = false;
	options.expandExpression = expandExpression;
	options.relationField = releationField;
	options.targetTypeName = targetTypeName;
    options.isInvertedRelation = isInvertedRelation;
	
    return new RelationNode(options);
};

module.exports = RelationNode;
