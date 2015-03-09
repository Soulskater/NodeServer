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
    createEntity: function (name, entityState, source) {
        var entitySchema = _getEntitySchema(name);
        if (!entitySchema.validate(source)) {
            throw new Error("Given source is invalid for model " + name, source);
            console.error("Given source is invalid for model " + name, source);
        }
        return _createObject(entitySchema, entityState, source);
    },
    getEntitySchema: _getEntitySchema
};

function _createObject(schema, entityState, source) {
    var newObj = {
        __entityMetadata__: {
            entityState: entityState,
            schema: schema
        }
    };
    schema.definition.forEach(function (propertyDescriptor) {
        if (propertyDescriptor.reference) {
            var referenceSchema = _getEntitySchema(propertyDescriptor.reference.name);
            newObj[propertyDescriptor.reference.referencedFieldName] = _createObject(referenceSchema, entityState, source[propertyDescriptor.reference.referencedFieldName]);
        } else {
            newObj[propertyDescriptor.name] = source[propertyDescriptor.name];
        }
    });
    return newObj;
}

function _getEntitySchema(name) {
    var baseModel = null;
    entitySchemas.forEach(function (model) {
        if (model.name === name) {
            baseModel = model;
            return;
        }
    });
    if (!baseModel) {
        var errorMsg = util.format("The model with name %s is not registered!", name);
        throw new Error(errorMsg);
        console.error(errorMsg);
    }
    return baseModel;
}