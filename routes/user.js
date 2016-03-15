var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Error = require('../errors');

function info(x) {
    return {
	id : x.id,
	username : x.username,
	nickname : x.info.nickname,
	name : x.info.name || '',
	group : x.group,
	ip : x.ip,
	manager : x.manager.display,
	grant : x.grant.state,
	createTime : x.createTime,
	button :  "<button class='btn btn-info btn-sm' ng-click='getInfo("+x.id+")'>编辑</button><button class='btn btn-danger btn-sm'>删除</button>"
    };
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN); 
	return;
    }
    User.findById(req.session.token,function(err,user) {
	if (!user) {
	    res.json(Error.BAD_TOKEN); 
	    return;
	}
	if (user.group < 90) {
	    res.json(Error.NO_PERMISSION); 
	    return;
	}
	var t = 90;
	if (user.group == 100) t = 100;

	User.find({group : {$lt : t}})
	    .populate('manager')
	    .exec(function(err,doc) {
		if (!doc) {
		    res.json(Error.UNKNOWN); 
		    return;
		}
		var s = [];
		doc.forEach(function(x) {
		    s.push(info(x));
		});
		res.json({data:s});
	    });
    });
});

router.get('/abnormal', function(req,res,next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN); 
	return;
    }
    User.findById(req.session.token,function(err,user) {
	if (!user) {
	    res.json(Error.BAD_TOKEN); 
	    return;
	}
	if (user.group < 90) {
	    res.json(Error.NO_PERMISSION); 
	    return;
	}
	User.find({grant : {$ne : 0}}) 

    });
});

module.exports = router;
