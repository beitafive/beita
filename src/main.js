// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
import './assets/css/reset.css'
import store from '@/vuex/store'
import api from '@/api.js'

Vue.prototype.$api = api;

Vue.config.productionTip = false

Vue.use(ElementUI)



$(document).ajaxSuccess(function(event, xhr, settings,res) {
	if(res.error == 1 && res.error_code == 'NOT_LOGIN'){
	 	router.push("/")
	}
});

$.ajaxSetup({
   beforeSend: function(request) {
        request.setRequestHeader("Test", "wuzq");
    },
});

//检测JS错误
//window.onerror=fnErrorTrap;
//function fnErrorTrap(sMsg,sUrl,sLine){
//	console.log(sMsg,sUrl,sLine)
//	return true;
//}
//Vue.config.errorHandler = function (err, vm, info) {
//// handle error
//// `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
//// 只在 2.2.0+ 可用
//console.log(err)
//console.log(vm)
//console.log(info)
//}
try{
	new Vue({
	  el: '#app',
	  router,
	  store:store,
	  template: '<App/>',
	  components: { App }
	})
	
}catch(e){
	alert(e.name)
}
