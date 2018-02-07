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
						<el-input type="text" placeholder="请输入表名" v-model="title" style="width:220px;padding-right: 12px;"></el-input>				
					</span>	
				  <p>备注{{num}}</p>
				  <p><textarea class="content" v-model="comment" placeholder="请填写备注"></textarea></p>
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
							that.$message('编辑失败')
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	
</style>