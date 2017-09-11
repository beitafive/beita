<template>
	<div class="addDoc">
		<h2>创建文档</h2>
		<p><span>标题</span> <input type="text" v-model="title" placeholder="请填写标题" /></p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="content"></textarea>
		</p>
		<p>
			<el-button type="primary" @click="createDoc" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/document"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'addDoc',
		data(){
			return{
				title:'',
				content:'',
			}
		},
		methods:{
			//创建文档
			createDoc(){
				let _this = this;
				$.ajax({
					type:"get",
					url:"/api.php?s=/front/doc/create",
					dataType:'json',
					data:{
						title:_this.title,
						content:_this.content
					},
					success:(res)=>{
						if(res.error == 0){
							_this.$message.success("添加成功！");
							_this.$router.push("/document");
						}else{
							_this.$message.error(res.error_msg);
						}
					}
				});
			},
		}
	}
</script>

<style scoped>
	.addDoc{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.addDoc h2{
		margin-bottom: 40px;
	}
	.addDoc p{
		margin:20px 0;
	}
	.addDoc p span{
		width:100px;
		display: inline-block;
	}
	.addDoc p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addDoc p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>