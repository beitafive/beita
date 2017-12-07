<template>
	<div class="editDepartment">
		<div class="anchu-normal-table">
			<h2 class="anchu-normal-title">编辑部门</h2>
			<div class="anchu-normal-content">
				<p>
					<span>部门名称：</span>
					<el-input v-model="depname" placeholder="请填写部门名称" :maxlength="12" style="width:250px"></el-input></p>
				<p>
					<span style="vertical-align: top;">部门描述：</span>
					<el-input v-model="depdescrib" type="textarea" placeholder="请填写部门描述" style="width:558px;" :autosize="{ minRows: 4}"></el-input></p>
				<p>
					<el-button type="primary" @click="editDepartment(depname,depdescrib)" style="margin:0 20px 0 100px"> 保 存 </el-button>
					<router-link to="/department"><el-button type="info" > 取 消 </el-button></router-link>
				</p>
				
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'editDepartment',
		data(){
			return {
				id:this.$route.query.id,//部门ID
				depname:'', 			//部门名称
				depdescrib:''			//部门描述
			}
		},
		mounted(){
			this.getDepartment(this.id);
		},
		methods:{
			getDepartment(id){
				let that = this;
				$.ajax({
					type: 'get',
					dataType: 'json',
					url:that.$api.department.get,
					data:{
						id:id
					},
					success:function(res){
						if(res.error == 1){
							return false;
						}
						let data = res.data;
						that.depname = data.name;
						that.depdescrib = data.describe;
					}
				})
			},
			//编辑部门信息
			editDepartment(name,describ){
				let that = this;
				$.ajax({
					type:'post',
					dataType:'json',
					url:that.$api.department.update,
					data:{
						id:that.id,
						name:name,
						describe:describ
					},
					success:function(res){
						if(res.error == 1){
							that.$message(res.error_msg);
							return false;
						}
						that.$message('编辑成功');
						that.$router.push('/department');
					}
				})
			}
		}
	}
</script>

<style>
	.editDepartment{
		float:left;
		width:85%;
		height: calc(100% - 60px);
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 80px;
	}
	.editDepartment p{
		margin:20px 0;
	}
	.editDepartment p span{
		width:100px;
		display: inline-block;
	}
	.editDepartment p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.editDepartment p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>