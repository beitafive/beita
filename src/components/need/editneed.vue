<template>
	<div class="editneed">
		<h2>编辑需求</h2>
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
		<p><span>标题</span> <el-input type="text" v-model="msg.title" placeholder="请填写标题" style="width:250px"/></p>
		<p><span>提出者</span>
			<el-select v-model="msg.submit_user_id" placeholder="请选择提出者" style="width:250px">
			    <el-option
			      v-for="item in ownerarr"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		</p>
		<p><span>负责人</span>
			<el-select v-model="msg.response_user_id" placeholder="请选择负责人" style="width:250px">
			    <el-option
			      v-for="item in ownerarr"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		</p>
		<p><span>状态</span>
		<el-select v-model="msg.status" placeholder="请选择">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select></p>
		<p><span>重要程度</span><el-rate v-model="msg.important" style="width: 250px;display: inline-block;"></el-rate></p>
		<p><span>期望上线日期</span> 
			<el-date-picker
		      v-model="msg.expect_online_at"
		      style="width:250px;"
		      type="date"
		      placeholder="选择日期">
		    </el-date-picker>
		</p>
		<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
		    <span style="float:left">内容</span> <textarea class="content" placeholder="请添加内容描述" v-model="msg.content"></textarea>
		</p>
		<p>
			<el-button type="primary" @click="editNeed" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/needs"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	import { formatDate } from '@/assets/js/util' 
	export default{
		name:'editneed',
		data(){
			return{
				projectarr:[],	//项目列表
				ownerarr:[],	//提出者列表				
				options:[{value:'WAIT',label:'等待中'},{value:'HANDLE',label:'处理中'},{value:'CONFIRMED',label:'开发中'},{value:'FINISHED',label:'已完成'},{value:'TESTED',label:'测试通过'},{value:'ONLINE',label:'已上线'},{value:'CLOSED',label:'已关闭'},{value:'REFUSED',label:'已拒绝'},{value:'DELETED',label:'已删除'}],
				msg:{
					project_id:'',
					version_id:'',
					title:'',
					content:'',
					ep:'',
					submit_user_id:'',
					response_user_id:'',
					expect_online_at:'',
					pageIndex: '',
					status:''
				},
				updateproject:[],//选择的项目
				//编辑，版本
				update_versionArr:[],
				update_version:'',
				important:1,	//重要程度
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
			this.getInfo();
			
		},
		methods:{
			//获取需求信息
			getInfo(){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.need.get,
					dataType:'json',
					data:{
						id:that.$route.query.id
					},
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data;
							//更新项目信息
							that.updateproject = [];
							that.updateproject.push(that.msg.project_id);
							//版本信息
							that.update_version = that.msg.version_id;
							
							that.getVersion(that.msg.project_id);
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
							that.projectarr = data.data.project_arr;					
						}
					}
				});
			},
			//编辑项目下拉
			updateprojectchange(value){
				let that = this;
				that.msg.project_id = value[0];
				that.update_versionArr=[];
				that.update_version= '';
				that.getVersion(value[0])
				
			},
			//获取版本信息
			getVersion(id){
				let that = this;

				//获取版本信息
				$.ajax({
					type:"get",
					url:that.$api.get_version_list,
					data:{
						project_id:id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							//版本列表
							that.update_versionArr = data.data;
						}
						if(data.error == 1){
							that.$message(data.error_msg)
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
			//编辑需求
			editNeed(){
				let that = this;
				if(that.msg.content == ''){
					that.$message.error("请填写内容！");
					return null;
				}
				that.msg.version_id = that.update_version;
				
				$.ajax({
					type:"post",
					data:{
						id:that.$route.query.id,
						project_id:that.msg.project_id,
						version_id:that.msg.version_id,
						title:that.msg.title,
						content:that.msg.content,
						ep:that.msg.ep,
						submit_user_id:that.msg.submit_user_id,
						response_user_id:that.msg.response_user_id,
						expect_online_at:formatDate(that.msg.expect_online_at),
						status: that.msg.status,
						important: that.msg.important
					},
					url:that.$api.need.update,
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error==1){
							that.$message(data.error_msg);
							return;
						}
						if(data.error==0){
							that.$router.push("/needs");
							that.$message.success("保存成功！");
						}
					}
				});
			},
		},
		
	}
</script>

<style scoped>
	.editneed{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.editneed h2{
		margin-bottom: 40px;
	}
	.editneed p{
		margin:20px 0;
	}
	.editneed p span{
		width:100px;
		display: inline-block;
	}
	.editneed p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.editneed p textarea{
		resize: none;
		width:900px;
		min-height:600px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>