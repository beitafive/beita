<template>
	<div class="editPer">
		<h2 style="margin-bottom:20px;">角色{{name}}的权限管理</h2>
		<!--
        	作者：beitafive@163.com
        	时间：2017-09-06
        	描述：列表数据
        -->
		<div class="tables">
			<div v-for="(item,index) in rList" key="item" class="case">
			    <span style="margin-right:10px">{{item.title}}</span><el-checkbox :indeterminate="item.check_half" v-model="item.checkall" @change="checkall(item)">全选</el-checkbox>
			    <div style="margin: 3px 0;"></div>
		    	<el-checkbox v-for="(val,ind) in item.children" :label="val.title" :key="val" @change="checkItem(item)" v-model="val.check">{{val.title}}</el-checkbox>
			</div>
			<p>
				<el-button type="info" style="width:110px;margin-right:30px" @click="submitPer">保 存</el-button>
				<router-link to='/rolecontrol'>
					<el-button :plain="true" type="info" style="width:110px;">取 消</el-button>				
				</router-link>
			</p>
		</div>
	</div>
</template>

<script>
export default({
	name:'editPer',
	data(){
		return{
			name:'',
			rList:[]
		}
	},
	mounted(){
		this.name = this.$route.query.name;
		this.getList();
	},
	methods:{
		//获取列表
		getList(){
			let _this = this;
			$.ajax({
				type:"get",
				url:_this.$api.permission.getlist,
				data:{
					id:_this.$route.query.id
				},
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						_this.rList = res.data;
						_this.rList.map((item)=>{
							item.checkall==0?item.checkall=false:item.checkall=true;
							item.check_half==0?item.check_half=false:item.check_half=true;
							item.children.map((val)=>{
								val.check==0?val.check=false:val.check=true;
							})
						})
					}else{
						_this.$message.error(res.error_msg)
					}
				}
			});
		},
		//全选
		checkall(item) {
	        if(item.checkall){
	        	item.children.map((val)=>{
	        		val.check = true;
	        	})
	        }else{
	        	item.children.map((val)=>{
	        		val.check = false;
	        	})
	        }
	        item.check_half = false;
	    },
	    //单选
	    checkItem(item) {
	        let checkedCount = 0;
	        item.children.map((val)=>{
	        	if(val.check){
	        		checkedCount++;
	        	}
	        })
	        item.checkall = checkedCount === item.children.length;
	        item.check_half = checkedCount > 0 && checkedCount < item.children.length;
	    },
	    //保存
	    submitPer(){
	    	let _this = this;
	    	let ids = new Array;
	    	this.rList.map((item)=>{
	        	item.children.map((val)=>{
	        		if(val.check){
	        			ids.push(val.resource_id)
	        		}
	        	})
	        })
	    	$.ajax({
	    		type:"post",
	    		url:_this.$api.permission.save,
	    		data:{
	    			id:_this.$route.query.id,
	    			resource_id:ids.join(',')
	    		},
	    		dataType:'json',
	    		success:(res)=>{
	    			if(res.error == 0){
	    				_this.$message.success("保存成功！");
	    				_this.$router.push("/rolecontrol");
	    			}else{
	    				_this.$message.error(res.error_msg)
	    			}
	    		}
	    	});
	    }
	}
})
</script>

<style>
	.editPer{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.editPer .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
	}
	.editPer .addUserInfo{
		box-sizing: border-box;
		padding:0 50px;
	}
	.editPer .addUserInfo p{
		height:40px;
		margin:10px 0;
		line-height:40px;
		font-size:14px;
		color:#333;
	}
	.editPer .addUserInfo input{
		width:75%;
		height:38px;
		border:1px solid #ddd;
		float:right;
		box-sizing: border-box;
		padding:10px;
		border-radius:4px;
	}
	.editPer .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.editPer .tables p{
		margin-top:30px;
	}
	.editPer .updateContent{
		width:75%;
		height:120px;
		float:right;
		border:1px solid #DDDDDD;
		resize:none;
		/*margin-top:10px;*/
	}
	.case {
		margin-bottom:5px;
		padding-bottom:5px;
		border-bottom:1px solid #777777;
	}
</style>