<template>
	<div class="w-needs">
		<h2 style="margin-bottom:20px;">需求管理</h2>
		<button class="addUser" @click="dialogVisible = true">+ 添加需求</button>
		<p style="margin-top:20px;"><el-cascader
		    placeholder="请选择项目"
		    :options="options"
		    filterable
		    style="width:200px;"
		    v-model="selectProject"
		    @change="findprojectchange"
		  ></el-cascader>
		  <el-input v-model="f_title" placeholder="请输入内容" style="width:200px;margin: 0 100px;"></el-input>
		   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
		  <el-button type="primary" icon="search" @click="getList('1')">搜索</el-button>
		</p>
		<div class="tables">
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
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="content"
			      label="内容"
			      width="500">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="150">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index)">编辑</el-button>
			        <el-button type="text" size="small" @click="closeItem(scope.$index,scope.row)">删除</el-button>
			        <router-link :to="{path:'/needDoc',query:{id:scope.row.id}}" target="_blank">
				        <el-button type="text" size="small" style="margin-left:20px">查看</el-button>			        	
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			  <p><span style="margin-right:100px;">任务总数：{{count}}</span><el-button type="primary" icon="arrow-left" @click="prePage">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
		</div>
		<el-dialog title="添加需求" v-model="dialogVisible" size="tiny">
			<div class='addUserInfo'>
				<p>项目<el-cascader
				    placeholder="请选择项目"
				    :options="options"
				    filterable
				    style="float:right;width:75%"
				    v-model="addselect"
				    @change="addprojectchange"
				  ></el-cascader>
				</p>
				<p>标题 <input type="text" v-model="addtitle" /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				内容	
				<textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addNewUser">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="编辑需求信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>标题 <input type="text" v-model="updatetitle"  /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
					内容
					<textarea class="updateContent" placeholder="请添加内容描述" v-model="updatecontent"></textarea>	
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateUserInfos = false">取 消</el-button>
		    <el-button type="primary" @click='updateUser' >确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提示"
		  :visible.sync="bTip"
		  size="tiny">
		  <span>确认要删除此条需求吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="bTip = false">取 消</el-button>
		    <el-button type="primary" @click="confrimDelete">确 定</el-button>
		  </span>
		</el-dialog>

	</div>
</template>

<script>
export default({
	name:'Needs',
	data(){
		return{
			f_title:'',
			tableData:[],
			pageIndex:1,
			count:'',
			allCount:'',
			dialogVisible:false,
			updateUserInfos:false,
			addtitle:'',
			addcontent:'',
			updatetitle:'',
			updatecontent:'',
			updateid:'',
			updateIndex:'',
			updateprojectid:'',
			options:[],			//项目下拉框数据
			findprojectinfo:'',
			addprojectinfo:'',
			selectProject:[],
			addselect:[],
			bTip:false,			//删除二次确认弹窗
			close_id:'',		//删除时需要的id
		}
	},
	mounted(){
		this.getProject();
		this.getList();
	},
	methods:{
		//显示删除弹窗
		closeItem(index,row){
			this.close_id = row.id;
			this.bTip = true;
		},
		//确认删除
		confrimDelete(){
			let that = this;
			$.ajax({
				type:"post",
				url:"/api.php?s=api/requirement/delete",
				dataType:'json',
				data:{
					id:that.close_id
				},
				success:(res)=>{
					console.log(res)
					if(res.error == 0){
						that.$message.success("删除成功")
						that.bTip = false;
						that.getList(that.pageIndex);
					}else{
						that.$message.error("删除失败")
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
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					that.options = data.data.project_arr;
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
		//获取需求列表
		getList(x){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					project_id:that.findprojectinfo,
					title:that.f_title,
				},
				url:"/api.php?s=/get_requirement_list",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
						that.tableData = [];
						return;
					}
					that.count = data.data.count;
					that.tableData = data.data.requirement_arr;
					that.pageIndex = x || 1;
					that.allCount = Math.ceil(data.data.count/10);
				}
			});
		},
		//添加需求功能
		addNewUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					project_id:that.addprojectinfo,
					title:that.addtitle,
					content:that.addcontent,
				},
				url:"/api.php?s=/add_requirement",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message);
						return;
					}
					if(data.error==0){
						that.dialogVisible = false;
						that.addtitle = "";
						that.addselect = [];
						that.addcontent = "";
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
			this.updatecontent = this.tableData[x].content;
			this.updateid = this.tableData[x].id;
			this.updateprojectid = this.tableData[x].project_id;
			this.updateIndex = x;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					project_id:that.updateprojectid,
					title:that.updatetitle,
					content:that.updatecontent
				},
				url:"/api.php?s=/update_requirement",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.tableData[that.updateIndex].page_no = that.updatepage_no;
						that.tableData[that.updateIndex].title = that.updatetitle;
						that.tableData[that.updateIndex].content = that.updatecontent;
						that.tableData[that.updateIndex].point = that.updatepoint;
						that.updateUserInfos = false;
					}
				}
			});
		},
		//获取checkbox的值
		findprojectchange(value){
			this.findprojectinfo = value[0];
		},
		//获取checkbox的值
		addprojectchange(value){
			this.addprojectinfo = value[0];
		},
		//清空搜索框
		clearSearch(){
			this.selectProject = [];
			this.f_title = '';
			this.findprojectinfo = '';
		}
	}
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
	.w-needs .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.w-needs .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.w-needs .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:16px;
		color:#333;
	}
	.w-needs .addUserInfo input:nth-child(1){
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		margin-left:10px;
		border-radius:4px;
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
</style>