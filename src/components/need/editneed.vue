<template>
	<div class="editneed">
		<h2>编辑需求</h2>
		<p><span>项目</span> 
			<el-select v-model="msg.project_id" placeholder="请选择项目" style="width:250px">
			    <el-option
			      v-for="item in projectarr"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		</p>
		<p><span>标题</span> <el-input type="text" v-model="msg.title" placeholder="请填写标题" style="width:250px"/></p>
		<!-- <p><span>紧急程度</span> <el-input type="text" v-model="msg.ep" placeholder="请填写紧急程度" style="width:250px"/></p> -->
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
	export default{
		name:'editneed',
		data(){
			return{
				projectarr:[],	//项目列表
				ownerarr:[],	//提出者列表
				msg:{
					project_id:'',
					title:'',
					content:'',
					ep:'',
					submit_user_id:'',
					response_user_id:'',
					expect_online_at:'',
					pageIndex: ''
				}
			}
		},
		mounted(){
			this.getProject();
			this.getUser();
			this.getInfo();
			this.pageIndex = this.$route.query.pageIndex;
			
		},
		methods:{
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
			//创建文档
			editNeed(){
				if(this.msg.content == ''){
					this.$message.error("请填写内容！");
					return null;
				}
				let that = this;
				$.ajax({
				type:"post",
				data:{
					id:that.$route.query.id,
					project_id:that.msg.project_id,
					title:that.msg.title,
					content:that.msg.content,
					ep:that.msg.ep,
					submit_user_id:that.msg.submit_user_id,
					response_user_id:that.msg.response_user_id,
					expect_online_at:that.msg.expect_online_at
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
						that.$store.state.pageIndex = that.pageIndex;
						that.$router.push("/needs");
						that.$message.success("保存成功！");
					}
				}
			});
			},
		},
		formatDate(date){
			if(date == ''){
				return '';
			}else{
				var d = new Date(date);
				var year = d.getFullYear();
				var month = d.getMonth()+1;
				var day = d.getDate();
				if (month < 10) month = '0' + month;
			  	if (day < 10) day = '0' + day;

			 	return [year, month, day].join('-');
				
			}
		}
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