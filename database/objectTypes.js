/**
 * Created by MCG on 2015.03.01..
 */

module.exports = {
    string: function (nullable) {
        return function (value) {
            if (nullable !== false && (typeof value !== "string")) {
                return {
                    isValid: false,
                    nullable: nullable,
                    value: "Expected type is string, got " + value
                };
            }
            return {
                isValid: true,
                nullable: nullable,
                value: value
            };
        }
    },
    number: function (nullable) {
        return function (value) {
            if (nullable !== false && (typeof value !== "number")) {
                return {
                    isValid: false,
                    nullable: nullable,
                    value: "Expected type is number, got " + value
                };
            }
            return {
                isValid: true,
                nullable: nullable,
                value: value
            };
        }
    }
};