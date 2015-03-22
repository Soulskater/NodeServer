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

var projectSchema = new schema("Project",
    [
        {
            name: "projectID",
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        {
            name: "name",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "description",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "gitHubUrl",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "gitHubIOUrl",
            isKeyField: false,
            isRequired: false,
            type: types.string
        },
        {
            name: "color",
            isKeyField: false,
            isRequired: true,
            type: types.string
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
        }
    ]);

factory.registerSchema(projectSchema);

module.exports = function projectContext() {

    var context = new dbContext();

    this.createProject = function (projectData) {
        return factory.createEntity("Project", entityState.new, projectData);
    };

    this.getProjects = function () {
        var deferred = q.defer();
        context.getObjects("Project")
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