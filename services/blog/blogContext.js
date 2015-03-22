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

var blogSchema = new schema("Blog",
    [
        {
            name: "blogID",
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        {
            name: "title",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "content",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "created",
            isKeyField: false,
            isRequired: true,
            type: types.date
        },
        {
            name: "userID",
            isKeyField: false,
            isRequired: true,
            reference:{
                name: "User",
                referencedFieldName: "user"
            },
            type: types.number
        }
    ]);

factory.registerSchema(blogSchema);

module.exports = function blogContext() {

    var context = new dbContext();

    this.createBlog = function (blogData) {
        return factory.createEntity("Blog", entityState.new, blogData);
    };

    this.getBlogs = function () {
        var deferred = q.defer();
        context.getObjects("Blog")
            .then(function (resultSet) {
                deferred.resolve(resultSet);
            })
            .fail(function (err) {
                deferred.reject(err);
                console.warn(err);
            });
        return deferred.promise;
    };
};