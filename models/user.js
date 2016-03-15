var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var schema = new Schema({
    username   : String,
    id         : Number,
    password   : String,
    ip         : String,
    createTime : {type :Date, default : Date.now},
    info       : {
	nickname : String,
	name     : String,
	qq       : String,
	mobile   : String,
	mail     : String,
	business : String,
    },
    security     : {
	question : String,
	answer   : String,
    },
    group        : {type : Number, default : 0},
    grant        : {
	state      : {type : Number, default : 0},
	by         : {type : Schema.Types.ObjectId, ref : 'User'},
	createTime : {type : Date, default : Date.now},
    },
    manager         : {type : Schema.Types.ObjectId, ref : 'User'},
    account         : {type : Number, default :0},
});


schema.virtual('expire').get(function() {
    if (this.group!=0) return 0;
    if (config.guest_expire === 0) return 0;
    return (this.createTime.getTime() + config.guest_expire - Date.now());
});

schema.virtual('display').get(function() {
    var display = this.info.nickname || '';
    if (display === '') display = this.username || '';
    if (display === '') display = 'guest_'+ this.id;
    return display;
});

var User = mongoose.model('User',schema);

User.findOne({},function(err,doc) {
    if (doc) {
	console.log('User exists');
	return;
    }
    var root = new User({
	username : 'root',
	id       : 0,
	password : config.root_password,
	group    : 100,
	ip       : '',
    }).save(function(err) {
	    if (err) console.log('User init fail');
	    else console.log('User init');
    });
});

module.exports = User;
