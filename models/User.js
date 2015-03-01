/**
 * Created by MCG on 2015.03.01..
 */


module.exports = function (source) {

    return {
        userID: formatter('userID', object.number()),
        userName: formatter('userName', object.string()),
        password: formatter('password', object.string()),
        token: formatter('token', object.string())
    }

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
};