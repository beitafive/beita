<template>
	<div v-if='page.page_total' class="page">
		<span>共 {{page.item_total}} 条</span>
		<el-button icon="arrow-left" @click="prePage" :disabled="load">上一页</el-button> {{page.page}}/{{page.page_total}}
	  	<el-button @click="nextPage" :disabled="load">下一页<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
	  	<el-input v-model="page.page" style="width:90px;margin-left:30px;" :disabled="load">
		    <template slot="append">页</template>
		</el-input>
		<el-button type="info" size="small" @click="getlist()" :disabled="load">跳 转</el-button>
	</div>
</template>

<script>
	/*
	   分页组件
	   可以直接调用
	  1.传入pagination对象
	  2.设置按钮是否能点击的 disabled 布尔值 - load
	  3.设置调用父组件的getlist事件
	 * 
	 * */
	
	
	export default{
		name:"wpage",
		props:['page','load'],
		methods:{
			getlist(){
				this.$emit("getList",this.page.page);
			},
			nextPage(){
				if(this.page.page==this.page.page_total){
					this.$message("没有下一页")
					return
				}
				this.page.page++;
				this.$emit("getList",this.page.page);
			},
			prePage(){
				if(this.page.page == 1){
					this.$message("没有上一页")
					return
				}
				this.page.page--;
				this.$emit("getList",this.page.page);
			}
		}
	}
</script>

<style scoped>
	.page{
		line-height:40px;
		text-align: center;
		margin: 30px 0;
	}
	.page span{
		float:left;
		margin-left:30px;
	}
</style>