/**
 * Created by gmeszaros on 3/3/2015.
 */
var models = [];
module.exports = {
    registerModel: function (name, schema) {
        var model = {
            name: name,
            schema: schema
        };
        if (models.indexOf(model) === -1) {
            models.push(model);
        }
        else {
            console.warn("The model is already registered, got " + name);
        }
    },
    createModel: function (name, source) {
        var model = _getBaseModel(name);
        if (!model.schema.validate(source)) {
            console.error("Given source is invalid for model " + name, source);
        }
        return _createObject(name, model.schema.schemaDefinition, source);
    }
};

function _createObject(name, schemaDefinition, source) {
    var newObj = {
        __entityType__: name
    };
    for (var prop in schemaDefinition) {
        newObj[prop] = source[prop];
    }
    return newObj;
}

function _getBaseModel(name) {
    var baseModel = null;
    models.forEach(function (model) {
        if (model.name = name) {
            baseModel = model;
            return;
        }
    });
    if (!baseModel) {
        console.error("The model with name " + name + "is not registered!");
    }
    return baseModel;
}