<template>
	<div class="addColumn">
		<el-dialog title="添加表字段" :visible.sync="addInfo.reduceTip" size="tiny">
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
						<el-input type="text" placeholder="请输入表名" v-model="title" style="width:220px;padding-right: 12px;"></el-input>				
					</span>	
				  <p>备注</p>
				  <p><textarea class="content" v-model="comment" placeholder="请填写备注"></textarea></p>
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
		name:'addColumn',
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
	
</style>