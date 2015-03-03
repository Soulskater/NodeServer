/**
 * Created by MCG on 2015.03.01..
 */
var schema = require("../database/schema");
var types = require('../database/objectTypes');
var factory = require('./modelFactory');

var userSchema = new schema({
    userID: {
        isKeyField: true,
        type: types.number()
    },
    userName:{
        isKeyField: false,
        type: types.string()
    },
    password: {
        isKeyField: false,
        type: types.string()
    },
    token: {
        isKeyField: false,
        type: types.string()
    }
});
factory.registerModel("User", userSchema);