
const base = "/api.php?s=";

const api = {
	login: `${base}api/admin/login`,	//登入
	logout: `${base}api/admin/logout`,	//登出
	
	get_menu_list:`${base}api/menu/get_list`,
	get_project_list:`${base}api/project/get_options`,	//获取项目列表
	get_module_list:`${base}api/module/get_options`,	//获取模块列表
	get_user_list:`${base}api/user/get_options`,		//获取用户列表
	get_version_list: `${base}api/version/get_options`,	//获取版本列表
	get_options: `${base}api/task/get_options`,	//获取测试人员列表

	
	//api管理
	api:{
		getlist:`${base}api/api/get_list`,				//获取API列表
		add:`${base}api/api/create`,					//添加API
		update:`${base}api/api/update`,					//编辑API
		get:`${base}api/api/get`,						//获取API
		delete:`${base}api/api/delete`					//删除API
	},
	//历史
	history:{
		getlist:`${base}api/history/get_list`,
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
		update:`${base}api/doc/update`,
		delete:`${base}api/doc/delete`
	},
	//普通任务
	task:{
		getlist:`${base}api/task/get_list`,
		get_my_task:`${base}api/task/get_my_task`,//我的任务和我的紧急任务合并接口
		add:`${base}api/task/create`,
		update:`${base}api/task/update`,
		get:`${base}api/task/get`,
		update_progress:`${base}api/task/update_progress`,//更新进度
		distribute:`${base}api/task/distribute`,	//分配
		finish:`${base}api/task/finish`,			//完成
		close:`${base}api/task/close`,				//关闭
		change_status:`${base}api/task/change_status`, //更改状态	

	},
	//紧急任务
	quicktask:{
		getlist: `${base}api/quicktask/get_list`,
		add:`${base}api/quicktask/create`,
		get:`${base}api/quicktask/get`,
		update:`${base}api/quicktask/update`,
		distribute: `${base}api/quicktask/distribute`,
		finish: `${base}api/quicktask/finish`,
		close: `${base}api/quicktask/close`,
		tested: `${base}api/quicktask/tested`,
		change_status:`${base}api/quicktask/change_status`, //更改状态	
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
		del: `${base}api/role/del`,
		update: `${base}api/role/update`
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
		get_options: `${base}api/requirement/get_options`,//提出者列表
		get_user_options: `${base}api/requirement/get_user_options`,//负责人列表
		remark: `${base}api/requirement/remark`,//需求备注
		add_log: `${base}api/requirement/add_log`,//需求日志添加

	},
	//用户管理
	usercontrol:{
		get_user_page: `${base}api/user/get_page`,			//获取页面
		getlist: `${base}api/user/get_list`,
		get: `${base}api/user/get`,							//获取用户信息
		add: `${base}api/user/create`,
		edit: `${base}api/user/update`,
		getpage: `${base}api/user/get_page`,
		getrolelist: `${base}api/role/role_list`,			//获取角色列表
		editrole: `${base}api/role/assign_user_role`,		//分配角色
		changepwd: `${base}api/user/changepwd`,
		reset_password: `${base}api/user/reset_password`,	//重置密码
	},
	//bug统计
	getbugstats: `${base}api/stat/get_list`,
	//团队统计
	team:{
		get_team: `${base}api/stat/team`,
		get_all_bug: `${base}api/stat/get_all_bug`
	},

	
	//项目管理
	project:{
		getlist:`${base}api/project/get_list`,
		add:`${base}api/project/create`,
		update:`${base}api/project/update`
	},
	//版本管理
	version: {
		getlist:`${base}api/version/get_list`,
		change_status: `${base}api/version/change_status`,
		get: `${base}api/version/get`,
		add: `${base}api/version/create`,
		update: `${base}api/version/update`
	},
	//模块
	module:{
		getlist: `${base}api/module/get_list`,
		add: `${base}api/module/create`,
		update: `${base}api/module/update`,
		del: `${base}api/module/delete`
	},
	
	//帐号管理
	account:{
		getlist: `${base}api/account/get_list`,
		add: `${base}api/account/create`,
		update: `${base}api/account/update`
	},
	
	//REPO管理
	repo:{
		getlist: `${base}api/repo/get_list`,
		add: `${base}api/repo/create`,
		update:`${base}api/repo/update`,
		del: `${base}api/repo/delete`,
		getpage: `${base}api/repo/get_page`
	},
	//服务器管理
	server:{
		getlist: `${base}api/server/get_list`,
		add: `${base}api/server/create`,
		update:`${base}api/server/update`,
		del: `${base}api/server/delete`,
		getpage: `${base}api/server/get_page`
	},
	//部门管理
	department:{
		getlist: `${base}api/department/get_list`,
		add: `${base}api/department/create`,
		update: `${base}api/department/update`,
		del: `${base}api/department/delete`,
		get: `${base}api/department/get`,
		assign: `${base}api/department/assign_department`, //为用户分配部门
	},
	//积分管理
	point:{
		getlist: `${base}api/point/get_list`,
	},
	//绩效管理
	performance:{
		get_overview_list: `${base}api/performance/get_overview_list`,//绩效总览列表
		get_detail_list: `${base}api/performance/get_detail_list`,//绩效日志列表
		add: `${base}api/performance/add`,//绩效日志列表--增加
		reduce: `${base}api/performance/reduce`,//绩效日志列表--减少

	},
	//表字段
	column:{
		get_list: `${base}api/column/get_list`,
		create: `${base}api/column/create`,
		delete: `${base}api/column/real_delete`,
		update: `${base}api/column/update`,
		get:`${base}api/column/get`,

	},
	//数据库表
	table:{
		get_list: `${base}api/table/get_list`,
		create: `${base}api/table/create`,
		delete: `${base}api/table/delete`,
		update: `${base}api/table/update`,
		get_table_options: `${base}api/table/get_table_options`,

	}
}

export default api;