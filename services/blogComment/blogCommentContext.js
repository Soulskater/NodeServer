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

var blogCommentSchema = new schema("BlogComment",
    [
        {
            name: "blogCommentID",
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        {
            name: "userID",
            isKeyField: false,
            isRequired: true,
            reference: {
                name: "User",
                referencedFieldName: "user"
            },
            type: types.number
        },
        {
            name: "comment",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "blogID",
            isKeyField: false,
            isRequired: true,
            reference: {
                name: "Blog",
                referencedFieldName: "blog"
            },
            type: types.number
        },
        {
            name: "created",
            isKeyField: false,
            isRequired: true,
            type: types.date
        }
    ]);

factory.registerSchema(blogCommentSchema);

module.exports = function blogCommentContext() {

    var context = new dbContext();

    this.createBlogComment = function (blogCommentData) {
        return factory.createEntity("BlogComment", entityState.new, blogCommentData);
    };

    this.getBlogComments = function (blogID) {
        var deferred = q.defer();
        context.getObjects("BlogComment", {blogID: blogID})
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