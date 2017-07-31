// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
import './assets/css/reset.css'
import store from '@/vuex/store'

Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
let sHref = '';//声明变量来检测域名

if(!window.location.origin){
	//IE兼容
	sHref =  window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}else{
	sHref = window.location.origin;
}
//判断访问那个API
if(sHref == 'http://localhost:8085'){
	store.state.sApi = '/local.php'
	console.log(store.state.sApi)
}else{
	store.state.sApi = '/api.php'
}

$(document).ajaxSuccess(function(event, xhr, settings,res) {
 if(res.error == 1 && res.error_code == 'NOT_LOGIN'){
 	router.push("/")
 }
 
});


new Vue({
  el: '#app',
  router,
  store:store,
  template: '<App/>',
  components: { App }
})
