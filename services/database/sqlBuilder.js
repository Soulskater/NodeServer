/**
 * Created by gmeszaros on 3/2/2015.
 */
var stringBuilder = require("stringbuilder");

module.exports = function () {
    this.createInsert = function (table, columns, values) {
        var commandText = new StringBuilder();
        commandText
            .append("insert into ")
            .append(table)
            .append(" ");

        if (columns.length > 0) {
            commandText
                .append("(")
                .append(columns.join(","))
                .append(")");
        }

        commandText
            .append(" values (")
            .append(_formatValues(values))
            .append(")");

        return commandText;

        function _formatValues(values) {
            var valuesText = new StringBuilder();
            values.forEach(function (value, index) {

                if (typeof value === "string") {
                    valuesText.append("'" + value + "'");
                }
                else {
                    valuesText.append(value);
                }
                if (index < values.length - 1) {
                    valuesText.append(",");
                }
            });
            return valuesText;
        }
    };
};