<template>
	<div class="sheet">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				列表页模板（对照数据库表列表页面）
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
				  <el-input v-model="missionInfo.f_title" placeholder="请输入表名" @keyup.enter.native="search" style="width:200px;padding-right: 12px;"></el-input>					
				</span>

			  <el-button type="primary" @click="search" style="padding: 10px 37px;margin-left: 12px;">搜索</el-button>
			  <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>

		<span class="page-info">任务总数：{{count}}</span>

		<!--列表展示-->
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			     @sort-change="projectSort"
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="90">
			    </el-table-column>
			    <el-table-column
			      prop="project"
			      label="项目"
			      sortable="custom"			     			     
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="表名"
			      width="95">
			    </el-table-column>
			    <el-table-column
			      prop="comment"
			      label="注释"
			     >
			    </el-table-column>
			   
			    <el-table-column
			      prop="created_at"
			      label="创建日期"
			      width="130">
			    </el-table-column>
			    
			    <el-table-column
			      label="操作"
			      width="220">
			      <template scope="scope">
			      	<el-button type="text" size="small" @click="editMission(scope.row.id)" v-if="bedit">编辑</el-button>
			      </template>
			    </el-table-column>
			 </el-table>
		</div>
	</div>
</template>
<script>
	export default {
		name:'sheet',
		data(){
			return{
				//搜索条件
				projectarr:[{label:'oa',value:'1'}],
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
				tableData:[
					{id:0,project:'oa',title:'用户列表',comment:'列表注释',created_at:'2018-01-02'},
					{id:1,project:'oa',title:'用户列表',comment:'列表注释',created_at:'2018-01-02'}
				],
				//权限条件
				badd:true,//增加
				bedit:true,//编辑
			}
		},
		mounted(){

		},
		methods:{
			//搜索
			search(){

			},
			//添加
			add(){

			},
			//操作--编辑
			editMission(){

			},
			//选择项目
			findprojectchange(){

			},
			//获取列表数据
			getlist(){
				let that = this;
				$.ajax({
					method:'get',
					dataType:'json',
					url:this.$api.column.get_list,
					data:{
						
					},
					success:function(res){
						
					}
				})
			},
			//排序
			projectSort(){

			},
			//清空
			clearSearch(){

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