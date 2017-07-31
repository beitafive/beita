<template>
	<div class="w-module">
		<h2 style="margin-bottom:20px;">模块管理</h2>
		<button class="addUser" @click="dialogVisible = true">+ 添加模块</button>
		<p style="margin-top:20px;"><el-cascader
		    placeholder="请选择项目"
		    :options="options"
		    filterable
		    style="width:200px;"
		    v-model="selectProject"
		    @change="checkChange"
		  ></el-cascader>
		  <el-input v-model="f_title" placeholder="请输入搜索标题" style="width:200px;margin: 0 100px;"></el-input>
		   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
		  <el-button type="primary" icon="search" @click="getList('1',checkInfo,f_title)">搜索</el-button>
		</p>
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
			      prop="project_name"
			      label="项目名称"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="标题"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="300">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="100">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index)">编辑</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			  <p><button @click="getList(+pageIndex-1,checkInfo,f_title)">上一页</button>{{+pageIndex}}/{{allCount}}<button @click="getList(+pageIndex+1,checkInfo,f_title)">下一页</button></p>
		</div>
		<el-dialog title="添加模块" v-model="dialogVisible" size="tiny">
			<div class='addUserInfo'>
				<p>项目<el-cascader
				    placeholder="请选择项目"
				    :options="options"
				    filterable
				    style="float:right;width:75%"
				    v-model="addselect"
				    @change="addcheckChange"
				  ></el-cascader>
				</p>
				<p>标题 <input type="text" v-model="addtitle" /></p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addNewUser">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="编辑模块信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>标题 <input type="text" v-model="updatetitle" /></p>
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
	name:'Module',
	data(){
		return{
			f_title:'',
			tableData:[],
			pageIndex:1,
			count:'',
			allCount:'',
			dialogVisible:false,
			updateUserInfos:false,
			addtitle:'',
			updatetitle:'',
			updateid:'',
			updateIndex:'',
			options:[],
			checkInfo:'',
			addcheckInfo:'',
			selectProject:[],
			addselect:[]
		}
	},
	mounted(){
		this.getProject();
		this.getList();
	},
	methods:{
		//获取项目列表
		getProject(){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_project",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					that.options = data.data.project_arr;
				}
			});
		},
		//获取需求列表
		getList(x,y,z){
			let that = this;
			if(x=='0'){
				that.$message("没有上一页");
				return;
			}
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					project_id:y,
					title:z
				},
				url:"/api.php?s=/get_module_list",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
						if(that.allCount!="" && x<=that.allCount){
							that.tableData = [];
						};
						return;
					}
					that.count = data.data.count;
					that.tableData = data.data.module_arr;
					that.pageIndex = x || 1;
					that.allCount = Math.ceil(data.data.count/10);
				}
			});
		},
		//添加需求功能
		addNewUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					project_id:that.addcheckInfo,
					title:that.addtitle
				},
				url:"/api.php?s=/add_module",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message);
						return;
					}
					if(data.error==0){
						that.dialogVisible = false;
						that.addtitle = "";
						that.addselect = [];
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑用户信息   x为下标index
		updateUserInfo(x){
			this.updateUserInfos = true;
			this.updatetitle = this.tableData[x].title;
			this.updateid = this.tableData[x].id;
			this.updateIndex = x;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					title:that.updatetitle
				},
				url:"/api.php?s=/update_module",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.tableData[that.updateIndex].title = that.updatetitle;
						that.updateUserInfos = false;
					}
				}
			});
		},
		//获取checkbox的值
		checkChange(value){
			this.checkInfo = value[0];
		},
		//获取checkbox的值
		addcheckChange(value){
			this.addcheckInfo = value[0];
		},
		//清空搜索框
		clearSearch(){
			this.selectProject = [];
			this.f_title = '';
			this.checkInfo = '';
		}
	}
})
</script>

<style>
	.w-module{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-module .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.w-module .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.w-module .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:16px;
		color:#333;
	}
	.w-module .addUserInfo input:nth-child(1){
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		margin-left:10px;
		border-radius:4px;
	}
	.w-module .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-module .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-module .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.w-module .content,.w-module .updateContent{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>