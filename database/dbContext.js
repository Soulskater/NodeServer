/**
 * Created by MCG on 2015.03.01..
 */
var q = require('Q');
var util = require('util');
var appConfig = require('../config/app.config');
var modelFactory = require("../models/modelFactory");
var sql = require('mssql');
var entityState = require('./entityState');
var extend = require('node.extend');
var scriptGenerator = require('./scriptBuilder');

module.exports = function () {

    var dbConfig = extend({
        options: {
            encrypt: true // Use this if you're on Windows Azure
        }
    }, appConfig.dbConnection);

    this.deleteEntity = function (entity) {
        var deferred = q.defer();
        var script = scriptGenerator.createDelete(entity);

        _executeQuery(script)
            .then(function (result) {
                entity.__entityMetadata__.entityState = entityState.deleted;
                deferred.resolve(result);
            })
            .fail(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.saveEntity = function (entity) {
        if (entity.__entityMetadata__.entityState === entityState.new) {
            return _addEntity(entity);
        }
        else {
            if (entity.__entityMetadata__.entityState !== entityState.deleted) {
                return _updateEntity(entity);
            }
        }
    };

    this.getObjects = function (schemaName, filters) {
        var deferred = q.defer();
        var entitySchema = modelFactory.getEntitySchema(schemaName);
        var script = scriptGenerator.createSelect(entitySchema, filters);

        _executeQuery(script)
            .then(function (dbResultSet) {
                var entitySet = [];
                dbResultSet.forEach(function (dbResult) {
                    var entitySource = _buildEntity(entitySchema, dbResult);
                    entitySet.push(modelFactory.createEntity(entitySchema.name, entityState.unchanged, entitySource));
                });
                deferred.resolve(entitySet);
            })
            .fail(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    function _addEntity(entity) {
        var deferred = q.defer();
        var result = scriptGenerator.createInsert(entity, true);
        _executeQuery(result.script)
            .then(function (resultSet) {
                var identityRecord = resultSet[0];
                if (identityRecord) {
                    deferred.resolve(identityRecord.ObjectID);
                }
                else {
                    deferred.resolve();
                }
            })
            .fail(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    function _updateEntity(entity) {
        var result = scriptGenerator.createUpdate(entity);
        return _executeQuery(result.script);
    };

    function _executeQuery(commandText) {
        var deferred = q.defer();
        var connection = new sql.Connection(dbConfig, function (err) {
            if (err) {
                console.warn(err);
                deferred.reject(err);
            }

            var request = new sql.Request(connection);
            request.query(commandText, function (err, resultSet) {
                if (err) {
                    console.warn(err);
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(resultSet);
                }
            });
        });
        return deferred.promise;
    }

    function _buildEntity(entitySchema, dbResult, referenceSchemaName, referenceFieldName) {
        var entity = {};
        entitySchema.definition.forEach(function (propertyDescriptor) {
            if (propertyDescriptor.reference) {
                var referencedSchema = modelFactory.getEntitySchema(propertyDescriptor.reference.name);
                var referencedObject = _buildEntity(referencedSchema, dbResult, entitySchema.name, propertyDescriptor.reference.referencedFieldName);
                entity[propertyDescriptor.reference.referencedFieldName] = referencedObject;
            }
            else {
                var fieldName = "";
                if (referenceSchemaName) {
                    fieldName = util.format("%s.%s.%s", referenceSchemaName, referenceFieldName, propertyDescriptor.name);
                }
                else {
                    fieldName = util.format("%s.%s", entitySchema.name, propertyDescriptor.name);
                }
                entity[propertyDescriptor.name] = dbResult[fieldName];
            }
        });
        return entity;
    }
};