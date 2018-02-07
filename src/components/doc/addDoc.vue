<template>
	<div class="addDoc">
		<div  class="co-normal-table">
			<h2 class="co-normal-title">创建文档</h2>
			<div  class="co-normal-content">
				<p>
					<span>标题</span> 
					<input type="text" v-model="title" placeholder="请填写标题" /></p>
				<p>
					<span>优先级</span> 
					<el-input-number v-model="docRank" @change="handleChange" :min="0" :max="10" label="描述文字"></el-input-number>
				</p>
				<p style="overflow:hidden;margin-top:20px;color:#333;font-size:16px;">
				    <span style="float:left">内容</span> 
				    <textarea class="content" placeholder="请添加内容描述" v-model="content"></textarea>
				</p>
				<p>
					<el-button type="primary" @click="createDoc" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
					<router-link to="/document"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'addDoc',
		data(){
			return{
				title:'',   //标题
				content:'',	//内容
				docRank:0	//优先级
			}
		},
		methods:{
			//创建文档
			createDoc(){
				let _this = this;
				$.ajax({
					type:"post",
					url:_this.$api.doc.add,
					dataType:'json',
					data:{
						title:_this.title,
						content:_this.content,
						order:_this.docRank
					},
					success:(res)=>{
						if(res.error == 0){
							_this.$message.success("添加成功！");
							_this.$router.push("/document");
						}else{
							_this.$message.error(res.error_msg);
						}
					}
				});
			},
			handleChange(value){
				// console.log(value)
			}
		}
	}
</script>

<style scoped>
	.addDoc{
		float:left;
		/*width:85%;*/
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.addDoc h2{
		margin-bottom: 40px;
	}
	.addDoc p{
		margin:20px 0;
	}
	.addDoc p span{
		width:100px;
		display: inline-block;
	}
	.addDoc p input{
		width:250px;
		height:34px;
		border:1px solid #ddd;
		border-radius:4px;
		box-sizing: border-box;
		padding:4px;
	}
	.addDoc p textarea{
		resize: none;
		width:500px;
		min-height:500px;
		border:1px solid #ddd;
		border-radius:12px;
		padding:20px;
	}
</style>