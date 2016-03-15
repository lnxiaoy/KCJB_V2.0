var express = require('express');
var router = express.Router();
var redis = require('../dao/redis_client');
var User = require('../models/user');
var Error = require('../errors');

/* GET users listing. */
router.get('/', function(req, res, next) {
    redis.hkeys('__gift',function(err,reply) {
	if (!reply) {
	    res.json([]);
	    return;
	}
	var s = [];
	reply.forEach(function (x) {
	    redis.hget('__gift',x,function(err,c) {
		s.push({name : x, score : c});
	    });
	});
	res.json(s);
	return;
    });
});


router.post('/:name',function(req,res,next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    if (!req.body.score) {
	res.json(Error.BAD_PARAMETER);
	return;
    }

    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	if (doc.group !== 100) {
	    res.json(Error.NO_PERMISSION);
	    return;
	}
	redis.hset('__gift',req.params.name,req.body.score,function (err,reply) {
	});
    });


});


module.exports = router;
