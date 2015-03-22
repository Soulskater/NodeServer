/**
 * Created by MCG on 2015.03.01..
 */
var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var authorize = require('../../services/authorize');
var jsonHelper = require('../../services/jsonHelper');
var userContext = require("../../services/user/userContext");

router.get('/', authorize, function (req, res) {
    var context = new userContext();
    context.getUserByToken(req.token)
        .then(function (user) {
            var currentDate = new Date();
            if (currentDate - user.tokenExpiresIn <= 0) {
                res.sendStatus(403);
            }
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
                user.token = jwt.sign(user, (new Date()).toString());
                user.tokenExpiresIn = new Date();
                user.tokenExpiresIn.setMinutes(user.tokenExpiresIn.getMinutes() + 30);
                context.saveUser(user);
                res.json({
                    type: true,
                    token: user.token,
                    tokenExpiresIn: user.tokenExpiresIn,
                    data: jsonHelper.serializeEntity(user)
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
                var expireDate = new Date();
                expireDate.setMinutes(expireDate.getMinutes() + 30);
                var userEntity = context.createUser({
                    userName: req.body.userName,
                    password: req.body.password,
                    tokenExpiresIn: expireDate
                });
                userEntity.token = jwt.sign(userEntity, (userEntity.tokenExpiresIn).toString());

                context.saveUser(userEntity)
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