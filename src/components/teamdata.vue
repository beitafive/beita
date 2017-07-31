<template>
	<div class="w-document">
		<h2>文档管理</h2>
		<p style="margin-top:20px;">
		  <el-date-picker
		      v-model="beginTime"
		      type="date"
		      placeholder="选择开始日期">
		    </el-date-picker>
		  ————<el-date-picker
		      v-model="endTime"
		      type="date"
		      placeholder="选择结束日期">
		    </el-date-picker>
		  <el-button type="primary" icon="search" @click="getList">搜索</el-button>
		</p>
		<!--列表展示-->
		<div class="tables">
			<el-table
		    :data="tableData"
		    border
		    style="width: 100%">
		    <el-table-column
		      prop="realname"
		      label="姓名"
		      width="100">
		    </el-table-column>
		    <el-table-column
		      prop="task_amount"
		      label="完成的任务数"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="task_dp_amount"
		      label="完成的任务点数"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="task_wait_amount"
		      label="等待的任务数"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="task_wait_dp_amount"
		      label="等待的任务点数"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="bug_inner_amount"
		      label="内网BUG数"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="bug_live_amount"
		      label="外网BUG数"
		      width="130">
		    </el-table-column>
		 </el-table>
		</div>
	</div>
</template>

<script>
	export default{
		name:'documentcontorl',
		data(){
			return{
				tableData:[],		//列表数据
				beginTime:'',
				endTime:'',
			}
		},
		mounted(){
			this.getList();
		},
		methods:{
			getList(){
				let that = this;
				let sTime,eTime;
				if(that.beginTime != ""){
					sTime = that.beginTime.getFullYear()+'-'+(that.beginTime.getMonth()+1)+'-'+that.beginTime.getDate();
				}else{
					sTime = '';
				}
				if(that.endTime != ""){
					eTime = that.endTime.getFullYear()+'-'+(that.endTime.getMonth()+1)+'-'+that.endTime.getDate();
				}else{
					eTime = '';
				}
				$.ajax({
					type:"get",
					url:"/api.php?s=front/stat/team",
					dataType:'json',
					data:{
						start_date:sTime,
						end_date:eTime
					},
					success:(res)=>{
						if(res.error == 0){
							that.tableData = res.data;
						}else{
							that.$message.error(res.error_msg);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-document{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-document .addUser{
		font-size:14px;
		margin-top:20px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.w-document .addDoc{
		box-sizing: border-box;
		padding:0 50px;
	}
	.w-document .addDoc p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.w-document .addDoc input:first-child{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-document .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-document .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.content{
		width:75%;
		height:160px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>