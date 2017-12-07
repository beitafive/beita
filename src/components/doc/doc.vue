<template>
	<div class="w-doc">
		<h2>{{msg.title}}</h2>
		<div class="doc-info">
			<p><i>创建时间</i> <span> {{msg.created_at}}</span></p>			
		</div>
		<div class="doc-content">内容：</div>
		<p v-html="msg.html" class="markdown"></p>
	</div>
</template>

<script>
	export default{
		name:'doc',
		data(){
			return{
				msg:''
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
					url:that.$api.doc.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						if(res.error == 0){
							that.msg = res.data;				
						}
						if(res.error == 1){
							that.$message(res.error_msg);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-doc{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow: 0 0 8px 2px rgba(231,231,231,0.50) ;
		padding:26px 34px;
		font-family: "microsoft yahei";
	}
	.w-doc h2{
		font-size: 20px;
		font-weight: normal;
		padding-bottom: 20px;
		color: #494949;
		font-family:"PingFangSC-Regular";
	}
	.w-doc .doc-msg{
		margin: 26px 0 20px 0;
		line-height: 26px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #494949;
	}
	.w-doc .doc-info{
		padding:12px 0;
		border-bottom: 1px solid #CCCCCC;
	}
	.w-doc .doc-info p{
		margin:17px 0;
	}
	.w-doc .doc-info p i{
		display: inline-block;
		width: 70px;
		font-family: "MicrosoftYaHei";
		font-size: 14px;
		color: #494949;
	}
	.w-doc .doc-info p span{
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
	.w-doc .doc-content{
		margin:26px 0 20px 0;
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