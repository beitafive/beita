<template>
	<div class="addColumn">
		<div  class="co-normal-table">
			<h2 class="co-normal-title">新增表字段</h2>
			<div  class="co-normal-content">
				<p><span>项目</span> 
					<el-select v-model="project_id" placeholder="请选择项目" style="width:250px">
					    <el-option
					      v-for="item in projectArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</p>
				<p><span>表名</span> 
					<el-select v-model="table_id" placeholder="请选择项目" style="width:250px">
					    <el-option
					      v-for="item in tableArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</p>
				<p><span>类型</span> <el-input type="text" v-model="type" placeholder="请填写类型" style="width:250px"/></el-input></p>
				<p><span>集合</span> <el-input type="text" v-model="collation" placeholder="请填写集合" style="width:250px"/></el-input></p>
				<p><span>key值</span> <el-input type="text" v-model="key" placeholder="请填写key值" style="width:250px"/></el-input></p>
				<p><span>默认值</span> <el-input type="text" v-model="def" placeholder="请填写默认值" style="width:250px"/></el-input></p>
				<p><span>扩展</span> <el-input type="text" v-model="extra" placeholder="请填写扩展值" style="width:250px"/></el-input></p>
				<p><span>备注</span> <el-input type="text" v-model="comment" placeholder="请填写备注" style="width:250px"/></el-input></p>
				<p><span>是否为NULL</span>   <el-checkbox v-model="is_null"></el-checkbox></p>

				<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				    <span style="float:left">说明</span> <textarea class="content" placeholder="请添加说明内容" v-model="content"></textarea>
				</p>
				<p>
					<el-button type="primary" @click="submit" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
					<router-link to="/column"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'addColumn',
		data(){
			return {
				type:'',//类型
				collation:'',//集合
				key:'',//key值
				def:'',//默认值
				extra:'',//扩展
				comment:'',//备注
				is_null:false,//是否为空
				content:'',//说明
				project_id:'',//项目ID
				projectArr:[],//项目列表
				table_id:'',//表ID
				tableArr:[{label:'表1',value:'0'},{label:'表2',value:'表2'}],//表列表

			}
		},
		mounted(){
			this.getProject();
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
							that.projectArr = data.data.project_arr;					
						}
					}
				});
			},
			//提交
			submit(){
				let that = this;
				$.ajax({
					method:'post',
					dataType:'json',
					url:this.$api.column.create,
					data:{
						table_id:this.table_id,
						project_id:this.project_id,
						type:this.title,
						collation:this.collation,
						key:this.key,
						is_null:this.is_null,
						default:this.def,
						extra:this.extra,
						content:this.content,
						comment:this.comment
					},
					success:function(res){
						if(res.error == 0){
							that.$router.push('/column')
							that.$message('添加成功')
						}else{
							that.$message('添加失敗')
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.addColumn{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.addColumn h2{
		margin-bottom: 40px;
	}
	.addColumn p{
		margin:20px 0;
	}
	.addColumn p span{
		width:100px;
		display: inline-block;
	}
	.addColumn p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addColumn p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>