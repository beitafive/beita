<template>
	<div class="usercontorl">
		<h2 style="margin-bottom:20px;">用户管理</h2>
		<button class="addUser" @click="dialogVisible = true">+ 添加用户</button>
		<div class="tables">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="80">
			    </el-table-column>
			    <el-table-column
			      prop="username"
			      label="用户名"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="realname"
			      label="姓名"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="email"
			      label="邮箱"
			      width="250">
			    </el-table-column>
			    <el-table-column
			      prop="mobile"
			      label="手机号"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="enter_at"
			      label="入职时间"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="leave_at"
			      label="离职时间"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="100">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index)">编辑</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			  <p><button @click="getList(+pageIndex-1,10)">上一页</button>{{+pageIndex}}/{{allCount}}<button @click="getList(+pageIndex+1,10)">下一页</button>总人数：{{count}}</p>
		</div>
		<el-dialog title="添加用户" v-model="dialogVisible" size="tiny">
			<div class='addUserInfo'>
				<p>用户名 <input type="text" v-model="addname" placeholder="用户名必填"/></p>
				<p>密码<input type="text" v-model="addpassword" placeholder="密码必填"/></p>
				<p>真名<input type="text" v-model="addrealname" /></p>
				<p>邮箱<input type="text" v-model="addemail"/></p>
				<p>手机号<input type="text" v-model="addmobile"/></p>
				<p>入职时间<input type="text" v-model="addenter_at" placeholder="格式：2017-09-30"/></p>
				<p>离职时间<input type="text" v-model="addleave_at" placeholder="格式：2017-09-30"/></p>
				<h3 style="overflow:hidden;margin-top:20px;">
				ssh公钥1
				<textarea class="updateContent" v-model="addssh1"></textarea>
				</h3>
				<h3 style="overflow:hidden;margin-top:20px;">
				ssh公钥2
				<textarea class="updateContent" v-model="addssh2"></textarea>
				</h3>
				<h3 style="overflow:hidden;margin-top:20px;">
				ssh公钥3
				<textarea class="updateContent" v-model="addssh3"></textarea>
				</h3>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addNewUser">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="编辑用户信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>用户名 <input type="text" v-model="updateusername"  /></p>
				<p>真名<input type="text" v-model="updaterealname" /></p>
				<p>邮箱<input type="text" v-model="updateemail" /></p>
				<p>手机号<input type="text" v-model="updatemobile"/></p>
				<p>入职时间<input type="text" v-model="updateenter_at" placeholder="格式：2017-09-30"/></p>
				<p>离职时间<input type="text" v-model="updateleave_at" placeholder="格式：2017-09-30"/></p>
				<h3 style="overflow:hidden;margin-top:20px;">
				ssh公钥1
				<textarea class="updateContent" v-model="updatessh1"></textarea>
				</h3>
				<h3 style="overflow:hidden;margin-top:20px;">
				ssh公钥2
				<textarea class="updateContent" v-model="updatessh2"></textarea>
				</h3>
				<h3 style="overflow:hidden;margin-top:20px;">
				ssh公钥3
				<textarea class="updateContent" v-model="updatessh3"></textarea>
				</h3>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateUserInfos = false">取 消</el-button>
		    <el-button type="primary" @click='updateUser' >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'Pandect',
	data(){
		return{
			tableData:[],
			count:'',
			pageIndex:1,
			allCount:'',
			dialogVisible:false,
			updateUserInfos:false,
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
			updateusername:'',
			updaterealname:'',
			updateemail:'',
			updateid:'',
			updateIndex:'',
			updatemobile:'',
			updateenter_at:'',
			updateleave_at:'',
			updatessh1:'',
			updatessh2:'',
			updatessh3:''
		}
	},
	mounted(){
		this.getList();
	},
	methods:{
		getList(x){
			let that = this;
			if(x=="0"){
				this.$message("没有上一页")
				return;
			}
			$.ajax({
				type:"get",
				data:{
					page:x||1
				},
				url:"/api.php?s=/get_user_list",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
						if(that.allCount!="" && x<=that.allCount){
							that.tableData = [];
						}
						return;
					}
					that.count = data.data.count;
					that.allCount = Math.ceil(data.data.count/10);
					that.tableData = data.data.user_arr;
					that.pageIndex = x || 1;
				}
			});
		},
		//添加新用户功能
		addNewUser(){
			let that = this;
			$.ajax({
				type:"post",
				dataType:'json',
				data:{
					username:that.addname,
					realname:that.addrealname,
					password:that.addpassword,
					email:that.addemail,
					mobile:that.addmobile,
					enter_at:that.addenter_at,
					leave_at:that.addleave_at,
					ssh_pub_key1:that.addssh1,
					ssh_pub_key2:that.addssh2,
					ssh_pub_key3:that.addssh3
				},
				url:"/api.php?s=/add_user",
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message);
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
					that.getList();
				}
			});
		},
		//编辑用户信息   x为下标index
		updateUserInfo(x){
			this.updateUserInfos = true;
			this.updateusername = this.tableData[x].username;
			this.updaterealname = this.tableData[x].realname;
			this.updateemail = this.tableData[x].email;
			this.updateid = this.tableData[x].id;
			this.updatemobile = this.tableData[x].mobile;
			this.updateenter_at = this.tableData[x].enter_at;
			this.updateleave_at = this.tableData[x].leave_at;
			this.updatessh1 = this.tableData[x].ssh_pub_key1;
			this.updatessh2 = this.tableData[x].ssh_pub_key2;
			this.updatessh3 = this.tableData[x].ssh_pub_key3;
			this.updateIndex = x;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				dataType:'json',
				data:{
					id:that.updateid,
					username:that.updateusername,
					realname:that.updaterealname,
					email:that.updateemail,
					mobile:that.updatemobile,
					enter_at:that.updateenter_at,
					leave_at:that.updateleave_at,
					ssh_pub_key1:that.updatessh1,
					ssh_pub_key2:that.updatessh2,
					ssh_pub_key3:that.updatessh3
				},
				url:"/api.php?s=/update_user",
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.tableData[that.updateIndex].username = that.updateusername;
						that.tableData[that.updateIndex].realname = that.updaterealname;
						that.tableData[that.updateIndex].email = that.updateemail;
						that.tableData[that.updateIndex].mobile = that.updatemobile;
						that.tableData[that.updateIndex].enter_at = that.updateenter_at;
						that.tableData[that.updateIndex].leave_at = that.updateleave_at;
						that.tableData[that.updateIndex].ssh_pub_key1 = that.updatessh1;
						that.tableData[that.updateIndex].ssh_pub_key2 = that.updatessh2;
						that.tableData[that.updateIndex].ssh_pub_key3 = that.updatessh3;
						that.updateusername="";
						that.updaterealname="";
						that.updateemail="";
						that.updatemobile="";
						that.updateenter_at="";
						that.updateleave_at="";
						that.updatessh1="";
						that.updatessh2="";
						that.updatessh3="";
						that.updateUserInfos = false;
					}
				}
			});
		}
	}
})
</script>

<style>
	.usercontorl{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.usercontorl .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.usercontorl .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.usercontorl .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.usercontorl .addUserInfo input{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.usercontorl .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.usercontorl .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.usercontorl .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.usercontorl .updateContent{
		width:75%;
		height:120px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
		/*margin-top:10px;*/
	}
</style>