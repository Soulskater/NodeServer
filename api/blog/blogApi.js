/**
 * Created by MCG on 2015.03.21..
 */
var express = require('express');
var router = express.Router();
var jsonHelper = require('../../services/jsonHelper');
var authorize = require('../../services/authorize');
var blogContext = require("../../services/blog/blogContext");

router.get('/', function (req, res) {
    var context = new blogContext();
    context.getBlogs()
        .then(function (blogs) {
            res.json(jsonHelper.serializeEntitySet(blogs));
        })
        .fail(function (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        });
});

module.exports = router;