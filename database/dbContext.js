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
var scriptGenerator = require('./scriptGenerator');

module.exports = function () {

    var dbConfig = extend({
        options: {
            encrypt: true // Use this if you're on Windows Azure
        }
    }, appConfig.dbConnection);

    this.addEntity = function (name, object) {
        var model = modelFactory.createEntity(name, entityState.new, object);

        var result = scriptGenerator.createInsert(model, true);
        _executeQuery(result.script).then(function (resultSet) {
            var identityRecord = resultSet[0];
            if (identityRecord) {
                console.dir(identityRecord.ObjectID);
                return identityRecord.ObjectID;
            }
            else {
                return null;
            }
        });
    };

    this.updateEntity = function (entity) {
        var result = scriptGenerator.createUpdate(entity);
        _executeQuery(result.script).then(function (result) {
            console.dir(result);
        });
    };

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

    function _buildEntity(entitySchema, dbResult) {
        var entity = {};
        entitySchema.definition.forEach(function (propertyDescriptor) {
            if (propertyDescriptor.reference) {
                var referencedSchema = modelFactory.getEntitySchema(propertyDescriptor.reference.name);
                var referencedObject = _buildEntity(referencedSchema, dbResult);
                entity[propertyDescriptor.reference.referencedFieldName] = referencedObject;
            }
            else {
                var fieldName = util.format("%s.%s", entitySchema.name, propertyDescriptor.name);
                entity[propertyDescriptor.name] = dbResult[fieldName];
            }
        });
        return entity;
    }
};