'use strict';
var Constants = require('./Constants');

/**
 * A class that is used to get all required information in order to process a set of relations.
 * @param parent - An ExecutionNode instance used to supply the tree like data structure.
 * @param relationNode - The relation node used to created the ExecutionNode instance (ExecutionNode instance should contain one or many relations
 * if they can be combined for batch execution).
 * @constructor
 */
var ExecutionNode = function (parentNode, relationNode) {
    var parentPath = '';
    if (parentNode) {
        parentPath = parentNode.path;
    }
    this.parent = parentPath;
    this.relations = [relationNode.path];
    this.name = relationNode.path;
    this.targetTypeName = relationNode.targetTypeName;
    this.canAddOtherRelations = !relationNode.filterExpression && !relationNode.sortExpression && !relationNode.aggregateExpression && !relationNode.take && !relationNode.skip;
    this.children = [];
    var path = '';
    if (parentPath) {
        path += parentPath + '.';
    }
    path += relationNode.targetTypeName;
    this.path = path;
};

/**
 * Inserts a RelationNode to an ExecutionNode.
 * @param relation - A RelationNode instance.
 */
ExecutionNode.prototype._insertRelationNode = function (relation) {
    this.relations.push(relation.path);
};

/**
 * Inserts a child node (which relations) depends from parent node result.
 * @param child - ExecutionNode instance representing child node.
 */
ExecutionNode.prototype._insertChildNode = function (child) {
    this.children.push(child.name);
};

/**
 * Helper method that checks if some relations could be combined (for example have same TargetType).
 * @param relation
 * @returns {boolean}
 */
ExecutionNode.prototype.canCombineWithRelation = function (relation) {
    if (!this.canAddOtherRelations) {
        return false;
    }

    return this.targetTypeName === relation.targetTypeName && !relation.filterExpression && !relation.sortExpression && !relation.aggregateExpression && !relation.take && !relation.skip;
};

/** ExecutionTree
 * Class that allows the creation of an execution tree from a RelationTree object. Used to process all queries (master and child) in a correct order.
 * @param relationTree - An instance of RelationTree.
 * @constructor
 */
var ExecutionTree = function (relationTree) {
    this._relationTree = relationTree;
    this._map = {};
};

/**
 * Adds execution node to the ExecutionTree.
 * @param executionNode
 */
ExecutionTree.prototype.addExecutionNode = function (executionNode) {
    this._map[executionNode.name] = executionNode;
};

/**
 * Finds the ExecutionNode which contains the requested relation.
 * @param relation - A Relation instance.
 * @returns {*}
 */
ExecutionTree.prototype.getExecutionNodeOfRelation = function (relation) {
    for (var execNode in this._map) {
        if (this._map.hasOwnProperty(execNode)) {
            if (this._map[execNode].relations.indexOf(relation) > -1) {
                return this._map[execNode];
            }
        }
    }
    return null;
};

ExecutionTree.prototype.getRelationTree = function () {
	return this._relationTree;
};

/**
 * Finds a RelationNode within the RelationTree.
 * @param relationNodePath - String that represents the relation within the RelationTree (for example: Activities.Likes.Role).
 * @returns {*}
 */
ExecutionTree.prototype.getRelationNode = function (relationNodePath) {
    if (relationNodePath) {
        return this._relationTree.map[relationNodePath] || null;
    } else {
        return null;
    }
};

ExecutionTree.prototype.getRootRelationNode = function () {
    return this._relationTree.map[this._relationTree.map.$root] || null;
};

ExecutionTree.prototype.getRootNode = function () {
	var executionTreeMap = this._map;
    var executionTreeRoot = null;
    for (var exNode in executionTreeMap) {
        if (executionTreeMap.hasOwnProperty(exNode)) {
            if (executionTreeMap[exNode].parent === '') {
                executionTreeRoot = executionTreeMap[exNode];
                break;
            }
        }
    }
    return executionTreeRoot;
};

ExecutionTree.prototype.getNode = function (nodeName) {
	return this._map[nodeName];
};

/**
 * Builds the ExecutionTree from a RelationTree.
 */
ExecutionTree.prototype.build = function () {
    //build beginning from the root
    var relationRoot = this.getRelationNode(this._relationTree.map.$root);
    //Setup the root of the execution tree.
    var rootExecutionNode = new ExecutionNode(null, relationRoot);//no parent node
    this.addExecutionNode(rootExecutionNode);
    this.buildInternal(relationRoot);
};

/**
 * Traverse the relation tree and build the execution tree.
 * @param relationRoot - The root node of the RelationTree.
 */
ExecutionTree.prototype.buildInternal = function (relationRoot) {
    relationRoot.children.forEach(function (child) {
        var childRelationNode = this.getRelationNode(child);
        this.insertRelationNodeInExecutionTree(childRelationNode);
        this.buildInternal(childRelationNode);
    }, this);
};

/**
 * Inserts a relation node within the execution tree (based on its dependencies).
 * @param relation - The relation that will be inserted.
 */
ExecutionTree.prototype.insertRelationNodeInExecutionTree = function (relation) {
    var rootExecutionNode = this.getExecutionNodeOfRelation(relation.parentPath);
    var childToCombine = this.tryGetChildNodeToCombine(rootExecutionNode, relation);
    if (childToCombine) {//if there is a child that we combine the relation
        childToCombine._insertRelationNode(relation);
    } else {
        var newExecutionNode = new ExecutionNode(rootExecutionNode, relation);//create a separate execution node that will host the relation
        rootExecutionNode._insertChildNode(newExecutionNode);
        this.addExecutionNode(newExecutionNode);
    }
};

/**
 * Tries to find an ExecutionNode which could be combined with a relation.
 * @param rootExecutionNode - The root node of the ExecutionTree.
 * @param relation - Relation that will be added to the ExecutionTree.
 * @returns {*}
 */
ExecutionTree.prototype.tryGetChildNodeToCombine = function (rootExecutionNode, relation) {
    if (rootExecutionNode.canCombineWithRelation(relation)) {
        return rootExecutionNode;
    }
    var children = rootExecutionNode.children;
    for (var i = 0; i < children.length; i++) {
        var child = this._map[children[i]];
        var childToCombine = this.tryGetChildNodeToCombine(child, relation);
        if (childToCombine) {
            return childToCombine;
        }
    }
    return null;
};

/**
 * Gets the filter expression from all relations inside an ExecutionNode.
 * @param executionNode - The ExecutionNode instance.
 * @returns {{}}
 */
ExecutionTree.prototype.getFilterFromExecutionNode = function (executionNode, includeArrays) {
    var filter = {};
    var subRelationsFilter = [];
    for (var i = 0; i < executionNode.relations.length; i++) {
        var innerFilter = this.getFilterFromSingleRelation(this._relationTree.map[executionNode.relations[i]], includeArrays);
        if (innerFilter) {
            subRelationsFilter.push(innerFilter);
        }
    }

    if (subRelationsFilter.length > 1) {
        filter.$or = subRelationsFilter;
    } else if (subRelationsFilter.length > 0) {
        filter = subRelationsFilter[0];
    } else {
        filter = null;
    }
    return filter;
};



/**
 * Gets filter expression from a single relation. Traverse the relation tree in order to get the "Id"s from the result of parent relation
 * along with user defined filters.
 * @param relation - A Relation instance.
 * @returns {*}
 */
ExecutionTree.prototype.getFilterFromSingleRelation = function (relation, includeArrays) {
    var userDefinedFilter = relation.filterExpression;
    var parentRelationFilter = {};
    var parentRelationIds = this.getRelationFieldValues(relation, includeArrays);
    var parentRelationFieldName = (relation.isInvertedRelation ? relation.relationField : Constants.IdFieldNameClient);

    if (parentRelationIds.length > 0) {
        parentRelationFilter[parentRelationFieldName] = {'$in': parentRelationIds};
    } else {
        return null;
    }

    if (userDefinedFilter !== undefined) {
        var filters = [];
        filters.push(parentRelationFilter);
        filters.push(userDefinedFilter);
        return {'$and': filters};
    } else {
        return parentRelationFilter;
    }
};

/**
 * Get relation field values of parent relation in order to construct a proper filter (to create a relation).
 * @param relation - A RelationNode instance which will get the filter.
 * @param includeArrays - Whether to include array values of the parent items when calculating the items that will be expanded on the current level.
 * @returns {Array} - An array of relation field values.
 */
ExecutionTree.prototype.getRelationFieldValues = function (relation, includeArrays) {
    var parentRelationIds = [];
    var parentRelation = this._relationTree.map[relation.parentPath];
    // parentRelationResult actually is an Activity or Array of Activities
    var parentRelationResult = Array.isArray(parentRelation.result) ? parentRelation.result : [parentRelation.result];
    if (relation.isInvertedRelation) {
        for (var p = 0; p < parentRelationResult.length; p++) {
            parentRelationIds.push(parentRelationResult[p][relation.parentRelationField]);
        }
    } else {
        // all comments are related to expand of type content type Activities expand: {"Likes": true}
        if (parentRelation && parentRelation.result) {
            relation.parentRelationIds = relation.parentRelationIds || {};
            for (var i = 0; i < parentRelationResult.length; i++) {
                // itemFromParentRelation is single Activity
                var itemFromParentRelation = parentRelationResult[i];

                // parentRelationFieldValue is Activity.Likes
                var parentRelationFieldValue = itemFromParentRelation[relation.relationField];
                if (Array.isArray(parentRelationFieldValue)) {
                    relation.hasArrayValues = true;
                    if (includeArrays) {
                        for (var j = 0; j < parentRelationFieldValue.length; j++) {
                            // itemToExpandId is current value in Activity.Likes array or just a single "Id"
                            var itemToExpandId = parentRelationFieldValue[j];
                            if(itemToExpandId !== undefined && itemToExpandId !== null) {
                                parentRelationIds.push(itemToExpandId);
                                // we set any value just to create a map of Ids
                                relation.parentRelationIds[itemToExpandId] = 1;
                            }
                        }
                    }
                } else {
                    if(parentRelationFieldValue !== undefined && parentRelationFieldValue !== null) {
                        parentRelationIds.push(parentRelationFieldValue);
                        relation.parentRelationIds[parentRelationFieldValue] = 1;
                    }
                }
            }
        }
    }

    return parentRelationIds;
};

module.exports = ExecutionTree;
