var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var User = require('../models/user');
var Error = require('../errors');
var redis = require('../dao/redis_client');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log('all cat');
    Product.find({},'-_id name category in_price out_price factor',
	    function(err,doc) {
		if (!doc) {
		    res.json([]);
		    return;
		}
		res.json(doc);
	    });
});

router.get('/:category', function(req,res,next) {
    console.log('cat');
    Product.find({category : req.params.category},
	    '-_id name category in_price out_price factor',
	    function(err,doc) {
		if (!doc) {
		    res.json([]);
		    return;
		}
		res.json(doc);
	    });
});

router.get('/:category/:name',function(req,res,next) {
    console.log('product');
    Product.findOne({
	name : req.params.name,
	category : req.params.category,
    },
	    '-_id name category in_price out_price factor',
	    function(err,doc) {
		if (!doc) {
		    res.json([]);
		    return;
		}
		res.json(doc);
	    });
});

var redis_record = function(c,n) {
    redis.sadd('__category', c,function(err,reply) {
	redis.sadd(c,n,function(e2, r2) {
	});
    });
}

router.post('/:category/:name',function(req,res,next) {

    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    } 

    User.findById(req.session.token, function(err,doc) {

	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	} 

	if (doc.group !== 100) {
	    res.json(Error.NO_PERMISION);
	    return;
	}

	redis_record(req.params.category, req.params.name);
	Product.findOne({
	    name : req.params.name,
	    category : req.params.category,
	}, function(err,doc) {
	    if (!doc) {
		doc = new Product({
		    name : req.params.name,
		    category : req.params.category
		});
	    }

	    if (req.body.in_price) doc.in_price = req.body.in_price;
	    if (req.body.out_price) doc.out_price = req.body.out_price;
	    if (req.body.facter) doc.factor_price = req.body.facter;

	    doc.save(function(err) {
		if (err) {
		    res.json(Error.UNKNOWN);
		    return
		}
		return res.json({succ : 0, msg:'ok'});
	    });
	});
    });
});

module.exports = router;
