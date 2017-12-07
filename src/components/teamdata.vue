<template>
	<div class="w-document">
		<div  class="anchu-inner-head">
			<h2 class="anchu-head-title">团队统计</h2>
			<p style="margin-top:20px;" class="anchu-search-wrap">
				<span class="anchu-search-condition">
					<span class="anchu-search-name">日期</span>
					  <el-date-picker
					      v-model="beginTime"
					      type="date"
					      placeholder="选择开始日期">
					    </el-date-picker>
					  — <el-date-picker
					      v-model="endTime"
					      type="date"
					      placeholder="选择结束日期">
					    </el-date-picker>					
				</span>
			  <el-button type="primary" icon="search" @click="getList()" style="margin-left: 12px;">搜索</el-button>
			</p>
		</div>
		
		<!--列表展示-->
		<div class="anchu-inner-content">
			<el-table
		    :data="tableData"
		    border
		     @sort-change="projectSort"
		    style="width: 100%">
		    <el-table-column
		      prop="realname"
		      label="姓名"
		      sortable="custom"
		      width="100">
		    </el-table-column>
		    <el-table-column
		      prop="task_amount"
		      label="完成任务数"
		      sortable="custom"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="task_point_amount"
		      label="完成工时数"
		      sortable="custom"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="task_wait_amount"
		      label="待完成任务数"
		      sortable="custom"
		      width="150">
		    </el-table-column>
		    <el-table-column
		      prop="task_wait_point_amount"
		      label="待完成工时数 "
		      sortable="custom"
		      width="150">
		    </el-table-column>
		    <el-table-column
		      prop="bug_inner_amount"
		      label="内网BUG数"
		      sortable="custom"
		      width="150">
		    </el-table-column>
		    <el-table-column
		      prop="bug_live_amount"
		      label="外网BUG数"
		      sortable="custom"
		      width="150">
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
				sTime:'',
				eTime:'',

				sort_realname: 0,
				realSortSwitch:false, 			//姓名排序开关

				sort_amount:0,
				amountSortSwitch:false,			//任务数排序

				sort_point_amount:0,
				pointSortSwitch:false,			//工时数排序

				sort_wait_amount:0,
				waitSortSwitch:false,			//待完成任务排序

				sort_wait_point_amount:0,
				waitPointSortSwitch:false,		//待完成工时排序

				sort_inner_amount:0,
				innerSortSwitch:false,			//内网bug排序

				sort_live_amount:0,
				liveSortSwitch:false,			//线上bug排序




			}
		},
		beforeMount(){
			this.beginTime = new Date();
			this.endTime = new Date();
		},
		mounted(){
			this.getList();
		},
		methods:{
			getList(order,sort){
				let that = this;
				if(that.beginTime != ""){
					that.sTime = that.beginTime.getFullYear()+'-'+(that.beginTime.getMonth()+1)+'-'+that.beginTime.getDate();
				}else{
					that.sTime = '';
				}
				if(that.endTime != ""){
					that.eTime = that.endTime.getFullYear()+'-'+(that.endTime.getMonth()+1)+'-'+that.endTime.getDate();
				}else{
					that.eTime = '';
				}
				$.ajax({
					type:"get",
					url:that.$api.get_team,
					dataType:'json',
					data:{
						start_date:that.sTime,
						end_date:that.eTime,
						order:order,
						sort:sort,
					},
					success:(res)=>{
						if(res.error == 0){
							let data = res.data;
							that.tableData = [];
							that.tableData = Object.values(data);
							
						}else{
							that.$message.error(res.error_msg);
						}
					}
				});
			},
			projectSort(e){
				let order = e.prop;
				//sort 0--默认(order为null) 1--正序  2--倒序 
				
				if(e.prop == "realname"){
					this.realSortSwitch = !this.realSortSwitch
					if(this.realSortSwitch == true){
						this.sort_realname = 1;					
					}else{
						this.sort_realname = 2;
					}
					this.getList(order,this.sort_realname);
				}else if(e.prop == "task_amount"){
					this.amountSortSwitch = !this.amountSortSwitch
					if(this.amountSortSwitch == true){
						this.sort_amount = 1;
						
					}else{
						this.sort_amount = 2;
					}
					this.getList(order,this.sort_amount);
				}else if(e.prop == "task_point_amount"){
					this.pointSortSwitch = !this.pointSortSwitch
					if(this.pointSortSwitch == true){
						this.sort_point_amount = 1;
						
					}else{
						this.sort_point_amount = 2;
					}
					this.getList(order,this.sort_point_amount);
				}else if(e.prop == "task_wait_amount"){
					this.waitSortSwitch = !this.waitSortSwitch
					if(this.waitSortSwitch == true){
						this.sort_wait_amount = 1;
						
					}else{
						this.sort_wait_amount = 2;
					}
					this.getList(order,this.sort_wait_amount);
				}else if(e.prop == "task_wait_point_amount"){
					this.waitPointSortSwitch = !this.waitPointSortSwitch
					if(this.waitPointSortSwitch == true){
						this.sort_wait_point_amount = 1;
						
					}else{
						this.sort_wait_point_amount = 2;
					}
					this.getList(order,this.sort_wait_point_amount);
				}else if(e.prop == "bug_inner_amount"){
					this.innerSortSwitch = !this.innerSortSwitch
					if(this.innerSortSwitch == true){
						this.sort_inner_amount = 1;
						
					}else{
						this.sort_inner_amount = 2;
					}
					this.getList(order,this.sort_inner_amount);
				}else if(e.prop == "bug_live_amount"){
					this.liveSortSwitch = !this.liveSortSwitch
					if(this.liveSortSwitch == true){
						this.sort_live_amount = 1;
						
					}else{
						this.sort_live_amount = 2;
					}
					this.getList(order,this.sort_live_amount);
				}else{
					this.getList();
				}
			},
		}
	}
</script>

<style scoped>
	.w-document{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
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
</style>