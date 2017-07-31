import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'
import Login from '@/components/Login' 						//登录
import Index from '@/components/Index'						//首页
import Pandect from '@/components/Pandect'					//总揽
import SetInfo from '@/components/SetInfo'					//个人设置
import Mymission from '@/components/Mymission'				//我的任务
import MissionCenter from '@/components/MissionCenter'		//任务管理
import taskDoc from '@/components/common/taskDoc'			//任务详情页
import Mybug from '@/components/Mybug'						//我的bug
import Bugcontorl from '@/components/Bugcontorl'			//bug管理
import Api from '@/components/Api'							//api管理
import bugcontent from '@/components/common/bugcontent'			//bug详情页
import documentContorl from '@/components/doc/documentContorl'	//文档管理
import doc from '@/components/doc/doc'						//文档详情页
import editdoc from '@/components/doc/editdoc'				//文档编辑页
import Needs from '@/components/Needs'						//需求管理
import needDoc from '@/components/common/needDoc'			//需求详情页
import Project from '@/components/Project'					//项目管理
import Module from '@/components/Module'					//模块管理
import Versions from '@/components/Versions'			 	//版本管理
import vsDoc from '@/components/common/vsDoc'			//版本详情页

import Account from '@/components/Account'					//帐号管理
import UserContorl from '@/components/UserContorl'			//用户管理

import teamdata from '@/components/teamdata'				//团队概要


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
    	{path:'/Bugcontrol',component:Bugcontorl},
    	{path:'/Api',component:Api},
    	{path:'/document',component:documentContorl},
    	{path:'/needs',component:Needs},
    	{path:'/project',component:Project},
    	{path:'/module',component:Module},
    	{path:'/versions',component:Versions},
    	{path:'/account',component:Account},
    	{path:'/usercontrol',component:UserContorl},
    	{path:'/stat_team',component:teamdata},
    ]},
    {path:'/bugcontent',component:bugcontent},
    {path:'/doc',component:doc},
    {path:'/needDoc',component:needDoc},
    {path:'/taskDoc',component:taskDoc},
    {path:'/VsDoc',component:vsDoc},
    {path:'/editdoc',component:editdoc},
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