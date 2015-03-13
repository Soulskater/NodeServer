/**
 * Created by MCG on 2015.03.01..
 */

var moment = require('moment');

module.exports = {
    string: function (value, nullable) {
        if (nullable !== false && (typeof value !== "string")) {
            return {
                isValid: false,
                value: "Expected type is string, got " + value
            };
        }
        return {
            isValid: true,
            value: value
        };
    },
    number: function (value, nullable) {
        if (nullable !== false && (typeof value !== "number")) {
            return {
                isValid: false,
                value: "Expected type is number, got " + value
            };
        }
        return {
            isValid: true,
            value: value
        };
    },
    date: function (value, nullable) {
        if (nullable !== false && !moment(value).isValid) {
            return {
                isValid: false,
                value: "Expected type is number, got " + value
            };
        }
        return {
            isValid: true,
            value: moment(value).toDate()
        };
    }
};