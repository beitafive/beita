<template>
	<div class='createtask'>
		<div  class="co-normal-table">
			<h2 class="co-normal-title">添加任务</h2>
			<div class="co-normal-content">
				<p><span>选择项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:250px;"
				    v-model="addproject"
				    @change="addprojectchange"
				  ></el-cascader></p>
				<p><span>选择版本</span>
					<el-select v-model="add_version" placeholder="请选择版本" style="width:250px;">
				    <el-option
				      v-for="item in add_versionArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select></p>
				<p><span>选择模块</span>
				<el-cascader
				    placeholder="请选择模块"
				    :options="addmodulearr"
				    filterable
				    style="width:250px;"
				    v-model="addmodule"
				    @change="addmodulechange"
				  ></el-cascader></p>
				<p><span>选择需求</span> 
					<el-select v-model="add_need" placeholder="请选择需求" style="width:250px;">
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
				<p><span>标题</span> <input type="text" v-model="addtitle" /></p>
				<p><span>执行者</span>
					<el-cascader
				    placeholder="请选择执行者"
				    :options="ownerarr"
				    filterable
				    style="width:250px;"
				    v-model="addowner"
				    @change="addownerchange"
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
				  <p><span>难度</span>
					<el-input-number v-model="difficultPerformance" :min="1" :max="5" label="难度"></el-input-number> 
				  </p>
				<p><span>工时</span> <input type="text" v-model="add_point" /></p>
				<p><span>截止日期</span> 
					<el-date-picker
				      v-model="endTime"
				      style="width:250px;"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
				</p>
				<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
				</p>
				<p>
					<el-button type="primary" @click="addMission" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
					<el-button type="info" style="width:100px" @click="cancel"> 取 消 </el-button>					
				</p>
			</div>		

		</div>

	</div>
</template>

<script>
	export default{
		name:'createtask',
		data(){
			return{
				projectarr:[],		//项目列表
				ownerarr:[],		//执行者列表
				testArr:[],
				testId:'',//测试id
				//添加，工时 难度
				add_point:'',
				add_dp:'1',
				endTime:'',			//截至日期
				eTime:'',			//转换后日期
				//添加，版本
				add_versionArr:[],
				add_version:'',
				//添加，项目
				addproject:[],
				addprojectinfo:'',
				//添加，模块
				addmodulearr:[],
				addmodule:[],
				addmoduleinfo:'',
				//添加需求
				needArr:[],
				add_need:'',

				task_type:'', 	//任务类型
				task_typeArr:[{value:'0',label:'版本任务'},{value:'1',label:'紧急任务'}],
				//添加，执行者
				addowner:[],
				addownerinfo:'',
				addtitle:'',//添加，标题
				addcontent:'',//添加，内容
				submit_user_id:localStorage.token,
				dpArr:[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'},{value:'5',label:'5'}],
				difficultPerformance:0,//难度
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
			this.getNeed();
			this.getTester();
		},
		methods:{
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
			getUser(type){
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
			//添加任务
			addMission(){
				let that = this;
				if(this.addownerinfo == ''){
					this.$message("请选择执行者！");
					return null;
				}
				if(this.addcontent == ''){
					this.$message("请填写内容！");
					return null;
				}
				if(that.endTime != ""){
					that.eTime = that.endTime.getFullYear()+'-'+(that.endTime.getMonth()+1)+'-'+that.endTime.getDate();
				}else{
					that.eTime = '';
				}
				$.ajax({
					type:"post",
					data:{
						project_id:that.addprojectinfo,
						module_id:that.addmoduleinfo,
						owner_id:that.addownerinfo,
						title:that.addtitle,
						content:that.addcontent,
						version_id:that.add_version,
						dp:that.difficultPerformance,
						point:that.add_point,
						expire_at:that.eTime,
						submit_user_id:that.submit_user_id,
						requirement_id: that.add_need,
						is_quick:that.task_type ,				//任务类型
						test_id:that.testId
					},
					dataType:'json',
					url:that.$api.task.add,
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_msg);
							return;
						}
						if(data.error==0){
							that.$message("添加成功");
							that.$router.go(-1);
						}
					}
				});
			},
			//添加项目下拉事件
			addprojectchange(value){
				this.addprojectinfo = value[0];
				let that = this;
				that.addmodulearr=[];
				that.addmodule=[];
				that.addmoduleinfo='';
				that.add_versionArr=[];
				that.add_version = '';
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
							that.addmodulearr = data.data.module_arr;
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
						project_id:value[0]
					},
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.add_versionArr = data.data;
						}
						if(data.error == 1){
							that.$message(data.error_msg)
						}
					}
				});
			},
			//添加模块下拉事件
			addmodulechange(value){
				this.addmoduleinfo = value[0];
			},
			addownerchange(value){
				this.addownerinfo = value[0];
			},
			//取消
			cancel(){
				this.$router.go(-1)
			}
		}
	}
</script>
<style scoped>
	.createtask{
		float:left;
		/*width:85%;*/
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	/*.createtask h2{
		margin-bottom: 40px;
	}*/	
	.createtask p{
		margin:20px 0;
	}
	.createtask p span{
		width:100px;
		display: inline-block;
	}
	.createtask p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.createtask p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>