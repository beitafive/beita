
const base = "/api.php?s=";

const api = {
	login: `${base}api/admin/login`,	//登入
	logout: `${base}api/admin/logout`,	//登出
	
	get_menu_list:`${base}api/menu/get_list`,
	get_project_list:`${base}api/get_all_project`,	//获取项目列表
	get_module_list:`${base}api/get_all_module`,	//获取模块列表
	get_user_list:`${base}api/get_all_user`,	//获取用户列表
	get_version_list: `${base}api/version/get_options`,	//获取版本列表
	
	//api管理
	api:{
		getlist:`${base}api/api/getlist`,
		add:`${base}api/api/add`,
		update:`${base}api/api/update`,
		get:`${base}api/api/get`
	},
	//历史
	history:{
		getlist:`${base}api/history/get_history_list`,
		addandedit:`${base}api/history/addandedit`,
		get:`${base}api/history/get_history_detail`
	},
	//bug管理
	bug:{
		getlist:`${base}api/bug/get_list`,
		set_status: `${base}api/bug/set_status`,
		add:`${base}api/bug/create`,
		get:`${base}api/bug/get`,
		update:`${base}api/bug/update`
	},
	//文档管理
	doc:{
		getlist:`${base}api/doc/get_list`,
		get:`${base}api/doc/get`,
		add:`${base}api/doc/create`,
		update:`${base}api/doc/update`
	},
	//普通任务
	task:{
		getlist:`${base}api/task/get_list`,
		add:`${base}api/task/create`,
		update:`${base}api/task/update`,
		get:`${base}api/task/get`,
		update_progress:`${base}api/task/update_progress`,//更新进度
		distribute:`${base}api/task/distribute`,	//分配
		finish:`${base}api/task/finish`,	//完成
		close:`${base}api/task/close`,		//关闭
	},
	//紧急任务
	quicktask:{
		add:`${base}api/quicktask/create`,
		get:`${base}api/quicktask/get`,
		update:`${base}api/quicktask/update`,
	},
	//获取模块资源权限
	getPer: `${base}api/base/code_get_resource`,
	//资源管理
	resource:{
		getlist: `${base}api/resource/get_list`,
		add: `${base}api/resource/create`,
		del: `${base}api/resource/del`,
	},
	//角色
	role:{
		getlist: `${base}api/role/get_list`,
		add: `${base}api/role/create`,
		del: `${base}api/role/del`
		
	},
	//角色资源管理
	permission:{
		getlist: `${base}api/resource/assign_role_resource`,
		save: `${base}api/resource/save_resource`
	},
	//需求管理
	need:{
		change_status: `${base}api/requirement/change_status`,
		del: `${base}api/requirement/delete`,
		getlist: `${base}api/requirement/get_list`,
		add: `${base}api/requirement/create`,
		get: `${base}api/requirement/get`,
		update: `${base}api/requirement/update`,
	},
	//用户管理
	usercontrol:{
		get_user_page: `${base}api/user/get_page`,			//获取页面
		getlist: `${base}api/user/get_list`,
		add: `${base}api/user/create`,
		edit: `${base}api/user/update`,
		getpage: `${base}api/user/get_page`,
		getrolelist: `${base}api/role/role_list`,			//获取角色列表
		editrole: `${base}api/role/assign_user_role`,		//分配角色
	},
	//bug统计
	getbugstats: `${base}api/stat/bug`,
	
	
	//项目管理
	project:{
		getlist:`${base}api/project/get_list`,
		add:`${base}api/project/add`,
		update:`${base}api/project/update`
	},
	//版本管理
	version: {
		getlist:`${base}api/version/get_list`,
		change_status: `${base}api/version/change_status`,
		get: `${base}api/version/get`,
		add: `${base}api/version/add`,
		update: `${base}api/version/update`
	},
	//模块
	module:{
		getlist: `${base}api/module/get_list`,
		add: `${base}api/module/create`,
		update: `${base}api/module/update`,
	}
}

export default api;