<template>
	<div class="missioncenter">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				任务管理
				<!-- <button class="addUser" @click="addMission" v-if="badd">+ 添加任务</button>	 -->
			</h2>
			<el-button  @click="addMission"  v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p style="margin-top:20px;"  class="co-search-wrap">
				<span class="co-search-condition">
				  <span class="co-search-name">任务类型</span>
				  <el-select v-model="missionInfo.is_quick" placeholder="请选择任务类型" style="width:200px;padding-right: 12px;">
				    <el-option
				      v-for="item in typeArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
				</span>
				<span class="co-search-condition">
					<span class="co-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findproject"
				    @change="findprojectchange"
				  ></el-cascader>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">模块</span>
				  <el-cascader
				    placeholder="请选择模块"
				    :options="findmodulearr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findmodule"
				    @change="findmodulechange"
				  ></el-cascader>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">版本</span>
				  <el-select v-model="missionInfo.find_version" placeholder="请选择版本" style="width:200px;padding-right: 12px;">
				    <el-option
				      v-for="item in find_versionArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
				</span>
				<br>
				<span class="co-search-condition">
				  <span class="co-search-name">状态</span>
				  <el-select v-model="missionInfo.findstatus" placeholder="请选择任务状态" style="padding-right: 12px;">
				    <el-option
				      v-for="item in statusArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				  </el-tooltip>					
				</span>
				
				<span class="co-search-condition">
				  <span class="co-search-name">执行者</span>
				  <el-cascader
				    placeholder="请选择执行者"
				    :options="ownerarr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findowner"
				    @change="findownerchange"
				  ></el-cascader>
				  </el-tooltip>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">标题</span>
				  <el-input v-model="missionInfo.f_title" placeholder="请输入标题" @keyup.enter.native="search" style="width:200px;padding-right: 12px;"></el-input>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">日期</span>
				     <el-date-picker
				      v-model="missionInfo.endTime"
				      style="width:200px;"
				      type="date"
				      placeholder="选择结束日期">
				    </el-date-picker>
				    </el-tooltip>
				</span>
				
			 <!--   <el-button type="primary" icon="circle-cross" @click="clearSearch" style="margin-left: 12px;">清空</el-button>
			  <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
			  <el-button type="primary" @click="search" style="padding: 10px 37px;margin-left: 12px;">搜索</el-button>
			  <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>
		<span class="page-info">任务总数：{{count}}</span>
		<!--列表展示-->
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			     @sort-change="projectSort"
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
			      sortable="custom"
			     			     
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
			      min-width="200"
			      >
			      <template scope="scope">
			      	<router-link :to="{path:'/taskDoc',query:{id:scope.row.id}}" target="_blank" :class="[scope.row.is_quick == 1 ? quickClass : normalClass]">
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
			       sortable="custom"		     
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
			      prop="created_at"
			      label="创建日期"
			      width="130">
			    </el-table-column>
			    <el-table-column
			      prop="expire_at"
			      label="截止日期"
			       sortable="custom"		      
			      width="130">
			    	<template scope="scope">
			      		<p v-if="scope.row.color == 'RED'" style="color: red;">{{scope.row.expire_at}}</p>
			      		<p v-if="scope.row.color == 'YELLOW'" style="color: blue;">{{scope.row.expire_at}}</p>
			      		<p v-if="scope.row.color == ''">{{scope.row.expire_at}}</p>
			      </template>
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="220">
			      <template scope="scope">
			      	<el-button type="text" size="small" @click="updateProgress(scope.row)" v-if="bUp&&scope.row.status!='FINISHED'">更新进度</el-button>
			      	<el-button type="text" size="small" @click="updateOwner(scope.$index,scope.row)" v-if="ballot">分配</el-button>

			      	<el-button type="text" size="small" @click="editMission(scope.row.id)" v-if="bedit">编辑</el-button>
			        <el-button type="text" size="small" @click="finishItem(scope.$index,scope.row)" v-if="bfinish && scope.row.status=='WAIT'">完成</el-button>
			        <el-button type="text" size="small" @click="testedItem(scope.$index,scope.row)" v-if="bpass && scope.row.status=='FINISHED'">测试通过</el-button>
			        <el-button type="text" size="small" @click="onlineItem(scope.$index,scope.row)" v-if="bline && scope.row.status=='TESTED'">上线</el-button>
			        <el-button type="text" size="small" @click="closeItem(scope.$index,scope.row)" v-if="bclose && scope.row.status=='ONLINE'">关闭</el-button>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p v-if="tableData.length"  class="co-page">
			 	
			 	<el-button  icon="arrow-left" @click="prePage" style="margin-right:10px;">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			 </p>
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
import {formatDate} from '@/assets/js/util'
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
			findstatus:'',
			is_quick:0,
			statusArr:[
				{value:'WAIT',label:'进行中'},
				{value:'FINISHED',label:'已完成'},
				{value:'TESTED',label:'测试通过'},
				{value:'ONLINE',label:'已上线'},
				{value:'CLOSED',label:'已关闭'}
			],
			//搜索，执行者
			findowner:[],
			findownerinfo:'',
			findownerarr:[],
			//分配 任务
			updateOwnerTip:false,
			newowner:'',
			//更新 进度 
			updateProgressTip:false,	//tip
			updatePro:'',			//更新进度值
			beginTime:'',
			endTime:'',
			//页面信息
			missionInfo:{
				findprojectinfo:'',//项目--搜索
				findmoduleinfo:'',//模块--搜索
				find_version:'',//版本--搜索
				findstatus:'',//状态--搜索
				f_title:'',//标题--搜索
				findownerinfo:'',//执行者--搜索
				endTime:'',//结束日期--搜索
				is_quick:'',//任务类型，版本任务-0，紧急任务-1，全部-''
				pageIndex:'',//页面下标
				taskType:'',//
			},
			//页面搜索条件信息
			searchInfo:{
				findprojectinfo:'',//项目--搜索
				findmoduleinfo:'',//模块--搜索
				find_version:'',//版本--搜索
				findstatus:'',//状态--搜索
				f_title:'',//标题--搜索
				findownerinfo:'',//执行者--搜索
				endTime:'',//结束日期--搜索
				is_quick:'',//任务类型，版本任务-0，紧急任务-1，全部-''
				pageIndex:'',//页面下标

			},
			quickClass:'quickClass',	//紧急任务样式
			normalClass:'normalClass',	//版本任务样式
			typeArr:[
				{label:'紧急任务',value:'1'},
				{label:'版本任务',value:'0'},
				{label:'全部',value:''}
			],
			//权限
			badd:false,				//添加
			bedit:false,			//编辑
			ballot:false,			//分配
			bfinish:false,			//完成
			bclose:false,			//关闭
			bline:false,			//上线
			bpass:false, 			//测试通过
			bUp:false,				//更新进度
			order_project: 0,		//按照项目排序
			order_user: 0,			//按照人员排序
			order_expire_at: 0		//按照截止日期排序
		}
	},
	mounted(){
		let that = this;
		this.getProject();
		this.getUser();
		this.$store.dispatch("getPer","task").then(()=>{
			that.$store.state.perList.includes("task.add")?this.badd=true:'';
			that.$store.state.perList.includes("task.edit")?this.bedit=true:'';		
			that.$store.state.perList.includes("task.allot")?this.ballot=true:'';
			that.$store.state.perList.includes("task.finish")?this.bfinish=true:'';
			that.$store.state.perList.includes("task.close")?this.bclose=true:'';
			that.$store.state.perList.includes("task.pass")?this.bpass=true:'';
			that.$store.state.perList.includes("task.line")?this.bline=true:'';
			that.$store.state.perList.includes("task.Up")?this.bUp=true:'';			
			
			//获取页面状态信息
			that.pageInfo();
			//获取搜索条件信息
			let searchParams =  that.$store.state.searchParams;
			that.getList(that.missionInfo.pageIndex,searchParams);

		});
	},
	methods:{
		//搜索
		search(){
			let that = this;
			let searchParams = {
				'findprojectinfo': that.missionInfo.findprojectinfo,
				'findmoduleinfo':that.missionInfo.findmoduleinfo,//模块--搜索
				'find_version':that.missionInfo.find_version,//版本--搜索
				'findstatus': that.missionInfo.findstatus,
				'f_title': that.missionInfo.f_title,
				'findownerinfo': that.missionInfo.findownerinfo,
				'endTime': that.missionInfo.endTime,
				'is_quick': that.missionInfo.is_quick,//紧急任务1，版本任务0
				'pageIndex': that.pageIndex,
			}
			that.$store.dispatch('search_params',searchParams)
			that.pageIndex = 1;
			that.getList(that.pageIndex,that.missionInfo)
		},
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
						that.$message.error(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message.success("更新成功！");
						that.updateProgressTip = false;
					}
					this.getList(this.pageIndex,this.searchInfo);
				}
			});
		},
		//更新执行者 - 按钮
		updateOwner(index,row){
			this.updateid = row.id;
			this.updateOwnerTip = true;
		},
		//重新分配执行者 - 发送请求
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
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message("新的执行者ID为"+data.data.new_owner_id);
						that.updateOwnerTip = false;
					}
					that.getList(that.pageIndex,that.searchInfo);
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
			// this.searchContent();
			let searchParams =  this.$store.state.searchParams;
			// this.getList(this.pageIndex,this.searchInfo);
			this.getList(this.pageIndex,searchParams);

		},
		//上一页
		prePage(){
			if(this.pageIndex == 1){
				this.$message.error("没有上一页")
				return
			}
			this.pageIndex--;
			// this.searchContent();
			let searchParams =  this.$store.state.searchParams;
			this.getList(this.pageIndex,searchParams)
		},
		//添加任务
		addMission(){
			this.savePageContent();
			this.$router.push('/createtask')
		},
		//编辑任务
		editMission(id){
			this.savePageContent();
			this.$router.push({path:'/edittask',query:{id:id}})
		},
		//保存页面信息
		savePageContent(){
			let that = this;
			let pageContent = {
				'findprojectinfo': that.missionInfo.findprojectinfo,
				'findmoduleinfo':that.missionInfo.findmoduleinfo,//模块--搜索
				'find_version':that.missionInfo.find_version,//版本--搜索
				'findstatus': that.missionInfo.findstatus,
				'f_title': that.missionInfo.f_title,
				'findownerinfo': that.missionInfo.findownerinfo,
				'endTime': that.missionInfo.endTime,
				'is_quick': that.missionInfo.is_quick,
				'pageIndex': that.pageIndex
			}
			this.$store.dispatch('keep_page_content',pageContent)
		},
		//更改任务状态
		changeTaskStatus(status,id,log){
			let that = this;
			$.ajax({
				type:"post",
				url:that.$api.task.change_status,
				dataType:'json',
				data:{
					status:status,
					id:id,
				},
				success:(res)=>{
					if(res.error == 0){
						let searchParams =  this.$store.state.searchParams;

						that.getList(that.pageIndex,searchParams);
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		},
		//任务完成
		finishItem(x,y){
			this.taskStatus = 'FINISHED';
			this.changeTaskStatus(this.taskStatus,y.id);				
		},
		//任务关闭
		closeItem(x,y){
			this.taskStatus = 'CLOSED';
			this.changeTaskStatus(this.taskStatus,y.id);
		},
		//测试通过
		testedItem(x,y){
			this.taskStatus = 'TESTED';
			this.changeTaskStatus(this.taskStatus,y.id);
		},
		//上线
		onlineItem(x,y){
			this.taskStatus = 'ONLINE';
			this.changeTaskStatus(this.taskStatus,y.id);
		},
		//获取页面信息
		pageInfo(){
			let that = this;
			//获取页面状态信息
			let pageContent = that.$store.state.pageContent;
	
			that.missionInfo.findprojectinfo = pageContent.findprojectinfo;//项目
			that.findproject[0] = that.missionInfo.findprojectinfo;
			that.findprojectchange([that.missionInfo.findprojectinfo]);

			that.missionInfo.findmoduleinfo = pageContent.findmoduleinfo;//模块--搜索
			that.findmodule[0] = that.missionInfo.findmoduleinfo;
			that.missionInfo.find_version = pageContent.find_version;//版本--搜索

			that.missionInfo.findstatus = pageContent.findstatus;//状态

			that.missionInfo.f_title = pageContent.f_title;//标题

			that.missionInfo.findownerinfo = pageContent.findownerinfo;//执行者
			that.getUser();			
			that.findowner[0] = that.missionInfo.findownerinfo;

			that.missionInfo.endTime = pageContent.endTime;//截止日期
			that.missionInfo.is_quick = pageContent.is_quick;//任务类型
			that.missionInfo.pageIndex = pageContent.pageIndex;//当前页码

			if(that.missionInfo.endTime == null){
				that.missionInfo.endTime = '';
			}
		},
		//获取搜索信息(获取参数信息会出现undefined，暂时不用)
		searchContent(){
			let that = this;
			//获取搜索条件
			let searchParams =  that.$store.state.searchParams;

			that.searchInfo.findprojectinfo = searchParams.f_project;
			that.searchInfo.findmoduleinfo = searchParams.f_module;//模块--搜索
			that.searchInfo.find_version = searchParams.f_version;//版本--搜索
			that.searchInfo.findstatus = searchParams.findstatus;
			that.searchInfo.f_title = searchParams.f_title;
			that.searchInfo.findownerinfo = searchParams.owner_id;
			that.searchInfo.endTime = searchParams.endTime;
			that.searchInfo.is_quick = searchParams.is_quick;
			that.searchInfo.pageIndex = searchParams.pageIndex;

			if(that.searchInfo.endTime == null){
				that.searchInfo.endTime = '';
			}

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
						that.$message(data.error_msg)
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
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.projectarr = data.data.project_arr;					
					}
				}
			});
		},
		//获取任务列表
		getList(page,info){
			let that = this;
			let sTime,eTime;
			
			if(info.endTime == null){
				eTime = '';
			}else{
				eTime = formatDate(info.endTime);
			}
			
			$.ajax({
				type:"get",
				data:{
					page:page||1,
					project_id: info.findprojectinfo,
					module_id: info.findmoduleinfo,
					page_id: that.findpageinfo,
					owner_id: info.findownerinfo,
					title: info.f_title,
					version_id: info.find_version,
					status: info.findstatus,
					finished_start: sTime,
					finished_end: eTime,
					order_project: that.order_project,
					order_user: that.order_user,
					order_expire_at: that.order_expire_at,
					taskStatus:'',	//更改任务状态
					is_quick:info.is_quick
				},
				url:that.$api.task.get_my_task,
				dataType:'json',
				success:function(res){
					let data = res
					if(data.error==1){
						that.count = 0;
						that.tableData = [];
						// that.$message(data.error_msg)
					}
					if(data.error == 0){
						that.tableData=data.data.task_arr;
						that.allCount = Math.ceil(data.data.count/10);
						that.count = data.data.count;
						that.pageIndex = page|| 1;
					}
				}
			});
		},
		//搜索，项目下拉事件
		findprojectchange(value){
			let that = this;
			that.missionInfo.findprojectinfo = value[0];
			// that.missionInfo.findmoduleinfo='';
			that.findmodulearr=[];
			that.findmodule=[];
			// that.find_version='';
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
						that.$message(data.error_msg)
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
						that.$message(data.error_msg)
					}
				}
			});

		},
		//搜索，模块下拉事件
		findmodulechange(value){
			this.missionInfo.findmoduleinfo = value[0];
		},
		//搜索，执行者下拉事件
		findownerchange(value){
			this.missionInfo.findownerinfo = value[0];
		},
		//清空
		clearSearch(){
			//项目
			this.findproject = [];
			this.missionInfo.findprojectinfo = '';
			//版本
			this.missionInfo.find_version = '';
			this.find_versionArr = [];
			//模块
			this.findmodule = [];
			this.missionInfo.findmoduleinfo = '';
			//任务状态
			this.missionInfo.findstatus = '';
			//执行者
			this.findowner = [];
			this.missionInfo.findownerinfo = '';
			//标题
			this.missionInfo.f_title = '';
			this.beginTime = '';
			this.missionInfo.endTime = '';
			this.missionInfo.is_quick = '';
		},
		//排序
		projectSort(e){
			if(e.prop == "project"){
				this.projectSortSwitch = !this.projectSortSwitch
				if(this.projectSortSwitch == true){
					this.order_project = 1;
					this.order_user = 0;
					this.order_expire_at = 0;
				}else{
					this.order_project = 2;
					this.order_user = 0;
					this.order_expire_at = 0;
				}
				
				this.getList(this.missionInfo.pageIndex,this.searchInfo);
			}else if(e.prop == "realname"){
				this.userSortSwitch = !this.userSortSwitch
				if(this.userSortSwitch == true){
					this.order_project = 0;
					this.order_user = 1;
					this.order_expire_at = 0;
					
				}else{
					this.order_project = 0;
					this.order_user = 2;
					this.order_expire_at = 0;
				}
				this.getList(this.missionInfo.pageIndex,this.searchInfo);
			}else if(e.prop == "expire_at"){
				this.expireSortSwitch = !this.expireSortSwitch
				if(this.expireSortSwitch == true){
					this.order_project = 0;
					this.order_user = 0;
					this.order_expire_at = 1;
					
				}else{
					this.order_project = 0;
					this.order_user = 0;
					this.order_expire_at = 2;
				}
				this.getList(this.missionInfo.pageIndex,this.searchInfo);
			}else{
				this.order_project = 0;
				this.order_user = 0;
				this.order_expire_at = 0;
				this.getList(this.missionInfo.pageIndex,this.searchInfo);
			}
			
		}
	}
})
</script>

<style scoped>
	.missioncenter{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
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
	.quickClass{
		cursor:pointer;
		color: #FA5555;
	}
	.normalClass{
		cursor:pointer;
		color:#1D8CE0;
	}
</style>