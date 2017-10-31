<template>
	<div class="missioncenter">
		<h2>任务管理</h2>
		<router-link to="/createtask" v-if="badd">
			<button class="addUser" @click="addmission = true">+ 添加任务</button>			
		</router-link>
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
		  <el-tooltip class="item" effect="dark" content="根据任务状态搜索" placement="top">
		  <el-select v-model="findstatus" placeholder="请选择任务状态">
		    <el-option
		      v-for="item in statusArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  </el-tooltip><br /><br />
		  <el-tooltip class="item" effect="dark" content="根据执行者搜索" placement="bottom">
		  <el-cascader
		    placeholder="请选择执行者"
		    :options="ownerarr"
		    filterable
		    style="width:200px;"
		    v-model="findowner"
		    @change="findownerchange"
		  ></el-cascader>
		  </el-tooltip>
		  <el-input v-model="f_title" placeholder="请输入标题" style="width:200px;"></el-input>
		  <el-tooltip class="item" effect="dark" content="根据完成日期搜索" placement="bottom">
		  <el-date-picker
	      v-model="beginTime"
	      style="width:200px"
	      type="date"
	      placeholder="选择开始日期"
	      :picker-options="pickerOptions0">
	    </el-date-picker>
	    </el-tooltip>
	     <el-tooltip class="item" effect="dark" content="根据完成日期搜索" placement="bottom">
	     <el-date-picker
	      v-model="endTime"
	      style="width:200px"
	      type="date"
	      placeholder="选择结束日期"
	      :picker-options="pickerOptions0">
	    </el-date-picker>
	    </el-tooltip>
		   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
		  <el-button type="primary" icon="search" @click="getList(1)">搜索</el-button>
		<!--列表展示-->
		<div class="tables">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      label="ID"
			      width="90">
			      <template scope="scope">
			      	<router-link :to="{path:'/taskDoc',query:{id:scope.row.id}}" target="_blank" style="cursor:pointer;color:#1D8CE0">
				        <span>{{scope.row.id}}</span>
			        </router-link>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="project"
			      label="项目"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="version"
			      label="版本"
			      width="95">
			    </el-table-column>
			    <el-table-column
			      prop="module"
			      label="模块"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      label="标题"
			      width="200">
			      <template scope="scope">
			      	<router-link :to="{path:'/taskDoc',query:{id:scope.row.id}}" target="_blank" style="cursor:pointer;color:#1D8CE0">
				        <span>{{scope.row.title}}</span>
			        </router-link>
			      </template>
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
			      prop="point"
			      label="工时"
			      width="70">
			    </el-table-column>
			    <el-table-column
			      prop="dp"
			      label="难度"
			      width="70">
			    </el-table-column>
			    <el-table-column
			      label="进度"
			      width="85">
			      <template scope="scope">
			      	{{scope.row.progress}}%
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="expire_at"
			      label="截止日期"
			      width="130">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="220">
			      <template scope="scope">
			      	<el-button type="text" size="small" @click="updateProgress(scope.row)" v-if="bUp&&scope.row.status!='FINISHED'">更新进度</el-button>
			      	<el-button type="text" size="small" @click="updateOwner(scope.$index,scope.row)" v-if="ballot">分配</el-button>
			      	<router-link :to="{path:'/edittask',query:{id:scope.row.id}}" v-if="bedit">
			        	<el-button type="text" size="small" >编辑</el-button>
			      	</router-link>
			        <el-button type="text" size="small" @click="finishItem(scope.$index,scope.row)" v-if="bfinish && scope.row.status=='WAIT'">完成</el-button>
			        <el-button type="text" size="small" @click="closeItem(scope.$index,scope.row)" v-if="bclose">关闭</el-button>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p v-if="tableData.length"><span style="margin-right:100px;">任务总数：{{count}}</span><el-button type="primary" icon="arrow-left" @click="prePage">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
		</div>
		<!--分配任务-->
		<el-dialog title="分配任务" v-model="updateOwnerTip" size="tiny">
			<div class='addUserInfo'>
			  <p>执行者
				<el-select v-model="newowner" placeholder="请选择">
				    <el-option
				      v-for="item in ownerarr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select></p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateOwnerTip = false">取 消</el-button>
		    <el-button type="primary" @click='updateNewOwner' >确 定</el-button>
		  </span>
		</el-dialog>
		<!--更新进度-->
		<el-dialog title="更新进度" v-model="updateProgressTip" size="tiny">
			<div class='addUserInfo'>
			  <p>进度<input v-model="updatePro" style="width:50px;float:none;margin:0 5px 0 10px;" maxlength="3"/>%
				</p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateProgressTip = false">取 消</el-button>
		    <el-button type="primary" @click='updateNewProgress' >确 定</el-button>
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
			//搜索，状态
			findstatus:'WAIT',
			statusArr:[{value:'WAIT',label:'等待中'},{value:'FINISHED',label:'已完成'},{value:'CLOSED',label:'已关闭'}],
			//搜索，执行者
			findowner:[localStorage.token],
			findownerinfo:localStorage.token,
			findownerarr:[],
			//分配 任务
			updateOwnerTip:false,
			newowner:'',
			//更新 进度 
			updateProgressTip:false,	//tip
			updatePro:'',			//更新进度值
			beginTime:'',
			endTime:'',
			
			
			badd:false,				//添加
			bedit:false,			//编辑
			ballot:false,			//分配
			bfinish:false,			//完成
			bclose:false,			//关闭
			bUp:false,				//更新进度
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer","task").then(()=>{
			_this.$store.state.perList.includes("task.add")?this.badd=true:'';
			_this.$store.state.perList.includes("task.edit")?this.bedit=true:'';		
			_this.$store.state.perList.includes("task.allot")?this.ballot=true:'';
			_this.$store.state.perList.includes("task.finish")?this.bfinish=true:'';
			_this.$store.state.perList.includes("task.close")?this.bclose=true:'';
			_this.$store.state.perList.includes("task.Up")?this.bUp=true:'';				
			_this.getList();
		});
		this.getProject();
		this.getUser();
	},
	methods:{
		//更新任务进度 - 按钮
		updateProgress(row){
			this.updateid = row.id;
			this.updatePro = row.progress;
			this.updateProgressTip = true;
		},
		//更新任务进度 - 发送请求
		updateNewProgress(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					progress:that.updatePro,
				},
				url:that.$api.task.update_progress,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message.error(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message.success("更新成功！");
						that.updateProgressTip = false;
					}
					that.getList()
				}
			});
		},
		//更新执行者 - 按钮
		updateOwner(index,row){
			this.updateid = row.id;
			this.updateOwnerTip = true;
		},
		//更新执行者 - 发送请求
		updateNewOwner(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					owner_id:that.newowner,
				},
				url:that.$api.task.distribute,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("新的执行者ID为"+data.data.new_owner_id);
						that.updateOwnerTip = false;
					}
					that.getList()
				}
			});
		},
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
				url:that.$api.task.finish,
				data:{
					id:y.id
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.getList(that.pageIndex)
					}else{
						that.$message(res.error_message)
					}
				}
			});
		},
		closeItem(x,y){
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.task.close,
				data:{
					id:y.id
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						that.getList(that.pageIndex)
					}else{
						that.$message(res.error_message)
					}
				}
			});
		},
		//获取执行者列表
		getUser(){
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.get_user_list,
				dataType:'json',
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){	
						that.ownerarr = that.ownerarr.concat(data.data.user_arr);
					}
				}
			});
		},
		//获取项目列表
		getProject(x){
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.get_project_list,
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
			let sTime,eTime;
			if(that.beginTime != ''){
				sTime = that.beginTime.getFullYear()+'-'+(that.beginTime.getMonth()+1)+'-'+that.beginTime.getDate();
			}else{
				sTime = '';
			}
			if(that.endTime != ''){
				eTime = that.endTime.getFullYear()+'-'+(that.endTime.getMonth()+1)+'-'+that.endTime.getDate();
			}else{
				eTime = '';
			}
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
					status:that.findstatus,
					finished_start:sTime,
					finished_end:eTime
				},
				url:that.$api.task.getlist,
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
				url:that.$api.get_module_list,
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
				url:that.$api.get_version_list,
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
			//任务状态
			this.findstatus = '';
			//执行者
			this.findowner = [];
			this.findownerinfo = '';
			//标题
			this.f_title = '';
			this.beginTime = '';
			this.endTime = '';
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
		cursor:pointer;
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
</style>