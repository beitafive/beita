//wzq
import Vue from 'vue'
import Vuex from 'vuex'
import "babel-polyfill"
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		sApi:'',
		token:null,
		perList:'',
		menuIndex:'',
	},
	getters,
	mutations,
	actions
})

