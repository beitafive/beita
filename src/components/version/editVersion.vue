<template>
	<div class="editversion">
		<h2>修改版本</h2>
		<p><span>标题</span> <input type="text" v-model="msg.title" placeholder="请填写标题" /></p>
		<p><span>简介</span> <input type="text" v-model="msg.short_desc" placeholder="请填写简介" /></p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="msg.content"></textarea>
		</p>
		<p>
			<el-button type="primary" @click="editVersion" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/versions"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'editversion',
		data(){
			return{
				msg:{
					title:'',			//标题
					short_desc:'',		//简介
					content:'',			//内容
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
					url:that.$api.version.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data.task;
						}
						if(data.error == 1){
							that.$message(data.error_msg);
						}
					}
				});
			},
			//获取项目列表
			getProject(){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.get_project_list,
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error==1){
							that.$message(data.error_msg)
							return;
						}
						if(data.error == 0){
							that.projectArr = data.data.project_arr;					
						}
					}
				});
			},
			//编辑
			editVersion(){
				let that = this;
				if(that.msg.short_desc == '' || that.msg.title == '' || that.msg.content==''){
					that.$message.error("请完善信息！");
					return null;
				}
				$.ajax({
					type:"post",
					url:that.$api.version.update,
					dataType:'json',
					data:{
						id:that.$route.query.id,
						short_desc:that.msg.short_desc,
						title:that.msg.title,
						content:that.msg.content
					},
					success:(res)=>{
						if(res.error == 0){
							that.$message.success("添加成功！");
							that.$router.push("/versions");
						}else{
							that.$message.error(res.error_msg);
						}
					}
				});
			},
		}
	}
</script>

<style scoped>
	.editversion{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.editversion h2{
		margin-bottom: 40px;
	}
	.editversion p{
		margin:20px 0;
	}
	.editversion p span{
		width:100px;
		display: inline-block;
	}
	.editversion p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.editversion p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>