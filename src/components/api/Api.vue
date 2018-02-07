<template>
	<!--
    	作者：beitafive@163.com
    	时间：2017-05-10
    	描述：api
    -->
	<div class="w-api">
		<div  class="co-inner-head">
			<h2 class="co-head-title">
				API管理
			</h2>
			<el-button @click="addApi"  v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<!--搜索-->
			<p style="margin-top:20px;"  class="co-search-wrap">
				<span class="co-search-condition">
					<span class="co-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:200px;;padding-right: 12px;"
				    v-model="findproject"
				    @change="findprojectchange"
				  ></el-cascader>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">模块</span>
				  <el-cascader
				    placeholder="请选择模块"
				    :options="findmodulearr"
				    filterable
				    style="width:200px;padding-right: 12px;"
				    v-model="findmodule"
				    @change="findmodulechange"
				  ></el-cascader>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">名称</span>
				  <el-input v-model="apiInfo.f_title" @keyup.enter.native="search" placeholder="请输入名称" style="width:200px;padding-right: 12px;"></el-input>					
				</span>
				<span class="co-search-condition">
				  <span class="co-search-name">地址</span>
				  <el-input v-model="apiInfo.f_url" @keyup.enter.native="search" placeholder="请输入地址" style="width:200px;padding-right: 12px;"></el-input>					
				</span>
			   <el-button type="primary" @click="search" style="padding: 10px 37px;">搜索</el-button>
			   <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>
		<span class="page-info">任务总数：{{count}}</span>
		<!--列表展示-->
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="80">
			    </el-table-column>
			    <el-table-column
			      prop="project_name"
			      label="项目名称"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="module_name"
			      label="模块名称"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="名称"
			      width="200">
			      <template scope="scope">
			      	<router-link :to="{path:'/oaApiDoc',query:{id:scope.row.id}}" target="_blank" style="color: #1D8CE0;">
				        <span>{{scope.row.title}}</span>
			        </router-link>
				  </template>
			    </el-table-column>
			    <el-table-column
			      prop="method"
			      label="method"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="url"
			      label="地址"
			      min-width="200"
			     >
			    </el-table-column>
			    <el-table-column
			      prop="new_time"
			      label="最新更新时间"
			      width="210">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200"
			     >
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index,scope.row)" v-if="bedit">编辑</el-button>
			        <el-button type="text" size="small" @click="deleteUserInfo(scope.row)" v-if="bdel">删除</el-button>
			        <!-- <router-link :to="{path:'/oaApiDoc',query:{id:scope.row.id}}" target="_blank">
				        <el-button type="text" size="small" style="margin-left:15px" v-if="bread">查看</el-button>			        	
			        </router-link> -->
			      </template>
			    </el-table-column>
			 </el-table>
			 <p v-if="tableData.length"  class="co-page">			 	
			 	<el-button icon="arrow-left" @click="prePage" style="margin-right:10px;">上一页</el-button> {{apiInfo.pageIndex}} / {{allCount}}  <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			 </p>
		</div>
		
	</div>
</template>

<script>
export default({
	name:'w-api',
	data(){
		return{
			tableData:[],//列表数据
			pageIndex:'',//页面下标
			allCount:'',//页面总数
			count:'',//api总条数
			projectarr:[],//项目列表
			//搜索-项目
			findproject:[],
			//搜索-模块
			findmodule:[],
			findmodulearr:[],
			//页面信息
			apiInfo:{
				findprojectinfo:'',//搜索-项目
				findmoduleinfo:'',//搜索-模块
				f_title:'',//搜索-名称
				f_url:'',//搜索-地址
				pageIndex:'',//页面下标
			},
			searchInfo:{
				findprojectinfo:'',//搜索-项目
				findmoduleinfo:'',//搜索-模块
				f_title:'',//搜索-名称
				f_url:'',//搜索-地址
				pageIndex:'',//页面下标
			},
			//权限
			badd:false,
			bedit:false,
			bread:false,
			bdel:false
		}
	},
	mounted(){
		let that = this;
		this.$store.dispatch("getPer",'api').then(()=>{
			//判断权限
			that.$store.state.perList.includes("api.add")?this.badd=true:'';
			that.$store.state.perList.includes("api.edit")?this.bedit=true:'';		
			that.$store.state.perList.includes("api.read")?this.bread=true:'';		
			that.$store.state.perList.includes("api.del")?this.bdel=true:'';

			//获取页面状态信息
			that.pageInfo();
			//获取搜索信息
			that.searchContent();
			that.getList(that.apiInfo.pageIndex,that.searchInfo);
		})
		that.getProject();
	},
	methods:{
		//搜索
		search(){
			let that = this;
			let searchParams = {
				'f_project': that.apiInfo.findprojectinfo,
				'f_module': that.apiInfo.findmoduleinfo,
				'f_title': that.apiInfo.f_title,
				'f_url': that.apiInfo.f_url,
				'pageIndex': that.apiInfo.pageIndex
			}
			that.$store.dispatch('search_params',searchParams)
			that.apiInfo.pageIndex = 1;
			that.getList(that.apiInfo.pageIndex,that.apiInfo)
		},
		//删除api
		deleteUserInfo(row){
			let that = this;
			let id = row.id;

			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	$.ajax({
				type:"post",
				data:{
					id:id
				},
				dataType:'json',
				url:that.$api.api.delete,
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					that.$message({
			            type: 'success',
			            message: '删除成功!',
			            duration: 800
			        });
					that.getList(that.apiInfo.pageIndex,that.apiInfo);
				}
			});

	          
	        }).catch(() => {
	          that.$message({
	            type: 'info',
	            message: '已取消删除',
	            duration: 700
	          });          
	        });
			
		},
		//添加api
		addApi(){
			let that = this;
			let pageContent = {
				'f_project': that.apiInfo.findprojectinfo,
				'f_module': that.apiInfo.findmoduleinfo,
				'f_title': that.apiInfo.f_title,
				'f_url': that.apiInfo.f_url,
				'pageIndex': that.apiInfo.pageIndex
			}
			that.$store.dispatch('keep_page_content',pageContent)
			that.$router.push('/addapi');
		},
		//编辑api信息,获取模块列表   x为下标index
		updateUserInfo(x,y){
			let that = this;
			let pageContent = {
				'f_project': that.apiInfo.findprojectinfo,
				'f_module': that.apiInfo.findmoduleinfo,
				'f_title': that.apiInfo.f_title,
				'f_url': that.apiInfo.f_url,
				'pageIndex': that.apiInfo.pageIndex
			}
			that.$store.dispatch('keep_page_content',pageContent)
			that.$router.push({path:"/editapi",query:{id:y.id,pid:y.project_id,mid:y.module_id}});
			
		},
		
		//搜索，项目下拉
		findprojectchange(value){
			let that = this;
			that.apiInfo.findprojectinfo = value[0];
			// that.apiInfo.findmoduleinfo = '';
			that.findmodule = [];
			$.ajax({
				type:"get",
				url:that.$api.get_module_list,
				data:{
					project_id:that.apiInfo.findprojectinfo
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
					}
					if(data.error == 0){
						that.findmodulearr = data.data.module_arr;
					}
				}
			});
		},
		//搜索，模块下拉
		findmodulechange(value){
			this.apiInfo.findmoduleinfo = value[0];
		},
		
		//下一页
		nextPage(){
			if(this.apiInfo.pageIndex==this.allCount){
				this.$message("没有下一页")
				return
			}
			this.apiInfo.pageIndex++;
			
			this.searchContent();

			this.getList(this.apiInfo.pageIndex,this.searchInfo);
		},
		//上一页
		prePage(){
			if(this.apiInfo.pageIndex == 1){
				this.$message("没有上一页")
				return
			}
			this.apiInfo.pageIndex--;
			
			this.searchContent();

			this.getList(this.apiInfo.pageIndex,this.searchInfo);
		},
		//获取页面信息
		pageInfo(){
			let that = this;
			//获取页面状态信息
			let pageContent = that.$store.state.pageContent;

			that.apiInfo.findprojectinfo = pageContent.f_project;
			that.apiInfo.findmoduleinfo = pageContent.f_module;
			that.apiInfo.f_title = pageContent.f_title;
			that.apiInfo.f_url = pageContent.f_url;
			that.apiInfo.pageIndex = pageContent.pageIndex;

			that.findproject[0] =  that.apiInfo.findprojectinfo;
			that.findprojectchange([that.apiInfo.findprojectinfo]);
			that.findmodule[0] = that.apiInfo.findmoduleinfo;
		},
		//获取搜索信息
		searchContent(){
			let that = this;
			//获取搜索条件
			let searchParams =  that.$store.state.searchParams;
			that.searchInfo.findprojectinfo = searchParams.f_project;
			that.searchInfo.findmoduleinfo = searchParams.f_module;
			that.searchInfo.f_title = searchParams.f_title;
			that.searchInfo.f_url = searchParams.f_url;
			that.searchInfo.pageIndex = searchParams.pageIndex;
		},
		//获取项目列表
		getProject(x){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:x||1
				},
				dataType:'json',
				url:that.$api.get_project_list,
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					that.projectarr = data.data.project_arr;
				}
			});
		},
		//获取api列表
		getList(page,info){
			let that = this;
			if(page=='0'){
				that.$message("没有上一页");
				return;
			}
			// if(x>that.allCount){
			// 	that.$message("没有下一页");
			// 	return;
			// }

			//筛选模块
			let m_arr = [];
			that.findmodulearr.forEach(function(i){
				m_arr.push(i.value)
			})
			if(m_arr.includes(info.findmoduleinfo) == false){
				info.findmoduleinfo = '';
			}

			$.ajax({
				type:"get",
				data:{
					page:page||1,
					project_id:info.findprojectinfo,
					module_id:info.findmoduleinfo,
					title:info.f_title,
					url:info.f_url
				},
				dataType:'json',
				url:that.$api.api.getlist,
				success:function(res){
					let data = res
					if(data.error==1){
						that.count = 0;
						that.tableData = [];
						that.$message(data.error_msg)
					}
					if(data.error == 0){
						that.tableData=data.data.api_arr;
						that.count = data.data.count;
						that.allCount = Math.ceil(data.data.count/10);
						that.apiInfo.pageIndex = page || 1;
					}
				}
			});
		},
		//清空功能
		clearSearch(){
			this.findproject = [];
			this.apiInfo.findprojectinfo ='';
			this.findmodule = [];
			this.apiInfo.findmoduleinfo = '';
			this.apiInfo.f_title = '';
			this.apiInfo.f_url = '';
		
		}
	}
})
</script>

<style>
	.w-api{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-api .addUserInfo span{
		margin-right: 12px;
	}
	.w-api .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	} 
	.w-api .addUserInfo .inputInfo{
		width:75%;
		height:38px;
		float:right;
		box-sizing: border-box;
		border-radius:4px;
		margin-right: 12px;
	}
	.w-api .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-api .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-api .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
	.w-api .content{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>