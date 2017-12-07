<template>
	<div class="w-urgenttask">
		<div class="anchu-inner-head">
			<h2 class="anchu-head-title">
				紧急任务
				<router-link to="/addurgent" v-if="badd">
					<button class="addUser">+ 添加任务</button>			
				</router-link>
			</h2>
			<p style="margin-top:20px;" class="anchu-search-wrap">
				<span class="anchu-search-condition">
					<span class="anchu-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findproject"
				    @change="findprojectchange"
				  ></el-cascader>					
				</span>
				<span class="anchu-search-condition">
				  <span class="anchu-search-name">版本</span>
				  <el-select v-model="find_version" placeholder="请选择版本" style="width:200px;padding-right: 12px;">
				    <el-option
				      v-for="item in find_versionArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
				</span>
				<span class="anchu-search-condition">
				  <span class="anchu-search-name">模块</span>
				  <el-cascader
				    placeholder="请选择模块"
				    :options="findmodulearr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findmodule"
				    @change="findmodulechange"
				  ></el-cascader>					
				</span>
				<span class="anchu-search-condition">
				  <span class="anchu-search-name">状态</span>
				  <el-select v-model="findstatus" placeholder="请选择任务状态" style="width:200px;padding-right: 12px;">
				    <el-option
				      v-for="item in statusArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
				</span>
				<span class="anchu-search-condition">
				  <span class="anchu-search-name">执行者</span>
				  <el-cascader
				    placeholder="请选择执行者"
				    :options="ownerarr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findowner"
				    @change="findownerchange"
				  ></el-cascader>					
				</span>
				<span class="anchu-search-condition">
				  <span class="anchu-search-name">标题</span>
				  <el-input v-model="f_title" placeholder="请输入标题" style="width:200px;padding-right: 12px;"></el-input>					
				</span>
			   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
			  <el-button type="primary" icon="search" @click="getList(1)">搜索</el-button>
			</p>
		</div>
		<span class="page-info">任务总数：{{count}}</span>
		<!--列表展示-->
		<div class="anchu-inner-content">
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
			      prop="title"
			      label="标题"
			      >
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
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200">
			      <template scope="scope">
			      	<el-button type="text" size="small" @click="updateOwner(scope.$index,scope.row)" v-if="ballot">分配</el-button>
			      	<router-link :to="{path:'/editurgent',query:{id:scope.row.id}}" v-if="bedit">
				        <el-button type="text" size="small">编辑</el-button>			     
			      	</router-link>
			        <el-button type="text" size="small" @click="finishItem(scope.row)" v-if="bfinish && scope.row.status=='WAIT'">完成</el-button>
			        <el-button type="text" size="small" @click="testedItem(scope.row)" v-if="bpass && scope.row.status=='FINISHED'">测试通过</el-button>
			        <el-button type="text" size="small" @click="onlineItem(scope.row)" v-if="bline && scope.row.status=='TESTED'">上线</el-button>
			        <el-button type="text" size="small" @click="closeItem(scope.row)" v-if="bclose && scope.row.status=='ONLINE'">关闭</el-button>
			        <router-link :to="{path:'/taskDoc',query:{id:scope.row.id}}" target="_blank" v-if="bread">
				        <el-button type="text" size="small" style="margin-left:20px">查看</el-button>
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p v-if="tableData.length" class="anchu-page">
			 	
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
			statusArr:[{value:'WAIT',label:'进行中'},{value:'FINISHED',label:'已完成'},{value:'TESTED',label:'测试通过'},{value:'ONLINE',label:'已上线'},{value:'CLOSED',label:'已关闭'}],
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
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer","urgent").then(()=>{
			_this.$store.state.perList.includes("urgent.add")?_this.badd=true:'';
			_this.$store.state.perList.includes("urgent.edit")?_this.bedit=true:'';	
			_this.$store.state.perList.includes("urgent.pass")?_this.bpass=true:'';	
			_this.$store.state.perList.includes("urgent.allot")?_this.ballot=true:'';
			_this.$store.state.perList.includes("urgent.finish")?_this.bfinish=true:'';
			_this.$store.state.perList.includes("urgent.close")?_this.bclose=true:'';
			_this.$store.state.perList.includes("urgent.line")?_this.bline=true:'';
			_this.$store.state.perList.includes("urgent.read")?_this.bread=true:'';				
			_this.getList();
		});
		this.getProject();
		this.getUser();
		
	},
	methods:{
		updateOwner(index,row){
			this.updateid = row.id;
			this.updateOwnerTip = true;
		},
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
						that.getList(that.pageIndex);
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
			console.log(y);
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
					status:that.findstatus,
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