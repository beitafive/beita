<template>
	<div class="w-server">
		<div class="co-inner-head">
			<h2 class="co-head-title">
			服务器管理
			<!-- <a href="javascript:;"><button type="info" @click="addTip=true" class="addUser">+ 添加服务 </button></a> -->
		</h2>
		<el-button @click="addTip=true" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p style="margin-top:30px" class="co-search-wrap">
				<span class="co-search-condition">
					<span class="co-search-name">名称</span>
					<el-input v-model="title" @keyup.enter.native="search" placeholder="请输入名称" style="width:200px;padding-right: 12px;"></el-input>
				</span>
				<el-button type="primary" @click="getList('1')" style="padding: 10px 37px;margin-left: 12px;">搜索</el-button>
			   <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>
		<span class="page-info">总数：{{count}}</span>
		<div  class="co-inner-content">
			<el-table
		    :data="tableData"
		    border
		    v-loading="$store.state.bload"
			element-loading-text="这应该是网络的问题..."
		    style="width: 100%">
		    <el-table-column
			      prop="server_id"
			      label="ID"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="名称"
			      width="200">
			    </el-table-column>
		    <el-table-column
		      label="操作"
		      width="160">
		      <template scope="scope">
		        <el-button type="text" size="small" @click="edit(scope.row,'edit')">编辑</el-button>
		        <el-button type="text" size="small" @click="edit(scope.row,'del')" style="color: #FA5555;">删除</el-button>
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
		name:'server',
		data(){
			return {
				path:'',
				title:'',
				pageInfo:'',
				count:'',
				addTip:false,
				
				addtitle:'',
				
				updatepath:'',
				updatetitle:'',
				id:'',
				
				updateTip: false,
				delTip: false
			}
		},
		components:{
			wPage
		},
		mounted(){
			this.getList();
		},
		computed:{
			tableData(){
				return this.$store.getters.getList;
			}
		},
		methods:{
			search(){
				this.getList(1);
			},
			getList(num){
				let _this = this;
				let path = this.path;
				let title = this.title;
				let params = new Object;
				params.url = this.$api.server.getlist;
				params.data = '&search[title]='+title;
				params.get_url = this.$api.server.getpage;
				_this.$store.dispatch("get_page_info",params).then((data)=>{
					_this.pageInfo = data;
					_this.$store.dispatch("page_go",num);
					_this.count = _this.$store.state.pagination.item_total;
				})
			},
			//增加
			addItem(){
				let _this = this;
				$.ajax({
					type:"post",
					url:_this.$api.server.add,
					data:{
						title:_this.addtitle
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
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
				this.id = row.server_id;
				this.updatetitle = row.title;
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
					url:_this.$api.server.update,
					data:{
						server_id:_this.id,
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
					url:_this.$api.server.del,
					data:{
						server_id:_this.id
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
			},
			clearSearch(){
				this.title = '';
			}
		}
	}
</script>

<style scoped>
	.w-server{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-server p{
		margin: 30px 0;
	}
	.tips p span{
		display: inline-block;
		width:60px;
		text-align: right;
		margin-right:9px;
	}
</style>