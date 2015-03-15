/**
 * Created by MCG on 2015.03.01..
 */
var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var userContext = require("../../models/userContext");

router.get('/', _authorizeUser, function (req, res) {
    var context = new userContext();
    context.getUserByToken(req.token)
        .then(function (user) {
            var timeoutSeconds = 1200;
            var currentDate = new Date();
            if ((currentDate - user.lastTokenCreated) / 1000 > timeoutSeconds) {
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

function _authorizeUser(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

router.post('/authenticate', function (req, res) {
    var context = new userContext();
    context.getUser(req.body.userName, req.body.password)
        .then(function (user) {
            if (user) {
                user.token = jwt.sign(user, (new Date()).toString());
                user.lastTokenCreated = new Date();
                context.saveUser(user);
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
                    password: req.body.password,
                    lastTokenCreated: new Date()
                });
                userEntity.token = jwt.sign(userEntity, (userEntity.lastTokenCreated).toString());

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