<template>
	<div class="oa_index">
		<top-header></top-header>
		<w-menu></w-menu>
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive" class="content"></router-view>			
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive" class="content"></router-view>
	</div>
</template>

<script>
import topHeader from '@/components/common/topHeader'
import wMenu from '@/components/common/menu'
export default({
	name:'oa_index',
	data(){
		return{
			msg:''
		}
	},
	components:{
		topHeader,
		wMenu
	}
})
</script>

<style scoped>
	.oa_index{
		height:100%;
		background:#f8f8f8;
	}
	.content{
		position: relative;
		top: 60px;
		height: 100%;
	    overflow: scroll;
	    width: calc(100% - 200px);
		min-width: 900px;
		margin: 0 0 0 200px;
	}
</style>
