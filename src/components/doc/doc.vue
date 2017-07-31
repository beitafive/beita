<template>
	<div class="w-doc">
		<h2>{{msg.title}}</h2>
		<p>创建时间：{{msg.created_at}}</p>
		<p v-html="msg.html"></p>
	</div>
</template>

<script>
	export default{
		name:'doc',
		data(){
			return{
				msg:''
			}
		},
		mounted(){
			this.getInfo();
		},
		methods:{
			getInfo(){
				let that = this;
				$.ajax({
					type:"get",
					url:"/api.php?s=/front/doc/get",
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						if(res.error == 0){
							that.msg = res.data;				
						}
						if(res.error == 1){
							that.$message(res.error_message);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-doc{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.w-doc h2{
		font-size:50px;
		text-align: center;
	}
	.w-doc p{
		margin: 50px 0 20px 50px;
		font-size:18px;
	}
</style>