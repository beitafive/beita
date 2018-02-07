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
			url:'/api.php?s=api/base/code_get_resource',
			data:{
				code:data
			},
			async:false,
			dataType:'json',
			success:(res)=>{
				if(res.error==0){
					state.perList = res.data.resource;
					// state.point = res.data.point;
					sessionStorage.perList = res.data;
				}
			}
		})
	},
	//获取积分
	CHANGE_POINT:(state) =>{
		let that = this;
		$.ajax({
			type:"get",
			dataType:'json',
			data:{
				id:sessionStorage.userid
			},
			url:'/api.php?s=api/user/get',
			success:function(res){
				let data = res;
				if(data.error==1){
					console.log(data.error_msg)
				}
				if(data.error == 0){
					state.point = data.data.point;
				}
			}
		});
	},
	//改变路由
	CHANGE_ROUTE:(state,data)=>{
		state.routerName = data;
	},
	//page组件数据
	PAGE_GO:(state,data)=>{
		state.bload = true;
		if(data == 1){
			state.pagination.page = 1;
		}
		$.ajax({
			type:"get",
			url:state.params.url+"&page="+state.pagination.page+state.params.data,
			dataType:'json',
			async:false,
			success:(res)=>{
				if(res.error == 0){
					state.pagination = res.data.pagination;
					state.tableData = res.data.rows;
				}else{
					state.tableData = [];
					//以后可以调用自己写的提示组件
				}
				state.bload = false;
			}
		});
	},
	//获取请求地址&&参数  -- 列表
	GETPARAMS:(state,data)=>{
		state.params = data;
		state.tableData = [];
	},
	//改变分页
	CHANGE_PAGE:(state,data)=>{
		if(data instanceof Object){
			state.pagination = data
		}else{
			state.pagination.page = data;			
		}
	},
	//获取页面的信息
	GET_PAGE_INFO:(state,data)=>{
		$.ajax({
			type:"get",
			url:data.get_url,
			dataType:'json',
			async:false,
			success:(res)=>{
				if(res.error == 0){
					state.pageInfo = res.data;
				}else{
					//以后可以调用自己写的提示组件
				}
			}
		});
	},
	//保存当前页面信息
	KEEP_PAGE_CONTENT:(state,data) => {
		state.pageContent = data;
		// console.log(data)
	},
	//保存页面搜索信息
	SEARCH_PARAMS:(state,data) => {
		state.searchParams = data;
		// console.log(data)
	},
}
export default mutations;
