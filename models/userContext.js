/**
 * Created by MCG on 2015.03.01..
 */
var schema = require("../database/entitySchema");
var types = require('../database/objectTypes');
var dbContext = require('../database/entityState');
var factory = require('./modelFactory');
var entityState = require('../database/entityState');

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
            type: types.string
        },
        {
            name: "password",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "token",
            isKeyField: false,
            isRequired: false,
            type: types.string
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
        context.getObjects("User", {userName: userName, password: password})
            .then(function (resultSet) {
                if (resultSet.length == 0) {
                    console.warn("The user with the given credentials does not exist in the database!(" + userName + "," + password + ")");
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
        context.getObjects("User", { token: token })
            .then(function (resultSet) {
                if (resultSet.length == 0) {
                    console.warn("The user with the given token does not exist in the database!");
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

    this.saveUser = function (userEntity) {
        context.saveUser(userEntity);
    };
};