var express = require('express');
var sql = require('mssql');
var extend = require('node.extend');
var q = require('Q');
var appConfig = require('../../config/app.config.js');
var userModelFormatter = require('../../models/userContext');

module.exports = {

    saveUser: function (userName, password) {
        var deferred = q.defer();
        var connection = new sql.Connection(dbConfig, function (err) {
            if (err) {
                console.warn(err);
                deferred.reject(err);
            }

            var request = new sql.Request(connection);
            request.query("select top 1 * from dbo.[User] where username='" + userName + "' and password='" + password + "'", function (err, resultSet) {
                if (err) {
                    console.warn(err);
                    deferred.reject(err);
                }
                else {
                    if (resultSet.length == 0) {
                        var token = jwt.sign({
                            userName: userName,
                            password: password
                        }, appConfig.jwtPrivateKey);

                        request.query("insert into dbo.[User] (username,password,token) values('" + userName + "','" + password + "','" + token + "'", function (err, resultSet) {
                            if (err) {
                                console.warn(err);
                                deferred.reject(err);
                            }
                            deferred.resolve("OK");
                        });
                    }
                    else {
                        console.warn("The user with the given credentials already exist in the database!(" + userName + "," + password + ")");
                        deferred.resolve(userModelFormatter(resultSet[0]));
                    }
                }
            });
        });
    }
};
