<template>
	<div class="w-repo" v-if="bload">
		<div class="anchu-inner-head">
			<h2 class="anchu-head-title">
				{{pageInfo.basic.page_title}}
				<button type="info" @click="addTip=true" class="addUser">+ 添加REPO </button>
			</h2>
			<p style="margin-top:30px" class="anchu-search-wrap">
				<span class="anchu-search-condition">
					<span class="anchu-search-name">标题</span>
					<el-input v-model="title" placeholder="请输入标题" style="width:200px;;padding-right: 12px;"></el-input>
				</span>
				<span class="anchu-search-condition">
					<span class="anchu-search-name">PATH</span>
					<el-input v-model="path" placeholder="请输入path" style="width:200px;padding-right: 12px;"></el-input>
				</span>				
				<el-button type="primary" icon="search" @click="getList(1)">搜索</el-button>
			</p>
		</div>
		<span class="page-info">总数：{{count}}</span>
		<div class="anchu-inner-content">
			<el-table
			    :data="tableData"
			    border
			    v-loading="$store.state.bload"
				element-loading-text="这应该是网络的问题..."
			    style="width: 100%">
			    <el-table-column v-for="(item,index) in pageInfo.data_area" key="item" :prop="item.value" :label="item.label" :width="item.width" width="200">
			    	
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="edit(scope.row,'edit')">编辑</el-button>
			        <el-button type="text" size="small" @click="edit(scope.row,'del')">删除</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			  <w-page></w-page>
		</div>
		<!--
        	作者：beitafive@163.com
        	时间：2017-11-02
        	描述：增加弹窗
        -->
        <el-dialog title="添加 REPO" v-model="addTip" size="tiny">
        	<div class="tips">
			  <p><span>标题</span> <el-input v-model="addtitle" style="width:270px" placeholder="请输入标题"></el-input></p>
			  <p><span>PATH</span> <el-input v-model="addpath" style="width:270px" placeholder="请输入path"></el-input></p>       		
        	</div>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="addTip = false">取 消</el-button>
		    <el-button type="primary" @click="addItem">确 定</el-button>
		  </div>
		</el-dialog>
		<!--
        	作者：beitafive@163.com
        	时间：2017-11-02
        	描述：编辑弹窗
        -->
        <el-dialog title="编辑 REPO" v-model="updateTip" size="tiny">
        	<div class="tips">
			  <p><span>标题</span> <el-input v-model="updatetitle" style="width:270px" placeholder="请输入标题"></el-input></p>
			  <p><span>PATH</span> <el-input v-model="updatepath" style="width:270px" placeholder="请输入path"></el-input></p>       		
        	</div>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="updateTip = false">取 消</el-button>
		    <el-button type="primary" @click="editItem">确 定</el-button>
		  </div>
		</el-dialog>
		<!--
        	作者：beitafive@163.com
        	时间：2017-11-02
        	描述：删除  二次确认
        -->
        <el-dialog title="编辑 REPO" v-model="delTip" size="tiny">
          <p>请确认要删除id为{{id}}的数据吗？</p>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="delTip = false">取 消</el-button>
		    <el-button type="primary" @click="delItem">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import wPage from '../common/page'
	export default{
		name:'repo',
		data(){
			return {
				path:'',
				title:'',
				pageInfo:'',
				count:'',
				addTip:false,
				
				addpath:'',
				addtitle:'',
				
				updatepath:'',
				updatetitle:'',
				id:'',
				
				updateTip: false,
				delTip: false,
				
				bload:false
			}
		},
		components:{
			wPage
		},
		beforeMount(){
			this.getList();
		},
		computed:{
			tableData(){
				return this.$store.getters.getList;
			}
		},
		methods:{
			getList(num){
				let _this = this;
				let path = this.path;
				let title = this.title;
				let params = new Object;
				params.url = this.$api.repo.getlist;
				params.data = '&search[title]='+title+'&search[path]='+path;
				params.get_url = this.$api.repo.getpage;
				_this.$store.dispatch("get_page_info",params).then((data)=>{
					_this.pageInfo = data;
					_this.$store.dispatch("page_go",num);
					_this.count = _this.$store.state.pagination.item_total;
					_this.bload = true;
				})
			},
			//增加
			addItem(){
				let _this = this;
				$.ajax({
					type:"post",
					url:_this.$api.repo.add,
					data:{
						path:_this.addpath,
						title:_this.addtitle
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
							_this.addpath = '';
							_this.addtitle = '';
							_this.getList(1);
							_this.addTip = false;
						}else{
							_this.$message.error(res.error_msg)
						}
					}
				});
			},
			edit(row,type){
				this.id = row.repo_id;
				this.updatetitle = row.title;
				this.updatepath = row.path;
				if(type === 'del'){
					this.delTip = true;
				}else{
					this.updateTip = true;					
				}
			},
			//编辑
			editItem(){
				let _this = this;
				$.ajax({
					type:"post",
					url:_this.$api.repo.update,
					data:{
						repo_id:_this.id,
						path:_this.updatepath,
						title:_this.updatetitle
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
							_this.getList();
							_this.updateTip = false;
						}else{
							_this.$message.error(res.error_msg)
						}
					}
				});
			},
			delItem(){
				let _this = this;
				$.ajax({
					type:"post",
					url:_this.$api.repo.del,
					data:{
						repo_id:_this.id
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
							_this.getList(1);
							_this.delTip = false;
						}else{
							_this.$message.error(res.error_msg)
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-repo{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-repo p{
		margin: 30px 0;
	}
	.tips p span{
		display: inline-block;
		width:60px;
		text-align: right;
		margin-right:9px;
	}
</style>