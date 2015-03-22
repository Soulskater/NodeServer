/**
 * Created by MCG on 2015.03.01..
 */
var q = require('Q');
var util = require('util');
var schema = require("../../database/entitySchema");
var types = require('../../database/objectTypes');
var dbContext = require('../../database/dbContext');
var factory = require('./../../models/modelFactory');
var entityState = require('../../database/entityState');

var userSchema = new schema("User",
    [
        {
            name: "userID",
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        {
            name: "userName",
            isKeyField: false,
            isRequired: true,
            ignoreForClient: true,
            type: types.string
        },
        {
            name: "firstName",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "lastName",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "password",
            isKeyField: false,
            isRequired: true,
            ignoreForClient: true,
            type: types.string
        },
        {
            name: "token",
            isKeyField: false,
            isRequired: false,
            ignoreForClient: true,
            type: types.string
        },
        {
            name: "tokenExpiresIn",
            isKeyField: false,
            isRequired: true,
            ignoreForClient: true,
            type: types.date
        }
    ]);

factory.registerSchema(userSchema);

module.exports = function userContext() {

    var context = new dbContext();

    this.createUser = function (userData) {
        return factory.createEntity("User", entityState.new, userData);
    };

    this.getUser = function (userName, password) {
        var deferred = q.defer();
        context.getObjects("User", {userName: util.format("'%s'", userName), password: util.format("'%s'", password)})
            .then(function (resultSet) {
                if (resultSet.length == 0) {
                    var message = "The user with the given credentials does not exist in the database!(" + userName + "," + password + ")";
                    console.warn(message);
                    deferred.resolve(null);
                }
                else {
                    deferred.resolve(resultSet[0]);
                }
            })
            .fail(function (err) {
                deferred.reject(err);
                console.warn(err);
            });
        return deferred.promise;
    };

    this.getUserByToken = function (token) {
        var deferred = q.defer();
        context.getObjects("User", {token: util.format("'%s'", token)})
            .then(function (resultSet) {
                if (resultSet.length == 0) {
                    var message = "The user with the given token does not exist in the database!";
                    console.warn(message);
                    deferred.reject(message);
                }
                else {
                    deferred.resolve(resultSet[0]);
                }
            })
            .fail(function (err) {
                deferred.reject(err);
                console.warn(err);
            });
        return deferred.promise;
    };

    this.saveUser = function (userEntity) {
        return context.saveEntity(userEntity);
    };
};