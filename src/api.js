
const base = "/api.php?s=/";

const api = {
	//获取模块资源权限
	getPer: `${base}front/base/code_get_resource`,
	//资源管理
	resource:{
		getlist: `${base}api/resource/get_list`,
		add: `${base}api/resource/create`,
		del: `${base}api/resource/del`,
	},
	//角色资源管理
	permission:{
		getlist: `${base}api/resource/assign_role_resource`,
		save: `${base}api/resource/save_resource`
	},
	//用户管理
	usercontrol:{
		getlist: `${base}get_user_list`,
		add: `${base}add_user`,
		edit: `${base}update_user`,
		getrolelist: `${base}api/role/role_list`,			//获取角色列表
		editrole: `${base}api/role/assign_user_role`,		//分配角色
	},
	//bug统计
	getbugstats: `${base}api/stat/bug`
}

export default api;