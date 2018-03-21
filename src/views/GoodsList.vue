<template>
<div>
  <nav-header></nav-header>
  <nav-bread>
    <span>商品</span>
  </nav-bread> 
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a @click="sortGoods" :class="sortFlag?'cur':''" href="javascript:void(0)" class="default">升序</a>
          <a @click="sortGoods" href="javascript:void(0)" :class="sortFlag?'':'cur'" class="price">降序
           </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showFilterPop">
          价格 排序
          </a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>价格:</dt>
            <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">全部</a></dd>
            <dd v-for="(val,index) in priceFilter">
              <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{val.startPrice}} - {{val.endPrice}}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="(val,index) in goodsList">
                <div class="pic">
                  <a href="#"><img v-lazy="'static/'+val.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{val.productName}}</div>
                  <div class="price">{{val.salePrice | currency('$')}}</div>
                  <div class="btn-area">
                  <a href="javascript:;" @click="addCart(val.productId)" class="btn btn--m">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>

          </div>
          <!-- 上拉加载 -->
          <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="../common/img/loading-spinning-bubbles.svg" v-show="loading">
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 弹框，请先登录 -->
  <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
    <p slot="message">
       请先登录,否则无法加入到购物车中!
    </p>
    <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
    </div>
  </modal>
  <!-- 弹框，加入购物车成功 -->
  <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>


  <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
<nav-footer></nav-footer>
</div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modal from './../components/Modal'
    import {currency} from './../common/js/currency'
    import axios from 'axios'
    import {mapGetters, mapActions} from 'vuex'
    export default{
        data(){
            return {
                goodsList:[],
                sortFlag:true,
                page:1,
                pageSize:8,
                busy:true,
                loading:true,
                mdShow:false,
                mdShowCart:false,
                priceFilter:[
                  {
                      startPrice:'0.00',
                      endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                  }
                ],
                priceChecked:'all',
                filterBy:false,
                overLayFlag:false
            }
        },
        filters:{
          currency:currency
        },
        mounted(){
            this.getGoodsList();
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        computed:{
          ...mapGetters([
            'nickName'
          ])
        },
        methods:{
            //请求列表 
            getGoodsList(flg){
              var param = {
                  page:this.page,
                  pageSize:this.pageSize,
                  sort:this.sortFlag?1:-1,
                  priceLevel:this.priceChecked
              };
               this.loading = true;
              axios.get("/goods/list",{
                params:param
              }).then((res)=>{
                 this.loading = false;
                if(flg){
                  this.goodsList=this.goodsList.concat(res.data.result.list)
                  console.log(this.goodsList)
                  if(res.data.result.list.length<this.pageSize){
                          this.busy = true;
                      }else{
                          this.busy = false;
                      }
                } else{
                  this.goodsList=res.data.result.list
                  this.busy = false;
                }               
                
              })
            },
            // 升序降序
            sortGoods(){
              this.sortFlag=!this.sortFlag;
              this.page=1
              this.getGoodsList()
            },
            // 加载更多
            loadMore(){
                console.log('xx');
                this.busy = true;
                setTimeout(() => {
                  this.page++;
                  this.getGoodsList(true);
                }, 500);
            },
            setPriceFilter(index){
              this.priceChecked = index;
              this.page = 1;
              this.closePop()
              this.getGoodsList();
            },
            // 小屏幕价格列表显示
            showFilterPop(){
              this.filterBy=true;
              this.overLayFlag=true;
            },
            closePop(){
              this.filterBy=false;
              this.overLayFlag=false;
              this.mdShowCart = false;
            },
            // 加入购物车
            addCart(productId){
              console.log(productId)
                axios.post("/goods/addCart",{
                  productId:productId
                }).then((res)=>{
                    var res = res.data;
                    console.log(res)
                    if(res.status==0){
                        this.mdShowCart = true;
                        // this.$store.commit("updateCartCount",1);
                    }else{
                        this.mdShow = true;
                    }
                });
            },
            // 关闭弹框
             closeModal(){
              this.mdShow = false;
              this.mdShowCart = false;
            },
            ...mapActions([
              'selectPlay'
            ])
        }
    }
</script>
