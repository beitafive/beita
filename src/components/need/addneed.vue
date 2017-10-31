<template>
	<div class="addneed">
		<h2>创建需求</h2>
		<p><span>项目</span> 
			<el-select v-model="project_id" placeholder="请选择项目" style="width:250px">
			    <el-option
			      v-for="item in projectarr"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		</p>
		<p><span>标题</span> <input type="text" v-model="title" placeholder="请填写标题" /></p>
		<p><span>紧急程度</span> <input type="text" v-model="ep" placeholder="请填写紧急程度" /></p>
		<p><span>提出者</span>
			<el-select v-model="owner_id" placeholder="请选择提出者" style="width:250px">
			    <el-option
			      v-for="item in ownerarr"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		</p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="content"></textarea>
		</p>
		<p>
			<el-button type="primary" @click="addNeed" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/needs"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'addneed',
		data(){
			return{
				title:'',		//标题
				content:'',		//内容
				ep:'',			//紧急程度
				projectarr:[],	//项目列表
				project_id:'',	//项目ID
				ownerarr:[],	//提出者列表
				owner_id:localStorage.token,	//提出者ID
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
		},
		methods:{
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
							that.$message(data.error_message)
							return;
						}
						if(data.error == 0){
							that.projectarr = data.data.project_arr;					
						}
					}
				});
			},
			//获取执行者列表
			getUser(){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.get_user_list,
					dataType:'json',
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_message)
							return;
						}
						if(data.error == 0){	
							that.ownerarr = that.ownerarr.concat(data.data.user_arr);
						}
					}
				});
			},
			//创建文档
			addNeed(){
				let that = this;
				$.ajax({
				type:"post",
				data:{
					project_id:that.project_id,
					title:that.title,
					ep:that.ep,
					submit_user_id:that.owner_id,
					content:that.content,
				},
				url:that.$api.need.add,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message);
						return;
					}
					if(data.error==0){
						that.$router.push("/needs");
						that.$message("添加成功");
					}
				}
			});
			},
		}
	}
</script>

<style scoped>
	.addneed{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.addneed h2{
		margin-bottom: 40px;
	}
	.addneed p{
		margin:20px 0;
	}
	.addneed p span{
		width:100px;
		display: inline-block;
	}
	.addneed p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addneed p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>