<template>
	<div class='addbug'>
		<div class="co-normal-table">
			<h2 class="co-normal-title">添加BUG</h2>
			<div class="co-normal-content">
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
				<p><span>标题</span> <input type="text" v-model="addtitle" maxlength="30" /></p>
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
				<!-- <p><span>紧急程度</span> <input type="text" v-model="add_ep" /></p>
				<p><span>难度</span> <input type="text" v-model="add_dp" /></p> -->
				<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
				</p>
				<p>
					 <el-button type="primary" @click="addBug" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
					<router-link to="/Bugcontrol"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
				</p>
			</div>
			


		
		</div>		
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
				testId:'',//测试id
				testArr:[],//测试人员列表
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
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
			//添加bug
			addBug(){
				let that = this;
				let is_live = '';
				if(this.addprojectinfo == ''){
					this.$message.error("请选择项目！")
					return null;
				}
				if(this.add_version == ''){
					this.$message.error("请选择版本！")
					return null;
				}
				if(this.add_is_live){
					is_live = 1;
				}else{
					is_live = 0;
				}
				if(that.testId == ''){
					that.$message.error("请选择测试者")
					return;
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
						is_live:is_live,
						test_id:that.testId
					},
					dataType:'json',
					url:that.$api.bug.add,
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_msg);
							return;
						}
						if(data.error==0){
							that.$store.dispatch('changePoint').then(function(){})
							// that.$store.dispatch("getPer","bug")
							that.$message("添加成功");
							// that.$router.push("/Bugcontrol");
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
	.addbug .info-box{
		width: 730px;
		box-sizing: border-box;
		border-radius: 4px;
		border: 1px solid #D0D0D0;
	}
	.addbug .info-box h2{
		height: 44px;
		line-height: 44px;
		padding-left: 30px;
		font-size: 14px;
		font-weight: normal;
		background: #EEEFF6;
		border-bottom: 1px solid #D0D0D0;
	}
	.addbug p{
		margin:10px 0;
	}
	.addbug p span{
		width:100px;
		display: inline-block;
	}
	.addbug  p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addbug  p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>