//wzq
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import "babel-polyfill"

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		sApi:'',
		token:null,
	},
	mutations:{
		login(state,data){
			state.token = data;
			localStorage.token = data;
		}
	}
})

