<template>
	<div class="w-needdoc">
		<h2>{{msg.title}}</h2>
		<p v-html="'内容：<br>'+msg.html"></p>
	</div>
</template>

<script>
	export default{
		name:'needdoc',
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
					url:"/api.php?s=/api/requirement/get",
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data;				
						}
						if(data.error == 1){
							that.$message(data.error_message);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-needdoc{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.w-needdoc h2{
		font-size:50px;
		text-align: center;
	}
	.w-needdoc h2 span{
		font-size:20px;
		color:#3c3c3c;
		font-weight: 100;
		margin-left:20px;
	}
	.w-needdoc p{
		margin: 50px 0 20px 50px;
		font-size:18px;
	}
</style>