<template>
	<div class="w-urgenttask">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				紧急任务
			</h2>
			<el-button  @click="addMission"  v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p style="margin-top:20px;" class="co-search-wrap">

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
				
				<span class="co-search-condition">
				  <span class="co-search-name">状态</span>
				  <el-select v-model="missionInfo.findstatus" placeholder="请选择任务状态" style="width:200px;padding-right: 12px;">
				    <el-option
				      v-for="item in statusArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
				</span>
				<br>
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
				</span>

				<span class="co-search-condition">
				  <span class="co-search-name">标题</span>
				  <el-input v-model="missionInfo.f_title" @keyup.enter.native="search" placeholder="请输入标题" style="width:200px;padding-right: 12px;"></el-input>					
				</span>
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
			      prop="id"
			      label="ID"
			      width="90">
			    </el-table-column>
			    <el-table-column
			      prop="project"
			      label="项目"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="version"
			      label="版本"
			      width="120">
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
			      	<router-link :to="{path:'/taskDoc',query:{id:scope.row.id}}" target="_blank" style="color: #1D8CE0;">
				        <span>{{scope.row.title}}</span>
			        </router-link>
			      </template>
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      width="100">
			      <template scope="scope">
			      	<span style="color:red">{{scope.row.status_name}}</span>
			      </template>
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
			    <!-- <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="180">
			    </el-table-column> -->
			    <el-table-column
			      prop="expire_at"
			      label="截止日期"
			      sortable="custom"		      
			      width="180">
				     <template scope="scope">
				      		<p v-if="scope.row.color == 'RED'" style="color: red;">{{scope.row.expire_at}}</p>
				      		<p v-if="scope.row.color == 'YELLOW'" style="color: blue;">{{scope.row.expire_at}}</p>
				      		<p v-if="scope.row.color == ''">{{scope.row.expire_at}}</p>
				      </template>
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200">
			      <template scope="scope">
			      	<el-button type="text" size="small" @click="updateOwner(scope.$index,scope.row)" v-if="ballot">分配</el-button>
			      	<!-- <router-link :to="{path:'/editurgent',query:{id:scope.row.id}}" v-if="bedit">
				        <el-button type="text" size="small">编辑</el-button>			     
			      	</router-link> -->
			      	<el-button type="text" size="small" @click="editMission(scope.row.id)" v-if="bedit">编辑</el-button>

			        <el-button type="text" size="small" @click="finishItem(scope.row)" v-if="bfinish && scope.row.status=='WAIT'">完成</el-button>
			        <el-button type="text" size="small" @click="testedItem(scope.row)" v-if="bpass && scope.row.status=='FINISHED'">测试通过</el-button>
			        <el-button type="text" size="small" @click="onlineItem(scope.row)" v-if="bline && scope.row.status=='TESTED'">上线</el-button>
			        <el-button type="text" size="small" @click="closeItem(scope.row)" v-if="bclose && scope.row.status=='ONLINE'">关闭</el-button>
			        <!-- <router-link :to="{path:'/taskDoc',query:{id:scope.row.id}}" target="_blank" v-if="bread">
				        <el-button type="text" size="small" style="margin-left:20px">查看</el-button>
			        </router-link> -->
			      </template>
			    </el-table-column>
			 </el-table>
			 <p v-if="tableData.length" class="co-page">
			 	
			 	<el-button icon="arrow-left" @click="prePage" style="margin-right: 10px;">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
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
			ownerarr:[{label: "自己", value: localStorage.token}],//执行者列表
			pageIndex:'',//页面下标
			allCount:'',//列表总条数
			count:'',//任务总条数
			updateUserInfos:false,//编辑页面弹窗
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
			statusArr:[
				{value:'WAIT',label:'进行中'},
				{value:'FINISHED',label:'已完成'},
				{value:'TESTED',label:'测试通过'},
				{value:'ONLINE',label:'已上线'},
				{value:'CLOSED',label:'已关闭'}
			],
			//页面信息
			missionInfo:{
				findprojectinfo:'',//项目--搜索
				findmoduleinfo:'',//模块--搜索
				find_version:'',//版本--搜索
				findstatus:'',//状态--搜索
				f_title:'',//标题--搜索
				findownerinfo:'',//执行者--搜索
				pageIndex:'',//页面下标
			},
			//页面搜索条件信息
			searchInfo:{
				findprojectinfo:'',//项目--搜索
				findmoduleinfo:'',//模块--搜索
				find_version:'',//版本--搜索
				findstatus:'',//状态--搜索
				f_title:'',//标题--搜索
				findownerinfo:'',//执行者--搜索
				pageIndex:'',//页面下标
			},
			//搜索，执行者
			findowner:[],
			findownerinfo:'',
			findownerarr:[],
			//分配 任务
			updateOwnerTip:false,
			newowner:'',
			taskStatus:'',			//任务状态
			
			badd:false,				//添加
			bedit:false,			//编辑
			bpass:false,			//通过
			ballot:false,			//分配
			bfinish:false,			//完成
			bclose:false,			//关闭
			bread:false,			//查看
			bline:false,			//上线

			order_project: 0,		//按照项目排序
			order_user: 0,			//按照人员排序
			order_expire_at: 0		//按照截止日期排序
		}
	},
	mounted(){
		let that = this;
		this.getProject();
		this.getUser();
		this.$store.dispatch("getPer","urgent").then(()=>{
			that.$store.state.perList.includes("urgent.add")?that.badd=true:'';
			that.$store.state.perList.includes("urgent.edit")?that.bedit=true:'';	
			that.$store.state.perList.includes("urgent.pass")?that.bpass=true:'';	
			that.$store.state.perList.includes("urgent.allot")?that.ballot=true:'';
			that.$store.state.perList.includes("urgent.finish")?that.bfinish=true:'';
			that.$store.state.perList.includes("urgent.close")?that.bclose=true:'';
			that.$store.state.perList.includes("urgent.line")?that.bline=true:'';
			that.$store.state.perList.includes("urgent.read")?that.bread=true:'';	

			//获取页面状态信息
			that.pageInfo();
			//获取搜索条件信息
			// that.searchContent();
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
				'pageIndex': that.pageIndex
			}
			that.$store.dispatch('search_params',searchParams)
			that.pageIndex = 1;

			that.getList(that.pageIndex,that.missionInfo)
		},
		updateOwner(index,row){
			this.updateid = row.id;
			this.updateOwnerTip = true;
		},
		//重新分配
		updateNewOwner(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					owner_id:that.newowner,
				},
				url:that.$api.quicktask.distribute,
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
			
			this.getList(this.pageIndex,searchParams);
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
						that.$store.dispatch('changePoint').then(function(){})
						// that.$store.dispatch("getPer","urgent")	
						that.getList(that.pageIndex,that.searchInfo);
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		},
		//任务完成
		finishItem(y){
			this.taskStatus = 'FINISHED';
			this.changeTaskStatus(this.taskStatus,y.id);
						
		},
		//任务关闭
		closeItem(y){
			this.taskStatus = 'CLOSED';
			this.changeTaskStatus(this.taskStatus,y.id);
		},
		//测试通过
		testedItem(y){
			this.taskStatus = 'TESTED';
			this.changeTaskStatus(this.taskStatus,y.id);
		},
		//上线
		onlineItem(y){
			this.taskStatus = 'ONLINE';
			this.changeTaskStatus(this.taskStatus,y.id);
		},
		//添加任务
		addMission(){
			this.savePageContent();
			this.$router.push('/addurgent')
		},
		//编辑任务
		editMission(id){
			this.savePageContent();
			this.$router.push({path:'/editurgent',query:{id:id}})
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
				'pageIndex': that.pageIndex
			}
			this.$store.dispatch('keep_page_content',pageContent)
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
			that.missionInfo.pageIndex = pageContent.pageIndex;//当前页码

			if(that.missionInfo.endTime == null){
				that.missionInfo.endTime = '';
			}
		},
		//获取搜索信息
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
					let data = res;
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
			//筛选
			let m_arr = [], v_arr=[], s_arr= [], o_arr=[];
			//筛选模块
			// that.findmodulearr.forEach(function(i){
			// 	m_arr.push(i.value)
			// })
			// if(m_arr.includes(info.findmoduleinfo) == false){
			// 	info.findmoduleinfo = '';
			// }
			// //筛选版本
			// if(that.find_versionArr.length == 0){
			// 	info.find_version = '';
			// }else{
			// 	that.find_versionArr.forEach(function(i){
			// 		v_arr.push(i.value)
			// 	})
			// 	if(v_arr.includes(info.find_version) == false){
			// 		info.find_version = '';
			// 	}				
			// }
			// //筛选状态
			// that.statusArr.forEach(function(i){
			// 	s_arr.push(i.value)
			// })
			// if(s_arr.includes(info.findstatus) == false){
			// 	info.findstatus = '';
			// }
			// //筛选执行者
			// that.ownerarr.forEach(function(i){
			// 	o_arr.push(i.value)
			// })
			// if(s_arr.includes(info.findownerinfo) == false){
			// 	info.findownerinfo = '';
			// }

			$.ajax({
				type:"get",
				data:{
					page:page||1,
					project_id:info.findprojectinfo,
					module_id:info.findmoduleinfo,
					page_id:that.findpageinfo,
					owner_id:info.findownerinfo,
					title:info.f_title,
					version_id:info.find_version,
					status:info.findstatus,
					order_project: that.order_project,
					order_user: that.order_user,
					order_expire_at: that.order_expire_at,
				},
				url:that.$api.quicktask.getlist,
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
						that.pageIndex = page || 1;
					}
				}
			});
		},
		changestatus(value){
			this.updatestate = value[0];
		},
		//搜索，项目下拉事件
		findprojectchange(value){
			let that = this;
			that.missionInfo.findprojectinfo = value[0];
			that.missionInfo.findmoduleinfo='';
			that.findmodulearr=[];
			that.findmodule=[];
			that.missionInfo.find_version='';
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
		}
	}
})
</script>

<style>
	.w-urgenttask{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-urgenttask .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-urgenttask .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-urgenttask .content{
		width:75%;
		height:160px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
		margin-top:10px;
	}
</style>