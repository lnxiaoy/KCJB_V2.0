var express = require('express');
var router = express.Router();
var Bill = require('../models/bill');
var AUTOINC = require('../models/auto_inc');
var User = require('../models/user');
var Error = require('../errors');
var Product = require('../models/product');
var all_socket = require('../chat_server').all_socket;

var broadcast = require('../utils/broadcast');

function type(ctype) {
    var s1 = '买空';
    if (/more/.test(ctype)) s1 = '买多';
    var s2 = '现金';
    if (/hang/.test(ctype)) s2 = '挂单';
    return s2+s1;
}

function state(doc) {
    if (/hang/.test(doc.type)) return '挂单';
    if (doc.operation==='open') 
	return '开仓';
    if (doc.operation==='add') 
	return '增仓';
    if (doc.operation==='reduce')
	return '减仓';
    if (doc.operation==='cancel')
	return '撤单';
    if (doc.operation==='finnish')
	return '平仓';
}

function button1(doc) {
    if (/hang/.test(doc.type)) {
	return "";
    }
    return "<button class='btn btn-danger' onclick='opera_finnish()'>平仓</button>";
}

function button2(doc) {
    if (/hang/.test(doc.type)) {
	return "<button class='btn deal btn-info btn-sm' onclick='opera_deal()'>成交</button><button id='"+doc.id+"' class='btn btn-warning btn-sm' onclick='opera_cancel()'>撤单</button>";
    }
    if (doc.operation==='open'
	    ||doc.operation==='add') {
	return "<button class='btn btn-info add btn-sm' onclick='opera_add()'>增仓</button><button class='btn btn-info sub btn-sm' onclick='opera_reduce()'>减仓</button>";
    }
    return "";
}

function bill_to_msg (doc) {
	s = {
	    id : doc.id,
	    from : doc.from.display,
	    product : doc.product.name,
	    lobby : doc.lobby,
	    type : doc.type ? type(doc.type) : 'test',
	    openPrice : doc.openPrice,
	    checkUpPrice : doc.checkUpPrice,
	    checkLowPrice : doc.checkLowPrice,
	    operation : doc.operation,
	    createTime : doc.createTime,
	    state : state(doc),
	    button1 : button1(doc),
	    button2 : button2(doc),
	};
	return s;
}


function get_bill(query,res) {
    Bill.find(query)
	.populate('from')
	.populate('product')
	.select('-_id id from product lobby type openPrice checkUpPrice checkLowPrice operation createTime')
	.exec(function(err,doc) {
	    if (!doc) res.json([]);
	    else {
		var s = [];
		doc.forEach(function(x) {
		    s.push(bill_to_msg(x));
		});
		res.json({data : s});
	    }
	});
}

router.get('/all',function(req,res,next) {
    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	get_bill({
	    from : req.session.token, 
	},res);
    });
});

router.get('/', function(req, res, next) {
    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	get_bill({
	    $or : [
	    {operation : 'add',
		from : req.session.token
	    },
	    {operation : 'open',
		from : req.session.token
	    }
		]
	},res);
    });
});

router.post('/',function(req,res,next) {
    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    if (!req.body.category) {
	res.json(Error.BAD_PARAMENTER);
	return;
    }

    if (!req.body.product) {
	res.json(Error.BAD_PARAMENTER);
	return;
    }

    if (!Number(req.body.openPrice)) {
	res.json(Error.BAD_PARAMENTER);
	return;
    }

    User.findById(req.session.token,function(err,user) {
	if (!user) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}

	if (user.group < 95) {
	    res.json(Error.NO_PERMISSION);
	    return;
	}

	Product.findOne({
	    category : req.body.category, 
	    name     : req.body.product
	}, function(err,product) {
	    if (!product) {
		res.json(Error.BAD_PARAMETERS);
		return;
	    }
	    AUTOINC.findOneAndUpdate({name:'bill'},
		    {$inc : {id:1}},
		    {new : true},
		    function(err,idx) {
			if (!idx) {
			    res.json(Error.UNKNOWN);
			    return;
			}
			var newBill = new Bill(req.body);
			newBill.id = idx.id;
			newBill.from = user._id;
			newBill.product = product._id;
			newBill.save(function(err){
			    if (err) {
				res.json(Error.UNKNOWN);
				return;
			    }
			    var msg = bill_to_msg(newBill);
			    msg.product = product.name,
			    msg.from = user.display;
			    msg.from_id = user.id;
			    msg.succ = 0;
			    res.json(msg);

			    all_socket.forEach(function(s) {
				broadcast(s,msg);
			    });


			});
		    });
	});

    });
});

/*
 * POST /api/bill/0 -- id
 * {
 *    operation : 'reduce' 'finnish' 'add' 'deal' 'cancel'
 *    openPrice
 *    checkUpPrice
 *    checkLowPrice
 * }
 */
router.post('/:id',function(req,res,next) {

    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    Bill.findOne({id : req.params.id})
	.populate('from')
	.populate('product')
	.exec(function(err,bill) {

	if (!bill) {
	    res.json(Error.BAD_PARAMETER);
	    return;
	}
	if (bill.from._id != req.session.token) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}

	if (req.body.operation === 'finnish' ||
		req.body.operation === 'reduce' ||
		req.body.operation === 'cancel') {

	    if (req.body.operation !== 'cancel') {
		if (req.body.checkUpPrice) {
		    bill.checkUpPrice = req.body.checkUpPrice;
		    bill.checkLowPrice = 0;
		}
		else if (req.body.checkLowPrice) {
		    bill.checkUpPrice = 0;
		    bill.checkLowPrice = req.body.checkLowPrice;
		} else {
		    res.json(Error.BAD_PARAMETER);
		    return;
		}
	    }

	    bill.operation = req.body.operation;
	    bill.save(function(err) {
		if (err) {
		    res.json(Error.UNKNOWN);
		    return;
		}
		res.json({succ : 0, remove : bill.id});
		var msg = bill_to_msg(bill);
		msg.product = bill.product.name,
		msg.from = bill.from.display;
		msg.from_id = bill.from.id;
		msg.succ = 0;

		all_socket.forEach(function(s) {
		    broadcast(s,msg);
		});

	    });
	    return;
	}
	if (req.body.operation === 'add' ||
		req.body.operation == 'deal') {
	    if (!req.body.openPrice) {
		res.json(Error.BAD_PARAMETER);
		return;
	    }
	    AUTOINC.findOneAndUpdate({name:'bill'},
		    {$inc : {id:1}},
		    {new : true},
		    function(err,idx) {
			if (!idx) {
			    res.json(Error.UNKNOWN);
			    return;
			}
			var newBill = new Bill();
			newBill.from = bill.from._id;
			newBill.product = bill.product._id;
			newBill.lobby = bill.lobby;
			newBill.type = /more/.test(bill.type) ? 'cashmare' : 'cashless';
			newBill.id = idx.id;
			newBill.openPrice = req.body.openPrice;
			newBill.operation = req.body.operation;

			if (newBill.operation === 'deal')
			    newBill.operation = 'open';

			if (req.body.checkUpPrice) 
			    newBill.checkUpPrice = req.body.checkUpPrice;
			if (req.body.checkLowPrice) 
			    newBill.checkLowPrice = req.body.checkLowPrice;

			newBill.save(function(err){
			    if (err) {
				res.json(Error.UNKNOWN);
				return;
			    }
			    var msg = bill_to_msg(newBill);
			    msg.operation = req.body.operation;
			    msg.product = bill.product.name,
			    msg.from = bill.from.display;
			    msg.from_id = bill.from.id;
			    msg.succ = 0;
			    res.json(msg);


			    all_socket.forEach(function(s) {
				broadcast(s,msg);
			    });
			});
		    });
	    return;
	}
    });
});

module.exports = router;
