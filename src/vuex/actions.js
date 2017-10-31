/*
 * create by beitafive@163.com
 * Action 提交的是 mutation，而不是直接变更状态。
 * Action 可以包含任意异步操作。
 * */

var actions = {
	//登入
	login:({commit},data)=>{
		commit('LOGIN',data)
	},
	//获取权限
	getPer:({commit},data)=>{
		commit('GET_PER',data)
	},
	//改变路由
	changeRoute:({commit},data)=>{
		commit("CHANGE_ROUTE",data)
	},
	//请求列表
	page_go:({commit})=>{
		commit("PAGE_GO")
	},
	//获取参数
	getparams:({commit},data)=>{
		commit("GETPARAMS",data)
	},
	//改变分页
	change_page:({commit},data)=>{
		commit("CHANGE_PAGE",data)
	},
	//获取页面信息
	get_page_info:({state,dispatch,commit},data)=>{
		return new Promise((resolve,reject)=>{
			commit("GET_PAGE_INFO",data)
			dispatch("getparams",data)
			resolve(state.pageInfo);
		})
	}
}
export default actions;