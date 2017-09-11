<template>
	<div class="addversion">
		<h2>创建版本</h2>
		<p><span>项目</span> 
			<el-select v-model="project_id" placeholder="请选择项目" style="width:250px">
			    <el-option
			      v-for="item in projectArr"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		</p>
		<p><span>标题</span> <input type="text" v-model="title" placeholder="请填写标题" /></p>
		<p><span>简介</span> <input type="text" v-model="short_desc" placeholder="请填写标题" /></p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="content"></textarea>
		</p>
		<p>
			<el-button type="primary" @click="addVersion" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/versions"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'addversion',
		data(){
			return{
				title:'',			//标题
				short_desc:'',		//简介
				content:'',			//内容
				project_id:'',		//项目ID
				projectArr:[],		//项目列表
			}
		},
		mounted(){
			this.getProject();
		},
		methods:{
			//获取项目列表
			getProject(){
				let that = this;
				$.ajax({
					type:"get",
					url:"/api.php?s=/get_all_project",
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error==1){
							that.$message(data.error_message)
							return;
						}
						if(data.error == 0){
							that.projectArr = data.data.project_arr;					
						}
					}
				});
			},
			//创建文档
			addVersion(){
				let that = this;
				$.ajax({
					type:"get",
					url:"/api.php?s=/add_version",
					dataType:'json',
					data:{
						project_id:that.project_id,
						short_desc:that.short_desc,
						title:that.title,
						content:that.content,
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
	.addversion{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.addversion h2{
		margin-bottom: 40px;
	}
	.addversion p{
		margin:20px 0;
	}
	.addversion p span{
		width:100px;
		display: inline-block;
	}
	.addversion p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addversion p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>