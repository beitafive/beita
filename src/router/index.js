import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'
import Login from '@/components/Login' 						//登录
import Index from '@/components/Index'						//首页
import Pandect from '@/components/Pandect'					//总揽
import SetInfo from '@/components/SetInfo'					//个人设置
import Mymission from '@/components/Mymission'				//我的任务
import MissionCenter from '@/components/mission/MissionCenter'	//任务管理
import urgentTask from '@/components/mission/urgentTask'	//紧急任务
import addUrgent from '@/components/mission/addUrgent'		//紧急任务 添加
import editUrgent from '@/components/mission/editUrgent'	//紧急任务 编辑
import taskDoc from '@/components/mission/taskDoc'			//任务详情页
import createtask from '@/components/mission/createTask'	//添加任务
import edittask from '@/components/mission/editTask'		//编辑任务

import Mybug from '@/components/bug/Mybug'					//我的bug
import Bugcontrol from '@/components/bug/Bugcontrol'		//bug管理
import bugcontent from '@/components/bug/bugcontent'		//bug详情页
import addBug from '@/components/bug/addBug'				//添加bug
import editbug from '@/components/bug/editBug'				//bug编辑页
import bugStats from '@/components/bug/bugStats'			//bug统计页

import Api from '@/components/api/Api'						//api管理
import apiDoc from '@/components/api/apiDoc'				//api详情页
import addApi from '@/components/api/addApi'                //添加api
import editApi from '@/components/api/editApi'              //编辑api
import showApi from '@/components/api/showApi'              //展示api


import documentContorl from '@/components/doc/documentContorl'	//文档管理
import createDoc from '@/components/doc/addDoc'				//文档创建页
import doc from '@/components/doc/doc'						//文档详情页
import editdoc from '@/components/doc/editdoc'				//文档编辑页

import Needs from '@/components/need/Needs'					//需求管理
import addNeed from '@/components/need/addneed'				//需求添加页
import needDoc from '@/components/need/needDoc'				//需求详情页
import editNeed from '@/components/need/editneed'			//需求编辑页
import createNeedTask from '@/components/need/createNeedTask'   //需求任务添加页

import Project from '@/components/Project'					//项目管理
import Module from '@/components/Module'					//模块管理
import Versions from '@/components/version/Versions'		//版本管理
import addVersion from '@/components/version/addversion'	//版本添加页
import editVersion from '@/components/version/editVersion'	//版本编辑页
import vsDoc from '@/components/version/vsDoc'				//版本详情页


import teamdata from '@/components/teamdata'				//团队概要

import historyList from '@/components/history/historyList'	//部门历史列表
import editHistory from '@/components/history/editHistory'	//增改部门历史
import historyDoc from '@/components/history/readHistory'	//部门历史详情

import nopage from '@/components/nopage'		//测试

import Account from '@/components/Account'						//帐号管理

import UserControl from '@/components/permission/UserControl'	//用户管理
import addUser from '@/components/permission/addUser'           //添加用户
import editUser from '@/components/permission/editUser'         //编辑用户


import RoleControl from '@/components/permission/roleControl'	//角色管理
import editPermission from '@/components/permission/editPermission'	//角色权限管理
import resources from '@/components/permission/resource'		      //资源管理

import department from '@/components/department/department'           //部门管理
import addDepartment from '@/components/department/addDepartment'     //新增部门
import editDepartment from '@/components/department/editDepartment'     //编辑部门

import repo from '@/components/deploy/repo'			//repo管理
import server from '@/components/deploy/server'		//服务器管理
import branch from '@/components/deploy/branch'	//分支管理
import deploy from '@/components/deploy/deploy'		//部署

import myBug from '@/components/mine/myBug'     //个人中心--我的bug
import myTask from '@/components/mine/myTask'     //个人中心--我的任务
import myUrgentTask from '@/components/mine/myUrgentTask'     //个人中心--我的紧急任务
import point from '@/components/mine/point'     //个人中心--我的积分

import performance from '@/components/performance/performance'     //个人中心--绩效总览表
import performanceLog from '@/components/performance/performanceLog'     //个人中心--绩效日志列表

import sheet from '@/components/sheet/sheet'     //任务中心--表列表
import addSheet from '@/components/sheet/addSheet'     //任务中心--新增
import editSheet from '@/components/sheet/editSheet'     //任务中心--编辑

import column from '@/components/column/column'     //任务中心--字段列表
import addColumn from '@/components/column/addColumn'     //任务中心--新增
import editColumn from '@/components/column/editColumn'     //任务中心--编辑






Vue.use(Router)

const routes = [
    {path:'/',name: 'oa_login',component: Login,meta:{keepAlive:false}},
    {path:'/index',name:'oa_index',component:Index, 
    	meta: {
            requireAuth: true,
        },children:[
    	{path:'/Pandect',component:Pandect},
    	{path:'/SetInfo',component:SetInfo,meta:{keepAlive:true},beforeEnter:(to,from,next)=>{
    		next();
    	}},
    	{path:'/Mymission',component:Mymission},
    	{path:'/MissionCenter',component:MissionCenter},
    	// {path:'/Mybug',component:Mybug},
    	{path:'/Bugcontrol',component:Bugcontrol},
    	{path:'/addbug',component:addBug},
    	{path:'/editbug',component:editbug},
    	{path:'/bugstats',component:bugStats},

    	{path:'/oaApi',component:Api},
        {path:'/addApi',component:addApi},
        {path:'/editApi',component:editApi},
        {path:'/showApi',component:showApi},

    	{path:'/document',component:documentContorl},
    	{path:'/createdoc',component:createDoc},
	    {path:'/editdoc',component:editdoc},
        
    	{path:'/needs',component:Needs},
    	{path:'/addneed',component:addNeed},
    	{path:'/editneed',component:editNeed},
        {path:'/createNeedTask',component:createNeedTask},

    	{path:'/project',component:Project},
    	{path:'/module',component:Module},

    	{path:'/versions',component:Versions},
    	{path:'/addversion',component:addVersion},
    	{path:'/editversion',component:editVersion},

    	{path:'/account',component:Account},
    	{path:'/usercontrol',component:UserControl},
        {path:'/adduser',component:addUser},
        {path:'/edituser',component:editUser},
    	{path:'/rolecontrol',component:RoleControl},
    	{path:'/editpermission',component:editPermission},
    	{path:'/resources',component:resources},

        {path:'/department',component:department},
        {path:'/addDepartment',component:addDepartment},
        {path:'/editDepartment',component:editDepartment},

    	{path:'/stat_team',component:teamdata},
    	{path:'/urgenttask',component:urgentTask},
    	{path:'/addurgent',component:addUrgent},
    	{path:'/editurgent',component:editUrgent},
    	{path:'/createtask',component:createtask},
    	{path:'/edittask',component:edittask},
    	{path:'/history',component:historyList},
    	{path:'/edithistory',component:editHistory},
		{path:'/repo',component:repo},
    	{path:'/server',component:server},
		{path:'/branch',component:branch},
    	{path:'/deploy',component:deploy},

        {path:'/myBug',component:myBug},
        {path:'/myUrgentTask',component:myUrgentTask},
        {path:'/myTask',component:myTask},
        {path:'/point',component:point},
        {path:'/performance',component:performance},
        {path:'/performanceLog',component:performanceLog},

        {path:'/sheet',component:sheet},
        {path:'/addsheet',component:addSheet},
        {path:'/editsheet',component:editSheet},

        {path:'/column',component:column},
        {path:'/addcolumn',component:addColumn},
        {path:'/editcolumn',component:editColumn},



    ]},
    {path:'/bugcontent',component:bugcontent},
    {path:'/doc',component:doc},
    {path:'/needDoc',component:needDoc},
    {path:'/taskDoc',component:taskDoc},
    {path:'/VsDoc',component:vsDoc},
    {path:'/oaApiDoc',component:apiDoc},
	{path:'/historydoc',component:historyDoc},
	{path:'*',component:nopage}
  ]
const router = new Router({
  mode:'history',
  routes
}); 
// 页面刷新时，重新赋值token
if (window.localStorage.token) {
    store.dispatch("login", localStorage.token)
}

router.beforeEach((to, from, next) => {
	if(to.fullPath != '/'){
		store.dispatch("changeRoute",to.fullPath)		
	}
    if (to.matched.some(r => r.meta.requireAuth)) {
    	let params = {page:1,page_count:10,page_total:1,item_total:0}
    	store.dispatch("change_page",params)
        if (store.state.token) {
            next();
        }else {
            next({
                path: '/'
            })
        }
    }else {
        next();
    }
})
export default router;