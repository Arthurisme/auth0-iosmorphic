'use strict';
var async = require('async');
var RelationTreeBuilder = require('./RelationTreeBuilder');
var ExecutionTree = require('./ExecutionTree');
var Constants = require('./Constants');
var ExpandError = require('./ExpandError');

function Processor(options) {
    this._executionNodeFunction = options.executionNodeFunction;
    this._metadataProviderFunction = options.metadataProviderFunction;
}

Processor.prototype._createExecuteNodeExecutor = function (relationsTree, executionTree, executionNode, expandContext) {
    var self = this;
    return function (done) {
        var relationNode = executionTree.getRelationNode(executionNode.relations[0]);//get the relation node for the only relation of the execution node.
        var parentRelationNode = executionTree.getRelationNode(relationNode.parentPath);
        var includeArrays = !(parentRelationNode.parentPath && parentRelationNode.hasArrayValues); //only expand array fields if the parent relation is not an array. This means that if we have expanded a Likes (multiple to Users), we won't expand any array relations that are nested in it such as the UserComments (multiple relation to Comments).
        var filter = executionTree.getFilterFromExecutionNode(executionNode, includeArrays);

        var errorMessage = RelationTreeBuilder.validateSingleRelation(relationNode);
        if (errorMessage) {
            return done(new ExpandError(errorMessage));
        }

        // if we have such options executionNode should have only one relation.
        var node = {};
        node.select = relationNode.fieldsExpression;
        node.sort = relationNode.sortExpression;
        node.skip = relationNode.skip;
        node.take = relationNode.take;
        node.filter = filter;
        node.targetTypeName = relationNode.targetTypeName;
		node.returnItemsCount = relationNode.returnItemsCount;
		node.aggregate = relationNode.aggregateExpression;

        self._executionNodeFunction.call(null, node, expandContext, function onProcessExecutionNode(err, result) {
            if (err) {
                return done(err);
            }
			
			var childRelationNode;

            for (var i = 0; i < executionNode.relations.length; i++) {
                childRelationNode = executionTree.getRelationNode(executionNode.relations[i]);
                childRelationNode.result = self._extractResultForRelation(childRelationNode, result);
            }
            executionNode.result = childRelationNode.result;
			
            var arr = [];
            for (var j = 0; j < executionNode.children.length; j++) {
                var executionTreeMap = executionTree._map;
                arr.push(self._createExecuteNodeExecutor(relationsTree, executionTree, executionTreeMap[executionNode.children[j]], expandContext));
            }
            async.parallel(arr, done);
        });
    };
};

Processor.prototype._getSingleResult = function (relationsTree, relation, singleObject, singleObjectIndex) {
    if (!singleObject) {
        return null;
    }

    var childRelation;
    var childItem;

    // if relation has singleFieldName option we just replace the parent id with a single value
    if (relation.singleFieldName) {
        if (relation.children && relation.children.length > 0) {
            childRelation = relationsTree[relation.children[0]];
            childItem = this._getObjectByIdFromArray(childRelation.result, singleObject[relation.singleFieldName]);
            return this._getSingleResult(relationsTree, childRelation, childItem, 0);
        }
        return singleObject[relation.singleFieldName];
    }

    var result = {};
    var passedProperties = {};

    if (relation.children && relation.children.length > 0) {
        for (var j = 0; j < relation.children.length; j++) {
            childRelation = relationsTree[relation.children[j]];
            var childRelationField = childRelation.relationField;
            var userDefinedRelName = childRelation.userDefinedName;
            if (!childRelation.isInvertedRelation && childRelationField === userDefinedRelName) {
                passedProperties[childRelationField] = 1;
            }

            var innerRelationResult = childRelation.result;

            if (childRelation.isInvertedRelation) {
				if (childRelation.aggregateExpression) {
					result[userDefinedRelName] = innerRelationResult[singleObjectIndex];
				} else if (childRelation.returnItemsCount) {
					result[userDefinedRelName] = innerRelationResult;
				} else {
					for (var k = 0; k < innerRelationResult.length; k++) {
						var singleResult = this._getSingleResult(relationsTree, childRelation, innerRelationResult[k], k);
						if (singleResult) {
							result[userDefinedRelName] = result[userDefinedRelName] || [];
							if (Array.isArray(relation.result)) {
								//Insert the related items in their proper place in the parent item
								if (singleResult[childRelation.relationField] === singleObject.Id) {
									result[userDefinedRelName].push(singleResult);
								}
							} else {
								result[userDefinedRelName].push(singleResult);
							}
						}
					}
				}
            } else {
                result[userDefinedRelName] = childRelation.isArray() ? [] : null;

                if (singleObject[childRelationField]) {
                    if (Array.isArray(singleObject[childRelationField])) {
						if (childRelation.aggregateExpression) {
							result[userDefinedRelName] = innerRelationResult[singleObjectIndex];
                        } else if (childRelation.sortExpression) {
                            // if there is a sorting we replace items using order of the query result
                            for (var p = 0; p < innerRelationResult.length; p++) {
                                if (singleObject[childRelationField].indexOf(innerRelationResult[p].Id) > -1) {
                                    childItem = innerRelationResult[p];
                                    this._addSingleResultToParentArray(relationsTree, childRelation, childItem, result, userDefinedRelName);
                                }
                            }
                        } else {
							// we just replace items getting them by id which we have
							for (var i = 0; i < singleObject[childRelationField].length; i++) {
								childItem = this._getObjectByIdFromArray(innerRelationResult, singleObject[childRelationField][i]);
								this._addSingleResultToParentArray(relationsTree, childRelation, childItem, result, userDefinedRelName);
							}
                        }
                    } else {
                        childItem = this._getObjectByIdFromArray(innerRelationResult, singleObject[childRelationField]);
                        result[userDefinedRelName] = this._getSingleResult(relationsTree, childRelation, childItem, 0);
                    }
                }
            }
        }
    }

    // add all other fields to the result (except the relation fields which we have already replaced).
    for (var prop in singleObject) {
		if (singleObject.hasOwnProperty(prop)) {
			var propertyShouldBeAddedToResult = !passedProperties[prop] && this._fieldExistInFieldsExpression(prop, relation.originalFieldsExpression);
			if (propertyShouldBeAddedToResult) {
				result[prop] = singleObject[prop];
			}
		}
    }

    return result;
};

Processor.prototype._addSingleResultToParentArray = function (relationsTree, childRelation, childItem, result, userDefinedRelName) {
    var singleResult = this._getSingleResult(relationsTree, childRelation, childItem, 0);
    result[userDefinedRelName] = result[userDefinedRelName] || [];
    if (singleResult) {
        result[userDefinedRelName].push(singleResult);
    }
};

/**
 * Checks if a field will be returned via given fields expression.
 * @param field - The name of the field.
 * @param fieldsExpression - The Fields expression which is checked.
 * @returns {*}
 */
Processor.prototype._fieldExistInFieldsExpression = function (field, fieldsExpression) {
    if (fieldsExpression === undefined || Object.keys(fieldsExpression).length === 0) {
        return true;
    }

    if (field === Constants.IdFieldNameClient) {
        if (fieldsExpression[field] === undefined) {
            return true;
        }
        return fieldsExpression[field];
    }

    var isExclusive = RelationTreeBuilder.getIsFieldsExpressionExclusive(fieldsExpression);

    if (isExclusive === undefined) {
        return true;
    }

    if (isExclusive) {
        return !fieldsExpression.hasOwnProperty(field);
    } else {
        return fieldsExpression.hasOwnProperty(field);
    }
};

/**
 * Extracts the result for a single relation (in cases when ExecutionNode contains more than one relations).
 * @param relation - The relation object.
 * @param queryResult - Result of the combined query.
 * @returns {Array}
 */
Processor.prototype._extractResultForRelation = function (relation, queryResult) {
	if (relation.returnItemsCount || relation.aggregateExpression) {
		return queryResult;
	} else {
		var result = [];
		for (var i = 0; i < queryResult.length; i++) {
			if (relation.parentRelationIds) {
				if (relation.parentRelationIds.hasOwnProperty(queryResult[i].Id)) {
					result.push(queryResult[i]);
				}
			}
			if (relation.isInvertedRelation) {
				result.push(queryResult[i]);
			}
		}
		return result;
	}
};

/**
 * Gets an object with a given Id from Array.
 * @param array
 * @param id
 * @returns {*}
 */
Processor.prototype._getObjectByIdFromArray = function (array, id) {
    if (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].Id === id) {
                return array[i];
            }
        }
    }
    return null;
};

/**
 * @public
 * @param expandExpression
 * @param mainTypeName
 * @param isArray
 * @param fieldsExpression
 * @param maxTakeValue
 * @param prepareContext
 * @param done
 */
Processor.prototype.prepare = function (expandExpression, mainTypeName, isArray, fieldsExpression, maxTakeValue, prepareContext, done) {
    var rtb = new RelationTreeBuilder(expandExpression, mainTypeName, isArray, fieldsExpression, maxTakeValue, this._metadataProviderFunction, prepareContext);
    rtb.build(function (err, map) {
        var mainQueryFieldsExpression;
        if (map) {
            mainQueryFieldsExpression = map[map.$root].fieldsExpression;
            var prepareResult = {
                relationsTree: rtb,
                mainQueryFieldsExpression: mainQueryFieldsExpression
            }
        }
        done(err, prepareResult);
    });
};

/**
 * @public
 * @param relationsTree
 * @param mainQueryResult
 * @param expandContext
 * @param done
 */
Processor.prototype.expand = function (relationsTree, mainQueryResult, expandContext, done) {
    var relationsTreeMap = relationsTree.map;
    var self = this;
	
	//Build the execution tree
    var executionTree = new ExecutionTree(relationsTree);
    executionTree.build();
    relationsTreeMap[relationsTreeMap.$root].result = mainQueryResult;
	
    var executionTreeMap = executionTree._map;
    var rootExecutionNode = executionTree.getRootNode();
    if (!rootExecutionNode) return;

	//Get a list of execute definitions(queries) to execute against the DB
	var executionList = this._getExecutionList(executionTree, rootExecutionNode, expandContext);
	
	//Check for the max queries limit
    var maxQueriesCount = 25;
    if (executionList.length > maxQueriesCount) {
        done(new ExpandError('Expand expression results in more than ' + maxQueriesCount + ' inner queries!'));
    }
	
	//Execute them in series, since the result of the parent relation is used to get correct filter.
	async.forEachSeries(
		executionList,
		function(executeDefinition, callback) {
			var executeOptions = executeDefinition.executeOptions;
			var relationNode = executeDefinition.relationNode;
			
			//Adjust the filter for the execute definition, as it sometimes uses the result of the parent relation, which is only available after execution
			self._adjustFilterForExecuteDefinition(executionTree, executeDefinition);
			
			//Apply the restrictions for expand
			var errorMessage = RelationTreeBuilder.validateSingleRelation(relationNode, relationsTree);
			if (errorMessage) {
				return callback(new ExpandError(errorMessage));
			}
			
			//Execute the query and set the result
			self._executionNodeFunction.call(null, executeOptions, expandContext, function onProcessExecutionNode(err, result) {
				if (err) {
					return callback(err);
				}
				
				var relationResult;
				
				if (executeDefinition.dataItem) {
					relationResult = self._extractResultForRelation(relationNode, result);
					if (!relationNode.result) relationNode.result = [];
					relationNode.result.push(relationResult);
				} else {
					var executionNode = executeDefinition.executionNode;
					var childRelationNode;
					for (var i = 0; i < executionNode.relations.length; i++) {
						childRelationNode = executionTree.getRelationNode(executionNode.relations[i]);
						childRelationNode.result = self._extractResultForRelation(childRelationNode, result);
					}
					executionNode.result = childRelationNode.result;
				}
				
				callback();
			});
		},
		function onProcessExecutionTree(err) {
			if (err) {
				done(err);
			} else {
				var output;
				var rootRelation = relationsTreeMap[relationsTreeMap.$root];
				if (Array.isArray(mainQueryResult)) {
					output = [];
					for (var i = 0; i < mainQueryResult.length; i++) {
						var singleResult = self._getSingleResult(relationsTreeMap, rootRelation, mainQueryResult[i], i);
						if (singleResult) {
							output.push(singleResult);
						}
					}
				} else {
					output = self._getSingleResult(relationsTreeMap, rootRelation, mainQueryResult, 0);
				}
				done(null, output);
			}
		}
	);
};

Processor.prototype._getExecutionList = function(executionTree, executionNode, expandContext) {
    var self = this;
	
	var relationTree = executionTree.getRelationTree();
	var relationNode = executionTree.getRelationNode(executionNode.name);
	var relationResult = relationNode.result;
	
	var executeDefinitions = [];
	for (var i = 0; i < executionNode.children.length; i++) {
		var executeDefinition;
		
		var childNodeName = executionNode.children[i];
		var childExecutionNode = executionTree.getNode(childNodeName);
		var childRelationNode = executionTree.getRelationNode(childNodeName);
		if (childRelationNode.aggregateExpression) {
			var relationResult = relationResult;
			if (!Array.isArray(relationResult)) relationResult = [ relationResult ];
			
			for (var j = 0; j < relationResult.length; j++) {
				executeDefinition = this._getExecuteDefinitionForItem(relationResult[j], childRelationNode, relationTree, expandContext);
				executeDefinitions.push(executeDefinition);
			}
		} else {
			executeDefinition = this._getExecuteDefinitionForNode(executionTree, childExecutionNode, expandContext);
			executeDefinitions.push(executeDefinition);
		}
		
		var childFunctions = this._getExecutionList(executionTree, childExecutionNode, expandContext);
		executeDefinitions = executeDefinitions.concat(childFunctions);
	}
	
	return executeDefinitions;
};

//Adjusts the filter for the query
Processor.prototype._adjustFilterForExecuteDefinition = function (executionTree, executeDefinition) {
	var filter;
	
	var relationNode = executeDefinition.relationNode;
	
	if (executeDefinition.dataItem) {
		filter = this._getFilterFromSingleItem(executeDefinition.dataItem, relationNode);
	} else {
		var executionNode = executeDefinition.executionNode;
		var parentRelationNode = executionTree.getRelationNode(relationNode.parentPath);
		var includeArrays = !(parentRelationNode.parentPath && parentRelationNode.hasArrayValues); //only expand array fields if the parent relation is not an array. This means that if we have expanded a Likes (multiple to Users), we won't expand any array relations that are nested in it such as the UserComments (multiple relation to Comments).
		filter = executionTree.getFilterFromExecutionNode(executionNode, includeArrays);
	}

	executeDefinition.executeOptions.filter = filter;
};

Processor.prototype._getExecuteDefinitionForItem = function (dataItem, relationNode, relationTree, expandContext) {
	//Create ExecuteOptions object
	var executeOptions = {};
	executeOptions.select = relationNode.fieldsExpression;
	executeOptions.sort = relationNode.sortExpression;
	executeOptions.skip = relationNode.skip;
	executeOptions.take = relationNode.take;
	executeOptions.targetTypeName = relationNode.targetTypeName;
	executeOptions.returnItemsCount = relationNode.returnItemsCount;
	executeOptions.aggregate = relationNode.aggregateExpression;

	return {
		executeOptions: executeOptions,
		relationNode: relationNode,
		dataItem: dataItem
	};
};

Processor.prototype._getExecuteDefinitionForNode = function (executionTree, executionNode, expandContext) {
	//get the relation node for the only relation of the execution node.
	var relationNode = executionTree.getRelationNode(executionNode.relations[0]);

	// if we have such options executionNode should have only one relation.
	var executeOptions = {};
	executeOptions.select = relationNode.fieldsExpression;
	executeOptions.sort = relationNode.sortExpression;
	executeOptions.skip = relationNode.skip;
	executeOptions.take = relationNode.take;
	executeOptions.targetTypeName = relationNode.targetTypeName;
	executeOptions.returnItemsCount = relationNode.returnItemsCount;
	executeOptions.aggregate = relationNode.aggregateExpression;

	return {
		executeOptions: executeOptions,
		relationNode: relationNode,
		executionNode: executionNode
	};
};

/**
 * Gets filter expression from a single item for certain relation.
 * along with user defined filters.
 * @param dataItem - The dataItem to get filter for.
 * @param relationNode - A RelationNode instance.
 * @returns {*}
 */
Processor.prototype._getFilterFromSingleItem = function (dataItem, relationNode) {
	var userDefinedFilter = relationNode.filterExpression;
	var itemFilter;
		
	var relationFieldName = relationNode.relationField;
	
	if (relationNode.isInvertedRelation) {
		itemFilter = {};
		itemFilter[relationNode.relationField] = dataItem.Id;
	} else {
		var relationData = dataItem[relationFieldName];
		if (relationData) {
			if (Array.isArray(relationData)) {
				itemFilter = { "Id": { "$in": relationData } };
			} else {
				itemFilter = { "Id": relationData };
			}
		} else {
			//TODO
			//Here we must stop the query, as there are no related items
		}
	}
		
	if (itemFilter && userDefinedFilter) {
		return { '$and': [itemFilter, userDefinedFilter] };
	} else if (itemFilter) {
		return itemFilter;
	} else if (userDefinedFilter) {
		return userDefinedFilter;
	} else {
		return null;
	}
};

Processor.Constants = Constants;

module.exports = Processor;
