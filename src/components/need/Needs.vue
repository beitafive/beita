<template>
	<div class="w-needs">
		<div  class="co-inner-head">
			<h2 class="co-head-title">
				需求管理
			</h2>
			<el-button  @click="addNeed"  v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p  class="co-search-wrap">
				<span class="co-search-condition">
			  		<span class="co-search-name">ID</span>
			  		<el-input v-model="needInfo.needs_id" placeholder="请输入ID" style="width:220px;padding-right: 12px;"></el-input>					
				</span>
				<span class="co-search-condition">
			  		<span class="co-search-name">标题</span>
			  		<el-input v-model="needInfo.f_title" placeholder="请输入标题" style="width:220px;padding-right: 12px;" @keyup.enter.native="search"></el-input>
				</span>
				<br>
				<span class="co-search-condition">
					<span class="co-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="options"
				    filterable
				    style="width:220px;padding-right: 12px;"
				    v-model="selectProject"
				    @change="findprojectchange"
				  ></el-cascader>					
				</span>
				
				<span class="co-search-condition">
			  		<span class="co-search-name">状态</span>
					  <el-select v-model="needInfo.findStatus" placeholder="请选择状态" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in statusArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>					
				</span>
				
				<span class="co-search-condition">
					<span class="co-search-name">负责人</span>
					<el-select v-model="needInfo.response_user_id" placeholder="请选择负责人" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</span>
				<span class="co-search-condition">
					<span class="co-search-name">提出人</span>
					<el-select v-model="needInfo.owner_id" placeholder="请选择提出人" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</span>

			   <el-button type="primary" @click="search" style="padding: 10px 37px;">搜索</el-button>
			   <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>
		<span class="page-info">需求总数：{{count}}</span>
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			    highlight-current-row
			    @sort-change="projectSort"
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      sortable="custom"	
			      width="80">
			    </el-table-column>
			    <el-table-column
			      prop="project_name"
			      label="项目名称"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      label="标题"
			      min-width="200"
			      >
			      	<template scope="scope">
				      	<router-link :to="{path:'/needDoc',query:{id:scope.row.id}}" target="_blank" style="cursor:pointer;color:#1D8CE0">
					        <span>{{scope.row.title}}</span>
				        </router-link>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="version_name"
			      label="版本"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      prop="status_name"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      label="重要程度"
			      prop="important"
			      sortable="custom"	
			      width="170">
			      <template scope="scope">
			      	<el-rate v-model="scope.row.important" disabled></el-rate>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="submit_user"
			      label="提出人"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="response_user_name"
			      label="负责人"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建日期"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="expect_online_at"
			      label="期望上线日期"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200"
			      >
			      <template scope="scope">
			      	
					<el-button type="text" size="small" v-if="scope.row.status=='WAIT'&&bhandle" @click="handleTip(scope.row,'HANDLE')">处理</el-button>
			      	<el-button type="text" size="small" v-if="scope.row.status=='WAIT'&&brefuse" @click="handleTip(scope.row,'REFUSED')">拒绝</el-button>
					<el-button type="text" size="small" v-if="scope.row.is_task == 1 && scope.row.status=='HANDLE'&&bconfirm" @click="handleTip(scope.row,'CONFIRMED')">确认</el-button>

				    <el-button @click="creatTask(scope.row.id)" type="text" size="small" v-if="scope.row.status=='HANDLE'&&bcreate_task">创建任务</el-button>

			      	<el-button type="text" size="small" v-if="(scope.row.status=='WAIT' || scope.row.status=='HANDLE')&&bdel" @click="handleTip(scope.row,'DELETED')" style="color: #FA5555;">删除</el-button>

			      	<!-- <el-button type="text" size="small" >通知上线</el-button> -->

				    <el-button @click="editNeed(scope.row.id)" v-if="bedit" type="text" size="small">编辑</el-button>
			      
					<el-button @click="remarkNeed(scope.row)" v-if="bremark" type="text" size="small">需求备注</el-button>
					<el-button @click="addNeedLog(scope.row)" v-if="blog" type="text" size="small">添加日志</el-button>
			       <!--  <router-link :to="{path:'/needDoc',query:{id:scope.row.id}}" target="_blank" v-if="bread">
				        <el-button type="text" size="small">查看</el-button>			       
			        </router-link> -->
			      </template>
			    </el-table-column>
			 </el-table>

			  <p v-if="tableData.length"  class="co-page">			  	
			  	<el-button  icon="arrow-left" @click="prePage"  style="margin-right:10px;">上一页</el-button> {{pageIndex}} / {{allCount}} <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			  </p>
		</div>
		
		<!-- 合并弹窗 -->
		<el-dialog
		  title="提示"
		  :visible.sync="qTip"
		  size="tiny">
		  <span v-if="changeStatus != 'REFUSED'">{{tipMsg}}</span>
		  <div class="refuse-info" v-if="changeStatus == 'REFUSED'">
			  <p>原因</p>
			  <textarea class="content" v-model="refuseReason" placeholder="请填写原因"></textarea>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="qTip = false">取 消</el-button>
		    <el-button type="primary" @click="confirm">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 需求备注 -->
		<el-dialog
		  title="提示"
		  :visible.sync="bTip"
		  size="tiny">
		  <span style="display: inline-block;padding: 10px 0;">备注内容</span>
		  <div class="refuse-info">
			  <textarea class="content" v-model="remarkInfo" placeholder="请填写备注"></textarea>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cancelRemark">取 消</el-button>
		    <el-button type="primary" @click="confirmRemark">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 需求日志 -->
		<el-dialog
		  title="提示"
		  :visible.sync="logTip"
		  size="tiny">
		  <span style="display: inline-block;padding: 10px 0;">日志内容</span>
		  <div class="refuse-info">
			  <textarea class="content" v-model="needLog" placeholder="请填写日志"></textarea>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cancelRemark">取 消</el-button>
		    <el-button type="primary" @click="confirmLog">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'Needs',
	data(){
		return{
			tableData:[],			//列表数据
			pageIndex:1,			//页面下标
			count:'',				//总条数
			allCount:'',			//总页数
			options:[],				//项目下拉框数据

			needs_id: '',			//需求id--搜索条件
			owner_id:'',			//提出人id--搜素条件
			response_user_id: '',	//负责人ID--搜索条件
			ownerarr:[],			//提出者列表
			
			selectProject:[],
			findprojectinfo:'',		//搜索 - 项目
			f_title:'',				//搜索 - 标题
			findStatus:'',			//搜索 - 状态
			statusArr:[
				{value:'WAIT',label:'等待中'},
				{value:'HANDLE',label:'处理中'},
				{value:'CONFIRMED',label:'开发中'},
				{value:'FINISHED',label:'已完成'},
				{value:'TESTED',label:'测试通过'},
				{value:'ONLINE',label:'已上线'},
				{value:'CLOSED',label:'已关闭'},
				{value:'REFUSED',label:'已拒绝'},
				{value:'DELETED',label:'已删除'}
			],	
			//需求页面信息					//状态 - 列表
			needInfo:{
				needs_id: '',			//需求id--搜索条件
				owner_id:'',			//提出人id--搜素条件
				response_user_id: '',	//负责人ID--搜索条件
				findprojectinfo:'',		//搜索 - 项目
				f_title:'',				//搜索 - 标题
				findStatus:'',			//搜索 - 状态
			},
			//需求页面搜索条件信息
			searchInfo:{
				needs_id: '',			//需求id--搜索条件
				owner_id:'',			//提出人id--搜素条件
				response_user_id: '',	//负责人ID--搜索条件
				findprojectinfo:'',		//搜索 - 项目
				f_title:'',				//搜索 - 标题
				findStatus:'',			//搜索 - 状态
			},

			qTip:false,			//合并请求弹窗
			tipMsg:'',			//弹窗内容
			id:'',				//完成||删除时需要的列表id

			bTip:false,			//需求备注
			remarkInfo:'',		//备注内容

			logTip:false,		//需求日志
			needLog:'',			//需求日志内容
			
			badd:false,				//添加
			bedit:false,			//编辑
			bfinish:false,			//完成
			bdel:false,				//删除
			bread:false,			//查看
			bconfirm:false,			//确认
			brefuse:false,			//拒绝
			bcreate_task:false,		//创建任务
			bhandle: false,			//处理
			bremark: false,			//需求备注权限
			blog: false,			//需求日志权限

			refuseReason:'',		//拒绝原因
			status: '',				//需求状态
			changeStatus: '',		//修改需求状态
			a:2,
			important:0,			//重要性等级
			importantSort: 0,		//重要性排序标志
			idSort: 0,				//id排序标志

		}
	},
	mounted(){
		let that = this;
		that.getProject();
		that.getUser();
		that.$store.dispatch("getPer","need").then((res)=>{
			that.$store.state.perList.includes("need.add")?that.badd=true:'';
			that.$store.state.perList.includes("need.edit")?that.bedit=true:'';		
			that.$store.state.perList.includes("need.finish")?that.bfinish=true:'';
			that.$store.state.perList.includes("need.read")?that.bread=true:'';
			that.$store.state.perList.includes("need.del")?that.bdel=true:'';	
			that.$store.state.perList.includes("need.confirm")?that.bconfirm=true:'';
			that.$store.state.perList.includes("need.refuse")?that.brefuse=true:'';
			that.$store.state.perList.includes("need.create_task")?that.bcreate_task=true:'';
			that.$store.state.perList.includes("need.handle")?that.bhandle=true:'';
			that.$store.state.perList.includes("need.remark")?that.bremark=true:'';
			that.$store.state.perList.includes("need.log")?that.blog=true:'';

			//获取页面状态信息
			that.pageInfo();
			//获取搜索条件信息
			that.searchContent();
			
			that.getList(that.pageIndex,that.searchInfo,that.importantSort);
			
		});
	},
	methods:{
		//搜索
		search(){
			let that = this;
			let searchParams = {
				'needs_id': that.needInfo.needs_id,
				'f_project': that.needInfo.findprojectinfo,
				'findStatus': that.needInfo.findStatus,
				'f_title': that.needInfo.f_title,
				'response_user_id': that.needInfo.response_user_id,
				'owner_id': that.needInfo.owner_id,
				'pageIndex': that.pageIndex
			}
			that.$store.dispatch('search_params',searchParams)
			that.pageIndex = 1;
			that.getList(that.pageIndex,that.needInfo,that.importantSort)
		},
		//更改需求状态
		changeNeedStatus(status,id,log){
			let that = this;
			$.ajax({
				type:"post",
				url:that.$api.need.change_status,
				dataType:'json',
				data:{
					status:status,
					id:that.id,
					log:log,
				},
				success:(res)=>{
					if(res.error == 0){
						that.searchContent();
						that.getList(that.pageIndex,that.searchInfo,that.importantSort);
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		},
		//修改状态弹框
		handleTip(row,status){
			this.id = row.id;
			this.changeStatus = status;
			this.qTip = true;

			switch(this.changeStatus){
				case 'CONFIRMED':
				this.refuseReason = '';
				this.tipMsg ='是否确认此条需求？'				
				break;

				case 'HANDLE':
				this.refuseReason = '';
				this.tipMsg = '是否处理此条需求？'
				break;

				case 'REFUSED':
				this.tipMsg = ''
				break;
				
				case 'DELETED':
				this.refuseReason = '';
				this.tipMsg = '确认要删除此条需求吗？'
				break;

			}
		},
		//确认修改状态
		confirm(){
			this.changeNeedStatus(this.changeStatus,this.id,this.refuseReason);
			this.qTip = false;
		},
		//添加需求
		addNeed(){
			this.savePageContent();
			this.$router.push('/addneed')
		},
		//编辑需求
		editNeed(id){
			this.savePageContent();
			this.$router.push({path:'/editneed',query:{id:id}})
		},
		//创建任务
		creatTask(id){
			this.savePageContent();
			this.$router.push({path:'/createNeedTask',query:{id:id}})
		},
		//保存页面信息
		savePageContent(){
			let pageContent = {
				'needs_id': this.needInfo.needs_id,
				'f_project': this.needInfo.findprojectinfo,
				'findStatus': this.needInfo.findStatus,
				'f_title': this.needInfo.f_title,
				'response_user_id': this.needInfo.response_user_id,
				'owner_id': this.needInfo.owner_id,
				'pageIndex': this.pageIndex
			}
			this.$store.dispatch('keep_page_content',pageContent)
		},
		//确认备注
		confirmRemark(){
			let that = this;
			$.ajax({
				type:"post",
				url:that.$api.need.remark,
				dataType:'json',
				data:{
					remark:this.remarkInfo,
					id:this.id
				},
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message('添加成功');
						that.remarkInfo = '';
						that.bTip = false;				
					}
				}
			});
			
		},
		//添加需求备注
		remarkNeed(row){
			this.id = row.id;
			this.bTip = true;
		},
		//取消添加
		cancelRemark(){
			//备注信息
			this.remarkInfo = '';
			this.bTip = false;
			//日志信息
			this.needLog = '';
			this.logTip = false;
		},
		//添加需求日志
		addNeedLog(row){
			this.id = row.id;
			this.logTip = true; 
		},
		//确认需求日志
		confirmLog(){
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.need.add_log,
				dataType:'json',
				data:{
					message:this.needLog,
					id:this.id
				},
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message('添加成功');
						that.needLog = '';
						that.logTip = false;				
					}
				}
			});
			
		},
		//下一页
		nextPage(){
			if(this.pageIndex==this.allCount){
				this.$message("没有下一页")
				return
			}
			this.pageIndex++;

			this.searchContent();

			this.getList(this.pageIndex,this.searchInfo,this.importantSort);
		},
		//上一页
		prePage(){
			if(this.pageIndex == 1){
				this.$message("没有上一页")
				return
			}
			this.pageIndex--;

			this.searchContent();

			this.getList(this.pageIndex,this.searchInfo,this.importantSort);
		}, 
		//排序
		projectSort(e){
			this.searchContent();
			switch(e.prop){
				case 'important':
					this.idSort = 0;
					if(e.order == "descending"){
						this.importantSort = 1;					
					}else if(e.order == "ascending"){
						this.importantSort = 2;
					}
					this.getList(this.pageIndex,this.searchInfo,this.importantSort,this.idSort);

					break;
				case 'id':
					this.importantSort = 0;
					if(e.order == "descending"){
						this.idSort = 1;					
					}else if(e.order == "ascending"){
						this.idSort = 2;
					}					
					this.getList(this.pageIndex,this.searchInfo,this.importantSort,this.idSort);

					break;
				default:
					this.importantSort = 0;
					this.idSort = 0;
					this.getList(this.pageIndex,this.searchInfo,this.importantSort,this.idSort);
			}
			
		},
		//获取页面信息
		pageInfo(){
			let that = this;
			//获取页面状态信息
			let pageContent = that.$store.state.pageContent;

			that.needInfo.findprojectinfo = pageContent.f_project;
			that.selectProject[0] =  that.needInfo.findprojectinfo;
			that.needInfo.f_title = pageContent.f_title;
			that.needInfo.findStatus = pageContent.findStatus;
			that.needInfo.needs_id = pageContent.needs_id;

			that.needInfo.response_user_id = pageContent.response_user_id;
			that.needInfo.owner_id = pageContent.owner_id;
			that.pageIndex = pageContent.pageIndex;
		},
		//获取搜索信息
		searchContent(){
			let that = this;
			//获取搜索条件
			let searchParams =  that.$store.state.searchParams;
			that.searchInfo.findprojectinfo = searchParams.f_project;
			that.searchInfo.f_title = searchParams.f_title;
			that.searchInfo.findStatus = searchParams.findStatus;
			that.searchInfo.needs_id = searchParams.needs_id;
			that.searchInfo.owner_id = searchParams.owner_id;
			that.searchInfo.response_user_id = searchParams.response_user_id;
		},
		//获取提出者列表
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
		getProject(){
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
					that.options = data.data.project_arr;
				}
			});
		},
		
		//获取需求列表
		getList(page,info,i_sort,id_sort){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:page||1,
					project_id:info.findprojectinfo,
					title:info.f_title,
					status:info.findStatus,
					id: info.needs_id,
					submit_user_id: info.owner_id,
					response_user_id: info.response_user_id,
					important:i_sort,
					order_by_id:id_sort
				},
				url:that.$api.need.getlist,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						that.tableData = [];
						return;
					}
					that.count = data.data.count;
					that.tableData = data.data.requirement_arr;
					that.pageIndex = page || 1;
					that.allCount = Math.ceil(data.data.count/10);
				}
			});
		},
		//获取项目
		findprojectchange(value){
			this.needInfo.findprojectinfo = value[0];			
		},
		//清空搜索框
		clearSearch(){
			this.selectProject = [];
			this.needInfo.f_title = '';
			this.needInfo.findStatus = '';
			this.needInfo.findprojectinfo = '';
			this.needInfo.needs_id = '';
			this.needInfo.owner_id = '';
			this.needInfo.response_user_id = '';
		}
	},
})
</script>

<style>
	.w-needs{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-needs .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-needs .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-needs .content,.w-needs .updateContent{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
	.w-needs .refuse-info p{
		margin:0 0 10px 0;
		font-size:14px;
		color:#333;
	}
	.w-needs .refuse-info textarea{
		width:100%;
		height:230px;
		border:1px solid #DDD;
		resize:none;
		border-radius:5px;
		overflow-x: hidden;
		margin-bottom: 20px;
	}
</style>