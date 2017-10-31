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
		perList:'',			//权限数据
		menuIndex:'',
		routerName:'',		//当前的路由
		//分页数据
		pagination:{
			page:1,
			page_count:10,
			page_total:0,
			item_total:0,
		},
		//列表数据
		tableData:[],
		//列表请求地址&&请求参数
		params:{
			url:'',
			data:''
		},
		bload:false,		//加载动画是否显示
		pageInfo:{},		//页面配置信息
	},
	getters,
	mutations,
	actions
})

