/**
 * Created by MCG on 2015.03.01..
 */
var util = require('util');
var factory = require('../models/modelFactory');

module.exports = function schema(name, definition) {

    this.name = name;
    this.definition = definition;

    this.validate = function (object) {
        var isValid = true;
        this.definition.forEach(function (propertyDescriptor) {
            if (!validateProperty(propertyDescriptor, object)) {
                isValid = false;
                return;
            }
        });
        return isValid;

        function validateProperty(descriptor, object) {
            if (descriptor.isIdentity === true) {
                return true;
            }

            if (descriptor.reference) {
                return _validateReference(descriptor, object);
            }
            else {
                return _validateSimpleValue(descriptor, object);
            }

            function _validateReference(descriptor, object) {
                var referencedEntity = object[descriptor.reference.referencedFieldName];
                if (referencedEntity) {
                    var referenceSchema = factory.getEntitySchema(descriptor.reference.name);
                    return referenceSchema.validate(referencedEntity);
                    return true;
                }
                if (descriptor.isRequired) {
                    console.warn(util.format("Reference '%s' is required!", descriptor.reference.name));
                    return false
                }
                return true;
            }

            function _validateSimpleValue(descriptor, object) {
                var propVal = object[descriptor.name];

                if (propVal === undefined) {
                    console.warn(util.format("Property mismatch, expected '%s'", descriptor.name));
                    return false;
                }

                var result = descriptor.type(propVal, descriptor.isRequired);
                if (!result.isValid) {
                    console.error(util.format("Property '%s' is invalid, the reason: ", descriptor.name), result.value);
                }
                return result.isValid;
            }
        }
    };

    this.hasIdentityColumn = function () {
        var hasIdentityColumn = false;
        this.definition.forEach(function (property) {
            if (property.isIdentity === true) {
                hasIdentityColumn = true;
                return;
            }
        });
        return hasIdentityColumn;
    };

    this.getKeyFieldColumn = function () {
        var keyFieldColumn = {};
        this.definition.forEach(function (property) {
            if (property.isKeyField === true) {
                keyFieldColumn = property;
                return;
            }
        });
        return keyFieldColumn;
    };
};