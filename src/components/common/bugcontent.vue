<template>
	<div class="w-content">
		<h2>{{msg.project}}</h2>
		<p>所属模块：{{msg.module}}</p>
		<p>标题：{{msg.title}}</p>
		<p>所属环境：{{msg.is_live=="0"?"内网":"线上"}}</p>
		<p>紧急程度：{{msg.ep}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;难度：{{msg.dp}}</p>
		<p v-html="'内容：<br>'+msg.html"></p>
	</div>
</template>

<script>
	export default{
		name:'content',
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
					url:"/api.php?s=/front/bug/get",
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
	.w-content{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.w-content h2{
		font-size:50px;
		text-align: center;
	}
	.w-content h2 span{
		font-size:20px;
		color:#3c3c3c;
		font-weight: 100;
		margin-left:20px;
	}
	.w-content p{
		margin: 20px 0 20px 50px;
		font-size:18px;
		line-height:30px;
	}
</style>