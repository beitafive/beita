<template>
	<div class="column">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				表字段管理
			</h2>
			<el-button  @click="add"  v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p style="margin-top:20px;"  class="co-search-wrap">
				
				<span class="co-search-condition">
					<span class="co-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findproject"
				    @change="findprojectchange"
				  ></el-cascader>					
				</span>
				
				<span class="co-search-condition">
				  <span class="co-search-name">表名</span>
				  <el-input v-model="missionInfo.title" placeholder="请输入表名" @keyup.enter.native="search" style="width:200px;padding-right: 12px;"></el-input>					
				</span>

				<span class="co-search-condition">
				  <span class="co-search-name">字段名</span>
				  <el-input v-model="missionInfo.column" placeholder="请输入字段名" @keyup.enter.native="search" style="width:200px;padding-right: 12px;"></el-input>					
				</span>

			  <el-button type="primary" @click="search" style="padding: 10px 37px;margin-left: 12px;">搜索</el-button>
			  <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>

		<span class="page-info">表字段总数：{{count}}</span>

		<!--列表展示-->
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			     @sort-change="projectSort"
			    style="width: 100%">
			    <el-table-column
			      prop="column_id"
			      label="ID"
			      width="90">
			    </el-table-column>
			    <el-table-column
			      prop="project_name"
			      label="项目"
			      sortable="custom"			     			     
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="table_title"
			      label="表名"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="column"
			      label="字段名"
			      min-width="110">
			    </el-table-column>
			    <el-table-column
			      prop="type"
			      label="类型"
			      min-width="150">
			    </el-table-column>
			    <el-table-column
			      prop="collation"
			      label="集合"
			      min-width="150">
			    </el-table-column>
			    <el-table-column
			      prop="is_null"
			      label="是否为NULL"
			      width="140">
			    </el-table-column>
			    <el-table-column
			      prop="key"
			      label="key"
			      width="95">
			    </el-table-column>
			    <el-table-column
			      prop="default"
			      label="默认值"
			      width="95">
			    </el-table-column>
			    <el-table-column
			      prop="extra"
			      label="扩展"
			      min-width="150">
			    </el-table-column>
			    <el-table-column
			      prop="comment"
			      label="备注"
			      min-width="200"
			     >
			    </el-table-column>
			   
			    <el-table-column
			      prop="desc"
			      label="说明"
			      min-width="200">
			    </el-table-column>
			    
			    <el-table-column
			      label="操作"
			      width="150">
			      <template scope="scope">
			      	<el-button type="text" size="small" @click="editColumn(scope.row.column_id)" v-if="bedit">编辑</el-button>
			      	<el-button type="text" size="small" @click="delColumn(scope.row.column_id)" style="color: #FA5555;" v-if="bdel">删除</el-button>
			      </template>
			    </el-table-column>
			 </el-table>

			  <p v-if="tableData.length"  class="co-page">
			 	
			 	<el-button  icon="arrow-left" @click="prePage" style="margin-right:10px;">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			 </p>
		</div>

	</div>
</template>
<script>
	export default {
		name:'column',
		data(){
			return{
				//搜索条件
				projectarr:[],
				findproject:[],
				findprojectinfo:'',
				count:0,
				allCount:0,
				missionInfo:{
					findprojectinfo:'',//项目--搜索
					project_id: '',
					title:'',
					column:'',//字段名
					pageIndex:'',//页面下标

				},
				searchInfo:{
					findprojectinfo:'',//项目--搜索
					project_id: '',
					title:'',
					column:'',//字段名
					pageIndex:'',//页面下标

				},
				pageIndex:'',//页面下标
				tableData:[],
				//权限条件
				badd:false,//增加
				bedit:false,//编辑
				bdel:false,//编辑

			}
		},
		mounted(){
			let that = this;
			this.getProject();

			this.$store.dispatch("getPer","column").then(()=>{
				that.$store.state.perList.includes("column.add")?this.badd=true:'';
				that.$store.state.perList.includes("column.edit")?this.bedit=true:'';				
				that.$store.state.perList.includes("column.del")?this.bdel=true:'';				
				
				//获取页面状态信息
				that.pageInfo();
				//获取搜索条件信息
				let searchParams =  that.$store.state.searchParams;
				that.getList(that.missionInfo.pageIndex,searchParams);

			});
		},
		methods:{
			//搜索
			search(){
				let that = this;
				let searchParams = {
					'findprojectinfo': that.missionInfo.findprojectinfo,
					'title': that.missionInfo.title,
					'column': that.missionInfo.column,
					'pageIndex': that.pageIndex,
				}
				that.$store.dispatch('search_params',searchParams)
				that.pageIndex = 1;
				that.getList(that.pageIndex,that.missionInfo)
			},
			//添加
			add(){
				this.savePageContent();
				this.$router.push('/addColumn')
			},
			//操作--编辑
			editColumn(id){
				this.savePageContent();
				this.$router.push({path:'/editColumn',query:{id:id}})
			},
			//删除
			delColumn(id){
				let that = this;
				this.$confirm('此操作将删除该字段, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	$.ajax({
						type:'post',
						dataType:'json',
						url:that.$api.column.delete,
						data:{
							column_id:id
						},
						success:function(res){
							if(res.error == 0){
								//获取搜索条件信息
								let searchParams =  that.$store.state.searchParams;
								that.getList(that.missionInfo.pageIndex,searchParams);
								that.$message('删除成功')
							}else{
								that.$message('删除失败')
							}
						}
					})
		          this.$message({
		            type: 'success',
		            message: '删除成功!',
		            duration:1000
		          });
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除',
		            duration:1000
		          });          
		        });
				
			},
			//选择项目
			findprojectchange(value){
				let that = this;
				that.missionInfo.findprojectinfo = value[0];
			},
			//保存页面信息
			savePageContent(){
				let that = this;
				let pageContent = {
					'findprojectinfo': that.missionInfo.findprojectinfo,
					'title': that.missionInfo.title,
					'column': that.missionInfo.column,
					'pageIndex': that.pageIndex
				}
				this.$store.dispatch('keep_page_content',pageContent)
			},
			//获取页面信息
			pageInfo(){
				let that = this;
				//获取页面状态信息
				let pageContent = that.$store.state.pageContent;
				//项目
				that.missionInfo.findprojectinfo = pageContent.findprojectinfo;
				that.findproject[0] = that.missionInfo.findprojectinfo;
				that.findprojectchange([that.missionInfo.findprojectinfo]);

				that.missionInfo.title = pageContent.title;//标题
				that.missionInfo.column = pageContent.column;//字段名
				that.missionInfo.pageIndex = pageContent.pageIndex;//当前页码


			},
			//下一页
			nextPage(){
				if(this.pageIndex==this.allCount){
					this.$message.error("没有下一页")
					return
				}
				this.pageIndex++;
				// this.searchContent();
				let searchParams =  this.$store.state.searchParams;
				// this.getList(this.pageIndex,this.searchInfo);
				this.getList(this.pageIndex,searchParams);

			},
			//上一页
			prePage(){
				if(this.pageIndex == 1){
					this.$message.error("没有上一页")
					return
				}
				this.pageIndex--;
				// this.searchContent();
				let searchParams =  this.$store.state.searchParams;
				this.getList(this.pageIndex,searchParams)
			},
			//获取项目列表
			getProject(x){
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
							that.projectarr = data.data.project_arr;	
						}
					}
				});
			},
			//获取列表数据
			getList(page,info,p_sort){
				let that = this;
				$.ajax({
					method:'get',
					dataType:'json',
					url:this.$api.column.get_list,
					data:{
						page:page || 1,
						project_id: info.findprojectinfo,
						title:info.title,
						column:info.column,
						project_name:p_sort

					},
					success:function(res){
						if(res.error == 0){
							that.tableData = res.data.data;
							that.count = res.data.pagination.item_total
							that.allCount = res.data.pagination.page_total
							that.pageIndex = page|| 1;
						}
						

					}
				})
			},
			//排序
			projectSort(e){
				if(e.order == "descending"){
					this.proSort = 1;					
				}else if(e.order == "ascending"){
					this.proSort = 2;
				}else{
					this.proSort = 0;
				}
				this.getList(this.pageIndex,this.missionInfo,this.proSort);
			},
			//清空
			clearSearch(){
				//项目
				this.findproject = [];
				this.missionInfo.findprojectinfo = '';
				//标题
				this.missionInfo.title = '';
				this.missionInfo.column = '';

			}
		}
	}
</script>

<style scoped>
	.column{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
</style>