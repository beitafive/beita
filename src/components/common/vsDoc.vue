<template>
	<div class="w-content">
		<h3>{{msg.project_name}}<span>{{msg.title}}</span></h3>
		<p>创建时间：{{msg.created_at}}</p>
		<p>简介：{{msg.short_desc}}</p>
		<p v-html="'内容：'+msg.html">内容：</p>
		<h4>版本进度</h4>
		<p>任务总数:{{task.task_amount}}</p>
		<p>进度:{{task.progress}}</p>
		<p>已完成的任务总数:{{task.task_finished_amount}}</p>
		<h4>进度详情</h4>
		<el-table
		    :data="taskList"
		    border
		    style="width: 301px;margin-left:300px;">
		    <el-table-column
		      prop="realname"
		      label="姓名"
		      width="100">
		    </el-table-column>
		    <el-table-column
		      prop="amount"
		      label="任务总数"
		      width="100">
		    </el-table-column>
		    <el-table-column
		      prop="dp_amount"
		      label="难度总量"
		      width="100">
		    </el-table-column>
		  </el-table>
	</div>
</template>

<script>
	export default({
		name:'content',
		data(){
			return{
				id:'',
				msg:'',			//概括
				task:'',		//任务概括
				taskList:[],	//任务列表
			}
		},
		created(){
			this.id = this.$route.query.id;
		},
		mounted(){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=front/version/get_detail",
				data:{
					id:that.id
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.msg = data.data.task;
						that.task = data.data.stat;
						that.taskList = data.data.stat_rows;
					}
					if(data.error == 1){
						that.$message(data.error_message);
					}
				}
			});
		}
	})
</script>

<style scoped>
	.w-content{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.w-content h3{
		font-size:50px;
		text-align: center;
	}
	.w-content h4{
		font-size:36px;
		text-align: center;
		margin-bottom:20px;
	}
	.w-content h3 span{
		font-size:20px;
		color:#3c3c3c;
		font-weight: 100;
		margin-left:20px;
	}
	.w-content p{
		margin: 20px 0 20px 50px;
		font-size:18px;
		line-height:30px;
	}
</style>