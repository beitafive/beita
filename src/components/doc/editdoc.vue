<template>
	<div class="editdoc">
		<h2>文档修改</h2>
		<p>标题
</p>
		<el-input v-model="msg.title" placeholder="请输入标题"></el-input>
		<p>内容</p>
		<textarea v-model="msg.content">
			
		</textarea>
		<el-button type="primary" @click="updateDocs" style="margin:30px;width:100px"> 保 存 </el-button>
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
			},
			//更新文档
			updateDocs(){
				let that = this;
				$.ajax({
					type:"get",
					url:"/api.php?s=/front/doc/update",
					dataType:'json',
					data:{
						id:that.$route.query.id,
						title:that.msg.title,
						content:that.msg.content
					},
					success:(res)=>{
						if(res.error == 0){
							that.$message.success("保存成功！")
						}else{
							that.$message.error(res.error_msg)
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.editdoc{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.editdoc h2{
		font-size:50px;
		text-align: center;
	}
	.editdoc p{
		font-size:30px;
		margin:20px 0;
	}
	.editdoc textarea{
		min-height: 600px;
		width:100%;
		border-radius:5px;
		border:1px solid #bfcbd9;
	}
</style>