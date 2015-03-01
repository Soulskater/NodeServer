/**
 * Created by MCG on 2015.03.01..
 */
module.exports = function schema(schemaObject) {

    this.validate = function (source) {

        for (var prop in schemaObject) {
            var type = schemaObject[prop];
            validateProperty(prop, type);
        }

        function validateProperty(propery, type) {

            var sourceProp = toUpperFirstLetter(propery);
            var propVal = source[sourceProp];
            if (propVal === undefined) {
                console.warn("Property mismatch, expected property " + sourceProp);
                return false;
            }

            function toUpperFirstLetter(text) {
                return text.charAt(0).toUpperCase() + text.substring(1);
            }

            var result = type(propVal);
            return result.isValid;
        }
    }
};