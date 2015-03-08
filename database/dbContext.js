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

    this.addObject = function (name, object) {
        var model = modelFactory.createObject(name, entityState.new, object);

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

    this.getObjects = function (schemaName, filters) {
        var entitySchema = modelFactory.getEntitySchema(schemaName);
        var script = scriptGenerator.createSelect(entitySchema, filters);

        _executeQuery(script).then(function (dbResultSet) {
            var entitySet = [];
            dbResultSet.forEach(function (dbResult) {
                var entitySource = _buildEntity(entitySchema, dbResult);
                entitySet.push(modelFactory.createObject(entitySchema.name, entityState.unchanged, entitySource));
            });
        });
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