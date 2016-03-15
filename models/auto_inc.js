var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name : String, 
    id : {type : Number, default : 0}
});

var Auto_inc = mongoose.model('Auto_inc', schema);

var init_auto_inc = function(name) {
    Auto_inc.findOne({name : name},function(err,doc) {
	if (doc) {
	    console.log(name + ' auto_increment exists');
	    return;
	}
	var init = new Auto_inc({
	    name : name,
	}).save(function(err) {
	    if (err) console.log(name + ' auto_inc init fail');
	    else console.log(name + ' auto_increment init');
	});
    });
}

init_auto_inc('user');
init_auto_inc('bill');

module.exports = Auto_inc;
