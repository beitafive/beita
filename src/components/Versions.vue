<template>
	<div class="w-versions">
		<h2 style="margin-bottom:20px;">版本管理</h2>
		<button class="addUser" @click="dialogVisible = true">+ 添加版本</button>
		<p style="margin-top:20px;"><el-cascader
		    placeholder="请选择项目"
		    :options="projectarr"
		    filterable
		    style="width:200px;"
		    v-model="findproject"
		    @change="checkChange"
		  ></el-cascader>
		  <el-input v-model="f_title" placeholder="请输入内容" style="width:200px;margin: 0 100px;"></el-input>
		   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
		  <el-button type="primary" icon="search" @click="getList('1',findprojectinfo,f_title)">搜索</el-button>
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
			      width="170">
			    </el-table-column>
			    <el-table-column
			      prop="short_desc"
			      label="简介"
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
			        &nbsp;<router-link :to="{path:'/VsDoc',query:{id:scope.row.id}}" target="_blank"><el-button type="text" size="small">查看</el-button></router-link>
			      </template>
			    </el-table-column>
			  </el-table>
			  <p><button @click="getList(+pageIndex-1,findprojectinfo,f_title)">上一页</button>{{+pageIndex}}/{{allCount}}<button @click="getList(+pageIndex+1,findprojectinfo,f_title)">下一页</button></p>
		</div>
		<el-dialog title="添加版本" v-model="dialogVisible" size="tiny">
			<div class='addUserInfo'>
				<p>项目<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="float:right;width:75%"
				    v-model="addproject"
				    @change="addcheckChange"
				  ></el-cascader>
				</p>
				<p>标题 <input type="text" v-model="addtitle" /></p>
				<p>简介 <input type="text" v-model="addsynopsis" /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				内容	
				<textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addNewUser">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="编辑版本信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>标题 <input type="text" v-model="updatetitle" /></p>
				<p>简介 <input type="text" v-model="updatesynopsis" /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
					内容
					<textarea class="updateContent" placeholder="请添加内容描述" v-model="updatecontent"></textarea>	
				</div>
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
	name:'Versions',
	data(){
		return{
			addtitle:'',//添加-标题
			addcontent:'',//添加-内容
			addsynopsis:'',//添加-简介
			addprojectinfo:'',//添加-项目
			addproject:[],
			f_title:'',//搜索-标题
			findprojectinfo:'',//搜索-项目
			findproject:[],
			tableData:[],//列表数据
			pageIndex:1,//页面下标
			count:'',//列表总数
			allCount:'',//页面总数
			dialogVisible:false,//添加弹窗
			updateUserInfos:false,//编辑弹窗
			updatetitle:'',//编辑 标题
			updatesynopsis:'',//编辑 简介
			updatecontent:'',//编辑 内容
			updateid:'',// 编辑 id
			updateIndex:'',//编辑 列表下标
			updateprojectid:'',//编辑项目id
			projectarr:[],//项目列表数据
			nowUrl:''//现在域名
		}
	},
	mounted(){
		this.getVersions();
		this.getList();
		if(!window.location.origin){
	 		this.nowUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	 	}else{
	 		this.nowUrl = window.location.origin;
	 	}
	},
	methods:{
		//获取版本列表
		getVersions(){
			let that = this;
			$.ajax({
				type:"get",
				dataType:'json',
				url:"/api.php?s=/get_all_project",
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					that.projectarr = data.data.project_arr;
				}
			});
		},
		//获取版本列表
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
				dataType:'json',
				url:"/api.php?s=/get_version_list",
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
					that.tableData = data.data.version_arr;
					that.pageIndex = x || 1;
					that.allCount = Math.ceil(data.data.count/10);
				}
			});
		},
		//添加版本功能
		addNewUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					project_id:that.addprojectinfo,
					short_desc:that.addsynopsis,
					title:that.addtitle,
					content:that.addcontent,
				},
				url:"/api.php?s=/add_version",
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
						that.addproject = [];
						that.addcontent = "";
						that.addsynopsis = '';
						that.addprojectinfo = '';
						that.allCount = data.data.count;
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑用户信息   x为下标index
		updateUserInfo(x){
			this.updateUserInfos = true;
			this.updatesynopsis = this.tableData[x].short_desc;
			this.updatetitle = this.tableData[x].title;
			this.updatecontent = this.tableData[x].content;
			this.updateid = this.tableData[x].id;
			this.updateprojectid = this.tableData[x].project_id;
			this.updateIndex = x;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					project_id:that.updateprojectid,
					short_desc:that.updatesynopsis,
					title:that.updatetitle,
					content:that.updatecontent
				},
				url:"/api.php?s=/update_version",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.getList(that.pageIndex);
						that.updateUserInfos = false;
					}
				}
			});
		},
		//获取checkbox的值
		checkChange(value){
			this.findprojectinfo = value[0];
		},
		//获取checkbox的值
		addcheckChange(value){
			this.addprojectinfo = value[0];
		},
		//清空搜索框
		clearSearch(){
			this.findproject = [];
			this.f_title = '';
			this.findprojectinfo = '';
		}
	}
})
</script>

<style>
	.w-versions{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-versions .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.w-versions .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.w-versions .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:16px;
		color:#333;
	}
	.w-versions .addUserInfo input:nth-child(1){
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		margin-left:10px;
		border-radius:4px;
	}
	.w-versions .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-versions .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-versions .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.w-versions .content,.w-versions .updateContent{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>