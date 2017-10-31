<template>
	<div class="resource">
		<h2 style="margin-bottom:20px;">资源管理</h2>
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-06
        	描述：列表数据
        -->
		<div class="tables">
			<p v-for="(items,index) in rList" :key="items">
				<el-button type="primary" style="margin-right:10px;width:120px;" @click="MenuShow(items)" >{{items.title}}</el-button> :
				<el-button type="info" v-for="(item,ind) in items.children" :key="item" @click="MenuShow(item,items)">{{item.title}}</el-button>
				<el-button type="success" icon="plus" @click="addResource('add',items)" v-if="badd"></el-button>
			</p>
			<p><el-button type="success" icon="plus" @click="addResource('add')" v-if="badd"> 添 加 </el-button></p>
		</div>
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-06
        	描述：菜单弹窗
        -->
        <el-dialog title="菜单" v-model="menuTip" size="tiny">
			<div class='addUserInfo'>
				<p>资源名称：{{rtitle}}</p>
				<p>资源code：{{rCode}}</p>
				<el-button type="text" @click="addResource('menu')" v-if="bedit">我想修改这条资源！！！</el-button><br />
				<el-button type="text" @click="deleteItem" v-if="bdel">我想删除这条资源！！！</el-button><br />
				<el-button type="text" @click="menuTip = false">我想还是算了吧！！！</el-button><br />
			</div>
		</el-dialog>
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-07
        	描述：添加||编辑弹窗
        -->
		<el-dialog :title="menutitle" v-model="editTip" size="tiny">
			<div class='addUserInfo'>
				<p>资源名称 <input type="text" v-model="rtitle" placeholder="请填写资源名称"/></p>
				<p>资源Code <input type="text" v-model="rCode" placeholder="请填写资源Code"/></p>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editTip = false">取 消</el-button>
		    <el-button type="primary" @click='sendAdd' >确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default({
	name:'resource',
	data(){
		return{
			menuTip:false,		//菜单弹窗
			rList:[],			//列表数据
        	rtitle:'',			//资源标题
        	rCode:'',			//资源code
        	editTip:false,		//编辑弹窗
        	menutitle:'',		//弹窗名称
        	pid:'',				//父ID
        	
        	pCode:'',			//父Code
        	
        	badd:false,
			bedit:false,
			bread:false,
			bdel:false,
		}
	},
	mounted(){
		let _this = this;
		this.$store.dispatch("getPer",'resource').then(()=>{
			_this.$store.state.perList.includes("resource.add")?this.badd=true:'';
			_this.$store.state.perList.includes("resource.edit")?this.bedit=true:'';		
			_this.$store.state.perList.includes("resource.read")?this.bread=true:'';				
			_this.$store.state.perList.includes("resource.del")?this.bdel=true:'';
			_this.getList();
		})
	},
	methods:{
		//获取列表
		getList(){
			let _this = this;
			$.ajax({
				type:"get",
				url:_this.$api.resource.getlist,
				dataType:"json",
				success:(res)=>{
					if(res.error == 0){
						_this.rList = res.data.data;
					}else{
						_this.rList = [];
						_this.$message.error(res.error_msg)
					}
				}
			})
		},
		//菜单弹窗
		MenuShow(item,items=''){
			if(this.bread){
				if(items){
					this.pCode = items.code+'.';
				}else{
					this.pCode = '';
				}
				this.id = item.resource_id;
				this.rtitle = item.title;
				this.rCode = item.code;
				this.menuTip = true;				
			}
		},
		//添加||编辑资源
		// type 表示 从那里点开的这个弹窗 add-添加 menu-菜单 null-编辑
		addResource(type,items=''){
			type=='menu'?'':this.id='';
			type=='add'?this.menutitle='添加弹窗':this.menutitle='编辑弹窗'
			this.pid = items.resource_id;
			if(type=='add'){
				this.rtitle = '';
				this.rCode = '';
				items==''?this.pCode='':this.pCode=items.code+'.';
			}
			this.menuTip = false;
			this.editTip = true;
		},
		//发送添加请求
		sendAdd(){
			let _this = this;
			if(!this.rCode.includes(this.pCode)){
				this.$message.error("子资源开头必须是"+this.pCode)
				return
			}
			$.ajax({
				type:"post",
				url:_this.$api.resource.add,
				data:{
					id:_this.id,
					pid:_this.pid,
					title:_this.rtitle,
					code:_this.rCode,
				},
				dataType:"json",
				success:(res)=>{
					if(res.error == 0){
						_this.editTip = false;
						_this.getList();
					}else{
						_this.$message.error(res.error_msg);
					}
				}
			});
		},
		//发送删除请求
		deleteItem(){
			let _this = this;
			$.ajax({
				type:'post',
				url:_this.$api.resource.del,
				data:{
					id:_this.id
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						_this.getList();
						_this.menuTip = false;
					}else{
						_this.$message.error(res.error_msg)
					}
				}
			})
		}
	}
})
</script>

<style>
	.resource{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.el-dialog--tiny{
		width:400px!important;
	}
	.resource .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.resource .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.resource .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.resource .addUserInfo input{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.resource .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.resource .tables p{
		margin:15px;
		font-size:14px;
	}
	.resource .updateContent{
		width:75%;
		height:120px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
		/*margin-top:10px;*/
	}
</style>