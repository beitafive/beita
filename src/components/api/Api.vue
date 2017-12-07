<template>
	<!--
    	作者：beitafive@163.com
    	时间：2017-05-10
    	描述：api
    -->
	<div class="w-api">
		<div  class="anchu-inner-head">
			<h2 class="anchu-head-title">
			API管理
				<router-link to="/addapi">
					<button class="addUser"  v-if="badd">+ 添加API</button>
				</router-link>
			</h2>
			<!--搜索-->
			<p style="margin-top:20px;"  class="anchu-search-wrap">
				<span class="anchu-search-condition">
					<span class="anchu-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:200px;;padding-right: 12px;"
				    v-model="findproject"
				    @change="findprojectchange"
				  ></el-cascader>					
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
				  <span class="anchu-search-name">名称</span>
				  <el-input v-model="f_title" placeholder="请输入名称" style="width:200px;"></el-input>					
				</span>
			   <el-button type="primary" icon="circle-cross" @click="clearSearch" style="margin-left: 12px;">清空</el-button>
			  <el-button type="primary" icon="search" @click="getList(1)">搜索</el-button>
			</p>
		</div>
		
		<!--列表展示-->
		<div class="anchu-inner-content">
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
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="module_name"
			      label="模块名称"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="名称"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="method"
			      label="method"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="url"
			      label="地址"
			     >
			    </el-table-column>
			    <el-table-column
			      prop="new_time"
			      label="最新更新时间"
			      width="210">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200"
			     >
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index,scope.row)" v-if="bedit">编辑</el-button>
			        <el-button type="text" size="small" @click="deleteUserInfo(scope.row)" v-if="bedit">删除</el-button>
			        <router-link :to="{path:'/oaApiDoc',query:{id:scope.row.id}}" target="_blank">
				        <el-button type="text" size="small" style="margin-left:15px" v-if="bread">查看</el-button>			        	
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p class="anchu-page">
			 	<el-button icon="arrow-left" @click="getList(+pageIndex-1)" style="margin-right: 10px;">上一页</el-button>{{+pageIndex}}/{{allCount}}<el-button @click="getList(+pageIndex+1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			 </p>
		</div>
		<!--添加API-->
	<!-- 	<el-dialog title="添加API" v-model="dialogVisible" size="tiny">
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
			  	<p>选择模块
				  <el-cascader
				    placeholder="请选择模块"
				    :options="addmodulearr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addmodule"
				    @change="addmodulechange"
				  ></el-cascader></p>
				<p>标题 <el-input type="text" v-model="addtitle" class="inputInfo" placeholder="请填写标题" /></p>
				<p>URL <el-input type="text" v-model="addurl" class="inputInfo"  placeholder="请填写URL"/></p>
				<p>METHOD
					<el-cascader
				    placeholder="请选择请求方式"
				    :options="methodarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addmethod"
				    @change="addmethodchange"
				  ></el-cascader></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				REQUEST
				<textarea v-model="addrequest" class="content">	</textarea>
				</div>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				RESPONSE
				<textarea v-model="addresponse" class="content"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addNewApi">确 定</el-button>
		  </span>
		</el-dialog> -->
		<!--编辑API信息-->
		<!-- <el-dialog title="编辑API信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>选择项目
				<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updateproject"
				    @change="updateproiectchange"
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
				<p>标题 <el-input type="text" v-model="updatetitle" class="inputInfo"  placeholder="请填写标题"/></p>
				<p>URL<el-input type="text" v-model="updateurl" class="inputInfo" placeholder="请填写URL"/></p>
				<p>METHOD
				<el-cascader
				    placeholder="请选择请求方式"
				    :options="methodarr"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updatemethod"
				    @change="updatemethodchange"
				  ></el-cascader></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				REQUEST
				<textarea v-model="updaterequest" class='content'></textarea>
				</div>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				RESPONSE
				<textarea v-model="updateresponse" class="content">	
				</textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateUserInfos = false">取 消</el-button>
		    <el-button type="primary" @click='updateUser' >确 定</el-button>
		  </span>
		</el-dialog> -->
	</div>
</template>

<script>
export default({
	name:'w-api',
	data(){
		return{
			tableData:[],//列表数据
			pageIndex:'',//页面下标
			allCount:'',//页面总数
			updateUserInfos:false,//编辑弹窗
			dialogVisible:false,//添加弹窗
			projectarr:[],//项目列表
			//搜索-项目
			findproject:[],
			findprojectinfo:'',
			//搜索-模块
			findmodule:[],
			findmodulearr:[],
			findmoduleinfo:'',
			f_title:'',//搜索-标题
			//添加-项目
			addproject:[],
			addprojectinfo:'',
			//添加-模块
			addmodulearr:[],
			addmodule:[],
			addmoduleinfo:'',
			//添加-请求方式
			addmethod:[],
			addmethodinfo:'',
			addtitle:'',//添加-标题
			addurl:'',//添加-url
			addrequest:'',//添加-request
			addresponse:'',//添加-response
			updateid:'',//编辑id
			//编辑-项目
			updateproject:[],
			updateproject_id:'',
			//更新时模块选择
			updatemodule:[],
			updatemodulearr:[],
			updatemoduleinfo:'',
			updatetitle:'',//更新时标题
			updateurl:'',//更新时的url
			updaterequest:'',//更新时的request
			updateresponse:'',//更新时的response
			updatemethod:[],//更新时的请求方式
			updatemethodinfo:'',//更新时的请求方式
			methodarr:[{value:'POST',label:'POST'},{value:'GET',label:'GET'},{value:'PUT',label:'PUT'},{value:'DELETE',label:'DELETE'},{value:'HEAD',label:'HEAD'}],//请求方式列表
			
			
			badd:false,
			bedit:false,
			bread:false
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer",'api').then(()=>{
			_this.$store.state.perList.includes("api.add")?this.badd=true:'';
			_this.$store.state.perList.includes("api.edit")?this.bedit=true:'';		
			_this.$store.state.perList.includes("api.read")?this.bread=true:'';				
			_this.getList();
		})
		this.getProject();
	},
	methods:{
		//删除api
		deleteUserInfo(row){
			let that = this;
			let id = row.id;

			$.ajax({
				type:"post",
				data:{
					id:id
				},
				dataType:'json',
				url:that.$api.api.delete,
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					that.$message('删除成功')
					that.getList();
				}
			});
		},
		//获取项目列表
		getProject(x){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:x||1
				},
				dataType:'json',
				url:that.$api.get_project_list,
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					that.projectarr = data.data.project_arr;
				}
			});
		},
		//获取api列表
		getList(x){
			let that = this;
			if(x=='0'){
				that.$message("没有上一页");
				return;
			}
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					project_id:that.findprojectinfo,
					module_id:that.findmoduleinfo,
					title:that.f_title
				},
				dataType:'json',
				url:that.$api.api.getlist,
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_msg)
					}
					if(data.error == 0){
						that.tableData=data.data.api_arr;
						
						that.allCount = Math.ceil(data.data.count/10);
						that.pageIndex = x || 1;
					}
				}
			});
		},
		//添加页面
		addNewApi(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					project_id:that.addprojectinfo,
					module_id:that.addmoduleinfo,
					title:that.addtitle,
					url:that.addurl,
					method:that.addmethodinfo,
					request:that.addrequest,
					response:that.addresponse
				},
				dataType:'json',
				url:that.$api.api.add,
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_msg);
						return;
					}
					if(data.error==0){
						that.dialogVisible = false;
						that.addtitle = "";
						that.addurl = '';
						that.addrequest = '';
						that.addresponse = '';
						that.addmodule = [];
						that.addmoduleinfo = '';
						that.addproject = [];
						that.addprojectinfo = '';
						that.addmethod = [];
						that.addmethodinfo = '';
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑api信息,获取模块列表   x为下标index
		updateUserInfo(x,y){
			let that = this;
			that.$router.push({path:"/editapi",query:{id:y.id,pid:y.project_id,mid:y.module_id,title:y.title}});
			return ;
			that.updateid = y.id;
			that.updateproject = [];
			that.updateproject_id = y.project_id;
			that.updateproject.push(y.project_id);
			$.ajax({
				type:"get",
				url:that.$api.get_module_list,
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
						that.$message(data.error_msg)
					}
				}
			});
			that.updatemodule = [];
			that.updatemoduleinfo = y.module_id;
			that.updatemodule.push(y.module_id);
			
			//默认选中请求方式
			that.updatemethod = [];
			that.updatemethodinfo = y.method;
			that.updatemethod.push(y.method);
			that.updatetitle = y.title;//默认标题
			that.updateurl = y.url;//默认url
			that.updaterequest = y.request;//默认request
			that.updateresponse = y.response;//默认response
			that.updateUserInfos = true;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					project_id:that.updateproject_id,
					module_id:that.updatemoduleinfo,
					title:that.updatetitle,
					url:that.updateurl,
					method:that.updatemethodinfo,
					request:that.updaterequest,
					response:that.updateresponse
				},
				dataType:'json',
				url:that.$api.api.update,
				success:function(res){
					let data = res
					if(data.error == 1){
						that.$message(data.error_msg)
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
		//添加，项目拉下事件
		addprojectchange(value){
			this.addprojectinfo = value[0];
			this.addmodule = [];
			this.addmodulearr = [];
			let that = this;
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
						that.addmodulearr = data.data.module_arr;
					}
					if(data.error == 1){
						that.$message(data.error_msg)
					}
				}
			});
		},
		//搜索，项目下拉
		findprojectchange(value){
			this.findprojectinfo = value[0];
			this.findmodule = [];
			this.updatemodulearr = []
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.get_module_list,
				data:{
					project_id:value[0]
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
					}
					if(data.error == 0){
						that.findmodulearr = data.data.module_arr;
					}
				}
			});
		},
		//搜索，模块下拉
		findmodulechange(value){
			this.findmoduleinfo = value[0];
		},
		//添加，请求方式下拉事件
		addmethodchange(value){
			this.addmethodinfo = value[0];
		},
		//添加，模块下拉事件
		addmodulechange(value){
			this.addmoduleinfo = value[0];
		},
		//编辑，模块下拉事件
		updatemodulechange(value){
			this.updatemoduleinfo = value[0];
		},
		//编辑，请求方式下拉事件
		updatemethodchange(value){
			this.updatemethodinfo = value[0];
		},
		//编辑，项目下拉事件
		updateproiectchange(value){
			let that = this;
			that.updateproject_id = value[0];
			that.updatemodule = [];
			that.updatemodulearr = [];
			$.ajax({
				type:"get",
				url:that.$api.get_module_list,
				data:{
					project_id:value[0]
				},
				dataType:'json',
				success:function(res){
					let data = res;
					that.updatemodulearr = data.data.module_arr;
				}
			});
		},
		//清空功能
		clearSearch(){
			this.findproject = [];
			this.findprojectinfo ='';
			this.findmodule = [];
			this.findmoduleinfo = '';
			this.f_title = '';
		}
	}
})
</script>

<style>
	.w-api{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-api .addUserInfo span{
		margin-right: 12px;
	}
	.w-api .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	} 
	.w-api .addUserInfo .inputInfo{
		width:75%;
		height:38px;
		float:right;
		box-sizing: border-box;
		border-radius:4px;
		margin-right: 12px;
	}
	.w-api .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-api .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-api .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.w-api .content{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>