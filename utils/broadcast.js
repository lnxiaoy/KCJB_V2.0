var Gift = require('../models/gift');

module.exports = function(socket,reply) {
    if (reply.lobby) {
	if (socket.group == 0) {
	    socket.emit('bill',{
		succ : 0,
		msg :  'handanla!'
	    });
	} else {
	    socket.emit('bill',reply);
	}
    } else {
	if (reply.from_id === socket.id) {
	    socket.emit('bill',reply);
	    return;
	}
	if (socket.group === 100) {
	    socket.emit('bill',reply);
	    return;
	}

	Gift.findOne({
	    pair : {
		from : reply.from_id,
		to : socket.id
	    },
	    name : 'suscribe'
	},function(err,doc) {
	    if (!doc) return;
	    if (doc.expire) return;
	    socket.emit('bill',reply);
	});
    }
}
