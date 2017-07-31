<template>
	<div class="w-header">
		OA-用户平台
		<span @click="closeMe">退出</span>
	</div>
</template>

<script>
export default({
	name:'topHeader',
	data(){
		return{
			msg:'',
			username:localStorage.username||""
		}
	},
	methods:{
		closeMe(){
			let _this = this;
			$.ajax({
				type:"get",
				url:'/api.php?s=/api/admin/logout',
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						_this.$store.state.token = null;
						localStorage.removeItem("token")
						localStorage.removeItem("role")
						_this.$router.push("/")
					}
				}
			});
		}
	}
})
</script>

<style scoped>
	.w-header{
		height:59px;
		border-bottom: 1px solid #e8e8e8;
		box-sizing: border-box;
		padding:0 30px;
		font-size:22px;
		color:#333;
		line-height:60px;
	}
	.w-header span{
		float:right;
		font-size:16px;
		cursor:pointer;
		margin-right:40px;
	}
	
</style>