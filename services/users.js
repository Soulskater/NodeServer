var express = require('express');
var router = express.Router();

/* SAMPLE GET */
router.get('/:name', function(req, res, next) {
    res.send('Hey ' + req.params.name + '!');
});

/* SAMPLE POST */
router.post('/post', function(req, res, next) {
    res.send('Sample post response');
});

module.exports = router;
