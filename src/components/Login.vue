<template>
  <div class="oa_login">
  	<div class='login_form'>
  		<h2>用户登录</h2>
  		<div class="loginInfo">
			  <el-input placeholder="用户名" :maxlength='16'  v-model="username"  style="width:320px;margin: 20px 0 15px 0;" class="inputs">
	</el-input><br />
				<el-input placeholder="密码" :maxlength='16'  v-model="password" type="password"  style="width:320px;" class="inputs">
				</el-input>
				<p><i id="remeberMe" style="display:inline-block;font-size:12px;width:14px;height:14px;border:1px solid #898989;line-height:16px;text-align: center;border-radius:3px;margin:0 10px 0 25px;" @click="rememberMe"></i>记住密码</p>
				<el-button type="primary" style="background:#5CB85C;width:320px;" v-on:click="goLogin">登录</el-button>
  		</div>
  	</div>
  </div>
</template>

<script>
export default {
  name: 'oa_login',
  data() {
    return {
      username: '',
      password:'',
      remeberMe:false
    }
  },
  mounted(){
  	//页面加载完毕后，放入账号密码
  	let that = this;
  	if(localStorage.username){
	  	this.username = localStorage.username;
	  	this.password = localStorage.password;
	  	$("#remeberMe").addClass('el-icon-check');
	  	this.remeberMe = true;
  	}
  	//enter监听事件
		$(".inputs").on('keyup',function(e){
			if(e.keyCode == 13){
				that.goLogin();
			}
		})
  },
  methods: {
    handleIconClick(ev) {
      console.log(ev);
    },
    rememberMe(e){
    	if($(e.target).hasClass('el-icon-check')){
    		$(e.target).removeClass('el-icon-check')
    	}else{
    		$(e.target).addClass('el-icon-check')
    	}
    	this.remeberMe = !this.remeberMe;
    },
    //发送登录验证请求
    goLogin(){
    	//用户名不能为空
    	if(this.username==""){
    		this.$message("请填写用户名")
    		return;
    	}
    	//密码不能为空
    	if(this.password==""){
    		this.$message("请填写密码")
    		return;
    	}
    	let that = this;
    	$.ajax({
    		type:"post",
    		data:{
    			'username':this.username,
    			'password':this.password
    		},
				url:that.$api.login,
				dataType:'json',
    		success:function(res){
    			let data = res
    			if(data.error=="1"){
    				that.$message(data.error_msg)
    			}
    			if(data.error=="0"){
    				// that.$message("登录成功")
    				sessionStorage.userid = data.data.id || '';
    				//记住密码 选中
    				if(that.remeberMe){
    					localStorage.username = that.username;
    					localStorage.password = that.password;
    				}else{
    					//记住密码 未选中
    					if(localStorage.username){
    						localStorage.removeItem('username');
    						localStorage.removeItem('password');
    					}
    				}
    				localStorage.role = data.data.role.toLowerCase();
    				that.$store.dispatch("login",data.data.id)
    				if(that.$store.state.routerName){
    					that.$router.push({path:that.$store.state.routerName})
    				}else{
	    				that.$router.push('/index')    					
    				}
    			}
    		}
    	});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.oa_login{
		height:100%;
		display:-webkit-box;
		-webkit-box-align:center;
		-webkit-box-pack:center;
		background:#f8f8f8;
	}
	.oa_login .login_form{
		width:370px;
		height:270px;
		background:#fff;
		text-align: center;
	}
	.oa_login .login_form p{
		overflow:hidden;
		height:36px;
		display: flex;
		font-size:14px;
		margin:5px 0 10px;
		align-items: center;
	}
	.oa_login .login_form h2{
		background:#f8f8f8;
		font-weight: 100;
		color:#333;
		font-size:16px;
		height:40px;line-height:40px;
		border:1px solid #ddd;
		border-bottom:none;
    margin:0;
	}
	.oa_login .login_form .loginInfo{
		border:1px solid #ddd;
		height:228px;
	}
</style>
