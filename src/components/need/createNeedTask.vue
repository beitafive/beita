<template>
	<div class='create-need-task'>
		<div  class="anchu-normal-table">
			<h2 class="anchu-normal-title">创建需求任务</h2>
			<div class="anchu-normal-content">
				<p><span>需求标题</span>{{msg.title}}</p>
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
					<router-link to="/MissionCenter"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
				</p>
			</div>
			

		</div>

	</div>
</template>

<script>
	export default{
		name:'createNeedTask',
		data(){
			return{
				projectarr:[],		//项目列表
				ownerarr:[],		//执行者列表
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
				//添加，执行者
				addowner:[],
				addownerinfo:'',
				addtitle:'',//添加，标题
				addcontent:'',//添加，内容
				submit_user_id:localStorage.token,
				dpArr:[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'},{value:'5',label:'5'}],
				requirement_id: this.$route.query.id || '', //需求任务id
				msg:'', //需求详情
				task_type:'', 	//任务类型
				task_typeArr:[{value:'0',label:'版本任务'},{value:'1',label:'紧急任务'}],

				pageIndex: this.$route.query.pageIndex
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
			this.getNeedInfo();
		},
		methods:{
			//获取需求信息
			getNeedInfo(id){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.need.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data;				
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
			//添加任务
			addMission(){
				let that = this;
				if(that.addproject == ''){
					that.$message.error("请填写项目！");
					return null;
				}
				if(that.add_version == ''){
					that.$message.error("请填写版本！");
					return null;
				}
				if(that.addmodule == ''){
					that.$message.error("请填写模块！");
					return null;
				}
				if(that.addtitle == ''){
					that.$message.error("请填写标题！");
					return null;
				}
				if(that.addownerinfo == ''){
					that.$message.error("请选择执行者！");
					return null;
				}
				if(that.addcontent == ''){
					that.$message.error("请填写内容！");
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
						dp:that.add_dp,
						point:that.add_point,
						expire_at:that.eTime,
						submit_user_id:that.submit_user_id,
						requirement_id: that.requirement_id,		//需求任务ID
						is_quick:that.task_type 					//任务类型
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
							
							that.$store.state.pageIndex = that.pageIndex;
							console.log(that.pageIndex);
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
		}
	}
</script>
<style scoped>
	.create-need-task{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	/*.createtask h2{
		margin-bottom: 40px;
	}*/	
	.create-need-task p{
		margin:20px 0;
	}
	.create-need-task p span{
		width:100px;
		display: inline-block;
	}
	.create-need-task p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.create-need-task p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>