/**
 * Created by Administrator on 2018/3/12.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
//连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on("connected",function(){
  console.log("连接成功");
});

mongoose.connection.on("err",function(){
  console.log("连接失败");
});

mongoose.connection.on("disconnected",function(){
  console.log("连接断开");
});

router.get("/list",function(req,res,next){
  let page=parseInt(req.param("page"));//页码
  let pageSize=parseInt(req.param("pageSize"));//一页显示多少个
  let sort = req.param("sort");//升序或降序
  let skip = (page-1)*pageSize;//跳过几个
  let priceLevel = req.param("priceLevel"); 
  var priceGt = '',priceLte = '';
  let params = {};
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt = 0;priceLte=100;break;
      case '1':priceGt = 100;priceLte=500;break;
      case '2':priceGt = 500;priceLte=1000;break;
      case '3':priceGt = 1000;priceLte=5000;break;
    }
    params = {
      salePrice:{
          $gt:priceGt,
          $lte:priceLte
      }
    }
  }

  let goodsModel=Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice':sort});//sort 升序降序
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:doc.message,
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  })
});
// 加入购物车
router.post("/addCart",function(req,res,next){
  var userId = '001';
  var productId = req.body.productId;//post需要req.body
  var User = require('../models/user');
  User.findOne({userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(userDoc){
        var goodsItem = '';
        userDoc.cartList.forEach(function(item){
          if(item.productId == productId){
            if(item.productId == productId){
                goodsItem = item;
                item.productNum ++;
              }
          }
        });
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'添加成功'
                })
              }
          })
        }else{
          Goods.findOne({productId:productId},function(err,doc){
            if(err){
              res.json({
                status:"1",
                msg:err.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                console.log(userDoc.cartList)
                userDoc.save(function(err2,doc2){
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:"添加成功"
                    })
                  }
                })
              }
            }
          })
        }        
      }else{
        res.json({
          status:'xx',
          msg:'',
          result:'无数据'
        })
      }
    }
  })
})
module.exports = router;
