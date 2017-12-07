<template>
	<div class="addUser">
		<div class="anchu-normal-table">
			<h2 class="anchu-normal-title">添加用户</h2>
			<div class="anchu-normal-content">
				<p>
					<span>用户名</span>
					<el-input v-model="addname" placeholder="请填写用户名" :maxlength="4" style="width:250px"/></el-input></p>
				<p>
					<span>密码</span>
					<el-input v-model="addpassword" type="password" placeholder="请填写密码" :maxlength="12" style="width:250px" /></el-input></p>

				<p>
					<span>真名</span>
					<el-input v-model="addrealname" placeholder="请填写真名"  :maxlength="4"  style="width:250px" /></el-input></p>
				<p>
					<span>邮箱</span>
					<el-input v-model="addemail" placeholder="请填写邮箱" :maxlength="30" style="width:250px" /></p>
				<p>
					<span>手机号</span>
					<el-input  v-model="addmobile" placeholder="请填写手机号" :maxlength="11" style="width:250px"/></el-input></p>
				<p>
					<span>入职时间</span>
					<el-date-picker
				      v-model="addenter_at"
				      type="date"
				      placeholder="格式：2017-09-30"
				      format="yyyy-MM-dd"
				      value-format="yyyy-MM-dd"
				      style="width: 250px;"
				    >
				    </el-date-picker>
				</p>
				<p><span>离职时间</span>
					<el-date-picker
				      v-model="addleave_at"
				      type="date"
				      placeholder="格式：2017-09-30"
				      format="yyyy-MM-dd"
				      value-format="yyyy-MM-dd"
				      style="width: 250px;"
				     >
				    </el-date-picker>
				</p>
			    
				<p>
					<span style="vertical-align: top;">ssh公钥1</span>
					<el-input type="textarea" v-model="addssh1"  style="width:558px;" :autosize="{ minRows: 4}"></el-input>
				</p>
				<p>
					<span style="vertical-align: top;">ssh公钥2</span>
				
				<el-input type="textarea" v-model="addssh2"  style="width:558px;" :autosize="{ minRows: 4}"></el-input>
				</p>
				<p>
					<span style="vertical-align: top;">ssh公钥3</span>
				
				<el-input type="textarea" v-model="addssh3"  style="width:558px;" :autosize="{ minRows: 4}"></el-input>
				</p>
				<p>
					 <el-button type="primary" @click="addNewUser" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
					<router-link to="/usercontrol"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import { formatDate, validateMobile, validateEmail } from '@/assets/js/util';
	export default {
		name: "addUser",
		data(){
			return {
				//添加 所需 数据
				addname:'',
				addrealname:'',
				addemail:'',
				addpassword:'',
				addmobile:'',
				addenter_at:'',
				addleave_at:'',
				addssh1:'',
				addssh2:'',
				addssh3:'',
			}
		},
		mounted(){

		},
		methods:{
			//添加新用户功能
			addNewUser(){
				let that = this;
				if(that.addpassword == ''){
					that.$message('请填写密码');
					return false;
				}
				let tel = validateMobile(that.addmobile);
				if(tel == false){
					that.$message('手机号码格式有误');
					return false;
				}
				let email = validateEmail(that.addemail)
				if(email == false){
					that.$message('邮箱格式有误');
					return false;
				}
				$.ajax({
					type:"post",
					dataType:'json',
					data:{
						username:that.addname,
						realname:that.addrealname,
						password:that.addpassword,
						email:email,
						mobile:tel,
						enter_at:formatDate(that.addenter_at),
						leave_at:formatDate(that.addleave_at),
						ssh_pub_key1:that.addssh1,
						ssh_pub_key2:that.addssh2,
						ssh_pub_key3:that.addssh3
					},
					url:that.$api.usercontrol.add,
					success:function(res){
						let data = res;
						if(data.error==1){
							that.$message(data.error_msg);
							return;
						}
						if(data.error==0){
							that.dialogVisible = false;
							that.addname="";
							that.addrealname="";
							that.addpassword="";
							that.addemail="";
							that.addmobile="";
							that.addenter_at="";
							that.addleave_at="";
							that.addssh1="";
							that.addssh2="";
							that.addssh3="";
							that.$message("添加成功");
						}
						that.$router.push("/usercontrol");
					}
				});
			}
			
		}
	}
</script>

<style scoped>
	.addUser{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	.addUser p{
		margin:20px 0;
	}
	.addUser p span{
		width:100px;
		display: inline-block;
	}
	.addUser p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addUser p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>