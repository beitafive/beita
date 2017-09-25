/*
 * create by beitafive@163.com
 * Action 提交的是 mutation，而不是直接变更状态。
 * Action 可以包含任意异步操作。
 * */

var actions = {
	login:({commit},data)=>{
		commit('LOGIN',data)
	},
	getPer:({commit},data)=>{
		commit('GET_PER',data)
	}
}
export default actions;