/**
 * Created by 王汉炎 on 2018/3/12.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var produtSchema = new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "checked": String,
  "productNum": String
});
module.exports = mongoose.model('dumal',produtSchema,"dumall")

