<template>
	<div class="mybug">
		<h2>我的BUG</h2>
		<!--列表展示-->
		<div class="tables">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="90">
			    </el-table-column>
			    <el-table-column
			      prop="project_id"
			      label="项目ID"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="module_id"
			      label="模块"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="标题"
			      width="190">
			    </el-table-column>
			    <el-table-column
			      prop="content"
			      label="内容"
			      width="270">
			    </el-table-column>
			    <el-table-column
			      prop="ep"
			      label="紧急程度"
			      width="66">
			    </el-table-column>
			    <el-table-column
			      prop="dp"
			      label="难度"
			      width="66">
			    </el-table-column>
			    <el-table-column
			      prop="status"
			      label="BUG状态"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="160">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index,scope.row)">分配</el-button>
			        <el-button type="text" size="small" @click='test(scope.$index,scope.row)' >修复</el-button>
			        &nbsp;<router-link :to="{path:'/bugcontent',query:{id:scope.row.id}}" target="_blank"><el-button type="text" size="small">查看</el-button></router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			 <p><button @click="getList(+pageIndex-1,my_id)">上一页</button>{{+pageIndex}} / {{allCount}}<button @click="getList(+pageIndex+1,my_id)">下一页</button></p>
		</div>
		<!--分配BUG信息-->
		<el-dialog title="分配BUG" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>执行者
				<el-cascader
				    placeholder="请选择执行者"
				    :options="options2"
				    filterable
				    style="float:right;width:75%;"
				    v-model="updateowner"
				    @change="updatecheckChange"
				  ></el-cascader></p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateUserInfos = false">取 消</el-button>
		    <el-button type="primary" @click='updateUser' >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'mybug',
	data(){
		return{
			tableData:[],
			dialogVisible:false,
			updateUserInfos:false,
			my_id:'',
			allCount:'',
			pageIndex:'',
			options2:[],
			updateowner:[],
			updateid:'',
			updateowner_id:'',
		}
	},
	mounted(){
		this.my_id = sessionStorage.userid;
		this.getList(1,this.my_id);
		this.getUser();
//		this.getProject();
	},
	methods:{
		//获取用户名
		getUser(){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/get_all_user",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
						return;
					}
					that.options2 = data.data.user_arr;
				}
			});
		},
		//获取BUG列表
		getList(x,y){
			let that = this;
			if(x == 0){
				this.$message("没有上一页");
				return;
			}
			$.ajax({
				type:"get",
				data:{
					owner_id:y || '',
					page:x||1
				},
				url:"/api.php?s=/front/bug/get_my_list",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
					}
					if(data.error == 0){
						that.allCount = Math.ceil(data.data.count/10);
						that.pageIndex = x || 1;
						that.tableData = data.data.bug_arr;
					}
				}
			});
		},
		//编辑BUG信息   x为下标index
		updateUserInfo(x,y){
			this.updateUserInfos = true;
			this.updateid = y.id;
			this.updateIndex = x;
		},
		//发送更新BUG信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					owner_id:that.updateowner_id
				},
				dataType:'json',
				url:"/api.php?s=/front/distribute_bug",
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_message)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.updateUserInfos = false;
//						that.getList(,that.my_id)
						if(that.tableData.length == 1){
							that.getList(+that.pageIndex-1,that.my_id)
						}else{
							that.getList(that.pageIndex,that.my_id)
						}
					}
				}
			});
		},
		//选择框change
		updatecheckChange(value){
			this.updateowner_id = value[0];
		},
		//交由测试
		test(x,y){
			let that = this;
			if(y.status == 'FIXED' || y.status == 'CLOSED'){
				that.$message('此项bug正在测试中或者关闭')
				return;
			}
			$.ajax({
				type:"get",
				url:"/api.php?s=/front/fix",
				data:{
					id:y.id
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.$message("已将此BUG交由测试")
						y.status = '已修复'
					}
					if(data.error == 1){
						that.$message(data.error_message)
					}
				}
			});
		}
	}
})
</script>

<style>
	.mybug{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.mybug .addUser{
		font-size:14px;
		margin-top:20px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.mybug .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.mybug .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.mybug .addUserInfo input:first-child{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.mybug .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.mybug .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.mybug .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.mybug .content{
		width:100%;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>