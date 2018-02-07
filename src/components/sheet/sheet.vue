<template>
	<div class="sheet">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				数据库表管理
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

			  <el-button type="primary" @click="search" style="padding: 10px 37px;margin-left: 12px;">搜索</el-button>
			  <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>

		<span class="page-info">表总数：{{count}}</span>

		<!--列表展示-->
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			     @sort-change="projectSort"
			    style="width: 100%">
			    <el-table-column
			      prop="table_id"
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
			      prop="title"
			      label="表名"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="comment"
			      label="注释"
			     >
			    </el-table-column>
			   
			    <el-table-column
			      prop="created_at"
			      label="创建日期"
			      width="200">
			    </el-table-column>
			    
			    <el-table-column
			      label="操作"
			      width="150">
			      <template scope="scope">
			      	<el-button type="text" size="small" @click="editTable(scope.row)" v-if="bedit">编辑</el-button>
			      	<el-button type="text" size="small" @click="delTable(scope.row.table_id)" style="color: #FA5555;" v-if="bdel">删除</el-button>
			      </template>
			    </el-table-column>
			 </el-table>

			 <p v-if="tableData.length"  class="co-page">
			 	
			 	<el-button  icon="arrow-left" @click="prePage" style="margin-right:10px;">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			 </p>
		</div>
		<add-sheet :addInfo="addInfo"  @getlist="search"></add-sheet>
		<edit-sheet :editInfo="editInfo" @getlist="search"></edit-sheet>

	</div>
</template>
<script>
	import addSheet from '@/components/sheet/addSheet'
	import editSheet from '@/components/sheet/editSheet'

	export default {
		name:'sheet',
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
					pageIndex:'',//页面下标

				},
				searchInfo:{
					findprojectinfo:'',//项目--搜索
					project_id: '',
					title:'',
					pageIndex:'',//页面下标

				},
				addInfo:{
					projectarr:[],
					reduceTip:false,
				},
				editInfo:{
					project_id:'',
					projectarr:[],
					title:'',
					comment:'',
					reduceTip:false,
				},
				pageIndex:'',//页面下标
				tableData:[],
				proSort:0,//项目排序
				//权限条件
				badd:false,//增加
				bedit:false,//编辑
				bdel:false,//编辑
			}
		},
		components:{
			addSheet,editSheet
		},
		mounted(){
			let that = this;
			this.getProject();

			this.$store.dispatch("getPer","table").then(()=>{
				that.$store.state.perList.includes("table.add")?this.badd=true:'';
				that.$store.state.perList.includes("table.edit")?this.bedit=true:'';				
				that.$store.state.perList.includes("table.del")?this.bdel=true:'';				
				
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
				this.addInfo.reduceTip = true;

			},
			//操作--编辑
			editTable(info){
				let that = this;
				this.savePageContent();

				this.editInfo.project_id = info.project_id;
				this.editInfo.title = info.title;
				this.editInfo.comment = info.comment;
				this.editInfo.table_id = info.table_id;

				that.editInfo.reduceTip = true
			},
			//删除
			delTable(id){
				let that = this;
				this.$confirm('此操作将删除该表, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	$.ajax({
						type:'post',
						dataType:'json',
						url:that.$api.table.delete,
						data:{
							table_id:id
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
					'pageIndex': that.pageIndex
				}
				this.$store.dispatch('keep_page_content',pageContent)
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
				that.missionInfo.pageIndex = pageContent.pageIndex;//当前页码


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
							that.addInfo.projectarr = data.data.project_arr
							that.editInfo.projectarr = data.data.project_arr
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
					url:this.$api.table.get_list,
					data:{
						page:page || 1,
						project_id: info.findprojectinfo,
						title:info.title,
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
			}
		}
	}
</script>

<style scoped>
	.sheet{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
</style>