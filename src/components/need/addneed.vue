<template>
	<div class="addneed">
		<div  class="anchu-normal-table">
			<h2 class="anchu-normal-title">创建需求</h2>
			<div  class="anchu-normal-content">
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
				<p><span>标题</span> <el-input type="text" v-model="title" placeholder="请填写标题" style="width: 250px;"/></p>
				<!-- <p><span>创建日期</span> 
					<el-date-picker
				      v-model="createTime"
				      style="width:250px;"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
				</p>
				<p><span>紧急程度</span> <input type="text" v-model="ep" placeholder="请填写紧急程度" /></p> -->
				<p><span>期望上线日期</span> 
					<el-date-picker
				      v-model="endTime"
				      style="width:250px;"
				      type="date"
				      placeholder="选择期望上线日期">
				    </el-date-picker>
				</p>
				<p><span>提出人</span>
					<el-select v-model="owner_id" placeholder="请选择提出人" style="width:250px">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</p>
				<p><span>负责人</span>
					<el-select v-model="response_user_id" placeholder="请选择负责人" style="width:250px">
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
		</div>
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
				response_user_id: '',//负责人ID
				createTime:'',  //创建时间
				endTime: '',    //期望截止时间
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
			addNeed(){
				let that = this;
				if(that.project_id == ''){
					that.$message.error("请填写项目！");
					return null;
				}
				if(that.title == ''){
					that.$message.error("请填写标题！");
					return null;
				}
				if(that.addownerinfo == ''){
					that.$message.error("请选择执行者！");
					return null;
				}
				if(that.response_user_id == ''){
					that.$message.error("请填写负责人！");
					return null;
				}
				if(this.content == ''){
					this.$message.error("请填写内容！");
					return null;
				}
				$.ajax({
				type:"post",
				data:{
					project_id:that.project_id,
					title:that.title,
					ep:that.ep,
					submit_user_id:that.owner_id,
					response_user_id:that.response_user_id,
					content:that.content,
					created_at:that.createTime,
					expect_online_at:that.formatDate(that.endTime),
				},
				url:that.$api.need.add,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg);
						return;
					}
					if(data.error==0){
						that.$router.push("/needs");
						that.$message("添加成功");
					}
				}
			});
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
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>
<style>
	.el-button+.el-button{
		margin-left: 0;
	}
</style>