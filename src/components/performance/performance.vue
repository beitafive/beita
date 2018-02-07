<template>
	<div class="performance">
		<div  class="co-inner-head">
			<h2 class="co-head-title">
				绩效管理
			</h2>
			<p style="margin-top:20px;" class="co-search-wrap">
			  	<span class="co-search-condition">
			  		<span class="co-search-name">用户名</span>
					<el-select v-model="user_id" placeholder="请选择用户" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>					
				</span>					
				<el-button type="primary" @click="search" style="padding: 10px 37px;">搜索</el-button>
			  <!-- <el-button type="primary" icon="search" @click="getlist(1)">搜索</el-button> -->
			</p>
		</div>
		<!-- <span class="page-info">绩效总数：{{count}}</span> -->
		<!--列表展示-->
		<div class="co-inner-content">
			<el-table
		    :data="tableData"
		    border
		    style="width: 100%">
		    <el-table-column
		      prop="user_id"
		      label="ID"
		     width="70">
		    </el-table-column>
		    <el-table-column
		      prop="user_name"
		      label="用户"
		     min-width="150">
		     
		    </el-table-column>
		    <el-table-column
		      prop="task"
		      label="任务"
		       width="150">
		    </el-table-column>
		    <el-table-column
		    	prop="test"
				label="测试"
				width="150"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="need"
				label="需求"
				width="150"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="test_live_bug"
				label="测试BUG"
				width="120"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="develop_live_bug"
				label="开发BUG"
				width="120"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="difficult_2"
				label="难度2"
				width="120"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="difficult_3"
				label="难度3"
				width="120"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="difficult_4"
				label="难度4"
				width="120"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="difficult_5"
				label="难度5"
				width="120"
		    >
		    </el-table-column>
		     <el-table-column
		     prop="total"
		      label="绩效总和"
		      width="150">
		    </el-table-column>
		  </el-table>
		  
		</div>
	</div>
</template>

<script>
	export default{
		name:'performance',
		data(){
			return{
				count:0,
				user_id:'',
				ownerarr:[],
				tableData:[{id:0,user_name:'rxy',performance_A:12,performance_B:8,performance:20}]
			}
		},
		mounted(){
			this.getList();
			this.getUser();
		},
		methods:{
			search(){
				this.getList();
			},
			getList(){
				let that = this;
				that.tableData = [];
				$.ajax({
					type:'get',
					url:that.$api.performance.get_overview_list,
					dataType:'json',
					data:{
						user_id:that.user_id
					},
					success:function(res){
						if(res.error == 0){
							var arr = res.data
							for (var i in arr){
								that.tableData.push(arr[i])

							}
						}else{
							that.$message(res.error_msg)
							return;
						}
						
					}
				})
			},
			//获取用户列表
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
		}
	}
</script>
<style scoped>
	.performance{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
</style>