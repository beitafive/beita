<template>
	<div class="editSheet">
		<el-dialog title="编辑数据库表" :visible.sync="editInfo.reduceTip" size="tiny">
				<div class="editUserInfo">
					<span class="co-search-condition">
				  		<span class="co-search-name">项目</span>
						<span class="co-search-condition">					
							<el-select v-model="project_id" placeholder="请选择项目" style="width:220px;padding-right: 12px;">
						    <el-option
						      v-for="item in editInfo.projectarr"
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
				  <p>备注{{num}}</p>
				  <p><textarea class="content" v-model="comment" placeholder="请填写备注" maxlength="200"></textarea></p>
				</div>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="editInfo.reduceTip = false">取 消</el-button>
			    <el-button type="primary" @click="submit">确 定</el-button>
			  </div>
			</el-dialog>
	</div>
</template>

<script>
	export default {
		name:'editSheet',
		data(){
			return {
				title:'',
				comment:'',
				project_id:'',
				
			}
		},
		props:['editInfo'],
		created(){
			
		},
		mounted(){
			// this.project_id = this.editInfo.project_id;
			// this.comment = this.editInfo.comment;
			// this.title = this.editInfo.title;
			// this.table_id = this.editInfo.table_id
		},
		computed:{
			num(){
				this.project_id = this.editInfo.project_id;
				this.comment = this.editInfo.comment;
				this.title = this.editInfo.title;
				this.table_id = this.editInfo.table_id
			}
			
			
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
				if(this.comment.length > 100){
					this.$message('备注字数不能超过100')
					return ;
				}
				$.ajax({
					method:'post',
					dataType:'json',
					url:this.$api.table.update,
					data:{
						table_id:this.table_id,
						project_id:this.project_id,
						title:this.title,
						comment:this.comment
					},
					success:function(res){
						if(res.error == 0){
							that.editInfo.reduceTip = false;
							that.$emit('getlist');
							that.$message('编辑成功')
						}else{
							that.$message(res.error_msg)
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