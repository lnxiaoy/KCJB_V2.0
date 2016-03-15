var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    id : Number,
    from : {type : Schema.Types.ObjectId, ref : 'User'},
    product : {type : Schema.Types.ObjectId, ref : 'Product'},
    lobby : Boolean,
    type : String,
    openPrice : Number,
    checkUpPrice : Number,
    checkLowPrice : Number,
    operation : String,
    createTime : {type : Date,default :Date.now}
});

schema.virtual('benefit').get(function() {

    if (this.operation!=='upSold' && this.operation!=='lowSold') 
	return NaN;
    var final_sold = checkUpPrice;
    if (this.operation==='lowSold') final_sold = checkLowPrice;
    if (this.moreless) {
	return final_sold - this.openPrice - this.product.cost;
    } else {
	return this.openPrice - final_sold - this.product.cost;
    }
});

module.exports = mongoose.model('bill', schema);

