<template>
	<div class="department">
		<div class="anchu-inner-head">
			<h2 class="anchu-head-title">
				部门管理
				<router-link tag="button" to="/addDepartment" class="addUser">+ 添加部门</router-link>
			</h2>
		</div>
		<div class="anchu-inner-content">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			     width="100">
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="部门名称"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="describe"
			      label="部门描述"
			      >
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="160"
			      >
			      <template scope="scope">
			        <el-button type="text" size="small" @click="editDepInfo(scope.row)">编辑</el-button>
			        <el-button type="text" size="small" @click="delDepInfo(scope.row)" style="margin-right:10px" >删除</el-button>
			        <!-- <router-link v-if="bper" :to="{path:'/editpermission',query:{id:scope.row.role_id,name:scope.row.title}}"      >
			        	<el-button type="text" size="small">权限管理</el-button>
			        </router-link> -->
			      </template>
			    </el-table-column>
			 </el-table>
		</div>
	</div>
</template>

<script>
	import wPage from '../common/page'
	export default  {
		name: 'department',
		data(){
			return {
				tableData:[],//部门列表
			}
		},
		components:{
			wPage
		},
		mounted(){
			this.getList();
		},
		methods:{
			//获取部门列表
			getList(){
				let that = this;
				$.ajax({
					type:'get',
					dataType:'json',
					url:that.$api.department.getlist,
					success:function(res){
						if(res.error == 1){
							return false;
						}
						that.tableData = res.data.data;
					}
				})
			},
			//编辑部门
			editDepInfo(row){
				let id = row.id;
				this.$router.push({path:'/editDepartment',query:{id:id}});
			},
			//删除部门
			delDepInfo(row){
				let that = this;
				let id = row.id;
				$.ajax({
					type:'post',
					dataType:'json',
					url:that.$api.department.del,
					data:{
						id:id
					},
					success:function(res){
						if(res.error == 1){
							that.$message(res.error_msg);
							return false;
						}
						that.$message('删除成功');
						that.getList();
					}
				})
			}
		}
	}
</script>

<style>
	.department{ 
		float:left;
		/*width:100%;*/
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
</style>