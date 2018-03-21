/* vuex入口 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions.js'
import * as getters from './getters.js'
import state from './state'
import mutations from './mutations'

// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)//注册插件

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	// strict: debug,
  // plugins: debug ? [createLogger()] : []
})