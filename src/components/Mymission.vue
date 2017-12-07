<template>
	<div class="mymission">
		<h2>我的任务</h2>
		<!--列表展示-->
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
			      prop="project_id"
			      label="项目ID"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="page_id"
			      label="页面编号"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="标题"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="task_no"
			      label="任务编号"
			      width="140">
			    </el-table-column>
			    <el-table-column
			      prop="status"
			      label="任务状态"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="120">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index,scope.row)">分配</el-button>
			        <el-button type="text" size="small" @click="finish(scope.$index,scope.row)">完成</el-button>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p><button @click="getList(+pageIndex-1)">上一页</button>{{+pageIndex}} / {{allCount}}<button @click="getList(+pageIndex+1)">下一页</button></p>
		</div>
		<!--编辑任务信息-->
		<el-dialog title="编辑用户信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
			  <p>执行者
				<el-cascader
			    placeholder="请选择执行者"
			    :options="options"
			    filterable
			    style="float:right;width:75%;"
			    v-model="updateowner_id"
			    @change="changeowner"
			  ></el-cascader></p>
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
	name:'Mymission',
	data(){
		return{
			tableData:[],//列表数据
			my_id:'',//现在登录的用户ID
			updateUserInfos:false,//分配弹窗
			updateid:'',//分配时 任务ID
			options:[],//执行者列表数据
			updateowner_id:[],//分配 执行者
			newowner_id:'',//分配 执行者
			allCount:'',//页面总数
			pageIndex:''//页面下标
		}
	},
	mounted(){
		this.my_id = sessionStorage.userid;
		this.getList(1);
		this.getUser();
	},
	methods:{
		//获取用户名
		getUser(){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/get_all_user",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					that.options = data.data.user_arr;
				}
			});
		},
		//获取任务列表
		getList(x){
			let that = this;
			if(x == 0){
				this.$message("没有上一页");
				return;
			}
			$.ajax({
				type:"get",
				data:{
					owner_id:that.my_id,
					page:x||1
				},
				url:"/api.php?s=/front/get_task_list",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
					}
					if(data.error == 0){
						that.allCount = Math.ceil(data.data.count/10);
						that.pageIndex = x || 1;
						that.tableData = data.data.task_arr;
					}
				}
			});
		},
		//分配任务信息   x为下标index
		updateUserInfo(x,y){
			this.updateUserInfos = true;
			this.updateowner_id = [];
			this.updateowner_id.push(y.owner_id);
			this.newowner_id = y.owner_id;
			this.updateid = y.id;
		},
		//完成任务
		finish(x,y){
			let that = this;
			if(y.status == 'FINISH'){
				that.$message('此任务已完成')
				return;
			}
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/finish",
				dataType:'json',
				data:{
					id:y.id,
				},
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.$message("完成喽！");
						y.status = 'FINISH';
						y.finished_at = data.data.time;
					}
					if(data.error == 1){
						that.$message(data.error_msg)
					}
				}
			});
		},
		//发送更新任务信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					owner_id:that.newowner_id
				},
				url:"/api.php?s=/front/distribute",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message("新的执行者ID为"+data.data.new_owner_id);
						that.updateUserInfos = false;
					}
					that.getList()
				}
			});
		},
		changeowner(value){
			this.newowner_id = value[0]
		}
	}
})
</script>

<style>
	.mymission{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.mymission .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.mymission .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.mymission .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.mymission .addUserInfo input:first-child{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.mymission .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.mymission .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.mymission .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.mymission .updateContent{
		width:100%;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>