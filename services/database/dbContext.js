/**
 * Created by MCG on 2015.03.01..
 */
var q = require('Q');
var appConfig = require('../../config/app.config.js');
var types = require('../objectTypes');

module.exports = function () {

    var models = [];

    this.addObject = function (name, object) {
        var schema = _getSchema(name);
        var columns = [];
        var values = [];
        for (var schemaProp in schema) {
            var propertyType = schema[schemaProp];
            var objectVal = object[schemaProp];

            if (!propertyType.isNullable && typeof objectVal === 'undefined') {
                console.error("Failed to add object, the property " + schemaProp + " is not nullable!");
            }
            else {
                columns.push(schemaProp);
                values.push(objectVal);
            }
        }

    };

    this.registerModel = function (name, schema) {
        var model = {
            name: name,
            schema: schema
        };
        if (models.indexOf(model) === -1) {
            models.push(model);
        }
        else {
            console.warn("The database model is already registered, got " + name);
        }
    }

    function _getSchema(name) {
        var schema = null;
        models.forEach(function (model) {
            if (model.name = name) {
                schema = model;
                return;
            }
        });
        if (!schema) {
            console.error("The model with name " + name + "is not registered!");
        }
        return schema;
    }
};