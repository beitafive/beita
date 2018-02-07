<template>
	<div class="w-document">
		<div  class="co-inner-head">
			<h2 class="co-head-title">团队统计</h2>
			<p style="margin-top:20px;" class="co-search-wrap">
				<span class="co-search-condition">
					<span class="co-search-name">日期</span>
						<el-date-picker
						    v-model="selectWeek"
						    type="week"
						    format="yyyy 第 WW 周"
						    placeholder="选择周">
						</el-date-picker>
					 			
				</span>
			  <el-button type="primary" @click="getList()" style="padding: 10px 37px;margin-left: 12px;">查询</el-button>
			</p>
		</div>
		
		<!--列表展示-->
		<!-- <div class="co-inner-content">
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
		</div> -->
		<div id="personChart" style="min-width: 1638px;height:600px;margin: 20px;"></div>
	</div>
</template>

<script>
	import {formatDate} from '@/assets/js/util.js'
	var echarts = require('echarts');
	var personChart;
	export default{
		name:'documentcontorl',
		data(){
			return{
				tableData:[],		//列表数据
				personArr:[],		//人员数据
				waitArr:[],			//未完成工作量
				taskArr:[],			//已完成任务量
				bugArr:[],			//bug数量

				selectWeek:new Date(),		//选择周
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

				echarts:{},
				
				option2:{						//个人数据统计表
		            title: {
		                text: '个人统计'
		            },
		            tooltip: {
		            	trigger: 'axis',
		            	axisPointer: {
				            type: 'cross',
				            crossStyle: {
				                color: '#999'
				            }
				        }
		            },
		            legend: {
		                data:['剩余工作量','完成任务量','产生BUG数']
		            },
		            xAxis: {
		                data: [],
		                axisPointer: {
			                type: 'shadow'
			            }
		            },
		            yAxis: {},
		            series: [
			            {
			                name: '剩余工作量',
			                type: 'bar',
			                data: []
			            },
			            {
			                name: '完成任务量',
			                type: 'bar',
			                data: []
			            },
			            {
			                name: '产生BUG数',
			                type: 'bar',
			                data: []
			            }
		            ]
		        },
		        num:0




			}
		},
		beforeMount(){
			// this.echarts = require('echarts');
			this.beginTime = new Date();
			this.endTime = new Date();
		},
		mounted(){
			this.getList();	
		},
		methods:{
			//获取团队数据
			getList(order,sort){
				let that = this;
				// if(that.beginTime != ""){
				// 	that.sTime = that.beginTime.getFullYear()+'-'+(that.beginTime.getMonth()+1)+'-'+that.beginTime.getDate();
				// }else{
				// 	that.sTime = '';
				// }
				// if(that.endTime != ""){
				// 	that.eTime = that.endTime.getFullYear()+'-'+(that.endTime.getMonth()+1)+'-'+that.endTime.getDate();

				// }else{
				// 	that.eTime = '';
				// }
				this.personArr = [];
				this.waitArr = [];
				this.taskArr = [];
				this.bugArr = [];
				$.ajax({
					type:"get",
					url:that.$api.team.get_team,
					dataType:'json',
					data:{
						start_date:formatDate(that.selectWeek),
						end_date:'',
						order:order,
						sort:sort,
					},
					success:(res)=>{
						if(res.error == 0){
							let data = res.data;
							that.tableData = [];
							that.tableData = Object.values(data);
							that.tableData.forEach(function(value){
								that.personArr.push(value.realname);
								that.waitArr.push(value.task_wait_point_amount);
								that.taskArr.push(value.task_point_amount);
								that.bugArr.push(value.bug_live_amount);
							})
							that.personStats();
						}else{
							that.$message.error(res.error_msg);
						}
					}
				});
			},
			//绘制个人统计chart
			personStats(arr){
					
					if (personChart != null && personChart != "" && personChart != undefined) {        
						personChart.dispose();
				    }
					this.option2.xAxis.data = this.personArr;

					this.option2.series[0].data = this.waitArr;
					this.option2.series[1].data = this.taskArr;
					this.option2.series[2].data = this.bugArr;
					personChart = echarts.init(document.getElementById('personChart'));
					personChart.setOption(this.option2);
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