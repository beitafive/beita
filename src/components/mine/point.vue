<template>
	<div class="point">
		<div class="co-inner-head">
				<h2 class="co-head-title">
					积分日志
				</h2>
			</div>
			<span class="page-info">日志总数：{{count}}</span>
			<!--列表展示-->
			<div class="co-inner-content">
				<el-table
				    :data="tableData"
				    border
				    style="width: 100%">
				    <el-table-column
				      prop="id"
				      label="ID"
				      width="90">
				    </el-table-column>
				    <el-table-column
				      prop="content"
				      label="内容"
				      min-width="200">
				    </el-table-column>
				    <el-table-column
				      prop="point"
				      label="变动积分"
				      width="120">
				    </el-table-column>
				    <el-table-column
				      prop="old_point"
				      label="旧的积分"
				      width="120">
				    </el-table-column>
				    <el-table-column
				      prop="new_point"
				      label="新的积分"
				      width="100">
				    </el-table-column>				    
				 </el-table>
				<p v-if="tableData.length" class="co-page">
				 	
			 		<el-button icon="arrow-left" @click="prePage" style="margin-right: 10px;">上一页</el-button>
			 			{{pageIndex}} / {{allCount}}
			 		<el-button @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>	
			 		<!-- 前往<el-input type="text" v-model="currentPage" @keyup.enter.native='search(currentPage)' style="width: 50px;margin: 0 5px;"></el-input>页 -->
				</p>
				 	
			</div>
	</div>
</template>

<script>
	export default ({
		name:'point',
		data(){
			return {
				tableData:[],//表格数据
				pageIndex:0,//页面下标
				allCount:0,//数据条数
				count:0,
				currentPage: 1,
			}
		},
		mounted(){
			this.search(1);
		},
		methods:{
			search(page){
				this.getList(page);
			},
			//获取积分列表
			getList(page){
				let that = this;
				if(page >this.allCount){
					page = this.allCount;
					this.currentPage = page;
				}
				$.ajax({
					type:"get",
					url:that.$api.point.getlist,
					dataType:'json',
					data:{
						page:page||1,
					},
					success:function(res){
						if(res.error == 0){
							that.tableData = res.data.rows;
							that.pageIndex = res.data.pagination.page;
							that.allCount = res.data.pagination.page_total;
							that.count = res.data.pagination.item_total;
						}
					}
				})
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
				if(this.pageIndex <= 1){
					this.$message.error("没有上一页")
					return
				}
				this.pageIndex--;
				this.getList(this.pageIndex)
			},
		}
	})
</script>

<style scoped>
	.point{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.point .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.point .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.point .content{
		width:100%;
		height:160px;
		border:1px solid #DDD;
		resize:none;
		border-radius:5px;
	}	
</style>