var io = require('socket.io')();
var redis = require('./dao/redis_client');

var all_user_id = [];
var all_user = []
var all_socket = [];

var sensitive = function(str) {
    /*
    redis.smembers('__sensitive',function(err,reply) {
	if (!reply) return false;
	RegExp(
    });
    */
    return false;
}

io.on('connection', function(socket) {

    console.log('connection');
    socket.on('disconnect',function() {
	if (socket==null) console.log('dis!');
	var id = socket.id;
	var idx = all_user_id.indexOf(id);
	if (idx===-1) {
	    console.log(idx);
	    return;
	}
	all_user_id.splice(idx,1);
	all_user.splice(idx,1);
	all_socket.splice(idx,1);
	socket.broadcast.emit('logout',idx);
    });

    socket.emit('who');

    socket.on('who', function(user) {
	/*
	 * id
	 * display
	 * group
	 * grant
	 * qq
	 * ip 
	 */
	console.log('who', user);
	console.log('all_user',all_user);
	socket.emit('room',all_user);
	console.log('room done!');

	var id = Number(user.id);
	var idx = all_user_id.indexOf(id);
	console.log(idx);
	if (idx==-1) {
	    if (socket==null) console.log('who -1!');
	    socket.id = id;
	    socket.group = user.group;
	    all_user.push(user);
	    all_user_id.push(id);
	    all_socket.push(socket);
	    socket.broadcast.emit('login',user);
	} else {
	    socket.broadcast.emit('login',user);
	    /*
	    if (socket==null) console.log('who !');
	    all_socket[idx].emit('kick',idx);
	    socket.id = id;
	    socket.group = user.group;
	    all_user[idx] = user;
	    all_socket[idx] = socket;
	    */
	}
    });

    socket.on('msg', function(msg) {
	/*
	 * msg : {
	 *   from : id
	 *   from_idx
	 *   to : id [option]
	 *   to_idx
	 *   createTime : Date
	 *   whisper : bool
	 *   context : text
	 * }
	 */
	console.log(msg);

	var from_idx = all_user_id.indexOf(msg.from);
	var to_idx;

	console.log('from_idx', from_idx);

	if (from_idx===-1) return;
	msg.from_idx = from_idx;

	if (msg.to>=0) {
	    to_idx = all_user_id.indexOf(msg.to);
	    msg.to_idx = to_idx;
	}

	if (sensitive(msg.context)) {
	    socket.broadcast.to('admin').emit('msg',msg);
	} else if (msg.to>=0 && msg.whisper && all_user[idx].group>=90) {
	    if (to_idx === -1) return;
	    all_socket[idx].emit('msg',msg);
	} else {
	    console.log(msg);
	    socket.broadcast.emit('msg',msg);
	}
    });

    /*
    socket.on('bill', function(billMsg) {
	console.log(billMsg);
	Bill.bind(billMsg,function(err,bill) {
	    console.log({where : 'afterbind', data : bill});
	    if (!bill) {
		socket.emit('bill',err);
		return;
	    }
	    Bill.create(bill,function(err,b) {
		if (!b) {
		    socket.emit('bill',err);
		    return;
		}
		Bill.to_msg(b,function(r) {
		    console.log(all_socket.length);
		    all_socket.forEach(function(s) {
			Bill.broadcast(s,r);
		    });
		});
	    });
	});
	/*
	 * bill : {
	 *    id Number
	 *    from : id
	 *    category : String
	 *    product : String
	 *    lobby : boolean
	 *    type : Number
	 *    openPrice :Number    
	 *    checkUpPrice : Number
	 *    checkLowPrice : Number
	 *    operation : 
	 *    createTime : 
	 * }
	 */
    //});

    socket.on('speaker', function(say) {
	/*
	 * say : {
	 *    from : id
	 *    msg  : Msg
	 *    lobby : boolean
	 *    createTime : 
	 * }
	 */
	console.log('speaker', say);
	var idx = all_user_id.indexOf(say.from);
	if (idx!==-1) {
	    if (say.group < 90) return;
	    socket.broadcast.emit('speaker',{from : say.from, from_idx : idx, display : all_user[idx].display, msg : say.context, createTime : say.createTime});
	}
    });

});

exports.listen = function (server) {
    return io.listen(server);

}
exports.all_socket = all_socket;
