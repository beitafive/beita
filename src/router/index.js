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

import Api from '@/components/api/Api'						//api管理
import apiDoc from '@/components/api/apiDoc'				//api详情页

import documentContorl from '@/components/doc/documentContorl'	//文档管理
import createDoc from '@/components/doc/addDoc'				//文档创建页
import doc from '@/components/doc/doc'						//文档详情页
import editdoc from '@/components/doc/editdoc'				//文档编辑页

import Needs from '@/components/need/Needs'					//需求管理
import addNeed from '@/components/need/addneed'				//需求添加页
import needDoc from '@/components/need/needDoc'				//需求详情页
import editNeed from '@/components/need/editneed'			//需求编辑页

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

import test from '@/components/test'		//测试

import Account from '@/components/Account'						//帐号管理
import UserControl from '@/components/permission/UserControl'	//用户管理
import RoleControl from '@/components/permission/roleControl'	//角色管理
import editPermission from '@/components/permission/editPermission'	//角色权限管理
import resources from '@/components/permission/resource'		//资源管理


Vue.use(Router)

const routes = [
    {path:'/',name: 'oa_login',component: Login},
    {path:'/index',name:'oa_index',component:Index, 
    	meta: {
            requireAuth: true,
        },children:[
    	{path:'/Pandect',component:Pandect},
    	{path:'/SetInfo',component:SetInfo},
    	{path:'/Mymission',component:Mymission},
    	{path:'/MissionCenter',component:MissionCenter},
    	{path:'/Mybug',component:Mybug},
    	{path:'/Bugcontrol',component:Bugcontrol},
    	{path:'/addbug',component:addBug},
    	{path:'/editbug',component:editbug},
    	{path:'/Api',component:Api},
    	{path:'/document',component:documentContorl},
    	{path:'/createdoc',component:createDoc},
	    {path:'/editdoc',component:editdoc},
    	{path:'/needs',component:Needs},
    	{path:'/addneed',component:addNeed},
    	{path:'/editneed',component:editNeed},
    	{path:'/project',component:Project},
    	{path:'/module',component:Module},
    	{path:'/versions',component:Versions},
    	{path:'/addversion',component:addVersion},
    	{path:'/editversion',component:editVersion},
    	{path:'/account',component:Account},
    	{path:'/usercontrol',component:UserControl},
    	{path:'/rolecontrol',component:RoleControl},
    	{path:'/editpermission',component:editPermission},
    	{path:'/resources',component:resources},
    	{path:'/stat_team',component:teamdata},
    	{path:'/urgenttask',component:urgentTask},
    	{path:'/addurgent',component:addUrgent},
    	{path:'/editurgent',component:editUrgent},
    	{path:'/createtask',component:createtask},
    	{path:'/edittask',component:edittask},
    	{path:'/history',component:historyList},
    	{path:'/edithistory',component:editHistory},
    ]},
    {path:'/bugcontent',component:bugcontent},
    {path:'/doc',component:doc},
    {path:'/needDoc',component:needDoc},
    {path:'/taskDoc',component:taskDoc},
    {path:'/VsDoc',component:vsDoc},
    {path:'/apidoc',component:apiDoc},
	{path:'/historydoc',component:historyDoc},
	{path:'/test',component:test}
  ]
const router = new Router({
  mode:'history',
  routes
}); 
// 页面刷新时，重新赋值token
if (window.localStorage.token) {
    store.commit("login", localStorage.token)
}

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        }
        else {
            next({
                path: '/',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
})
export default router;