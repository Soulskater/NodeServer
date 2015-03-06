/**
 * Created by MCG on 2015.03.01..
 */
var util = require('util');

module.exports = function schema(name, definition) {

    this.name = name;
    this.definition = definition;

    this.validate = function (object) {
        var isValid = true;
        for (var prop in definition) {
            var propertyDescriptor = definition[prop];
            if (!validateProperty(prop, propertyDescriptor, object)) {
                isValid = false;
                break;
            }
        }
        return isValid;

        function validateProperty(propertyName, descriptor, object) {
            if (descriptor.isIdentity === true) {
                return true;
            }
            var sourceProp = toLowerFirstLetter(propertyName);
            var propVal = object[sourceProp];
            if (propVal === undefined) {
                console.warn(util.format("Property mismatch, expected '%s'", sourceProp));
                return false;
            }

            function toLowerFirstLetter(text) {
                return text.charAt(0).toLowerCase() + text.substring(1);
            }

            var result = descriptor.type(propVal, descriptor.isRequired);
            if (!result.isValid) {
                console.error(util.format("Property '%s' is invalid, the reason: ", sourceProp), result.value);
            }
            return result.isValid;
        }
    }
};