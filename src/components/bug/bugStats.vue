<template>
	<div class="bugstats" >
		<p>这里可以切换月份-><el-select v-model="months" placeholder="请选择" @change="initGrid()">
		    <el-option
		      v-for="item in monthArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select></p>
		<div id="main" style="width: 100%;height:600px;">
			
		</div>
	</div>
</template>

<script>
	var echarts = require('echarts');
	let times = new Date();
	let year = times.getFullYear().toString();
	let month = (times.getMonth()+1)<10?'0'+(times.getMonth()+1).toString():(times.getMonth()+1);
	
	export default{
		name:'bugstats',
		data(){
			return {
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
				}
			}
		},
		mounted(){
			this.initGrid();
		},
		methods:{
			//初始化
			initGrid(){
				let _this = this;
				$.ajax({
					type:"get",
					url:_this.$api.getbugstats,
					data:{
						month:_this.months
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
							_this.option.title.subtext = "BUG总数为："+_this.count+'个';
							let myChart = echarts.init(document.getElementById('main'));
							myChart.setOption(this.option);
						}else{
							_this.$message.error(res.error_msg)
						}
					}
				});
				
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
	.bugstats p{
		margin:30px 0;
		text-align: center;
	}
</style>