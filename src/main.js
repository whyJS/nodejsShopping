// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// import Vuex from 'vuex'
// 添加vuex
import store from './store'

import VueLazyload from 'vue-lazyload'
import infiniteScroll from  'vue-infinite-scroll'
Vue.config.productionTip = false
Vue.use(infiniteScroll);

import '@/common/css/base.css'
import '@/common/css/checkout.css'
import '@/common/css/product.css'
// import '@/common/css/login.css'
// Vue.use(Vuex);
Vue.use(VueLazyload, {
  loading: require('./common/img/loading-bars.svg'),
  try: 3 // default 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
