/**
 * Created by MCG on 2015.03.01..
 */
var express = require('express');
var router = express.Router();
var userService = require("../../services/user");

router.post('/', function (req, res) {
    userService.getUser(req.body.userName, req.body.password)
        .then(function (user) {
            if (user) {
                res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        })
        .catch(function (err) {
            console.warn(err);
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        });
});

module.exports = router;