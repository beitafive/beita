<template>
	<div class='addbug'>
		<h2>添加BUG</h2>
		<p><el-checkbox v-model="add_is_live" style="color:#cc3737">是否在线上</el-checkbox></p>
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
		<p><span>提出者</span>
			<el-cascader
		    :options="ownerarr"
		    filterable
		    style="width:250px;"
		    v-model="addsubUser"
		    @change="addsubchange"
		  ></el-cascader></p>
		<p><span>紧急程度</span> <input type="text" v-model="add_ep" /></p>
		<p><span>难度</span> <input type="text" v-model="add_dp" /></p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
		</p>
		<p>
			 <el-button type="primary" @click="addBug" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/Bugcontrol"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'addbug',
		data(){
			return{
				add_is_live:false,
				projectarr:[],		//项目列表
				ownerarr:[],		//执行者列表
				//添加，工时 难度
				add_ep:'',
				add_dp:'',
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
				//添加提出者数据
				addsubUser:[localStorage.token],
				addsubUserId:localStorage.token,
				addtitle:'',//添加，标题
				addcontent:'',//添加，内容
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
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
			//添加任务
			addBug(){
				let that = this;
				let is_live = '';
				if(this.add_is_live){
					is_live = 1;
				}else{
					is_live = 0;
				}
				$.ajax({
					type:"post",
					data:{
						project_id:that.addprojectinfo,
						module_id:that.addmoduleinfo,
						version:that.add_version,
						title:that.addtitle,
						content:that.addcontent,
						dp:that.add_dp,
						ep:that.add_ep,
						owner_id:that.addownerinfo,
						submit_user_id:that.addsubUserId,
						is_live:is_live
					},
					dataType:'json',
					url:that.$api.bug.add,
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_message);
							return;
						}
						if(data.error==0){
							that.$message("添加成功");
							that.$router.push("/Bugcontrol");
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
							that.$message(data.error_message)
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
							that.$message(data.error_message)
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
			addsubchange(value){
				this.addsubUserId = value[0];
			},
		}
	}
</script>
<style scoped>
	.addbug{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	.addbug h2{
		margin-bottom: 40px;
	}
	.addbug p{
		margin:20px 0;
	}
	.addbug p span{
		width:100px;
		display: inline-block;
	}
	.addbug p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addbug p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>