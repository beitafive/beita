<template>
	<div class="w-account">
		<div class="anchu-inner-head">
			<h2 class="anchu-head-title">
				账户管理
				<button class="addUser" @click="dialogVisible = true" v-if="badd">+ 添加账户</button>
			</h2>
			<p style="margin-top:30px" class="anchu-search-wrap">
				<span class="anchu-search-condition">
					<span class="anchu-search-name">标题</span>
					<el-input v-model="f_title" placeholder="请输入内容" style="width:200px;margin:0 15px"></el-input>					
				</span>
				<el-button type="primary" icon="search" @click="getList('1')">搜索</el-button>
			</p>
		</div>
		
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
			      width="400">
			    </el-table-column>
			    <el-table-column
			      label="内容"
			     >
			      <template scope="scope">
			      	<div v-html="scope.row.content"></div>
			      </template>
			    </el-table-column>
			    <el-table-column
			      label="操作"
			     width="200">
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.$index)" v-if="bedit">编辑</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			  <p class="anchu-page">
			  	<el-button  icon="arrow-left" @click="getList(+pageIndex-1)" style="margin-right: 10px;">上一页</el-button>{{+pageIndex}}/{{allCount}}
			  	<el-button  @click="getList(+pageIndex+1)">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			  </p>
		</div>
		<el-dialog title="添加账户" v-model="dialogVisible" size="tiny">
			<div class='addUserInfo'>
				<p>标题 <input type="text" v-model="addtitle" /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				内容
				<textarea class="content" placeholder="请添加内容描述" v-model="addcontent"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addNewUser">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="编辑项目信息" v-model="updateUserInfos" size="tiny">
			<div class='addUserInfo'>
				<p>标题 <input type="text" v-model="updatetitle"  /></p>
				<div style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				内容
				<textarea class="updateContent" placeholder="请添加内容描述" v-model="updatecontent"></textarea>
				</div>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateUserInfos = false">取 消</el-button>
		    <el-button type="primary" @click='updateUser' >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'Account',
	data(){
		return{
			f_title:'',
			tableData:[],
			count:'',
			pageIndex:1,
			allCount:'',
			dialogVisible:false,
			updateUserInfos:false,
			addtitle:'',
			addcontent:'',
			updatetitle:'',
			updatecontent:'',
			updateid:'',
			updateIndex:'',
			
			badd:false,
			bedit:false
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer",'account').then(()=>{
			_this.$store.state.perList.includes("account.add")?this.badd=true:'';
			_this.$store.state.perList.includes("account.edit")?this.bedit=true:'';
			_this.getList();
		})
	},
	methods:{
		//获取账号列表
		getList(x){
			let that = this;
			if(x=='0'){
				that.$message("没有上一页");
				return;
			}
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					title:that.f_title
				},
				dataType:'json',
				url:that.$api.account.getlist,
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg);
						if(that.allCount!="" && x<=that.allCount){
							that.tableData = [];
						}
						return;
					}
					that.tableData = data.data.account_arr;
					that.pageIndex = x || 1;
					that.count = data.data.count;
					that.allCount = Math.ceil(data.data.count/10)
				}
			});
		},
		//添加新用户功能
		addNewUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					title:that.addtitle,
					content:that.addcontent,
				},
				dataType:'json',
				url:that.$api.account.add,
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg);
						return;
					}
					if(data.error==0){
						that.dialogVisible = false;
						that.allCount = data.data.count;
						that.addtitle = "";
						that.addcontent = "";
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑用户信息   x为下标index
		updateUserInfo(x){
			this.updateUserInfos = true;
			this.updatetitle = this.tableData[x].title;
			this.updatecontent = this.tableData[x].content;
			this.updateid = this.tableData[x].id;
			this.updateIndex = x;
		},
		//发送更新用户信息功能
		updateUser(){
			let that = this;
			$.ajax({
				type:"post",
				data:{
					id:that.updateid,
					title:that.updatetitle,
					content:that.updatecontent
				},
				dataType:'json',
				url:that.$api.account.update,
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.tableData[that.updateIndex].title = that.updatetitle;
						that.tableData[that.updateIndex].content = that.updatecontent;
						that.updateUserInfos = false;
					}
				}
			});
		}
	}
})
</script>

<style>
	.w-account{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-account .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.w-account .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:16px;
		color:#333;
	}
	.w-account .addUserInfo input{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		margin-left:10px;
		border-radius:4px;
	}
	.w-account .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-account .tables .contor{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-account .content,.w-account .updateContent{
		width:75%;
		height:160px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
	}
</style>