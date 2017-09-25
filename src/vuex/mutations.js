/*
 *	create by beitafive@163.com
 * 	更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
 * */
var mutations = {
	//登录
	LOGIN:(state,data)=>{
		state.token = data;
		localStorage.token = data;
	},
	//获取权限
	GET_PER:(state,data)=>{
		$.ajax({
			type:'get',
			url:'/api.php?s=/front/base/code_get_resource',
			data:{
				code:data
			},
			async:false,
			dataType:'json',
			success:(res)=>{
				if(res.error==0){
					state.perList = res.data;
					sessionStorage.perList = res.data;
				}
			}
		})
	}
}
export default mutations;
