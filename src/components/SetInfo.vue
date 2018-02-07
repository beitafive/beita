<template>
	<div class="setInfo">
		<div class="info-wrap">
			<div class="title">个人信息</div>
			<div class="info-name">
				<span>姓名</span>
				<p>{{userData.realname}}</p>
			</div>
			<div class="info-name">
				<span>ID</span>
				<p>{{userData.id}}</p>
			</div>
			<div class="info-name">
				<span>用户名</span>
				<p>{{userData.username}}</p>
			</div>
			<div class="info-name">
				<span>e-mail</span>
				<p>{{userData.email}}</p>
			</div>
			<div class="info-name">
				<span>手机号</span>
				<p>{{userData.mobile}}</p>
			</div>
			<!-- <div class="info-name">
				<span>积分</span>
				<p>{{userData.point}}</p>
			</div> -->
			<div class="info-name">
				<span>入职时间</span>
				<p>{{userData.enter_at}}</p>
			</div>
			<div class="info-name">
				<span>ssh（1）</span>
				<p>{{userData.ssh_pub_key1}}</p>
			</div>
			<div class="info-name">
				<span>ssh（2）</span>
				<p>{{userData.ssh_pub_key2}}</p>
			</div>
			<div class="info-name" style="margin-bottom: 20px;">
				<span>ssh（3）</span>
				<p>{{userData.ssh_pub_key3}}</p>
			</div>

		</div>
		
		<el-button type="info" icon="edit" style="margin:30px;" @click="updateUserInfos = true" v-if="bedit"> 编 辑 </el-button>
		<el-button type="info" style="margin-top:30px;" @click="editPwd = true" v-if="bcpass"> 修改密码 </el-button>
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
				url:that.$api.usercontrol.get,
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
					}
					if(data.error == 0){
						that.userData=data.data;
						that.updatemobile = data.data.mobile;
						that.updatessh1 = data.data.ssh_pub_key1;
						that.updatessh2 = data.data.ssh_pub_key2;
						that.updatessh3 = data.data.ssh_pub_key3;
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
				url:that.$api.usercontrol.edit,
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
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
				url:that.$api.usercontrol.changepwd,
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
	
	.setInfo .info-wrap{
		width: 730px;
		border-radius: 4px;
		font-size: 16px;
		box-sizing: border-box;
		border:1px solid #D0D0D0;
	}
	.setInfo .info-wrap .title{
		height: 44px;
		line-height: 44px;
		padding-left: 30px;
		background: #EEEFF6;
		border-bottom: 1px solid #D0D0D0;
	}
	.setInfo .info-name{
		width: 730px;
		position: relative;
		padding: 10px 0;
	}
	.setInfo .info-name:after{
		position: absolute;
		left: 30px;
		top: 0;
		content: ' ';
		width: 670px;
		border-bottom:1px solid #D0D0D0;
	}
	.setInfo .info-name:nth-of-type(2){
		margin-top: 20px;
	}
	.setInfo .info-name:nth-of-type(2):after {
		position: absolute;
		left: 30px;
		top: 0;
		content: ' ';
		width: 670px;
		border-bottom:1px solid #fff;
	}
	.setInfo .info-name span{
		width: 200px;
		display: inline-block;
		line-height: 30px;
		text-align: center;
		vertical-align: top;
	}
	.setInfo .info-name p{
		width: 500px;
		display: inline-block;
		margin: 0;
	}

</style>