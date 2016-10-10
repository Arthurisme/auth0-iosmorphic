'use strict';
var RelationNode = require('./RelationNode');
var _ = require('underscore');
var Constants = require('./Constants');
var ExpandError = require('./ExpandError');

//var relationFieldPropertyName = Constants.RelationExpressionName;

var possibleExpandOptions = [
    Constants.ExpandExpressionName,
    Constants.ReturnAsFieldName,
    Constants.FieldsExpressionName,
    Constants.SingleFieldExpressionName,
    Constants.SortExpressionName,
    Constants.FilterExpressionName,
    Constants.SkipExpressionName,
    Constants.TakeExpressionName,
    Constants.ParentRelationFieldName,
    Constants.TargetTypeNameFieldName,
	Constants.ReturnItemsCountFieldName,
	Constants.AggregateExpressionFieldName
];


/**
 * A class used to parse Expand expression and build a corresponding relation tree.
 * In a process of creating the relation tree are performed several checks in order to force some limitations -
 * 50 items both for master and child queries and entire amount of all queries limited to 20.
 * Checks if the relation field given by the customer is valid (for example: user gives "Like" while the relation field is "Likes").
 * Checks for possible expand options.
 * @constructor
 */
var RelationTreeBuilder = function (expandExpression, mainTypeName, isArray, fieldsExpression, maxTakeValue, metadataProviderFunction, context) {
    this.maxTakeValue = maxTakeValue;
    this._metadataProviderFunction = metadataProviderFunction;
    this.context = context;
    this.expandExpression = this._processExpandExpression(expandExpression);
    // mark the main query in order to avoid some duplication issues.
    this.map = {};
    this.map[mainTypeName] = new RelationNode({
        targetTypeName: mainTypeName,
        isArrayRoot: isArray,
        fieldsExpression: fieldsExpression,
        validated: true,
        path: mainTypeName,
        maxTakeValue: maxTakeValue
    });
    this.map[mainTypeName].originalFieldsExpression = {};
    _.extend(this.map[mainTypeName].originalFieldsExpression, fieldsExpression);
    this.map.$root = mainTypeName;
};

/**
 * Creates fully qualified expand expression from shorthand usages:
 * {"Likes": true} -> {"Likes": {"ReturnAs": "Likes"}}
 * {"Likes": "LikesExpanded"} -> {"Likes": {"ReturnAs": "LikesExpanded"}}
 * @param expandExpression
 * @returns {*}
 */
RelationTreeBuilder.prototype._processExpandExpression = function (expandExpression) {
    for (var property in expandExpression) {
        if (expandExpression.hasOwnProperty(property)) {
            if (typeof expandExpression[property] === 'boolean') {
                expandExpression[property] = {};
                expandExpression[property][Constants.ReturnAsFieldName] = property;
            }
            if (typeof expandExpression[property] === 'string') {
                var relationField = expandExpression[property];
                expandExpression[property] = {};
                expandExpression[property][Constants.ReturnAsFieldName] = relationField;
            }
        }
    }
    return expandExpression;
};

/**
 * Builds the relation tree.
 * @param done
 */
RelationTreeBuilder.prototype.build = function (done) {
    try {
        this.buildMapInternal(this.expandExpression, this.map.$root);
    } catch (e) {
        return done(e);
    }
    var self = this;
    require('async').series([
        this.configureRelationTree.bind(this),
        this.validateRelationTree.bind(this)
    ], function (err) {
        done(err, self.map);
    });
};

/**
 * An internal method which parses the expand expression and produces a basic relation tree (only names and parent relations).
 * @param expandExpression - The expand expression which will be processed.
 * @param rootName - The name of the root relation (master query) usually the name of the requested content type (Activities).
 */
RelationTreeBuilder.prototype.buildMapInternal = function (expandExpression, rootName) {
    for (var relationName in expandExpression) {
        if (expandExpression.hasOwnProperty(relationName)) {
            var fieldExpression = expandExpression[relationName];
			
			//Check if all options in an expand field definition are recognized
            for (var option in fieldExpression) {
                if (fieldExpression.hasOwnProperty(option) && possibleExpandOptions.indexOf(option) === -1) {
                    throw new ExpandError('\"' + option + '\"' + ' is not a valid option for Expand expression');
                }
            }

            if (relationName.indexOf('.') > -1) { //If the relation is inverted
                var invertedRelation = RelationNode.createInverted(relationName, fieldExpression, rootName, this.maxTakeValue);
				
                this.map[invertedRelation.path] = invertedRelation;
                this.map[rootName].children.push(invertedRelation.path);
				
                // adds a field expression in the original fields expression in order to get the result for that field
                RelationTreeBuilder.addFieldToFieldsExpression(this.map[invertedRelation.parentPath].originalFieldsExpression, invertedRelation.userDefinedName);

                if (expandExpression[relationName][Constants.ExpandExpressionName]) {
                    var processedExpandExpression = this._processExpandExpression(expandExpression[relationName][Constants.ExpandExpressionName]);
                    this.buildMapInternal(processedExpandExpression, invertedRelation.path);
                }
            } else {
                var relationNode = RelationNode.createRegular(relationName, fieldExpression, rootName, this.maxTakeValue);
				
                this.map[relationNode.path] = relationNode;
                this.map[rootName].children.push(relationNode.path);

                if (fieldExpression.hasOwnProperty(Constants.ExpandExpressionName)) {
                    if (typeof(fieldExpression[Constants.ExpandExpressionName]) === 'object') {
                        this.buildMapInternal(this._processExpandExpression(fieldExpression.Expand), relationNode.path);
                    } else {
                        throw new ExpandError(relationNode.path + '.Expand must be a valid expand expression!');
                    }
                }
            }
        }
    }
};

/**
 * Adds additional metadata which is necessary to execute a query.
 * Name of the content type of the child relation get via relation field.
 * @param done
 */
RelationTreeBuilder.prototype.configureRelationTree = function (done) {
    if (this._metadataProviderFunction) {
        var relationNames = [];
        var self = this;

        for (var relationPath in this.map) {
            if (this.map.hasOwnProperty(relationPath)) {
                if (this.map[relationPath].parentPath !== null) {
                    relationNames.push(this.map[relationPath].relationField);
                }
            }
        }

        this._metadataProviderFunction(relationNames, this.map, this.context, function (err, result) {
            done(err);
        });
    } else {
        return done();
    }
};

/**
 * Performs several checks like:
 * Validity of the relation field.
 * To not use filter or sorting expression within a "GetByFilter" scenario.
 * Does not allow to nest (expand multiple relation field) after a multiple relation.
 * Does not allow to use both "Fields" and "SingleField" options.
 * @param done
 * @returns {*}
 */
RelationTreeBuilder.prototype.validateRelationTree = function (done) {
    var errorMessage = '';
    var EOL = '\r\n';
    for (var relationPath in this.map) {
        if (relationPath !== '$root' && this.map.hasOwnProperty(relationPath)) {
            var relation = this.map[relationPath];
            errorMessage += RelationTreeBuilder.validateSingleRelation(relation, this);
            this.configureFieldsExpressionsForRelation(relation);
        }
    }
    if (errorMessage !== '') {
        var finalErrorMessage = errorMessage.substr(0, errorMessage.lastIndexOf(EOL));
        var error = new ExpandError(finalErrorMessage);
        return done(error);
    } else {
        done();
    }
};

/**
 * Add relation fields to parent relation fields expression if needed (otherwise relation cannot be established).
 * @param relation - A relation which will be configured.
 */
RelationTreeBuilder.prototype.configureFieldsExpressionsForRelation = function (relation) {
    if (relation.parentPath) {
        var parentRelationFieldsExpression = this.map[relation.parentPath].fieldsExpression;
        if (relation.isInvertedRelation) {
            RelationTreeBuilder.addFieldToFieldsExpression(parentRelationFieldsExpression, relation.parentRelationField);
        } else {
            RelationTreeBuilder.addFieldToFieldsExpression(parentRelationFieldsExpression, relation.relationField);
        }
    }
    if (relation.isInvertedRelation) {
        RelationTreeBuilder.addFieldToFieldsExpression(relation.fieldsExpression, relation.relationField);
    } else {
        RelationTreeBuilder.addFieldToFieldsExpression(relation.fieldsExpression, Constants.IdFieldNameClient);
    }
    RelationTreeBuilder.adjustParentRelationFieldsExpression(this.map[relation.parentPath], relation);
};


/**
 * Validates a single relation for all build-in limitations.
 * @param relationNode - A relation which will be validated.
 * @param relationTree - The whole relation tree.
 * @returns {string} - Returns an error message with all errors or empty string if there is no errors.
 */
RelationTreeBuilder.validateSingleRelation = function (relationNode, relationTree) {
    var errorMessage = '';
	var relationTreeMap = relationTree.map;
	var rootRelationNode = relationTreeMap[relationTreeMap.$root];
    var EOL = '\r\n';
    var isGetByFilterQuery = rootRelationNode.isArrayRoot;

    if (relationNode.path === relationNode.parentPath) {
        errorMessage += relationNode.path + ' has same parent which will cause an infinite loop.' + EOL;
        return errorMessage;
    }

    if (relationNode.isArray()) {
        var multipleQueriesCount = RelationTreeBuilder._getParentMultipleRelationsCount(relationNode, relationTree);
        if (multipleQueriesCount > 0) {
            errorMessage += 'Expand expression has multiple relation \"' + relationNode.path + '\" inside a multiple relation.';
            errorMessage += EOL;
        }

        if (relationTreeMap[relationNode.parentPath] === rootRelationNode &&
            isGetByFilterQuery &&
            (relationNode.filterExpression || relationNode.sortExpression)) {
            errorMessage += 'Filter and Sort are not allowed when expanding multiple items.';
            errorMessage += EOL;
        }
		
		if (relationTreeMap[relationNode.parentPath] === rootRelationNode &&
            isGetByFilterQuery && relationNode.isInvertedRelation &&
            relationNode.skip) {
            errorMessage += 'Skip and Take are not supported when expanding multiple items with external relation.';
            errorMessage += EOL;
        }

        //if (isGetByFilterQuery && relationNode.isInvertedRelation) {
        //    errorMessage += 'Expanding an external content type is not allowed with GetByFilter scenario.';
        //    errorMessage += EOL;
        //}
    }
	
    if (!relationNode.targetTypeName) {
        errorMessage += 'Expanding relation \"' + relationNode.relationField + '\" has no target type name specified. You should use \"TargetTypeName\" to specify it.';
        errorMessage += EOL;
    }
	
    if (relationNode.fieldsExpression && Object.keys(relationNode.fieldsExpression).length && relationNode.singleFieldName) {
        errorMessage += relationNode.path + ' ';
        errorMessage += 'expand expression contains both \"Fields\" and \"SingleField\" expressions.';
        errorMessage += EOL;
    }
	
    if (relationNode.singleFieldName) {
        if (relationNode.children) {
            if (relationNode.children.length > 1) {
                errorMessage += relationNode.path + ' has multiple expand expressions with a single field option.' + EOL;
            }
            if (relationNode.children.length === 1 && relationTreeMap[relationNode.children[0]].relationField !== relationNode.singleFieldName) {
                errorMessage += 'Expand expression ' + relationNode.path;
                errorMessage += ' single field \"' + relationNode.singleFieldName + '\"';
                errorMessage += ' does not match child relation field \"' + relationTreeMap[relationNode.children[0]].relationField + '\".';
                errorMessage += EOL;
            }
        }
    }

    return errorMessage;
};

/**
 * Gets the count of parent multiple relations.
 * @param relation - Starting relation.
 * @returns {number} - count of all parent multiple relations
 */
RelationTreeBuilder._getParentMultipleRelationsCount = function (relationNode, relationTree) {
    var result = 0;
    var currentRelation = relationNode;
    while (currentRelation.parentPath) {
        var parentRelation = relationTree.map[currentRelation.parentPath];
        if (parentRelation.isArray() && parentRelation.parentPath) {
            result += 1;
        }
        currentRelation = parentRelation;
    }
    return result;
};



/**
 * Adjusts fields expression of the parent relation based on paging setting of a relation (skip, take).
 * In that case we put a "$slice" option within the parent relation fields expression.
 * @param parentRelation
 * @param relation
 */
RelationTreeBuilder.adjustParentRelationFieldsExpression = function (parentRelation, relation) {
    if (!relation.isInvertedRelation && relation.take && typeof relation.take === 'number') {
        // when relation has filter or sorting skip and take should not be transferred to the parent relation as $slice.
        var shouldTransferPagingToParentRelation = relation.isArray() && !relation.filterExpression && !relation.sortExpression && parentRelation;
        if (shouldTransferPagingToParentRelation) {
            if (parentRelation.fieldsExpression === undefined) {
                parentRelation.fieldsExpression = {};
            }

            if (relation.skip && typeof relation.skip === 'number') {
                parentRelation.fieldsExpression[relation.relationField] = {
                    '$slice': [relation.skip, relation.take]
                };
            } else {
                parentRelation.fieldsExpression[relation.relationField] = {
                    '$slice': relation.take
                };
            }
            relation.take = null;
            relation.skip = null;
            relation.movedSkipTakeAsSlice = true;
        }
    }
};

/**
 * Adds field to parent relation fields expression. For example if the relation field is excluded from the master request.
 * @param fieldsExpression - Fields expression of the parent relation.
 * @param relationField - Name of the field which should be returned.
 */
RelationTreeBuilder.addFieldToFieldsExpression = function (fieldsExpression, relationField) {
    if (fieldsExpression === undefined || Object.keys(fieldsExpression).length === 0) {
        return;
    }
    var isExclusive = RelationTreeBuilder.getIsFieldsExpressionExclusive(fieldsExpression);

    if (isExclusive === undefined) {
        return;
    }

    if (isExclusive) {
        delete fieldsExpression[relationField];
    } else {
        fieldsExpression[relationField] = 1;
    }
};

/**
 * Gets if the fields expression is exclusive ("FieldName" : 0)
 * @param fieldsExpression - Fields expression to check.
 * @returns {*}
 */
RelationTreeBuilder.getIsFieldsExpressionExclusive = function (fieldsExpression) {
    var isExclusive;
    for (var fieldName in fieldsExpression) {
        if (fieldName !== Constants.IdFieldNameClient && fieldsExpression.hasOwnProperty(fieldName)) {
            if (isExclusive === undefined) {
                if (fieldsExpression[fieldName] === 0) {
                    isExclusive = true;
                    break;
                } else {
                    if (typeof fieldsExpression[fieldName] === 'object') {
                        continue;
                    } else {
                        // fieldsExpression[fieldName] === 1
                        isExclusive = false;
                        break;
                    }
                }
            }
        }
    }
    return isExclusive;
};

module.exports = RelationTreeBuilder;
