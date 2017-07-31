<template>
	<div class="oa_index">
		<top-header></top-header>
		<w-menu></w-menu>
		<router-view></router-view>
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
</style>