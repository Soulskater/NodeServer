/**
 * Created by MCG on 2015.03.01..
 */
var schema = require("../database/schema");
var types = require('../database/objectTypes');
var factory = require('./modelFactory');

var userSchema = new schema("User",
    {
        userID: {
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        userName: {
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        password: {
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        token: {
            isKeyField: false,
            isRequired: true,
            type: types.string
        }
    });
factory.registerSchema(userSchema);