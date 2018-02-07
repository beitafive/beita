<template>
	<div class="bugstats" >
		<div  class="co-inner-head">
			<h2 class="co-head-title">BUG统计</h2>
			<p style="margin-top:20px;" class="co-search-wrap">
				<span class="co-search-condition">
					<span class="co-search-name">日期</span>
					<el-date-picker
					    v-model="selectMonth"
					    type="month"
					    placeholder="请选择查询月份">
					  </el-date-picker>
					  <el-button type="primary" @click="search" style="padding: 10px 37px;margin-left: 12px;">查询</el-button>
				</span>
			</p>
		</div>
		<!-- <p>这里可以切换月份->
			<el-select v-model="months" placeholder="请选择" @change="initGrid()">
		    <el-option
		      v-for="item in monthArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		</p> -->
		<div id="main" style="min-width: 1638px;height:600px;margin: 20px;"></div>
		<div id="developChart" style="min-width: 1638px;height:600px;margin: 20px;"></div>
	</div>
</template>

<script>
	import {formatDate} from '@/assets/js/util.js'
	var echarts = require('echarts');
	var myChart, developChart;
	let times = new Date();
	let year = times.getFullYear().toString();
	let month = (times.getMonth()+1)<10?'0'+(times.getMonth()+1).toString():(times.getMonth()+1);
	
	export default{
		name:'bugstats',
		data(){
			return {
				selectMonth: new Date(),		//选择月份	
				personArr:[],		//开发者列表
				countArr:[],			//个人bug数量
				count:0,				// bug总数
				months:year+'-'+month,
				monthArr:[{value:year+'-01',label:'一月'},{value:year+'-02',label:'二月'},{value:year+'-03',label:'三月'},{value:year+'-04',label:'四月'},{value:year+'-05',label:'五月'},{value:year+'-06',label:'六月'},{value:year+'-07',label:'七月'},{value:year+'-08',label:'八月'},{value:year+'-09',label:'九月'},{value:year+'-10',label:'十月'},{value:year+'-11',label:'十一月'},{value:year+'-12',label:'十二月'}],

				option : {
				    title: {
				        text: 'BUG统计',
				        subtext: ''
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    xAxis:  {
				        type: 'category',
				        boundaryGap: false,
				        data: []
				    },
				    yAxis: {
				        type: 'value',
				        axisLabel: {
				            formatter: '{value} 个'
				        }
				    },
				    itemStyle:{
				    	normal:{
				    		borderWidth:5
				    	}
				    },
				    series: [
				        {
				            name:'BUG数量',
				            type:'line',
				            data:[],
				            markLine: {
				                data: [
				                    {type: 'average', name: '平均值'}
				                ]
				            }
				        }
				    ]
				},
				option2:{
		            title: {
		                text: '个人bug统计'
		            },
		            tooltip: {
		            	trigger: 'axis'
		            },
		            legend: {
		                data:['BUG数量']
		            },
		            xAxis: {
		                data: [],
		                 axisPointer: {
			                type: 'shadow'
			            }
		            },
		            yAxis: {},
		            series: [{
		                name: 'BUG数量',
		                type: 'bar',
		                data: []
		            }]
		        }
			}
		},
		mounted(){
			this.initGrid();
			this.personBug();

			this.personList();
		},
		methods:{
			//查询
			search(){
				this.initGrid();
				this.personList();
			},
			//初始化
			initGrid(){
				let _this = this;
				$.ajax({
					type:"get",
					url:_this.$api.getbugstats,
					data:{
						// month:_this.months
						month:formatDate(_this.selectMonth)
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
							_this.option.xAxis.data = [];
							_this.option.series[0].data = [];
							_this.count = 0;
							res.data.map((item)=>{
								let days = item.day<10?'0'+item.day:item.day;
								_this.option.xAxis.data.push(days)
								_this.option.series[0].data.push(item.bug)
								_this.count += +item.bug;
							})
							if (myChart != null && myChart != "" && myChart != undefined) {        
								myChart.dispose();
						    }
							_this.option.title.subtext = "BUG总数为："+_this.count+'个';
							myChart = echarts.init(document.getElementById('main'));
							myChart.setOption(this.option);
						}else{
							_this.$message.error(res.error_msg)
						}
					}
				});
				
				
			},
			//获取个人数据
			personList(){
				let that = this;
				this.personArr = [];
				this.countArr = [];
				$.ajax({
					type:"get",
					url:that.$api.team.get_all_bug,
					dataType:'json',
					data:{
						month:formatDate(that.selectMonth),
					},
					success:(res)=>{
						if(res.error == 0){
							let data = res.data;
							if(data == ''){
								that.personArr = [];
								that.countArr = [];
							}else{
								data.forEach(function(value){
									that.personArr.push(value.realname);
									that.countArr.push(value.count);
								})
							}
							that.personBug();

						}else{
							that.$message.error(res.error_msg);
						}
					}
				});
			},
			//绘制个人统计chart
			personBug(){
				if (developChart != null && developChart != "" && developChart != undefined) {        
					developChart.dispose();
			    }
				this.option2.xAxis.data = this.personArr;
				this.option2.series[0].data = this.countArr;
				developChart = echarts.init(document.getElementById('developChart'));
				developChart.setOption(this.option2);
			}
		}
	}
	
	
</script>

<style scoped>
	.bugstats{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	/*.bugstats p{
		margin:30px 0;
		text-align: center;
	}*/
</style>