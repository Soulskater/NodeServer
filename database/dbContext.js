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

        var script = scriptGenerator.createInsert(model);
        _executeQuery(script).then(function (resultSet) {
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

    this.getObjects = function () {
        var query = {};
        query.where("User", function (user) {
            return user.userName === "gmeszaros" && user.password;
        });
        /*.prop("name")
         .equalsTo("gmeszaros")
         .and()
         .prop("password")
         .equalsTo("admin");*/
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
};