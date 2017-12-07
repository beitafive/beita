<template>
	<div class="w-versions">
		<div class="anchu-inner-head">
			<h2 class="anchu-head-title">
				版本管理
				<router-link to="/addversion" v-if="badd">
					<button class="addUser">+ 添加版本</button>			
				</router-link>
			</h2>
			<p style="margin-top:20px;" class="anchu-search-wrap">
				<span class="anchu-search-condition">
					<span class="anchu-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:200px;"
				    v-model="findproject"
				    @change="checkChange"
				  ></el-cascader>					
				</span>
				<span class="anchu-search-condition">
				  <span class="anchu-search-name">状态</span>
				  <el-select v-model="selectStatus" placeholder="请选择状态">
				    <el-option
				      v-for="item in statusArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
				</span>
			   <el-button type="primary" icon="circle-cross" @click="clearSearch" style="margin-left: 12px;">清空</el-button>
			  <el-button type="primary" icon="search" @click="getList('1',findprojectinfo,f_title)">搜索</el-button>
			</p>
		</div>
		
		<div class="anchu-inner-content">
			<el-table
			    :data="tableData"
			    border
			    :row-class-name="tableRowClassName"
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="70">
			    </el-table-column>
			    <el-table-column
			      prop="project_name"
			      label="项目名称"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="标题"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="short_desc"
			      label="简介"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="status_name"
			      label="状态"
			      width="140">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="230">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="230">
			      <template scope="scope">
			      	<el-button type="text" size="small" v-if="scope.row.status=='WAIT'" @click="changeItem(scope.row,'DEVELOPED')" >开始</el-button>
			      	<el-button type="text" size="small" v-if="bfinish&&scope.row.status=='DEVELOPED'" @click="changeItem(scope.row,'FINISHED')" >完成</el-button>
			      	<el-button type="text" size="small" v-if="bpass&&scope.row.status=='FINISHED'" @click="changeItem(scope.row,'TESTED')">测试通过</el-button>
			      	<el-button type="text" size="small" v-if="bline&&scope.row.status=='TESTED'" @click="changeItem(scope.row,'ONLINE')">上线</el-button>
			      	<el-button type="text" size="small" v-if="bclose&&scope.row.status=='ONLINE'" @click="changeItem(scope.row,'CLOSED')">关闭</el-button>
			      	<router-link :to="{path:'editversion',query:{id:scope.row.id}}" v-if="bedit" style="margin: 0 7px">
				        <el-button type="text" size="small">编辑</el-button>			  
			      	</router-link>
			        &nbsp;<router-link :to="{path:'/VsDoc',query:{id:scope.row.id}}" target="_blank" v-if="bread"><el-button type="text" size="small">查看</el-button></router-link>
			      </template>
			    </el-table-column>
			  </el-table>
			  <p  class="anchu-page">
			  	<el-button  icon="arrow-left" @click="getList(+pageIndex-1,findprojectinfo,f_title)" style="margin-right: 10px;">上一页</el-button> {{+pageIndex}} / {{allCount}} <el-button  @click="getList(+pageIndex+1,findprojectinfo,f_title)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
		</div>
	</div>
</template>

<script>
export default({
	name:'Versions',
	data(){
		return{
			role:localStorage.role,		//角色
			f_title:'',//搜索-标题
			findprojectinfo:'',//搜索-项目
			findproject:[],
			status:'', //列表版本的状态
			statusArr:[{value:'WAIT',label:'等待中'},{value:'DEVELOPED',label:'进行中'},{value:'FINISHED',label:'已完成'},{value:'TESTED',label:'测试通过'},{value:'ONLINE',label:'已上线'},{value:'CLOSED',label:'已关闭'}],
			selectStatus:'', //选择版本状态
			tableData:[],//列表数据
			pageIndex:1,//页面下标
			count:'',//列表总数
			allCount:'',//页面总数
			updatetitle:'',//编辑 标题
			updatesynopsis:'',//编辑 简介
			updatecontent:'',//编辑 内容
			updateid:'',// 编辑 id
			updateIndex:'',//编辑 列表下标
			updateprojectid:'',//编辑项目id
			projectarr:[],//项目列表数据
			
			badd:false,
			bedit:false,
			bpass:false,
			bfinish:false,
			bclose:false,
			bread:false,
			bline:false,
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer","version").then(()=>{
			_this.$store.state.perList.includes("version.add")?this.badd=true:'';
			_this.$store.state.perList.includes("version.edit")?this.bedit=true:'';		
			_this.$store.state.perList.includes("version.pass")?this.bpass=true:'';
			_this.$store.state.perList.includes("version.line")?this.bline=true:'';
			_this.$store.state.perList.includes("version.finish")?this.bfinish=true:'';
			_this.$store.state.perList.includes("version.close")?this.bclose=true:'';
			_this.$store.state.perList.includes("version.read")?this.bread=true:'';				
			_this.getList();
		});
		this.getVersions();
	},
	updated(){
		// console.log(this.selectStatus);

	},
	methods:{
		changeItem(row,status){
			let that = this;
			$.ajax({
				type:"post",
				dataType:'json',
				url:that.$api.version.change_status,
				data:{
					id:row.id,
					status:status
				},
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					
					if(status == 'CLOSED'&&Number(that.count)%10 == 1){
						if(Number(that.count)<=20){
							
							that.getList(1,that.findprojectinfo);
						}else{
							
							that.getList(Number(that.pageIndex)-1,that.findprojectinfo);								
						}
					}else{
						
						that.getList(that.pageIndex,that.findprojectinfo);
					}
					
				}
			});
		},
		//获取项目列表
		getVersions(){
			let that = this;
			$.ajax({
				type:"get",
				dataType:'json',
				url:that.$api.get_project_list,
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					that.projectarr = data.data.project_arr;
				}
			});
		},
		//获取版本列表
		getList(x,y,z){
			let that = this;
			if(x=='0'){
				that.$message("没有上一页");
				return;
			}
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					project_id:y,
					status:that.selectStatus,
					title:z
				},
				dataType:'json',
				url:that.$api.version.getlist,
				success:function(res){
					let data = res;
					if(data.error==1){
						// that.$message(data.error_msg)
						if(that.allCount!="" && x<=that.allCount){
							that.tableData = [];
						};
						return;
					}
					that.count = data.data.count;
					that.tableData = data.data.version_arr;
					that.pageIndex = x || 1;
					that.allCount = Math.ceil(data.data.count/10);

					that.findprojectinfo = y;
					that.status = z;
					
				}
			});
		},
		//获取checkbox的值
		checkChange(value){
			this.findprojectinfo = value[0];
		},
		//清空搜索框
		clearSearch(){
			this.findproject = [];
			this.f_title = '';
			this.status = '';
			this.selectStatus = '';
			this.findprojectinfo = '';
		},
		//不同状态，颜色区别
		tableRowClassName(row){
			 switch(row.status){
			 	case 'DEVELOPED': return 'wait-row';
			 	case 'FINISHED': return 'finished-row';
			 	case 'TESTED': return 'tested-row';
			 	case 'ONLINE': return 'online-row';
			 	case 'CLOSED': return 'closed-row';
			 	
			 }
		}
	}
})
</script>

<style>
	.w-versions{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-versions .addUserInfo span{
		margin-right: 12px;
	}
	.w-versions .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-versions .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-versions .content,.w-versions .updateContent{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>
<style>
  .el-table .wait-row {
    background:  #FFFAD6;
  }

  /*.el-table .finished-row {
    background: #f0f9eb;
  }*/
  .el-table .tested-row {
    background: #FFDFD9;
  }
  /*.el-table .online-row {
    background: #DAF0DF;
  }
  .el-table .closed-row {
    background: #D8F3FA;
  }*/
</style>