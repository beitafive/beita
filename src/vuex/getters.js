/*
 * create by beitafive@163.com	
 * 
 * Vuex 允许我们在 store 中定义『getters』（可以认为是 store 的计算属性）。
 * 就像计算属性一样，getters的返回值会根据它的依赖被缓存起来，
 * 且只有当它的依赖值发生了改变才会被重新计算
 * */

const getters = {
	setPerList: state => state.perList,			//权限列表
	getpoint: state => state.point,
	getList: state => state.tableData,			//数据列表
	pagination: state => state.pagination,		//分页数据
}

export default getters;
