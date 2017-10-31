<template>
	<div class="w-document">
		<h2>文档管理</h2>
		<router-link to="/createdoc" v-if="badd">
			<button class="addUser">+ 添加文档</button>			
		</router-link>
		<p style="margin-top:20px;">
		  <el-input v-model="f_title" placeholder="请输入标题" style="width:200px;margin-right:50px;"></el-input>
		  <el-button type="primary" icon="search" @click="getlist(1)">搜索</el-button>
		</p>
		<!--列表展示-->
		<div class="tables">
			<el-table
		    :data="tableData"
		    border
		    style="width: 100%">
		    <el-table-column
		      prop="id"
		      label="ID"
		      width="120">
		    </el-table-column>
		    <el-table-column
		      prop="title"
		      label="标题"
		      width="180">
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
		  <p><button @click="getlist(+pageIndex-1)">上一页</button>{{+pageIndex}}/{{allCount}}<button @click="getlist(+pageIndex+1)">下一页</button></p>
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
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-document .addUser{
		font-size:14px;
		margin-top:20px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
		cursor: pointer;
	}
	.w-document .addDoc{
		box-sizing: border-box;
		padding:0 50px;
	}
	.w-document .addDoc p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.w-document .addDoc input:first-child{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
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
	.content{
		width:75%;
		height:160px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>