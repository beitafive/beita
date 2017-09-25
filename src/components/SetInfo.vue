<template>
	<div class="setInfo">
		<h2>个人信息</h2>
		<p><span>姓名<i>:</i></span>{{userData.realname}}</p>
		<p><span>ID<i>:</i></span>{{userData.id}}</p>
		<p><span>用户名<i>:</i></span>{{userData.username}}</p>
		<p><span>e-mail<i>:</i></span>{{userData.email}}</p>
		<p><span>手机号<i>:</i></span>{{userData.mobile}}</p>
		<p><span>入职时间<i>:</i></span>{{userData.enter_at}}</p>
		<p><span>ssh（1）<i>:</i></span>{{userData.ssh_pub_key1}}</p>
		<p><span>ssh（2）<i>:</i></span>{{userData.ssh_pub_key2}}</p>
		<p><span>ssh（3）<i>:</i></span>{{userData.ssh_pub_key3}}</p>
		<el-button type="info" icon="edit" style="margin:30px" @click="updateUserInfos = true" v-if="bedit"> 编 辑 </el-button>
		<el-button type="info" style="margin-top:30px" @click="editPwd = true" v-if="bcpass"> 修改密码 </el-button>
		<!--编辑个人信息-->
		<el-dialog title="编辑个人信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>用户名 
					<el-tooltip class="item" effect="light" content="用户名无法编辑，如需修改，请联系管理员" placement="top-start">
     					<input type="text" v-model="userData.username" readonly="true"  />
				</el-tooltip>
				</p>
				<p>真名
					<el-tooltip class="item" effect="light" content="真名无法编辑，如需修改，请联系管理员" placement="top-start">
						<input type="text" v-model="userData.realname" readonly="true" />
					</el-tooltip>
				</p>
				<p>邮箱
					<el-tooltip class="item" effect="light" content="邮箱无法编辑，若有错误，请联系管理员" placement="top-start">
						<input type="text" v-model="userData.email" readonly="true" />
					</el-tooltip>
				</p>
				<p>手机号<input type="text" v-model="updatemobile"/></p>
				<p>入职时间
					<el-tooltip class="item" effect="light" content="入职时间无法编辑，若有错误，请联系管理员" placement="top-start">
						<input type="text" v-model="userData.enter_at" placeholder="格式：2017-09-30" readonly="true" />
					</el-tooltip>
				</p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				ssh公钥1
				<textarea v-model="updatessh1" class="content"></textarea>
				</div>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				ssh公钥2
				<textarea v-model="updatessh2" class="content"></textarea>
				</div>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				ssh公钥3
				<textarea v-model="updatessh3" class="content"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateUserInfos = false">取 消</el-button>
		    <el-button type="primary" @click='updateUser' >确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="修改密码" v-model="editPwd" size="tiny">
			<el-input v-model="newPwd" placeholder="请输入新密码" :maxlength="16"></el-input>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="editPwd = false">取 消</el-button>
			    <el-button type="primary" @click='updatePwd' >确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'SetInfo',
	data(){
		return{
			userData:'',		//用户数据
			updateUserInfos:false,//编辑弹窗
			editPwd:false,		  	//更改密码弹窗
			updatemobile:'',		//更新手机号
			updatessh1:'',			//更新ssh1
			updatessh2:'',
			updatessh3:'',
			newPwd:'',				//新密码
			bedit:false,
			bcpass:false,			
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer","self").then(()=>{
			_this.$store.state.perList.includes("self.update")?this.bedit=true:'';
			_this.$store.state.perList.includes("self.change_pass")?this.bcpass=true:'';							
			_this.getList();
		});
	},
	methods:{
		getList(){
			let that = this;
			$.ajax({
				type:"get",
				dataType:'json',
				data:{
					id:sessionStorage.userid
				},
				url:"/api.php?s=/front/get_user",	
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
					}
					if(data.error == 0){
						that.userData=data.data.user[0];
						that.updatemobile = data.data.user[0].mobile;
						that.updatessh1 = data.data.user[0].ssh_pub_key1;
						that.updatessh2 = data.data.user[0].ssh_pub_key2;
						that.updatessh3 = data.data.user[0].ssh_pub_key3;
					}
				}
			});
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				dataType:'json',
				data:{
					id:sessionStorage.userid,
					mobile:that.updatemobile,
					ssh_pub_key1:that.updatessh1,
					ssh_pub_key2:that.updatessh2,
					ssh_pub_key3:that.updatessh3
				},
				url:"/api.php?s=/front/update_user",
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.updateUserInfos = false;
						that.getList();
					}
				}
			});
		},
		updatePwd(){
			let that = this;
			$.ajax({
				type:"post",
				url:"/api.php?s=front/user/changepwd",
				dataType:'json',
				data:{
					password:that.newPwd
				},
				success:(res)=>{
					if(res.error == 0){
						that.$message.success("修改成功！")
						that.editPwd = false;
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		}
	}
})
</script>

<style>
	.setInfo{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.setInfo h2{
		margin-bottom:50px;
	}
	.setInfo p{
		margin:10px 0;
		line-height:30px;
	}
	.setInfo p span{
		display: inline-block;
		width:100px;
		margin-right:15px;
		font-size:20px;
	}
	.setInfo p span i{
		float:right;
	}
	.setInfo .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.setInfo .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.setInfo .addUserInfo input{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.setInfo .content{
		width:75%;
		height:160px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>