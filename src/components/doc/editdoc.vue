<template>
	<div class="editdoc">
		<h2>文档修改</h2>
		<p><span>标题</span> <input type="text" v-model="msg.title" placeholder="请填写标题" /></p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="msg.content"></textarea>
		</p>
		<p>
			<el-button type="primary" @click="updateDocs" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/document"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'editdoc',
		data(){
			return{
				msg:{
					title:'',
					content:'',
				}
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
					url:that.$api.doc.get,
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
					url:that.$api.doc.update,
					dataType:'json',
					data:{
						id:that.$route.query.id,
						title:that.msg.title,
						content:that.msg.content
					},
					success:(res)=>{
						if(res.error == 0){
							that.$router.push("/document")
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
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.editdoc h2{
		margin-bottom: 40px;
	}
	.editdoc p{
		margin:20px 0;
	}
	.editdoc p span{
		width:100px;
		display: inline-block;
	}
	.editdoc p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.editdoc p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>