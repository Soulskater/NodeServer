/**
 * Created by MCG on 2015.03.01..
 */
var q = require('Q');
var util = require('util');
var appConfig = require('../config/app.config');
var squel = require("squel");
var modelFactory = require("../models/modelFactory");
var sql = require('mssql');
var extend = require('node.extend');
var sqlKeywords = require('./reservedKeywords');


module.exports = function () {

    var dbConfig = extend({
        options: {
            encrypt: true // Use this if you're on Windows Azure
        }
    }, appConfig.dbConnection);

    this.addObject = function (object) {
        var model = modelFactory.createModel(object);

        var query = squel.insert().into(_formatTableName(object.__entityType__));

        for (var modelProp in model) {
            var objectVal = model[modelProp];
            query.set(modelProp, objectVal);
        }
        var script = query.toString();
        _executeQuery(script);
    };

    this.getObjects = function (filterObject) {

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

    function _formatTableName(name) {
        if (sqlKeywords.indexOf(name.toUpperCase()) !== -1) {
            return util.format("dbo.[%s]", name);
        }
        return name;
    }
};