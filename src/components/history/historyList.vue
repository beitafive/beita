<template>
	<div class="w-history">
		<div class="co-inner-head">
			<h2 class="co-head-title">
				部门历史
				<!-- <router-link to="/edithistory" v-if="badd">
					<button class="addUser">+ 添加历史</button>			
				</router-link> -->
			</h2>
			<el-button  @click="add" v-if="badd" type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<p style="margin-top:20px;"  class="co-search-wrap">
				<span class="co-search-condition">
					<span class="co-search-name">内容</span>
				  	<el-input v-model="f_title" @keyup.enter.native="search"  placeholder="请输入内容" style="width:200px;padding-right: 12px;"></el-input>					
				</span>
			  <!-- <el-button type="primary" icon="search" @click="getList('1')">搜索</el-button> -->
			  <el-button type="primary" @click="getList('1')" style="padding: 10px 37px;margin-left: 12px;">搜索</el-button>
			  <el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>
			</p>
		</div>
		
		<div class="co-inner-content">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="70">
			      </el-table-column> 
			    <el-table-column
			      prop="title"
			      label="标题"
			      min-width="200"
			      >
			      <template scope="scope">
			      	<router-link :to="{path:'/historydoc',query:{id:scope.row.id}}" target="_blank" style="color: #1D8CE0;">
				        <span>{{scope.row.title}}</span>
			        </router-link>
				  </template>
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="300">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200">
			      <template scope="scope">
			      	<router-link :to="{path:'/edithistory',query:{id:scope.row.id}}" v-if="bedit">
			        	<el-button type="text" size="small">编辑</el-button>
			       </router-link>
			        <!-- <router-link :to="{path:'/historydoc',query:{id:scope.row.id}}" target="_blank" v-if="bread">
				        <el-button type="text" size="small" style="margin-left:20px">查看</el-button>			        	
			        </router-link> -->
			      </template>
			    </el-table-column>
			 </el-table>
			  <p class="co-page">
			  	<el-button  icon="arrow-left" @click="prePage"  style="margin-right: 10px;">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			  </p>
		</div>
	</div>
</template>

<script>
export default({
	name:'history',
	data(){
		return{
			tableData:[],			//列表数据
			pageIndex:1,			//页面下标
			count:'',				//总条数
			allCount:'',			//总页数
			f_title:'',				//搜索 - 标题
			
			badd:false,
			bedit:false,
			bread:false
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer",'history').then(()=>{
			_this.$store.state.perList.includes("history.add")?this.badd=true:'';
			_this.$store.state.perList.includes("history.edit")?this.bedit=true:'';		
			_this.$store.state.perList.includes("history.read")?this.bread=true:'';				
			_this.getList();
		})
	},
	methods:{
		search(){
			this.getList(1);
		},
		//添加历史
		add(){
			this.$router.push('/edithistory');
		},
		//下一页
		nextPage(){
			if(this.pageIndex==this.allCount){
				this.$message.error("没有下一页")
				return
			}
			this.pageIndex++;
			this.getList(this.pageIndex);
		},
		//上一页
		prePage(){
			if(this.pageIndex == 1){
				this.$message.error("没有上一页")
				return
			}
			this.pageIndex--;
			this.getList(this.pageIndex)
		},
		//获取需求列表
		getList(x){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					title:that.f_title,
				},
				url:that.$api.history.getlist,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						// that.$message(data.error_msg)
						that.tableData = [];
						return;
					}
					that.count = data.data.count;
					that.tableData = data.data.list;
					that.pageIndex = x || 1;
					that.allCount = Math.ceil(data.data.count/10);
				}
			});
		},
		clearSearch(){
			this.f_title = '';
		}
	}
})
</script>

<style>
	.w-history{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-history .addUserInfo span{
		margin-right: 12px;
	}
	.w-history .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-history .tables p{
		margin-top:50px;
		font-size:14px;
	}
	.w-history .content,.w-history .updateContent{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>