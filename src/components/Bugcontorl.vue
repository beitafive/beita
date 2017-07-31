<template>
	<div class="bugcontorl">
		<h2>BUG管理</h2>
		<button class="addUser" @click="addbug = true">+ 添加BUG</button>
		<p style="margin-top:20px;"><el-cascader
		    placeholder="请选择项目"
		    :options="projectarr"
		    filterable
		    style="width:200px;"
		    v-model="findproject"
		    @change="findprojectchange"
		  ></el-cascader>
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
			      label="所属项目"
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
			      width="180">
			    </el-table-column>
			    <el-table-column
			      label="是否线上"
			      width="120">
			      <template scope="scope">
			      	{{scope.row.is_live==0?"否":"是"}}
			      </template>>
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
			      	<el-button type="text" size="small" @click="editBug(scope.row,'fixed')" v-if="role=='developer'&&scope.row.status=='WAIT'">完成</el-button>
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index,scope.row)" v-if="(role=='project_manager'||role=='depart_manager')&&(scope.row.status=='WAIT'||scope.row.status=='FIXED')">编辑</el-button>
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
		<!--添加BUG-->
		<el-dialog title="添加BUG" v-model="addbug" size="tiny">
			<div class='addUserInfo'>
				<el-checkbox v-model="add_is_live" style="color:#cc3737">是否在线上</el-checkbox>
				<p>选择项目
				<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addproject"
				    @change="addprojectchange"
				  ></el-cascader></p>
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
				<p>提出者
					<el-cascader
				    :options="ownerarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addsubUser"
				    @change="addsubchange"
				  ></el-cascader></p>
				  <p>紧急程度 <input type="text" v-model="addep" /></p>
				  <p>难度 <input type="text" v-model="adddp" /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				内容
				<textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addbug = false">取 消</el-button>
		    <el-button type="primary" @click="addNewPage">确 定</el-button>
		  </span>
		</el-dialog>
		<!--编辑BUG信息-->
		<el-dialog title="编辑BUG信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<el-checkbox v-model="update_is_live" style="color:#cc3737">是否在线上</el-checkbox>
				<p>选择项目
				<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updateproject"
				    @change="updateprojectchange"
				  ></el-cascader></p>
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
				<p>提出者
					<el-cascader
				    placeholder="请选择提出者"
				    :options="ownerarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updatesub"
				    @change="updatesubchange"
				  ></el-cascader></p>
				  <p>紧急程度 <input type="text" v-model="updateep" /></p>
				  <p>难度 <input type="text" v-model="updatedp" /></p>
				  <p>状态
					<el-cascader
				    placeholder="请选择状态"
				    :options="statusarr"
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
	name:'bugcontorl',
	data(){
		return{
			role:localStorage.role,		//角色
			add_is_live:false, 			//是否线上 --添加
			update_is_live:false,		//是否线上 --编辑
			find_is_live:'',
			is_live_arr:[{value:'',label:'全部'},{value:'1',label:'线上'},{value:'0',label:'内网'}],
			//搜索，项目
			findproject:[],
			findprojectinfo:'',
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
			tableData:[],//表格数据
			pageIndex:'',//页面下标
			allCount:'',//数据条数
			count:'',
			updateUserInfos:false,//更新弹窗
			addbug:false,
			projectarr:[],//项目下拉列表
			ownerarr:[],//执行者下拉列表
			//添加版本
			add_version_id:'',
			add_version_arr:[],
			//添加模块数据
			addmodulearr:[],
			addmodule:[],
			addmoduleinfo:'',
			//添加项目数据
			addproject:[],
			addprojectinfo:'',
			//添加执行者数据
			addowner:[],
			addownerinfo:'',
			//添加提出者数据
			addsubUser:[localStorage.token],
			addsubUserId:localStorage.token,
			addtitle:'',	//添加标题
			addep:'',		//添加 - 紧急 程度
			adddp:'',		//添加	- 难度
			addcontent:'',//添加内容
			//更新 项目数据
			updateproject:[],
			updateprojectinfo:'',
			//更新 模块数据
			updatemodulearr:[],
			updatemodule:[],
			updatemoduleinfo:'',
			//更新 执行者数据
			updateowner:[],
			updateownerinfo:'',
			//更新 提出者数据
			updatesub:[],
			updatesubuserid:'',
			updateid:'',//更新id
			updatetitle:'',//更新标题
			updatecontent:'',//更新内容
			//更新 状态数据
			updatestatus:[],
			updatestate:'',
			updateep:'',	//紧急程度
			updatedp:'',	//难度
			//状态列表
			statusarr:[{value:'WAIT',label:'WAIT'},{value:'FIXED',label:'FIXED'},{value:'CLOSED',label:'CLOSED'},{value:'TESTED',label:'TESTED'}]
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
		//打回或者关闭
		editBug(row,type){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/bug/set_status",
				dataType:'json',
				data:{
					id:row.id,
					status:type
				},
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
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
					is_live:that.find_is_live
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
		//添加页面
		addNewPage(){
			let that = this;
			let is_live = '';
			if(this.add_is_live){
				is_live = 1;
			}else{
				is_live = 0;
			}
			$.ajax({
				type:"post",
				data:{
					project_id:that.addprojectinfo,
					module_id:that.addmoduleinfo,
					title:that.addtitle,
					content:that.addcontent,
					dp:that.adddp,
					ep:that.addep,
					owner_id:that.addownerinfo,
					submit_user_id:that.addsubUserId,
					is_live:is_live
				},
				url:"/api.php?s=/front/add_bug",
				dataType:'json',
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_message);
						return;
					}
					if(data.error==0){
						that.addbug = false;
						that.addproject = [];
						that.addprojectinfo = '';
						that.addmodule = [];
						that.addmoduleinfo = '';
						that.addowner = [];
						that.addownerinfo = '';
						that.addtitle = "";
						that.addcontent = "";
						that.adddp = '',
						that.addep = '',
						that.add_is_live = false;
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑BUG信息   x为下标index ,y为当前列数据对象
		updateUserInfo(x,y){
			let that = this;
			y.is_live=="1"?that.update_is_live=true:that.update_is_live=false;
			that.updateUserInfos = true;//显示弹窗
			//更新项目数据
			that.updateprojectinfo=y.project_id;
			that.updateproject = [];
			that.updateproject.push(y.project_id);
			//更新提出者ID
			that.updatesubuserid=y.submit_user_id;
			that.updatesub = [];
			that.updatesub.push(y.submit_user_id);
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_module",
				data:{
					project_id:y.project_id
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
			//更新模块数据
			that.updatemodule = [];
			that.updatemodule.push(y.module_id);
			that.updatemoduleinfo = y.module_id;
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_page",
				data:{
					module_id:y.module_id
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.updatepagearr = data.data.page_arr;						
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
			//更新状态数据
			that.updatestatus = [];
			that.updatestatus.push(y.status);
			that.updatestate=y.status;
			//更新执行者数据
			that.updateowner = [];
			that.updateowner.push(y.owner_id);
			that.updateownerinfo=y.owner_id;
			that.updateid = y.id;//获取id
			that.updatetitle=y.title;//获取标题
			that.updatecontent=y.content;//获取内容
			that.updateep = y.ep;
			that.updatedp = y.dp;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			let is_live = '';
			that.update_is_live?is_live=1:is_live=0;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					project_id:that.updateprojectinfo,
					module_id:that.updatemoduleinfo,
					is_live:is_live,
					title:that.updatetitle,
					content:that.updatecontent,
					status:that.updatestate,
					owner_id:that.updateownerinfo,
					ep:that.updateep,
					dp:that.updatedp,
					submit_user_id:that.updatesubuserid
				},
				dataType:'json',
				url:"/api.php?s=/front/update_bug",
				success:function(res){
					let data = res
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.updateUserInfos = false;
						that.getList(that.pageIndex);
						
					}
				}
			});
		},
		//获取checkbox的值
		addprojectchange(value){
			this.addprojectinfo = value[0];
			this.addmodule = [];
			this.addmodulearr = '';
			this.addmodulearr = [];
			let that = this;
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
		},
		addmodulechange(value){
			this.addmoduleinfo = value[0];
		},
		addownerchange(value){
			this.addownerinfo = value[0];
		},
		addsubchange(value){
			this.addsubUserId = value[0];
		},
		updateownerchange(value){
			this.updateownerinfo = value[0];
		},
		updatesubchange(value){
			this.updatesubuserid = value[0];
		},
		updateprojectchange(value){
			this.updatemodule = [];
			this.updatemoduleinfo = '';
			this.updatemodulearr = [];
			let that = this;
			that.updateprojectinfo = value[0];
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
		},
		updatemodulechange(value){
			this.updatemoduleinfo = value[0];
		},
		changestatus(value){
			this.updatestate = value[0];
		},
		//搜索，项目下拉事件
		findprojectchange(value){
			this.findprojectinfo = value[0];
			this.findmodule = [];
			this.findmoduleinfo = '';
			this.findmodulearr = [];
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
		height:40px;
		margin:10px 0;
		line-height:40px;
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
		width:75%;
		height:160px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>