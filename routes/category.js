var express = require('express');
var router = express.Router();

var category = require('../models/category');

/* GET users listing. */
router.get('/', function(req, res, next) {
    category(function(c) {res.json(c)});
    return;
});

module.exports = router;
