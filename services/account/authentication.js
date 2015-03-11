/**
 * Created by MCG on 2015.03.01..
 */
var express = require('express');
var router = express.Router();
var userContext = require("../../models/userContext");

router.get('/', function (req, res) {
    var context = new userContext();
    context.getUserByToken(req.token)
        .then(function (user) {
            res.json({
                type: true,
                data: user
            });
        })
        .fail(function (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        });
});

router.post('/authenticate', function (req, res) {
    var context = new userContext();
    context.getUser(req.body.userName, req.body.password)
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

router.post('/signin', function (req, res) {
    var context = new userContext();
    context.getUser(req.body.userName, req.body.password)
        .then(function (user) {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userEntity = context.createUser({
                    userName: req.body.userName,
                    password: req.body.password
                });
                userEntity.token = jwt.sign(user, "micimackó");
                context.saveEntity(userEntity)
                    .then(function () {
                        res.json({
                            type: true,
                            userName: userEntity.userName,
                            token: userEntity.token
                        });
                    });
            }
        })
        .fail(function (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        });
});

module.exports = router;