<template>
	<div class="w-module">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				模块管理
			</h2>
			<el-button  @click="dialogVisible = true" v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p style="margin-top:20px;" class="co-search-wrap">
				<span class="co-search-condition">
					<span class="co-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="options"
				    filterable
				    style="width:200px;;padding-right: 12px;"
				    v-model="selectProject"
				    @change="checkChange"
				  ></el-cascader>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">标题</span>
				  <el-input v-model="f_title" @keyup.enter.native="search" placeholder="请输入搜索标题" style="width:200px;padding-right: 12px;"></el-input>					
				</span>

			   <el-button type="primary" @click="getList('1',checkInfo,f_title)" style="padding: 10px 37px;margin-left: 12px;">搜索</el-button>
			   <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>
		<span class="page-info">模块总数：{{count}}</span>
		<div class="co-inner-content">
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
			      min-width="200"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="300">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			     width="200">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index)" v-if="bedit">编辑</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			  <p class="co-page">
			  	<el-button  icon="arrow-left" @click="getList(+pageIndex-1,checkInfo,f_title)" style="margin-right: 10px;">上一页</el-button>{{+pageIndex}}/{{allCount}}<el-button  @click="getList(+pageIndex+1,checkInfo,f_title)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			  </p>
		</div>
		<el-dialog title="添加模块" v-model="dialogVisible" size="tiny">
			<div class='addUserInfo'>
				<p>
					<span style="line-height: 36px;">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="options"
				    filterable
				    style="float:right;width:75%;"
				    v-model="addselect"
				    @change="addcheckChange"
				  ></el-cascader>
				</p>
				<p>
					<span style="line-height: 36px;">标题</span>
					<el-input type="text" v-model="addtitle" style="float:right;width:75%"/></el-input></p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addNewUser">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="编辑模块信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>
					<span style="line-height: 36px;">标题</span> 
					<el-input type="text" v-model="updatetitle" style="float:right;width:75%" /></el-input></p>
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
	name:'Module',
	data(){
		return{
			f_title:'',
			tableData:[],
			pageIndex:1,
			count:'',				//总条数
			allCount:'',

			dialogVisible:false,
			updateUserInfos:false,
			addtitle:'',
			updatetitle:'',
			updateid:'',
			updateIndex:'',
			options:[],
			checkInfo:'',
			addcheckInfo:'',
			selectProject:[],
			addselect:[],
			
			badd:false,
			bedit:false,
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer",'module').then(()=>{
			_this.$store.state.perList.includes("module.add")?this.badd=true:'';
			_this.$store.state.perList.includes("module.edit")?this.bedit=true:'';		
			_this.getList();
		})
		this.getProject();
	},
	methods:{
		search(){
			this.getList(1,this.checkInfo,this.f_title);
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
		//获取模块列表
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
				url:that.$api.module.getlist,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						if(that.allCount!="" && x<=that.allCount){
							that.tableData = [];
						};
						return;
					}
					that.count = data.data.count;
					that.tableData = data.data.module_arr;
					that.pageIndex = x || 1;
					that.allCount = Math.ceil(data.data.count/10);
				}
			});
		},
		//添加模块
		addNewUser(){
			let that = this;
			if(this.addtitle == ''){
				this.$message.error("请填写标题！");
				return null;
			}
			$.ajax({
				type:"post",
				data:{
					project_id:that.addcheckInfo,
					title:that.addtitle
				},
				url:that.$api.module.add,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg);
						return;
					}
					if(data.error==0){
						that.dialogVisible = false;
						that.addtitle = "";
						that.addselect = [];
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑用户信息   x为下标index
		updateUserInfo(x){
			this.updateUserInfos = true;
			this.updatetitle = this.tableData[x].title;
			this.updateid = this.tableData[x].id;
			this.updateIndex = x;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			if(this.updatetitle == ''){
				this.$message.error("请填写标题！");
				return null;
			}
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					title:that.updatetitle
				},
				url:that.$api.module.update,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.tableData[that.updateIndex].title = that.updatetitle;
						that.updateUserInfos = false;
					}
				}
			});
		},
		//获取checkbox的值
		checkChange(value){
			this.checkInfo = value[0];
		},
		//获取checkbox的值
		addcheckChange(value){
			this.addcheckInfo = value[0];
		},
		//清空搜索框
		clearSearch(){
			this.selectProject = [];
			this.f_title = '';
			this.checkInfo = '';
		}
	}
})
</script>

<style>
	.w-module{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-module .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-module .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-module .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.w-module .content,.w-module .updateContent{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>