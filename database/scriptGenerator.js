/**
 * Created by gmeszaros on 3/6/2015.
 */
var squel = require("squel");
var sqlKeywords = require('./reservedKeywords');
var util = require('util');

module.exports = {
    createInsert: function (model) {
        var query = squel.insert().into(_formatTableName(model.__entityMetadata__.schema.name));

        for (var modelProp in model) {
            if (!_ignoreProperty(modelProp, model.__entityMetadata__.schema.definition[modelProp])) {
                var objectVal = model[modelProp];
                query.set(modelProp, objectVal);
            }
        }
        var script = query.toString();
        script += "; SELECT SCOPE_IDENTITY() AS 'ObjectID';";
        return script;

        function _ignoreProperty(propName, descriptor) {
            return propName === "__entityMetadata__" || descriptor.isIdentity === true;
        }
    }
}

function _formatTableName(name) {
    if (sqlKeywords.indexOf(name.toUpperCase()) !== -1) {
        return util.format("dbo.[%s]", name);
    }
    return name;
}