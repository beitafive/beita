<template>
	<div class="w-taskdoc">
		<h2>{{msg.title}}</h2>
		<div class="doc-time">
			<p><i>创建时间</i> <span> {{msg.created_at}}</span></p>
			<p><i>执行者</i> <span v-if="msg.owner_name"> {{msg.owner_name}}</span></p>
			<p><i>提出者</i> <span v-if="msg.submit_user_name"> {{msg.submit_user_name}}</span></p>	
			<p><i>测试者</i> <span v-if="msg.test_name"> {{msg.test_name}}</span></p>	

		</div>
		
		<h2 class="doc-content">描述：</h2>
		<div v-html="msg.html"  class="markdown"></div>
		<p v-if="taskArr.length > 0">
			<h2 style="font-weight: 800;">相关任务列表：</h2>
			<ul v-for="item in taskArr">
				<li >
					<h4>负责人：{{item.task_owner}}</h4>
					任务描述：<a :href=" item.task_link"  target="_blank" style="color: blue;">{{item.task_title}}</a></li>
			</ul>
	        
		</p>
		<h2 style="font-weight: 800;">需求：</h2>
		<p ><span style="font-weight: 700;">需求ID：</span>
			<router-link :to="{path:'/needDoc',query:{id:needinfo.id}}" target="_blank" style="color: blue;">
				 {{msg.requirement_id}}       		       
			</router-link></p>
		<p style="font-weight: 700;">需求描述：</p>
		<div v-html="needinfo.html"></div>
	</div>
</template>

<script>
	export default{
		name:'taskdoc',
		data(){
			return{
				msg:'',//任务内容
				needinfo:'',//需求信息
				taskArr:[],//相关任务列表
			}
		},
		mounted(){
			this.getInfo();
		},
		methods:{
			getInfo(){
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.task.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data;
							that.needinfo = data.data.requirement_content;
							if(that.msg.requirement_content != false){
								let t_arr = that.msg.requirement_content.task_info;
								t_arr.forEach(i => {
									if(i.task_id != that.msg.id){
										that.taskArr.push(i)
									}
								}) 	
								
							}	

						}
						if(data.error == 1){
							that.$message(data.error_msg);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-taskdoc{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow: 0 0 8px 2px rgba(231,231,231,0.50) ;
		padding:26px 34px;
		font-family: "microsoft yahei";
	}
	.w-taskdoc h2{
		font-size: 20px;
		font-weight: normal;
		padding-bottom: 20px;
		color: #494949;
		font-family:"PingFangSC-Regular";
	}
	.w-taskdoc .doc-time{
		padding:12px 0;
		border-bottom: 1px solid #CCCCCC;
	}
	.w-taskdoc .doc-time p{
		margin:17px 0;
	}
	.w-taskdoc .doc-time p i{
		display: inline-block;
		width: 70px;
		font-family: "MicrosoftYaHei";
		font-size: 14px;
		color: #494949;
	}
	.w-taskdoc .doc-time p span{
		height: 20px;
		line-height: 20px;
		display: inline-block;
		padding:2px 10px;
		border-radius: 10px;
		background: #EEEFF6;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #6F7E95;
	} 
	.w-taskdoc .doc-content{
		margin:26px 0 20px 0;
		font-weight: 800;
	}
	.markdown {
	  word-wrap: break-word;
	}
	.markdown,
	.markdown h1,
	.markdown h2,
	.markdown h3,
	.markdown h4,
	.markdown h5,
	.markdown h6,
	.markdown pre,
	.markdown code,
	.markdown blockquote,
	.markdown em,
	.markdown strong,
	.markdown code {
	  font-size: 14px;
	  line-height: 20px;
	  font-weight: normal;
	  font-style: normal;
	  font-family: consolas, monaco, courier, "courier new", fixed-width;
	  color: #333333;
	}

</style>