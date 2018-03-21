/**
 * Created by 王汉炎 on 2018/3/12.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var produtSchema = new Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "salePrice":String,
      "productImage":String,
      "checked":Number,
      "productNum":Number
    }
  ],
  "addressList":[
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault": Boolean
    }
  ]
});
module.exports = mongoose.model('user',produtSchema,"users")

