<template>
	<div class="missioncenter">
		<h2>任务管理</h2>
		<button class="addUser" @click="addmission = true">+ 添加任务</button>
		<p style="margin-top:20px;"><el-cascader
		    placeholder="请选择项目"
		    :options="projectarr"
		    filterable
		    style="width:200px;"
		    v-model="findproject"
		    @change="findprojectchange"
		  ></el-cascader>
		  <el-select v-model="find_version" placeholder="请选择版本" style="width:200px;">
		    <el-option
		      v-for="item in find_versionArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  <el-cascader
		    placeholder="请选择模块"
		    :options="findmodulearr"
		    filterable
		    style="width:200px;"
		    v-model="findmodule"
		    @change="findmodulechange"
		  ></el-cascader>
		  <el-cascader
		    placeholder="请选择执行者"
		    :options="ownerarr"
		    filterable
		    style="width:200px;"
		    v-model="findowner"
		    @change="findownerchange"
		  ></el-cascader>
		  <el-input v-model="f_title" placeholder="请输入内容" style="width:200px;"></el-input>
		   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
		  <el-button type="primary" icon="search" @click="getList(1)">搜索</el-button>
		<!--列表展示-->
		<div class="tables">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="90">
			    </el-table-column>
			    <el-table-column
			      prop="project"
			      label="所属项目"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="version"
			      label="所属版本"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="module"
			      label="所属模块"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="标题"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="status_name"
			      label="状态"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="realname"
			      label="执行者"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="ep"
			      label="紧急程度"
			      width="66">
			    </el-table-column>
			    <el-table-column
			      prop="dp"
			      label="难度"
			      width="70">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index,scope.row)" v-if="role=='project_manager'||role=='depart_manager'">编辑</el-button>
			        <el-button type="text" size="small" @click="finishItem(scope.$index,scope.row)" v-if="role=='developer'&&scope.row.status=='WAIT'">完成</el-button>
			        <el-button type="text" size="small" @click="closeItem(scope.$index,scope.row)" v-if="(role=='project_manager'||role=='depart_manager')&&scope.row.status=='FINISHED'">关闭</el-button>
			        <router-link :to="{path:'/taskDoc',query:{id:scope.row.id}}" target="_blank">
				        <el-button type="text" size="small" style="margin-left:20px">查看</el-button>
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p><span style="margin-right:100px;">任务总数：{{count}}</span><el-button type="primary" icon="arrow-left" @click="prePage">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
		</div>
		<!--添加任务-->
		<el-dialog title="添加任务" v-model="addmission" size="tiny">
			<div class='addUserInfo'>
				<p>选择项目
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addproject"
				    @change="addprojectchange"
				  ></el-cascader></p>
				<p>选择版本
					<el-select v-model="add_version" placeholder="请选择版本" style="float:right;width:75%;">
				    <el-option
				      v-for="item in add_versionArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select></p>
				<p>选择模块
				<el-cascader
				    placeholder="请选择模块"
				    :options="addmodulearr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addmodule"
				    @change="addmodulechange"
				  ></el-cascader></p>
				<p>标题 <input type="text" v-model="addtitle" /></p>
				<p>执行者
					<el-cascader
				    placeholder="请选择执行者"
				    :options="ownerarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addowner"
				    @change="addownerchange"
				  ></el-cascader></p>
				<p>紧急程度 <input type="text" v-model="add_ep" /></p>
				<p>难度 <input type="text" v-model="add_dp" /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				内容
				<textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addmission = false">取 消</el-button>
		    <el-button type="primary" @click="addMission">确 定</el-button>
		  </span>
		</el-dialog>
		<!--编辑任务信息-->
		<el-dialog title="编辑任务信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>选择项目
				<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updateproject"
				    @change="updateprojectchange"
				  ></el-cascader></p>
				<p>选择版本
					<el-select v-model="update_version" placeholder="请选择版本" style="float:right;width:75%;">
				    <el-option
				      v-for="item in update_versionArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select></p>
				<p>选择模块
				<el-cascader
				    placeholder="请选择模块"
				    :options="updatemodulearr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updatemodule"
				    @change="updatemodulechange"
				  ></el-cascader></p>
				<p>标题 <input type="text" v-model="updatetitle" /></p>
				<p>执行者
					<el-cascader
				    placeholder="请选择执行者"
				    :options="ownerarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updateowner"
				    @change="updateownerchange"
				  ></el-cascader></p>
				<p>紧急程度 <input type="text" v-model="update_ep" /></p>
				<p>难度 <input type="text" v-model="update_dp" /></p>
				  <p>状态
					<el-cascader
					    placeholder="请选择状态"
					    :options="options3"
					    filterable
					    style="float:right;width:75%;"
					    v-model="updatestatus"
					    @change="changestatus"
					  ></el-cascader></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				内容
				<textarea class="content" placeholder="请添加内容描述" v-model="updatecontent"></textarea>
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
	name:'MissionCenter',
	data(){
		return{
			role:localStorage.role, 	//角色
			tableData:[],//列表数据
			projectarr:[],//项目列表
			ownerarr:[],//执行者列表
			pageIndex:'',//页面下标
			allCount:'',//列表总条数
			count:'',//任务总条数
			updateUserInfos:false,//编辑页面弹窗
			addmission:false,//添加页面弹窗
			//搜索，项目
			findproject:[],
			findprojectinfo:'',
			//搜索，版本
			find_versionArr:[],
			find_version:'',
			//搜索，标题
			f_title:'',
			//搜索，模块
			findmoduleinfo:'',
			findmodulearr:[],
			findmodule:[],
			//搜索，执行者
			findowner:[],
			findownerinfo:'',
			findownerarr:[],
			//添加，紧急程度 难度
			add_ep:'',
			add_dp:'',
			//添加，版本
			add_versionArr:[],
			add_version:'',
			//添加，项目
			addproject:[],
			addprojectinfo:'',
			//添加，模块
			addmodulearr:[],
			addmodule:[],
			addmoduleinfo:'',
			//添加，执行者
			addowner:[],
			addownerinfo:'',
			addtitle:'',//添加，标题
			addcontent:'',//添加，内容
			//编辑，紧急程度 难度
			update_ep:'',
			update_dp:'',
			
			//编辑，项目
			updateproject:[],
			updateprojectinfo:'',
			//编辑，版本
			update_versionArr:[],
			update_version:'',
			//编辑，模块
			updatemodulearr:[],
			updatemodule:[],
			updatemoduleinfo:'',
			//编辑，执行者
			updateowner:[],
			updateownerinfo:'',
			updateid:'',//编辑，ID
			updatetitle:'',//编辑，标题
			updatecontent:'',//编辑，内容
			//编辑，状态
			updatestatus:[],
			updatestate:'',
			options3:[{value:'WAIT',label:'WAIT'},{value:'FINISHED',label:'FINISHED'},{value:'CLOSED',label:'CLOSED'}],
		}
	},
	mounted(){
		this.getList();
		this.getProject();
		this.getUser();
	},
	methods:{
		//下一页
		nextPage(){
			if(this.pageIndex==this.allCount){
				this.$message.error("没有下一页")
				return
			}
			this.pageIndex++;
			this.getList(this.pageIndex);
		},
		//上一页
		prePage(){
			if(this.pageIndex == 1){
				this.$message.error("没有上一页")
				return
			}
			this.pageIndex--;
			this.getList(this.pageIndex)
		},
		finishItem(x,y){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/finish",
				data:{
					id:y.id
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.getList(that.pageIndex)
					}else{
						that.$message(data.error_message)
					}
				}
			});
		},
		closeItem(x,y){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=front/task/close",
				data:{
					id:y.id
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.getList(that.pageIndex)
					}else{
						that.$message(data.error_message)
					}
				}
			});
		},
		//获取执行者列表
		getUser(){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/get_all_user",
				dataType:'json',
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){	
						that.ownerarr = data.data.user_arr;
					}
				}
			});
		},
		//获取项目列表
		getProject(x){
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
					if(data.error == 0){
						that.projectarr = data.data.project_arr;					
					}
				}
			});
		},
		//获取任务列表
		getList(x){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					project_id:that.findprojectinfo,
					module_id:that.findmoduleinfo,
					page_id:that.findpageinfo,
					owner_id:that.findownerinfo,
					title:that.f_title,
					version_id:that.find_version,
				},
				url:"/api.php?s=/front/get_task_list",
				dataType:'json',
				success:function(res){
					let data = res
					if(data.error==1){
						that.tableData = [];
						that.$message(data.error_message)
					}
					if(data.error == 0){
						that.tableData=data.data.task_arr;
						that.allCount = Math.ceil(data.data.count/10);
						that.count = data.data.count;
						that.pageIndex = x || 1;
					}
				}
			});
		},
		//添加任务
		addMission(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					project_id:that.addprojectinfo,
					module_id:that.addmoduleinfo,
					owner_id:that.addownerinfo,
					title:that.addtitle,
					content:that.addcontent,
					version_id:that.add_version,
					ep:that.add_ep,
					dp:that.add_dp
				},
				dataType:'json',
				url:"/api.php?s=/front/add_task",
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_message);
						return;
					}
					if(data.error==0){
						that.addmission = false;//关闭弹窗
						//重置弹窗内的数据
						that.addproject = [];
						that.addprojectinfo = '';
						that.add_version='';
						that.add_versionArr=[];
						that.add_ep="";
						that.add_dp="";
						that.addmodule = [];
						that.addmoduleinfo = '';
						that.addowner = [];
						that.addownerinfo = '';
						that.addtitle = "";
						that.addcontent = "";
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑用户信息   x为下标index
		updateUserInfo(x,y){
			let that = this;
			that.updateUserInfos = true;
			//更新 项目信息
			that.updateproject = [];
			that.updateprojectinfo=y.project_id;
			that.updateproject.push(y.project_id);
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_module",
				dataType:'json',
				data:{
					project_id:y.project_id
				},
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.updatemodulearr = data.data.module_arr;						
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
			$.ajax({
				type:"get",
				url:"/api.php?s=front/version/get_options",
				dataType:'json',
				data:{
					project_id:y.project_id
				},
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.update_versionArr = data.data;
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
			//更新 版本信息
			that.update_version = y.version_id;
			//更新 模块信息
			that.updatemodule = [];
			that.updatemoduleinfo = y.module_id,
			that.updatemodule.push(y.module_id);
			that.updateIndex = x;//列表下标
			that.updateid = y.id;//编辑 - id
			that.updatetitle=y.title;//编辑 标题
			that.updatecontent=y.content;//编辑 内容
			//更新 状态信息
			that.updatestatus = [];
			that.updatestatus.push(y.status);
			that.updatestate=y.status;
			//更新 执行者信息
			that.updateowner = [];
			that.updateowner.push(y.owner_id);
			that.updateownerinfo=y.owner_id;
			//更新 紧急程度 难度
			that.update_ep = y.ep;
			that.update_dp = y.dp;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					project_id:that.updateprojectinfo,
					module_id:that.updatemoduleinfo,
					title:that.updatetitle,
					content:that.updatecontent,
					status:that.updatestate,
					owner_id:that.updateownerinfo,
					version_id:that.update_version,
					ep:that.update_ep,
					dp:that.update_dp
				},
				dataType:'json',
				url:"/api.php?s=/front/update_task",
				success:function(res){
					let data = res
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.updateUserInfos = false;
						that.getList(that.pageIndex)
					}
				}
			});
		},
		//添加项目下拉事件
		addprojectchange(value){
			this.addprojectinfo = value[0];
			let that = this;
			that.addmodulearr=[];
			that.addmodule=[];
			that.addmoduleinfo='';
			that.add_versionArr=[];
			that.add_version = '';
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_module",
				data:{
					project_id:value[0]
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.addmodulearr = data.data.module_arr;
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
			$.ajax({
				type:"get",
				url:"/api.php?s=front/version/get_options",
				dataType:'json',
				data:{
					project_id:value[0]
				},
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.add_versionArr = data.data;
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
		},
		//添加模块下拉事件
		addmodulechange(value){
			this.addmoduleinfo = value[0];
		},
		addownerchange(value){
			this.addownerinfo = value[0];
		},
		//编辑，执行者下拉
		updateownerchange(value){
			this.updateownerinfo = value[0];
		},
		//编辑，项目下拉
		updateprojectchange(value){
			this.updateprojectinfo = value[0];
			let that = this;
			that.updatemodulearr=[];
			that.updatemodule=[];
			that.updatemoduleinfo='';
			that.update_versionArr=[];
			that.update_version = '';
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_module",
				data:{
					project_id:value[0]
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.updatemodulearr = data.data.module_arr;						
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
			$.ajax({
				type:"get",
				url:"/api.php?s=front/version/get_options",
				data:{
					project_id:value[0]
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.update_versionArr = data.data;
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
		},
		//编辑，模块下拉
		updatemodulechange(value){
			this.updatemoduleinfo = value[0];
		},
		changestatus(value){
			this.updatestate = value[0];
		},
		//搜索，项目下拉事件
		findprojectchange(value){
			this.findprojectinfo = value[0];
			let that = this;
			that.findmoduleinfo='';
			that.findmodulearr=[];
			that.findmodule=[];
			that.find_version='';
			that.find_versionArr=[];
			//获取项目下的模块
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_module",
				data:{
					project_id:value[0]
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.findmodulearr = data.data.module_arr;
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
			$.ajax({
				type:"get",
				url:"/api.php?s=front/version/get_options",
				data:{
					project_id:value[0]
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.find_versionArr = data.data;
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
		},
		//搜索，模块下拉事件
		findmodulechange(value){
			this.findmoduleinfo = value[0];
		},
		//搜索，执行者下拉事件
		findownerchange(value){
			this.findownerinfo = value[0];
		},
		//清空
		clearSearch(){
			//项目
			this.findproject = [];
			this.findprojectinfo = '';
			//版本
			this.find_version = '';
			this.find_versionArr = [];
			//模块
			this.findmodule = [];
			this.findmoduleinfo = '';
			//执行者
			this.findowner = [];
			this.findownerinfo = '';
			//标题
			this.f_title = '';
		}
	}
})
</script>

<style>
	.missioncenter{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.missioncenter .addUser{
		font-size:14px;
		margin-top:20px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.missioncenter .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.missioncenter .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.missioncenter .addUserInfo input:first-child{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.missioncenter .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.missioncenter .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.missioncenter .content{
		width:75%;
		height:160px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
		margin-top:10px;
	}
</style>