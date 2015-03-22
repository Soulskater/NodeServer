/**
 * Created by MCG on 2015.03.21..
 */
var express = require('express');
var router = express.Router();
var jsonHelper = require('../../services/jsonHelper');
var authorize = require('../../services/authorize');
var projectContext = require("../../services/project/projectContext");

router.get('/', authorize, function (req, res) {
    var context = new projectContext();
    context.getProjects()
        .then(function (projects) {
            res.json(jsonHelper.serializeEntitySet(projects));
        })
        .fail(function (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        });
});

module.exports = router;