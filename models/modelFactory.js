/**
 * Created by gmeszaros on 3/3/2015.
 */
var entitySchemas = [];
module.exports = {
    registerSchema: function (schema) {
        if (entitySchemas.indexOf(schema) === -1) {
            entitySchemas.push(schema);
        }
        else {
            console.warn("The model is already registered, got " + schema.name);
        }
    },
    createObject: function (name, entityState, source) {
        var entitySchema = _getEntitySchema(name);
        if (!entitySchema.validate(source)) {
            console.error("Given source is invalid for model " + name, source);
        }
        return _createObject(entitySchema, entityState, source);
    }
};

function _createObject(schema, entityState, source) {
    var newObj = {
        __entityMetadata__: {
            entityState: entityState,
            schema: schema
        }
    };
    for (var prop in schema.definition) {
        newObj[prop] = source[prop];
    }
    return newObj;
}

function _getEntitySchema(name) {
    var baseModel = null;
    entitySchemas.forEach(function (model) {
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