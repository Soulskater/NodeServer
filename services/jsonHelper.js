/**
 * Created by MCG on 2015.03.21..
 */
var jsonHelper = {
    serializeEntity: function (entity) {
        var jsonObject = {};
        entity.__entityMetadata__.schema.definition.forEach(function (propertyDescriptor) {
            if (!propertyDescriptor.ignoreForClient) {
                if (propertyDescriptor.reference) {
                    jsonObject[propertyDescriptor.reference.referencedFieldName] = jsonHelper.serializeEntity(entity[propertyDescriptor.reference.referencedFieldName]);
                }
                else {
                    jsonObject[propertyDescriptor.name] = entity[propertyDescriptor.name];
                }
            }
        });

        return jsonObject;
    },
    serializeEntitySet: function (entitySet) {
        var jsonResultSet = [];
        entitySet.forEach(function (entity) {
            jsonResultSet.push(jsonHelper.serializeEntity(entity));
        });
        return jsonResultSet;
    }
};

module.exports = jsonHelper;