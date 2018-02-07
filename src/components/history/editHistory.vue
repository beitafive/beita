<template>
	<div class='edithistory'>
		<div  class="co-normal-table">
			<h2 class="co-normal-title">部门历史</h2>
			<div  class="co-normal-content">
				<p><span>标题</span> <input type="text" v-model="msg.title" /></p>
				<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="msg.content"></textarea>
				</p>
				<p>
					 <el-button type="primary" @click="addHistory" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
					<router-link to="/history"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'edithistory',
		data(){
			return{
				msg:{
					title:'',
					content:''
				},
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
					url:that.$api.history.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data;				
						}
					}
				});
			},
			//添加任务
			addHistory(){
				let that = this;
				$.ajax({
					type:"post",
					data:{
						id:that.$route.query.id || '',
						title:that.msg.title,
						content:that.msg.content,
					},
					dataType:'json',
					url:that.$api.history.addandedit,
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_msg);
							return;
						}
						if(data.error==0){
							that.$message("保存成功");
							that.$router.push("/history");
						}
					}
				});
			},
		}
	}
</script>
<style scoped>
	.edithistory{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	.edithistory h2{
		margin-bottom: 40px;
	}
	.edithistory p{
		margin:20px 0;
	}
	.edithistory p span{
		width:100px;
		display: inline-block;
	}
	.edithistory p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.edithistory p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>