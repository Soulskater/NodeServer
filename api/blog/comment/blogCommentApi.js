/**
 * Created by MCG on 2015.03.21..
 */
var express = require('express');
var router = express.Router();
var jsonHelper = require('../../../services/jsonHelper');
var authorize = require('../../../services/authorize');
var blogCommentContext = require("../../../services/blogComment/blogCommentContext");

router.get('/:blogID', function (req, res) {
    var context = new blogCommentContext();
    context.getBlogComments(req.params.blogID)
        .then(function (blogComments) {
            res.json(jsonHelper.serializeEntitySet(blogComments));
        })
        .fail(function (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        });
});

module.exports = router;
