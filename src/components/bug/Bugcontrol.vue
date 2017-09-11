<template>
	<div class="bugcontorl">
		<h2>BUG管理</h2>
		<router-link to="/addbug">
			<button class="addUser">+ 添加BUG</button>			
		</router-link>
		<p style="margin-top:20px;"><el-cascader
		    placeholder="请选择项目"
		    :options="projectarr"
		    filterable
		    style="width:200px;"
		    v-model="findproject"
		    @change="findprojectchange"
		  ></el-cascader>
		  <el-select v-model="version_id" placeholder="请选择版本" style="width:200px;">
		    <el-option
		      v-for="item in versionArr"
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
		  ></el-cascader><br /><br />
		  <el-tooltip class="item" effect="dark" content="BUG所在环境" placement="top">
		  <el-select v-model="find_is_live" placeholder="请选择" style="width:200px;">
		    <el-option
		      v-for="item in is_live_arr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  </el-tooltip>
		  <el-select v-model="findstatus" placeholder="请选择BUG状态" style="width:200px;">
		    <el-option
		      v-for="item in statusarr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  <el-input v-model="f_title" placeholder="请输入标题" style="width:200px;"></el-input>
		   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
		  <el-button type="primary" icon="search" @click="getList(1)">搜索</el-button>
		</p>
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
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="status_name"
			      label="状态"
			      width="100">
			      <template scope="scope">
			      	<span v-html="scope.row.status_name"></span>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="realname"
			      label="执行者"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="submit_user"
			      label="提出者"
			      width="100">
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
			      	<el-button type="text" size="small" v-if="role=='developer'&&scope.row.status=='WAIT'" @click="showTip(scope.row)">完成</el-button>
			      	<router-link :to="{path:'/editbug',query:{id:scope.row.id}}" v-if="(role=='project_manager'||role=='depart_manager')&&(scope.row.status=='WAIT'||scope.row.status=='FIXED')">
			        	<el-button type="text" size="small" >编辑</el-button>
			      	</router-link>
			        <el-button type="text" size="small" @click="editBug(scope.row,'tested')" v-if="role=='tester'&&scope.row.status=='FIXED'">通过</el-button>
			        <el-button type="text" size="small" @click="editBug(scope.row,'wait')" v-if="role=='tester'&&scope.row.status=='FIXED'">打回</el-button>
			        <el-button type="text" size="small" @click="editBug(scope.row,'closed')" v-if="(role=='project_manager'||role=='depart_manager')&&scope.row.status=='TESTED'">关闭</el-button>
			        &nbsp;
			        <router-link :to="{path:'/bugcontent',query:{id:scope.row.id}}" target="_blank">
			        <el-button type="text" size="small">
			        	查看
			        </el-button></router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p><span style="margin-right:100px;">BUG总数：{{count}}</span><el-button type="primary" icon="arrow-left" @click="prePage">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
		</div>
		<!--完成弹窗-->
		<el-dialog title="请填写原因和解决方案" :visible.sync="finishTip" size="tiny">
			<div class="addUserInfo">
			  <p>原因</p>
			  <p><textarea class="content" v-model="reason" placeholder="请填写原因"></textarea></p>
			  <p>解决方案</p>
			  <p><textarea class="content" v-model="solution" placeholder="请填写解决方案"></textarea></p>
			</div>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="finishTip = false">取 消</el-button>
		    <el-button type="primary" @click="editBug(finishObj,'fixed')">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'bugcontorl',
	data(){
		return{
			role:localStorage.role,		//角色
			find_is_live:'',
			is_live_arr:[{value:'',label:'全部'},{value:'1',label:'线上'},{value:'0',label:'内网'}],
			//搜索，项目
			findproject:[],
			findprojectinfo:'',
			//搜索，版本
			versionArr:[],
			version_id:'',
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
			//搜索，状态
			findstatus:'',
			
			tableData:[],//表格数据
			pageIndex:'',//页面下标
			allCount:'',//数据条数
			count:'',
			projectarr:[],//项目下拉列表
			ownerarr:[],//执行者下拉列表
			//状态列表
			statusarr:[{value:'WAIT',label:'WAIT'},{value:'FIXED',label:'FIXED'},{value:'CLOSED',label:'CLOSED'},{value:'TESTED',label:'TESTED'}],
			//完成时 填写的原因  && 解决方案
			reason:'',
			solution:'',
			finishTip:false,		//完成弹窗
			finishObj:{},			//完成对象
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
		showTip(row){
			this.finishObj = row;
			this.finishTip = true;
		},
		//打回或者关闭
		editBug(row,type){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/bug/set_status",
				dataType:'json',
				data:{
					id:row.id,
					status:type,
					reason:that.reason,
					solution:that.solution
				},
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						if(type=='fixed'){
							that.reason = '';
							that.solution = '';
						}
						that.finishTip = false;
						that.getList(1);
					}
				}
			});
		},
		//获取用户名
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
		getProject(){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_project",
				dataType:'json',
				success:function(res){
					let data = res
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
		//获取BUG列表
		getList(x){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					project_id:that.findprojectinfo,
					module_id:that.findmoduleinfo,
					owner_id:that.findownerinfo,
					title:that.f_title,
					is_live:that.find_is_live,
					status:that.findstatus,
					version:that.version_id,
				},
				url:"/api.php?s=/front/get_bug_list",
				dataType:'json',
				success:function(res){
					let data = res
					if(data.error==1){
						that.tableData = [];
						that.$message.error(data.error_message)
					}
					if(data.error == 0){
						that.tableData=data.data.bug_arr;
						that.count = data.data.count;
						that.allCount = Math.ceil(data.data.count/10);
						that.pageIndex = x || 1;
					}
				}
			});
		},
		//搜索，项目下拉事件
		findprojectchange(value){
			this.findprojectinfo = value[0];
			this.findmodule = [];
			this.findmoduleinfo = '';
			this.findmodulearr = [];
			this.versionArr = [];
			this.version_id = '';
			let that = this;
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
						that.versionArr = data.data;
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
			this.versionArr = [];
			this.version_id = '';
			//模块
			this.findmodule = [];
			this.findmoduleinfo = '';
			//执行者
			this.findowner = [];
			this.findownerinfo = '';
			//环境
			this.find_is_live = '';
			//标题
			this.f_title = '';
		}
	}
})
</script>

<style>
	.bugcontorl{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.bugcontorl .addUser{
		cursor:pointer;
		font-size:14px;
		margin-top:20px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.bugcontorl .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.bugcontorl .addUserInfo p{
		margin:10px 0;
		font-size:14px;
		color:#333;
	}
	.bugcontorl .addUserInfo input:first-child{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.bugcontorl .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.bugcontorl .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.bugcontorl .content{
		width:100%;
		height:160px;
		border:1px solid #DDD;
		resize:none;
		border-radius:5px;
	}
</style>