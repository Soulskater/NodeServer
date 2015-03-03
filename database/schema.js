/**
 * Created by MCG on 2015.03.01..
 */
var util = require('util');

module.exports = function schema(schemaObject) {

    this.schemaDefinition = schemaObject;

    this.validate = function (source) {
        var isValid = true;
        for (var prop in schemaObject) {
            var propertyDescriptor = schemaObject[prop];
            if (!validateProperty(prop, propertyDescriptor.type)) {
                isValid = false;
                break;
            }
        }
        return isValid;

        function validateProperty(propertyName, type) {

            var sourceProp = toLowerFirstLetter(propertyName);
            var propVal = source[sourceProp];
            if (propVal === undefined) {
                console.warn(util.format("Property mismatch, expected '%s'", sourceProp));
                return false;
            }

            function toLowerFirstLetter(text) {
                return text.charAt(0).toLowerCase() + text.substring(1);
            }

            var result = type(propVal);
            if(!result.isValid){
                console.warn(result.value);
            }
            return result.isValid;
        }
    }
};