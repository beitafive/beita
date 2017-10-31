<template>
	<div class="w-history">
		<h2 style="margin-bottom:20px;">部门历史</h2>
		<router-link to="/edithistory" v-if="badd">
			<button class="addUser">+ 添加历史</button>			
		</router-link>
		<p style="margin-top:20px;">
		  <el-input v-model="f_title" placeholder="请输入内容" style="width:200px;"></el-input>
		  <el-button type="primary" icon="search" @click="getList('1')">搜索</el-button>
		</p>
		<div class="tables">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="title"
			      label="标题"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建时间"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="150">
			      <template scope="scope">
			      	<router-link :to="{path:'/edithistory',query:{id:scope.row.id}}" v-if="bedit">
			        	<el-button type="text" size="small">编辑</el-button>
			       </router-link>
			        <router-link :to="{path:'/historydoc',query:{id:scope.row.id}}" target="_blank" v-if="bread">
				        <el-button type="text" size="small" style="margin-left:20px">查看</el-button>			        	
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			  <p><el-button type="primary" icon="arrow-left" @click="prePage">上一页</el-button> {{pageIndex}} / {{allCount}}  <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
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
						that.$message(data.error_message)
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
	.w-history .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
		cursor:pointer;
	}
	.w-history .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.w-history .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:16px;
		color:#333;
	}
	.w-history .addUserInfo input:nth-child(1){
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		margin-left:10px;
		border-radius:4px;
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