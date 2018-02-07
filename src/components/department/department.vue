<template>
	<div class="department">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				部门管理
			</h2>
			<el-button  @click="add" v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
		</div>

		<span class="page-info">部门总数：{{count}}</span>
		<div class="co-inner-content">
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
			      min-width="200"
			      >
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="160"
			      >
			      <template scope="scope">
			        <el-button type="text" size="small" @click="editDepInfo(scope.row)"  v-if="bedit">编辑</el-button>
			        <el-button type="text" size="small" @click="delDepInfo(scope.row)" style="margin-right:10px;color: #FA5555;" v-if="bdel">删除</el-button>
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
				count: '', //总条数
				//权限
				badd:false,
				bedit:false,
				bdel:false
			}
		},
		components:{
			wPage
		},
		mounted(){
			let that = this;
			this.$store.dispatch("getPer",'department').then(()=>{
				that.$store.state.perList.includes("department.add")?that.badd=true:'';
				that.$store.state.perList.includes("department.edit")?that.bedit=true:'';		
				that.$store.state.perList.includes("department.read")?that.bread=true:'';		
				that.$store.state.perList.includes("department.del")?that.bdel=true:'';			
			})
			this.getList();
		},
		methods:{
			//添加部门
			add(){
				this.$router.push('/addDepartment');
			},
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
						that.count = res.data.count;
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
				that.$confirm('是否继续删除?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
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
							that.$message({
					            type: 'success',
					            message: '删除成功!',
					            duration: 900
					        });
							that.getList();
						}
					})
		          
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除',
		            duration: 700
		          });          
		        });
				
			}
		}
	}
</script>

<style scoped>
	.department{ 
		float:left;
		/*width:100%;*/
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
</style>