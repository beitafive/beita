<template>
	<div class="addSheet">
		<el-dialog title="添加数据库表" :visible.sync="addInfo.reduceTip" size="tiny">
				<div class="addUserInfo">
					<span class="co-search-condition">
				  		<span class="co-search-name">项目</span>
						<span class="co-search-condition">					
							<el-select v-model="project_id" placeholder="请选择項目" style="width:220px;padding-right: 12px;">
						    <el-option
						      v-for="item in addInfo.projectarr"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>					
						</span>					
					</span>
					
					<span class="co-search-condition">
				  		<span class="co-search-name">表名</span>
						<input type="text" placeholder="请输入表名" v-model="title" class="table" maxlength="50"></input>				
					</span>	
				  <p>备注</p>
				  <p><textarea class="content" v-model="comment" placeholder="请填写备注" maxlength="200"></textarea></p>
				</div>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="addInfo.reduceTip = false">取 消</el-button>
			    <el-button type="primary" @click="submit">确 定</el-button>
			  </div>
			</el-dialog>
	</div>
</template>

<script>
	export default {
		name:'addSheet',
		data(){
			return {
				title:'',
				comment:'',
				project_id:'',

			}
		},
		props:['addInfo'],
		mounted(){

		},
		methods:{
			submit(){
				let that = this;
				if(this.project_id == ''){
					this.$message('项目不能为空')
					return;
				}
				if(this.title == ''){
					this.$message('表名不能为空')
					return;

				}

				
				$.ajax({
					method:'post',
					dataType:'json',
					url:this.$api.table.create,
					data:{
						project_id:this.project_id,
						title:this.title,
						comment:this.comment
					},
					success:function(res){
						if(res.error == 0){
							that.addInfo.reduceTip = false;
							that.$emit('getlist')
							that.title = ''
							that.comment = ''
							that.project_id = ''
							that.$message('添加成功')
						}else{
							that.$message('添加失败')
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
.table{
	width:220px;
	height:34px;
	border:1px solid #ddd;
	border-radius:4px;
	box-sizing: border-box;
	padding:0 12px;
}	 
</style>