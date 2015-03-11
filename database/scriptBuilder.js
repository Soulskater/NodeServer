/**
 * Created by gmeszaros on 3/6/2015.
 */
var squel = require("squel");
var sqlKeywords = require('./reservedKeywords');
var util = require('util');
var factory = require('../models/modelFactory');
var entityState = require('./entityState');

var generator = {
    createInsert: function (model, isRoot) {
        var query = squel.insert().into(_formatTableName(model.__entityMetadata__.schema.name));
        var hasIdentity = model.__entityMetadata__.schema.hasIdentityColumn();
        var keyFieldDescriptor = model.__entityMetadata__.schema.getKeyFieldColumn();
        var sqlVarName = util.format('@%s', keyFieldDescriptor.name);
        var script = util.format("declare %s int;", sqlVarName);

        model.__entityMetadata__.schema.definition.forEach(function (propertyDescriptor) {
            var propertyValue = model[propertyDescriptor.name];

            if (propertyDescriptor.reference) {
                var referencedEntity = model[propertyDescriptor.reference.referencedFieldName];
                var referenceResult = generator.createInsert(referencedEntity);
                script += referenceResult.script;
                query.set(propertyDescriptor.name, referenceResult.idValue, {
                    dontQuote: true
                });
            }
            else {
                if (!_ignoreProperty(propertyDescriptor)) {
                    query.set(propertyDescriptor.name, propertyValue);
                }
            }
        });
        script += query.toString() + ";";
        if (isRoot) {
            script += "SELECT SCOPE_IDENTITY() AS 'ObjectID';";
        }
        else {
            script += util.format('set %s = SCOPE_IDENTITY();', sqlVarName);
        }
        return {
            script: script,
            idValue: hasIdentity ? sqlVarName : model[keyFieldDescriptor.name]
        };

        function _ignoreProperty(descriptor) {
            return descriptor.isIdentity === true;
        }
    },
    createUpdate: function (entity) {
        var query = squel.update().table(_formatTableName(entity.__entityMetadata__.schema.name));
        var keyFieldDescriptor = entity.__entityMetadata__.schema.getKeyFieldColumn();
        var script = "";

        entity.__entityMetadata__.schema.definition.forEach(function (propertyDescriptor) {
            var propertyValue = entity[propertyDescriptor.name];

            if (propertyDescriptor.reference) {
                var referencedEntity = entity[propertyDescriptor.reference.referencedFieldName];
                var referenceIdValue = null;
                if (referencedEntity.__entityMetadata__.entityState === entityState.new) {
                    var referenceResult = generator.createInsert(referencedEntity);
                    script += referenceResult.script;
                    referenceIdValue = referenceResult.idValue;
                }
                if (referencedEntity.__entityMetadata__.entityState === entityState.unchanged) {
                    var referenceResult = generator.createUpdate(referencedEntity);
                    script += referenceResult.script;
                    referenceIdValue = referenceResult.idValue;
                }

                query.set(propertyDescriptor.name, referenceIdValue, {
                    dontQuote: true
                });
            }
            else {
                if (!_ignoreProperty(propertyDescriptor)) {
                    query.set(propertyDescriptor.name, propertyValue);
                }
            }
        });
        script += query.toString() + ";";

        return {
            script: script,
            idValue: entity[keyFieldDescriptor.name]
        };

        function _ignoreProperty(descriptor) {
            return descriptor.isIdentity === true;
        }
    },
    createSelect: function (entitySchema, filterObject) {
        var tableName = _formatTableName(entitySchema.name);
        filterObject = filterObject || {};
        var query = squel.select().from(tableName);

        var fields = _getAllFields(entitySchema, []);

        fields.forEach(function (field) {
            query.field(field.fieldName, field.alias);
        });

        entitySchema.definition.forEach(function (propertyDescriptor) {

            if (propertyDescriptor.reference) {
                var referenceSchema = factory.getEntitySchema(propertyDescriptor.reference.name);
                var referencedTableName = _formatTableName(referenceSchema.name);
                var keyField = util.format("%s.%s", tableName, propertyDescriptor.name);
                var referencedField = util.format("%s.%s", referencedTableName, referenceSchema.getKeyFieldColumn().name);
                query.left_join(propertyDescriptor.reference.name, null, util.format("%s=%s", keyField, referencedField));
            }
        });

        for (var filterName in filterObject) {
            query.where(util.format("%s=%s", filterName, filterObject[filterName]));
        }

        return query.toString();

        function _getAllFields(entitySchema, fields) {
            var tableName = _formatTableName(entitySchema.name);
            entitySchema.definition.forEach(function (propertyDescriptor) {
                if (propertyDescriptor.reference) {
                    var referenceSchema = factory.getEntitySchema(propertyDescriptor.reference.name);
                    fields = fields.concat(_getAllFields(referenceSchema, fields));
                }
                else {
                    fields.push({
                        fieldName: util.format("%s.%s", tableName, propertyDescriptor.name),
                        alias: util.format("%s.%s", entitySchema.name, propertyDescriptor.name)
                    });
                }
            });
            return fields;
        }
    },
    createDelete: function (entity) {
        if (!entity.__entityMetadata__ || entity.__entityMetadata__.entityState === entityState.new ||
            entity.__entityMetadata__.entityState === entityState.deleted) {
            return;
        }
        var tableName = _formatTableName(entity.__entityMetadata__.schema.name);
        var keyFieldDescriptor = entity.__entityMetadata__.schema.getKeyFieldColumn();
        var query = squel.delete().from(tableName)
            .where(util.format("%s=%s", keyFieldDescriptor.name, entity[keyFieldDescriptor.name]));

        return query.toString();
    }
};

module.exports = generator;

function _formatTableName(name) {
    if (sqlKeywords.indexOf(name.toUpperCase()) !== -1) {
        return util.format("dbo.[%s]", name);
    }
    return name;
}