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
		 <p><span>选择需求</span> 
			<el-select v-model="edit_need" placeholder="请选择需求" style="width:250px;">
		    <el-option
		      v-for="item in needArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value"
		      >
		    </el-option>
		  </el-select></p>
		<p><span>选择任务类型</span>
			<el-select v-model="task_type" placeholder="请选择任务类型" style="width:250px;">
		    <el-option
		      v-for="item in task_typeArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select></p>
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
		  <p><span>测试者</span>
			<el-select v-model="testId" placeholder="请选择测试" style="width:250px;">
			    <el-option
			      v-for="item in testArr"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
		</p>
		<p><span>状态</span>
		<el-cascader
		    placeholder="请选择状态"
		    :options="options3"
		    filterable
		    style="width:250px;"
		    v-model="updatestatus"
		    @change="changestatus"
		  ></el-cascader></p>
		 <p><span>难度</span>
			<el-input-number v-model="difficultPerformance" :min="1" :max="5" label="难度"></el-input-number> 
		  </p>
		<p><span>工时</span> <input type="text" v-model="update_point" /></p>
		<!-- <p><span>难度</span> 
			<el-select v-model="update_dp" placeholder="请选择版本" style="width:250px;">
		    <el-option
		      v-for="item in dpArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select></p> -->
		<p><span>截止日期</span> 
			<el-date-picker
		      v-model="endTime"
		      type="date"
		      style="width:250px;"
		      placeholder="选择日期">
		    </el-date-picker>
		</p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left;margin:10px 0;">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="updatecontent"></textarea>
		</p>
		<p>
			<el-button type="primary" @click="updateInfo" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<el-button type="info" style="width:100px" @click="cancel"> 取 消 </el-button>
		</p>
	</div>
</template>

<script>
	export default{
		name:'edittask',
		data(){
			return{
				testArr:[],
				testId:'',//测试id
				endTime:'',			//截止日期
				projectarr:[],		//项目列表
				ownerarr:[],		//执行者列表
				updateid:'',		//编辑ID
				//编辑，工时 难度
				update_point:'',
				update_dp:'1',
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
				//编辑需求
				needArr:[],
				edit_need:'',
				//编辑，执行者
				updateowner:[],
				updateownerinfo:'',
				updatetitle:'',//编辑，标题
				updatecontent:'',//编辑，内容

				task_type:'', 	//任务类型
				task_typeArr:[{value:'0',label:'版本任务'},{value:'1',label:'紧急任务'}],

				//编辑，状态
				updatestatus:[],
				updatestate:'',
				options3:[
					{value:'WAIT',label:'等待中'},
					{value:'FINISHED',label:'已完成'},
					{value:'TESTED',label:'测试通过'},
					{value:'ONLINE',label:'已上线'},
					{value:'CLOSED',label:'已关闭'}
				],
				dpArr:[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'},{value:'5',label:'5'}],
				difficultPerformance:0,//难度
				
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
			this.getInfo();
			this.getNeed();
			this.getTester();
		},
		methods:{
			//获取任务信息
			getInfo(){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.task.get,
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
							that.testId = y.test_id;
							that.difficultPerformance = y.dp;
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
										that.$message(data.error_msg)
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
										that.$message(data.error_msg)
									}
								}
							});
							//更新 版本信息
							that.update_version = y.version_id;
							//更新 模块信息
							that.updatemodule = [];
							that.updatemoduleinfo = y.module_id,
							that.updatemodule.push(y.module_id);
							//更新需求信息
							that.edit_need = y.requirement_id;

							that.updateid = y.id;//编辑 - id
							that.updatetitle=y.title;//编辑 标题
							that.updatecontent=y.content;//编辑 内容
							that.task_type = y.is_quick;
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
							//更新 截至时间
							if(y.expire_at){
								that.endTime = new Date(y.expire_at);								
							}
						}
						if(data.error == 1){
							that.$message(data.error_msg);
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
							that.$message(data.error_msg)
							return;
						}
						if(data.error == 0){
							that.projectarr = data.data.project_arr;					
						}
					}
				});
			},
			//获取需求列表(处理中的需求)
			getNeed(){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.need.get_options,
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error==1){
							that.$message(data.error_msg)
							return;
						}
						if(data.error == 0){
							that.needArr = data.data;		
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
							that.$message(data.error_msg)
							return;
						}
						if(data.error == 0){	
							that.ownerarr = that.ownerarr.concat(data.data.user_arr);
						}
					}
				});
			},
			//获取测试人员列表
			getTester(type){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.get_options,
					dataType:'json',
					data:{
						type:'test'
					},
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_msg)
							return;
						}
						if(data.error == 0){	
							that.testArr = that.testArr.concat(data.data.user_arr);
						}
					}
				});
			},
			//发送更新
			updateInfo(){
				let that = this;
				let eTime;
				if(that.updateownerinfo == ''){
					that.$message("请选择执行者！");
					return false;
				}				
				if(that.updatecontent == ''){
					that.$message("请填写内容！");
					return false;
				}
				if(that.endTime != "" && that.endTime != null){
					eTime = that.endTime.getFullYear()+'-'+(that.endTime.getMonth()+1)+'-'+that.endTime.getDate();
				}else{
					eTime = '';
				}
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
						dp:that.difficultPerformance,
						point:that.update_point,
						expire_at:eTime,
						requirement_id: that.edit_need,
						is_quick:that.task_type,
						test_id:that.testId,

					},
					dataType:'json',
					url:that.$api.task.update,
					success:function(res){
						let data = res
						if(data.error == 1){
							that.$message(data.error_msg)
							return;
						}
						if(data.error == 0){
							that.$message("更新成功");
							that.$router.go(-1);
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
							that.$message(data.error_msg)
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
							that.$message(data.error_msg)
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
			//取消
			cancel(){
				this.$router.go(-1)
			}
		}
	}
</script>
<style scoped>
	.edittask{
		float:left;
		/*width:85%;*/
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