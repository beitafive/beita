<template>
	<div v-if='pagination.page_total' class="anchu-page">
		<!-- <span class="page-info">总数：{{pagination.item_total}}</span> -->
		<el-button  icon="arrow-left" @click="prePage" style="margin-right:10px">上一页</el-button> {{pagination.page}}/{{pagination.page_total}}
	  	<el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
	</div>
</template>

<script>
	export default{
		name:'page',
		computed:{
			pagination(){
				return this.$store.getters.pagination;
			}
		},
		methods:{
			prePage(){
				let _this = this;
				if(this.pagination.page == 1){
					this.$message.error("没有上一页")
					return null
				}else{
					new Promise((resolve,reject)=>{
						_this.$store.dispatch("change_page",+this.pagination.page-1)
						resolve();
					}).then(()=>{
						_this.$store.dispatch("page_go")
					})
				}
			},
			nextPage(){
				let _this = this;
				if(this.pagination.page >= this.pagination.page_total){
					this.$message.error("没有下一页")
					return null
				}else{
					new Promise((resolve,reject)=>{
						_this.$store.dispatch("change_page",+this.pagination.page+1)
						resolve();
					}).then(()=>{
						_this.$store.dispatch("page_go")
					})
				}
			}
		}
	}
</script>

<style>
</style>