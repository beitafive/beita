<template>
	<div class="editUser">
		<div class="anchu-normal-table">
			<h2 class="anchu-normal-title">编辑用户</h2>
			<div class="anchu-normal-content">
				<p>
					<span>用户名</span>
					<el-input v-model="editname" placeholder="用户名必填" :maxlength="4" style="width:250px"/></el-input></p>

				<p>
					<span>真名</span>
					<el-input v-model="editrealname" placeholder="请填写用户名"  :maxlength="4"  style="width:250px" /></el-input></p>
				<p>
					<span>邮箱</span>
					<el-input v-model="editemail" placeholder="请填写邮箱" :maxlength="30" style="width:250px" /></p>
				<p>
					<span>手机号</span>
					<el-input  v-model="editmobile" placeholder="请填写手机号" :maxlength="11" style="width:250px"/></el-input></p>
				<p>
					<span>入职时间</span>
					<el-date-picker
				      v-model="editenter_at"
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
				      v-model="editleave_at"
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
					<el-input type="textarea" v-model="editssh1"  style="width:558px;" :autosize="{ minRows: 4}"></el-input>
				</p>
				<p>
					<span style="vertical-align: top;">ssh公钥2</span>
				
				<el-input type="textarea" v-model="editssh2"  style="width:558px;" :autosize="{ minRows: 4}"></el-input>
				</p>
				<p>
					<span style="vertical-align: top;">ssh公钥3</span>
				
				<el-input type="textarea" v-model="editssh3"  style="width:558px;" :autosize="{ minRows: 4}"></el-input>
				</p>
				<p>
					<el-button type="primary" @click="editUser" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
					<router-link to="/usercontrol"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import { formatDate, validateMobile, validateEmail } from '@/assets/js/util';
	export default {
		name: "editUser",
		data(){
			return {
				id:'',//用户id
				//添加 所需 数据
				editname:'',
				editrealname:'',
				editemail:'',
				editmobile:'',
				editenter_at:'',
				editleave_at:'',
				editssh1:'',
				editssh2:'',
				editssh3:'',
			}
		},
		mounted(){
			this.id = this.$route.query.id;
			this.getUser(this.id)
		},
		methods:{
			//获取用户信息
			getUser(id){
				let that = this;
				$.ajax({
					type:"get",
					dataType:"json",
					url:that.$api.usercontrol.get,
					data:{
						id:id
					},
					success:function(res){
						let data = res.data;
						that.editname = data.username;
						that.editrealname = data.realname;
						that.editemail = data.email;
						that.editmobile = data.mobile;
						that.editenter_at = data.enter_at;
						that.editleave_at = data.leave_at;
						that.editssh1 = data.ssh_pub_key1;
						that.editssh2 = data.ssh_pub_key2;
						that.editssh3 = data.ssh_pub_key3;	
					}
				});
			},
			//编辑用户信息
			editUser(){
				let that = this;
				let tel = validateMobile(that.editmobile);
				if(tel == false){
					that.$message('手机号码格式有误');
					return false;
				}
				let email = validateEmail(that.editemail)
				if(email == false){
					that.$message('邮箱格式有误');
					return false;
				}
				$.ajax({
					type:"post",
					dataType:'json',
					data:{
						id:that.id,
						username:that.editname,
						realname:that.editrealname,
						email:email,
						mobile:tel,
						enter_at:formatDate(that.editenter_at),
						leave_at:formatDate(that.editleave_at),
						ssh_pub_key1:that.editssh1,
						ssh_pub_key2:that.editssh2,
						ssh_pub_key3:that.editssh3
					},
					url:that.$api.usercontrol.edit,
					success:function(res){
						let data = res;
						if(data.error==1){
							that.$message(data.error_msg);
							return;
						}
						if(data.error==0){
							that.$message("编辑成功");
						}
						that.$router.push("/usercontrol");
					}
				});
			}
		}
	}
</script>

<style scoped>
	.editUser{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	.editUser p{
		margin:20px 0;
	}
	.editUser p span{
		width:100px;
		display: inline-block;
	}
	.editUser p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.editUser p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>