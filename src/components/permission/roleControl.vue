<template>
	<div class="rolecontrol">
		<div class="anchu-inner-head">
			<h2 class="anchu-head-title">
				角色管理
				<button class="addUser" @click="addTip = true" v-if="badd">+ 添加角色</button>
			</h2>
		</div>
		
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-06
        	描述：列表数据
        -->
		<div class="anchu-inner-content">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="role_id"
			      label="ID"
			     width="100">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="角色名称"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="code"
			      label="CODE"
			      >
			    </el-table-column>
			    <el-table-column
			      label="操作"
			     width="200" >
			      <template scope="scope">
			        <el-button type="text" size="small" @click="updateUserInfo(scope.row)" v-if="bedit">编辑</el-button>
			        <el-button type="text" size="small" @click="updateUserInfo(scope.row,'del')" style="margin-right:10px" v-if="bdel">删除</el-button>
			        <router-link v-if="bper" :to="{path:'/editpermission',query:{id:scope.row.role_id,name:scope.row.title}}"      >
			        	<el-button type="text" size="small">权限管理</el-button>
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
		</div>
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-06
        	描述：添加弹窗
        -->
		<el-dialog title="添加角色" v-model="addTip" size="tiny">
			<div class='addUserInfo'>
				<p>角色名称 <input type="text" v-model="addtitle" placeholder="请填写新角色名称"/></p>
				<p>CODE <input type="text" v-model="addrole" placeholder="请填写新角色Code"/></p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addTip = false">取 消</el-button>
		    <el-button type="primary" @click="addNewItem">确 定</el-button>
		  </span>
		</el-dialog>
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-06
        	描述：编辑弹窗
        -->
		<el-dialog title="编辑角色信息" v-model="updateTip" size="tiny">
			<div class='addUserInfo'>
				<p>角色名称 <input type="text" v-model="updatetitle"  /></p>
				<p>CODE <input type="text" v-model="updaterole"  /></p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateTip = false">取 消</el-button>
		    <el-button type="primary" @click='updateRole' >确 定</el-button>
		  </span>
		</el-dialog>
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-06
        	描述：删除确认弹窗
        -->
		<el-dialog title="删除角色" v-model="delTip" size="tiny">
			<div class='addUserInfo'>
				<p>请问你确定要将《{{updatetitle}}》角色删除吗？</p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="delTip = false">取 消</el-button>
		    <el-button type="primary" @click='deleteItem' >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'roleControl',
	data(){
		return{
			tableData:[],
			count:'',
			pageIndex:1,
			allCount:'',
			addTip:false,	//新增弹窗
			updateTip:false,	//更新弹窗
			delTip: false,		//删除确认弹窗
			//添加数据
			addrole:'',
			addtitle:'',
			//更新数据
			updateId:'',
			updaterole:'',
			updatetitle:'',
			
			badd:false,
			bedit:false,
			bper:false,
			bdel:false,
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer",'role').then(()=>{
			_this.$store.state.perList.includes("role.add")?this.badd=true:'';
			_this.$store.state.perList.includes("role.edit")?this.bedit=true:'';
			_this.$store.state.perList.includes("role.per")?this.bper=true:'';
			_this.$store.state.perList.includes("role.del")?this.bdel=true:'';
			_this.getList();
		})
	},
	methods:{
		//获取列表
		getList(x){
			let that = this;
			if(x=="0"){
				this.$message("没有上一页")
				return;
			}
			$.ajax({
				type:"get",
				url:that.$api.role.getlist,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						that.tableData = [];
						return;
					}
					that.count = data.data.count;
					that.allCount = Math.ceil(data.data.count/10);
					that.tableData = data.data.data;
					that.pageIndex = x || 1;
				}
			});
		},
		//添加新角色功能
		addNewItem(){
			let that = this;
			$.ajax({
				type:"post",
				dataType:'json',
				data:{
					id:'',
					title:that.addtitle,
					code:that.addrole,
				},
				url:that.$api.role.add,
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg);
						return;
					}
					if(data.error==0){
						that.addTip = false;
						that.addrole="";
						that.addtitle='';
						that.$message("添加成功");
					}
					that.getList();
				}
			});
		},
		//编辑角色信息  
		updateUserInfo(x,type){
			this.updateId = x.role_id;
			this.updatetitle = x.title;
			this.updaterole = x.code;
			if(type=="del"){
				this.delTip = true;
			}else{
				this.updateTip = true;				
			}
		},
		//发送更新角色信息功能
		updateRole(){
			let that = this;
			$.ajax({
				type:"post",
				dataType:'json',
				data:{
					id:that.updateId,
					code:that.updaterole,
					title:that.updatetitle
				},
				url:that.$api.role.add,
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						that.updateTip = false;
						that.getList(that.pageIndex);
					}
				}
			});
		},
		deleteItem(){
			let that = this;
			$.ajax({
				type:"post",
				dataType:'json',
				data:{
					id:that.updateId,
				},
				url:that.$api.role.del,
				success:function(res){
					let data = res;
					if(data.error == 1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){
						that.$message("更新成功");
						if(that.count==1){
							that.tableData=[];
						}
						that.delTip = false;
						that.getList();
					}
				}
			});
		}
	}
})
</script>

<style>
	.rolecontrol{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.rolecontrol .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.rolecontrol .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.rolecontrol .addUserInfo input{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.rolecontrol .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.rolecontrol .tables p{
		margin-top:50px;
		font-size:14px;
	}
	.rolecontrol .updateContent{
		width:75%;
		height:120px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
		/*margin-top:10px;*/
	}
</style>