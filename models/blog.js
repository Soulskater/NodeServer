/**
 * Created by MCG on 2015.03.01..
 */
var object = {
    string: function (nullable) {
        return function (value) {
            console.assert(typeof value !== "string" || (nullable === false && !value), "Expected type is string, got " + value);
            return value;
        }
    }
}

module.exports = function (source) {

    function formatter(propery, type) {

        var sourceProp = toUpperFirstLetter(propery);
        var propVal = source[sourceProp];
        if (propVal === undefined) {
            console.warn("Property mismatch, expected property " + sourceProp);
        }

        function toUpperFirstLetter(text) {
            return text.charAt(0).toUpperCase() + text.substring(1);
        }

        return type(propVal);
    }

    return {
        title: formatter('title', object.string())
    }
};