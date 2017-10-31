<template>
	<div class='edittask'>
		<h2>编辑任务</h2>
		<p><span>选择项目</span>
			<el-cascader
		    placeholder="请选择项目"
		    :options="projectarr"
		    filterable
		    style="width:250px;"
		    v-model="updateproject"
		    @change="updateprojectchange"
		  ></el-cascader></p>
		<p><span>选择版本</span>
			<el-select v-model="update_version" placeholder="请选择版本" style="width:250px;">
		    <el-option
		      v-for="item in update_versionArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select></p>
		<p><span>选择模块</span>
		<el-cascader
		    placeholder="请选择模块"
		    :options="updatemodulearr"
		    filterable
		    style="width:250px;"
		    v-model="updatemodule"
		    @change="updatemodulechange"
		  ></el-cascader></p>
		<p><span>标题</span> <input type="text" v-model="updatetitle" /></p>
		<p><span>执行者</span>
			<el-cascader
		    placeholder="请选择执行者"
		    :options="ownerarr"
		    filterable
		    style="width:250px;"
		    v-model="updateowner"
		    @change="updateownerchange"
		  ></el-cascader></p>
		<p><span>状态</span>
		<el-cascader
		    placeholder="请选择状态"
		    :options="options3"
		    filterable
		    style="width:250px;"
		    v-model="updatestatus"
		    @change="changestatus"
		  ></el-cascader></p>
		<p><span>工时</span> <input type="text" v-model="update_point" /></p>
		<p><span>难度</span> <input type="text" v-model="update_dp" /></p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="updatecontent"></textarea>
		</p>
		<p>
			 <el-button type="primary" @click="updateInfo" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/MissionCenter"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'edittask',
		data(){
			return{
				projectarr:[],		//项目列表
				ownerarr:[],		//执行者列表
				updateid:'',		//编辑ID
				//编辑，工时 难度
				update_point:'',
				update_dp:'',
				//编辑，版本
				update_versionArr:[],
				update_version:'',
				//编辑，项目
				updateproject:[],
				updateprojectinfo:'',
				//编辑，模块
				updatemodulearr:[],
				updatemodule:[],
				updatemoduleinfo:'',
				//编辑，执行者
				updateowner:[],
				updateownerinfo:'',
				updatetitle:'',//编辑，标题
				updatecontent:'',//编辑，内容
				//编辑，状态
				updatestatus:[],
				updatestate:'',
				options3:[{value:'WAIT',label:'等待中'},{value:'FINISHED',label:'已完成'},{value:'TESTED',label:'测试通过'},{value:'CLOSED',label:'已关闭'}],
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
			this.getInfo();
		},
		methods:{
			getInfo(){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.quicktask.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							let y = data.data;				
							//更新 项目信息
							that.updateproject = [];
							that.updateprojectinfo=y.project_id;
							that.updateproject.push(y.project_id);
							$.ajax({
								type:"get",
								url:that.$api.get_module_list,
								dataType:'json',
								data:{
									project_id:y.project_id
								},
								success:function(res){
									let data = res;
									if(data.error == 0){
										that.updatemodulearr = data.data.module_arr;						
									}
									if(data.error == 1){
										that.$message(data.error_message)
									}
								}
							});
							$.ajax({
								type:"get",
								url:that.$api.get_version_list,
								dataType:'json',
								data:{
									project_id:y.project_id
								},
								success:function(res){
									let data = res;
									if(data.error == 0){
										that.update_versionArr = data.data;
									}
									if(data.error == 1){
										that.$message(data.error_message)
									}
								}
							});
							//更新 版本信息
							that.update_version = y.version_id;
							//更新 模块信息
							that.updatemodule = [];
							that.updatemoduleinfo = y.module_id,
							that.updatemodule.push(y.module_id);
							that.updateid = y.id;//编辑 - id
							that.updatetitle=y.title;//编辑 标题
							that.updatecontent=y.content;//编辑 内容
							//更新 状态信息
							that.updatestatus = [];
							that.updatestatus.push(y.status);
							that.updatestate=y.status;
							//更新 执行者信息
							that.updateowner = [];
							that.updateowner.push(y.owner_id);
							that.updateownerinfo=y.owner_id;
							//更新 难度 工时
							that.update_dp = y.dp;
							that.update_point = y.point;
						}
						if(data.error == 1){
							that.$message(data.error_message);
						}
					}
				});
			},
			//获取项目列表
			getProject(x){
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
			//发送更新
			updateInfo(){
				let that = this;
				$.ajax({
					type:"post",
					data:{
						id:that.updateid,
						project_id:that.updateprojectinfo,
						module_id:that.updatemoduleinfo,
						title:that.updatetitle,
						content:that.updatecontent,
						status:that.updatestate,
						owner_id:that.updateownerinfo,
						version_id:that.update_version,
						dp:that.update_dp,
						point:that.update_point
					},
					dataType:'json',
					url:that.$api.quicktask.update,
					success:function(res){
						let data = res
						if(data.error == 1){
							that.$message(data.error_message)
							return;
						}
						if(data.error == 0){
							that.$message("更新成功");
							that.$router.push("/urgenttask");
						}
					}
				});
			},
			//编辑，执行者下拉
			updateownerchange(value){
				this.updateownerinfo = value[0];
			},
			//编辑，项目下拉
			updateprojectchange(value){
				this.updateprojectinfo = value[0];
				let that = this;
				that.updatemodulearr=[];
				that.updatemodule=[];
				that.updatemoduleinfo='';
				that.update_versionArr=[];
				that.update_version = '';
				$.ajax({
					type:"get",
					url:that.$api.get_module_list,
					data:{
						project_id:value[0]
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.updatemodulearr = data.data.module_arr;						
						}
						if(data.error == 1){
							that.$message(data.error_message)
						}
					}
				});
				$.ajax({
					type:"get",
					url:that.$api.get_version_list,
					data:{
						project_id:value[0]
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.update_versionArr = data.data;
						}
						if(data.error == 1){
							that.$message(data.error_message)
						}
					}
				});
			},
			//编辑，模块下拉
			updatemodulechange(value){
				this.updatemoduleinfo = value[0];
			},
			changestatus(value){
				this.updatestate = value[0];
			},
		}
	}
</script>
<style scoped>
	.edittask{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	.edittask h2{
		margin-bottom: 40px;
	}
	.edittask p{
		margin:20px 0;
	}
	.edittask p span{
		width:100px;
		display: inline-block;
	}
	.edittask p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.edittask p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>