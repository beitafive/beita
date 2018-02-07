<template>
	<div class="usercontrol" v-if="bload">
		<div  class="co-inner-head">
			<h2 class="co-head-title">
				{{pageInfo.basic.page_title}}
			</h2>
			<el-button  @click="addUser"  v-if="badd&&pageInfo.operate_area.add" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p class="co-search-wrap">
				<span  class="co-search-condition">
					<span v-if="pageInfo.search_area.username"  class="co-search-name">{{pageInfo.search_area.username.username}}</span>			<el-input v-model="find_username" @keyup.enter.native="search" placeholder="请输入内容" style="width:200px;margin:0 15px"></el-input>	
				</span>
				<el-button type="primary" @click="search" style="padding: 10px 37px;">搜索</el-button>
			</p>

		</div>
		<span class="page-info">用户总数：{{count}}</span>
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			    v-loading="$store.state.bload"
    			element-loading-text="这应该是网络的问题..."
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="70">
			    </el-table-column>
			    <el-table-column
			      prop="username"
			      label="用户名"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="realname"
			      label="真实姓名"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="email"
			      label="邮箱"
			      min-width="200"
			     >
			    </el-table-column>
			    <el-table-column
			      prop="mobile"
			      label="手机"
			      width="150"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="role"
			      label="角色"
			      min-width="200"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="department_name"
			      label="部门"
			     min-width="150">
			    </el-table-column>
			    <!-- <el-table-column
			      prop="point"
			      label="积分"
			     width="100">
			    </el-table-column> -->
			    <!-- <el-table-column v-for="(item,index) in pageInfo.data_area" key="item" :prop="item.value" :label="item.label" :width="item.width">
			    	
			    </el-table-column> -->
			    <el-table-column
			      label="操作"
			      width="230">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope)" v-if="bedit">编辑</el-button>
			        <el-button type="text" size="small" @click="getrolelist(scope.row)" v-if="beditrole">分配角色</el-button>
			        <el-button type="text" size="small" @click="getDepartmentList(scope.row)" v-if="beditdepartment">分配部门</el-button>
			        <el-button type="text" size="small" @click="resetPassword(scope.row)" v-if="bresetpassword">重置密码</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			  <w-page></w-page>
		</div>

		<el-dialog title="分配角色" v-model="editroleTip" size="small">
			<div class='addUserInfo'>
				<el-checkbox v-for="(val,index) in roleList" :label="val.title" :key="index" v-model="val.check">{{val.title}}</el-checkbox>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editroleTip = false">取 消</el-button>
		    <el-button type="primary" @click='submitUR' >确 定</el-button>
		  </span>
		</el-dialog>

		<el-dialog title="分配部门" v-model="editDepartmentTip" size="small">
			<div class='addUserInfo'>
				  <el-radio-group v-for="(val,index) in departmentList" v-model="depId" :key="index" style="padding-right: 10px;">
				    <el-radio :label="val.id">{{val.name}}</el-radio>
				  </el-radio-group>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDepartmentTip = false">取 消</el-button>
		    <el-button type="primary" @click='submitDep(depId)' >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import wPage from '../common/page'
	
export default({
	name:'Pandect',
	components:{
		wPage
	},
	data(){
		return{
			bload:false,
			find_username:'',
			count:'',
			pageIndex:1,				//当前页数
			allCount:'',				//总页数
			editroleTip:false,			//分配角色弹窗
			editDepartmentTip:false,	//分配部门弹窗
			params:{
				url:'',
				data:{
					
				}
			},
			
			//角色
			roleList:[],
			user_id:'',
			//部门
			departmentList:[],
			depId:'',
			badd:false,
			bedit:false,
			beditrole:false,
			beditdepartment:false,
			bresetpassword:false,
			
			pageInfo:""
		}
	},
	beforeMount(){
		this.getList();	
	},
	mounted(){
		let that = this;
		this.$store.dispatch("getPer",'user').then(()=>{
			that.$store.state.perList.includes("user.add")?this.badd=true:'';
			that.$store.state.perList.includes("user.edit")?this.bedit=true:'';
			that.$store.state.perList.includes("user.editrole")?this.beditrole=true:'';
			that.$store.state.perList.includes("user.editdepartment")?this.beditdepartment=true:'';
			that.$store.state.perList.includes("user.resetpassword")?this.bresetpassword=true:'';
		})
		
	},
	computed:{
		tableData(){
			return this.$store.getters.getList;
		}
	},
	methods:{
		//搜索
		search(){
			this.getList(1);
		},
		//获取部门列表
		getDepartmentList(row){
			let that = this;
			that.user_id = row.id;
			$.ajax({
				type:"get",
				url:that.$api.department.getlist,
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.editDepartmentTip = true;
						that.departmentList = res.data.data;
						that.depId = row.department_id;
					}else{
						that.$message.error(res.data.error_msg)
					}
				}
			});
		},
		//新增用户
		addUser(){
			this.$router.push('/addUser');
		},
		//分配部门
		submitDep(id){
			let that = this;
			$.ajax({
				type:"post",
				url:that.$api.department.assign,
				dataType:'json',
				data:{
					department_id: id,
					user_id: that.user_id
				},
				success:(res)=>{
					if(res.error == 0){
						that.editDepartmentTip = false;
						that.depId = '';
						that.$message('分配成功');
						that.getList();
						
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		},	
		//重置密码
		resetPassword(){
			let that = this;
			this.$confirm('是否确认重置密码?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	$.ajax({
	        		type:"get",
					url:that.$api.usercontrol.reset_password,
					dataType:'json',
					success:(res) => {
						if(res.error == 0){
							that.$message({
					            type: 'success',
					            message: '重置成功!'
					          });
							that.getList();
							
						}else{
							that.$message.error(res.error_msg)
						}
					}
	        	})
	          
	        }).catch(() => {
	          that.$message({
	            type: 'info',
	            message: '已取消重置'
	          });          
	        });
		},
		//发送用户部门请求
		submitUR(){
			let that = this;
			let arr = [];
			this.departmentList.map((item)=>{
				if(item.check){
					arr.push(item.role_id)
				}
			})
			$.ajax({
				type:'post',
				url:that.$api.usercontrol.editrole,
				data:{
					user_id:that.user_id,
					role_id:arr.join(',')
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.editroleTip = false;
					}else{
						that.$message.error(res.error_msg);
					}
				}
			})
		},
		//获取角色列表
		getrolelist(row){
			let that = this;
			that.user_id = row.id;
			$.ajax({
				type:"get",
				url:that.$api.usercontrol.getrolelist,
				data:{
					user_id:that.user_id
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.editroleTip = true;
						that.roleList = res.data;
						that.roleList.map((item)=>{
							item.check==0?item.check=false:item.check=true;
						})
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		},
		//发送用户角色请求
		submitUR(){
			let that = this;
			let arr = [];
			this.roleList.map((item)=>{
				if(item.check){
					arr.push(item.role_id)
				}
			})
			$.ajax({
				type:'post',
				url:that.$api.usercontrol.editrole,
				data:{
					user_id:that.user_id,
					role_id:arr.join(',')
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.editroleTip = false;
					}else{
						that.$message.error(res.error_msg);
					}
				}
			})
		},
		//获取列表
		getList(num){
			let that = this;
			this.params.url = this.$api.usercontrol.getlist;
			this.params.data = '&search[username]='+this.find_username;
			this.params.get_url = this.$api.usercontrol.get_user_page;
			that.$store.dispatch("get_page_info",that.params).then((data)=>{
				that.pageInfo = data;
				that.$store.dispatch("page_go",num);
				that.count = that.$store.state.pagination.item_total;
				that.bload = true;
			})
		},
		//编辑用户信息   x为下标index
		updateUserInfo(x){
			this.$router.push({path:'/editUser',query:{id:x.row.id}});
		},
		formatDate(date){
			if(date == ''){
				return '';
			}else{
				var d = new Date(date);
				var year = d.getFullYear();
				var month = d.getMonth()+1;
				var day = d.getDate();
				if (month < 10) month = '0' + month;
			  	if (day < 10) day = '0' + day;

			 	return [year, month, day].join('-');
				
			}
		}
	}
})
</script>

<style>
	.usercontrol{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	
	.usercontrol .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.usercontrol .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	} 
	.usercontrol .addUserInfo .inputInfo{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.usercontrol .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.usercontrol .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	/*.usercontrol .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}*/
	.usercontrol .updateContent{
		width:75%;
		height:120px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
		/*margin-top:10px;*/
	}
	.el-loading-spinner .circular {
		width:80px!important;
		height:80px!important;
	}

</style>