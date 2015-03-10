/**
 * Created by MCG on 2015.03.01..
 */
var schema = require("../database/entitySchema");
var types = require('../database/objectTypes');
var factory = require('./modelFactory');

var userSchema = new entitySchema("User",
    [
        {
            name: "userID",
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        {
            name: "userName",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "password",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "token",
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        {
            name: "blogID",
            isKeyField: false,
            isRequired: true,
            reference: {
                name: "Blog",
                referencedFieldName: "blog"
            },
            type: types.number
        }
    ]);

var blogSchema = new entitySchema("Blog",
    [
        {
            name: "blogID",
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        {
            name: "name",
            isKeyField: false,
            isRequired: true,
            type: types.string
        }
    ]);

factory.registerSchema(userSchema);
factory.registerSchema(blogSchema);