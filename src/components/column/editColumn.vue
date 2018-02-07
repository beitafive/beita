<template>
	<div class="editColumn">
		<div  class="co-normal-table">
			<h2 class="co-normal-title">编辑表字段</h2>
			<div  class="co-normal-content">
				<p><span>项目</span> 
					   <el-cascader
					    placeholder="请选择项目"
					    :options="projectArr"
					    filterable
					    style="width:250px;"
					    v-model="addproject"
					    @change="addprojectchange"
					  ></el-cascader>
				</p>
				<p><span>表名</span> 
					  <el-cascader
					    placeholder="请选择表"
					    :options="tableArr"
					    filterable
					    style="width:250px;"
					    v-model="addtable"
					    @change="addtablechange"
					  ></el-cascader>
				</p>
				<p><span>字段名</span> <input type="text" v-model="column" placeholder="请填写字段名" style="width:250px" maxlength="50"/></input></p>
				<p><span>类型</span> <input type="text" v-model="type" placeholder="请填写类型" style="width:250px" maxlength="30"/></input></p>
				<p><span>集合</span> <input type="text" v-model="collation" placeholder="请填写集合" style="width:250px" maxlength="30"/></input></p>
				<p><span>key值</span> <input type="text" v-model="key" placeholder="请填写key值" style="width:250px" maxlength="30"/></input></p>
				<p><span>默认值</span> <input type="text" v-model="def" placeholder="请填写默认值" style="width:250px" maxlength="30"/></input></p>
				<p><span>扩展</span> <input type="text" v-model="extra" placeholder="请填写扩展值" style="width:250px" maxlength="30"/></input></p>
				<p><span>备注</span> <input type="text" v-model="comment" placeholder="请填写备注" style="width:250px" maxlength="200"/></input></p>
				<p><span>是否为NULL</span>   <el-checkbox v-model="is_null"></el-checkbox></p>

				<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				    <span style="float:left">说明</span> <textarea class="content" placeholder="请添加说明内容" v-model="desc"></textarea>
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
		name:'editColumn',
		data(){
			return {
				column:'',//字段名
				info:{},
				type:'',//类型
				collation:'',//集合
				key:'',//key值
				def:'',//默认值
				extra:'',//扩展
				comment:'',//备注
				is_null:false,//是否为空
				desc:'',//说明
				column_id:'',//字段id

				addproject:[],
				project_id:'',//项目ID
				projectArr:[],//项目列表

				table_id:'',//表ID
				addtable:[],
				tableArr:[],//表列表

			}
		},
		mounted(){
			this.column_id = this.$route.query.id 
			this.getInfo();
			this.getProject();
			// this.getTable();
		},
		methods:{
			//获取表字段信息
			getInfo(){
				let that = this;
				$.ajax({
					type:'get',
					url:that.$api.column.get,
					dataType:'json',
					data:{
						column_id:this.column_id
					},
					success:function(res){
						if(res.error == 0){
							that.info = res.data
							that.column = that.info.column;

							that.addproject = []
							that.addtable = []
							that.project_id  = that.info.project_id;
							that.addproject.push(that.project_id);

							that.table_id = that.info.table_id;
							that.getTable(that.project_id)


							that.type = that.info.type;
							that.comment = that.info.comment;
							that.def = that.info.default;
							that.key = that.info.key;
							that.collation = that.info.collation;
							that.extra = that.info.extra
							that.desc = that.info.desc
							if(that.info.is_null == 'YES'){
								that.is_null = true;
							}else{
								that.is_null = false;
							}
						}else{
							this.$message('未获取到数据')
						}
					}
				})
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
							that.projectArr = data.data.project_arr;
											
						}
					}
				});
			},
			//获取表列表
			getTable(project_id){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.table.get_table_options,
					dataType:'json',
					data:{
						project_id:project_id
					},
					success:function(res){
						let data = res;
						if(data.error==1){
							that.$message(data.error_msg)
							return;
						}
						if(data.error == 0){
							that.tableArr = data.data.arr
							if(that.table_id !=''){
								that.addtable.push(that.table_id) 

							}	
						}
					}
				});
			},
			//添加项目下拉事件
			addprojectchange(value){
				this.tableArr=[];
				this.addtable=[];
				this.table_id='';
				this.project_id = value[0];
				
				this.getTable(this.project_id)
				
			},
			//添加表下拉事件
			addtablechange(value){
				this.table_id = value[0];
			},
			//提交
			submit(){
				let that = this;
				let is_null;
				if(that.is_null == true){
					is_null = 1;
				}else{
					is_null = 0;
				}
				if(this.project_id == ''){
					this.$message('项目不能为空')
					return;
				}
				if(this.table_id == ''){
					this.$message('表名不能为空')
					return;

				}
				if(this.column == ''){
					this.$message('字段名不能为空')
					return;
				}
				if(this.type == ''){
					this.$message('类型不能为空')
					return;
				}else if(this.type == 'string' || this.type == 'String'){
					if(this.collation == ''){
						this.$message('集合不能为空')
						return;
					}
				}
				$.ajax({
					method:'post',
					dataType:'json',
					url:this.$api.column.update,
					data:{
						column:this.column,
						column_id:this.column_id,
						table_id:this.table_id,
						project_id:this.project_id,
						type:this.type,
						collation:this.collation,
						key:this.key,
						is_null:is_null,
						default:this.def,
						extra:this.extra,
						comment:this.comment,
						desc:this.desc
					},
					success:function(res){
						if(res.error == 0){
							that.$router.push('/column')
							that.$message('编辑成功')
						}else{
							that.$message(res.error)
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.editColumn{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.editColumn h2{
		margin-bottom: 40px;
	}
	.editColumn p{
		margin:20px 0;
	}
	.editColumn p span{
		width:100px;
		display: inline-block;
	}
	.editColumn p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px 12px;
	}
	.editColumn p textarea{
		resize: none;
		width:500px;
		min-height:300px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>