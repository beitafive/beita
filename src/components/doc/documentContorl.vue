<template>
	<div class="w-document">
		<div  class="anchu-inner-head">
			<h2 class="anchu-head-title">
			文档管理
				<router-link to="/createdoc" v-if="badd">
					<button class="addUser">+ 添加文档</button>			
				</router-link>
			</h2>
			<p style="margin-top:20px;" class="anchu-search-wrap">
				<span class="anchu-search-condition">
					<span class="anchu-search-name">标题</span>
				  	<el-input v-model="f_title" placeholder="请输入标题" style="width:200px;margin-right:12px;"></el-input>					
				</span>
			  <el-button type="primary" icon="search" @click="getlist(1)">搜索</el-button>
			</p>
		</div>
		
		<!--列表展示-->
		<div class="anchu-inner-content">
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
		     >
		    </el-table-column>
		    <el-table-column
		      prop="created_at"
		      label="创建日期"
		       width="150">
		    </el-table-column>
		     <el-table-column
		      label="操作"
		     width="150">
		      <template scope="scope">
		      	<router-link :to="{path:'/editdoc',query:{id:scope.row.id}}" v-if="bedit">
		      		<el-button type="text" style="margin-right:20px;">编辑</el-button>
		      	</router-link>	
		      	<router-link :to="{path:'/doc',query:{id:scope.row.id}}" target="_blank" v-if="bread">
			      	<el-button type="text">查看</el-button>		      		
		      	</router-link>
		      </template>
		    </el-table-column>
		  </el-table>
		  <p class="anchu-page">
		  	<el-button  icon="arrow-left" @click="getlist(+pageIndex-1)" style="margin-right: 10px;">上一页</el-button>{{+pageIndex}}/{{allCount}}<el-button  @click="getlist(+pageIndex+1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
		  </p>
		</div>
	</div>
</template>

<script>
	export default{
		name:'documentcontorl',
		data(){
			return{
				tableData:[],		//列表数据
				f_title:'',			//标题 	- 搜索
				pageIndex:1,		//当前页
				allCount:1,			//总数
				
				badd:false,
				bedit:false,
				bread:false,
			}
		},
		mounted(){
			let _this = this;
			this.$store.dispatch("getPer",'doc').then(()=>{
				_this.$store.state.perList.includes("doc.add")?this.badd=true:'';
				_this.$store.state.perList.includes("doc.edit")?this.bedit=true:'';		
				_this.$store.state.perList.includes("doc.read")?this.bread=true:'';				
				_this.getlist(1);
			})
		},
		methods:{
			//获取列表
			getlist(x){
				let _this = this;
				if(x=='0'){
					_this.$message("没有上一页");
					return;
				}
				if(x>_this.allCount){
					_this.$message("没有下一页");
					return;
				}
				$.ajax({
					type:"get",
					url:_this.$api.doc.getlist,
					data:{
						page:x||1,
						title:_this.f_title
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
							_this.tableData = res.data.rows;
							_this.allCount = Math.ceil(res.data.count/10);
							_this.pageIndex = x||1;
						}else{
							_this.$message.error(res.error_msg)
						}
					}
				});
			},
		}
	}
</script>

<style scoped>
	.w-document{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-document .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-document .tables p button{
		width:68px;height:28px;
		margin:0 20px;
		background:#fff;
		border:1px solid #ddd;
		font-size:14px;
		color:#333;
		border-radius:3px;
	}
</style>