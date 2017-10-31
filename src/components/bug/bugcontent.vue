<template>
	<div class="w-content">
		<h2>{{msg.project}}</h2>
		<p>所属模块：{{msg.module}}</p>
		<p>标题：{{msg.title}}</p>
		<p>所属环境：{{msg.is_live=="0"?"内网":"线上"}}</p>
		<p>紧急程度：{{msg.ep}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;难度：{{msg.dp}}</p>
		<p v-if="msg.reason">原因：{{msg.reason}}</p>
		<p v-if="msg.solution">解决方案：{{msg.solution}}</p>
		<p v-html="'内容：<br>'+msg.html"></p>
	</div>
</template>

<script>
	export default{
		name:'content',
		data(){
			return{
				msg:{
					reason:false,
					solution:false,
				}
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
					url:that.$api.bug.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data;				
						}
						if(data.error == 1){
							that.$message(data.error_message);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-content{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.w-content h2{
		font-size:50px;
		text-align: center;
	}
	.w-content h2 span{
		font-size:20px;
		color:#3c3c3c;
		font-weight: 100;
		margin-left:20px;
	}
	.w-content p{
		margin: 20px 0 20px 50px;
		font-size:18px;
		line-height:30px;
	}
	html { font-size: 100%; overflow-y: scroll; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }

	body{
	    color:#444;
	    font-family:Georgia, Palatino, 'Palatino Linotype', Times, 'Times New Roman', serif;
	    font-size:13px;
	    line-height:1.5em;
	    padding:1em;
	    margin:auto;
	    max-width:42em;
	    background:#fefefe;
	}
	
	h1, h2, h3, h4, h5, h6 {
	    font-weight: bold;
	}
	
	h1 {
	    color: #000000;
	    font-size: 28px;
	}
	
	h2 {
	    border-bottom: 2px solid #CCCCCC;
	    color: #000000;
	    font-size: 24px;
	}
	
	h3 {
	    border-bottom: 2px solid #CCCCCC;
	    font-size: 18px;
	}
	
	h4 {
	    font-size: 16px;
	}
	
	h5 {
	    font-size: 14px;
	}
	
	h6 {
	    color: #777777;
	    background-color: inherit;
	    font-size: 14px;
	}
	
	hr {
	    height: 0.2em;
	    border: 0;
	    color: #CCCCCC;
	    background-color: #CCCCCC;
	}
	
	p, blockquote, ul, ol, dl, li, table, pre {
	    margin: 15px 0;
	}
	
	p{
	    margin:1em 0;
	}
	
	pre { 
	    background-color: #F8F8F8;    
	    border: 1px solid #CCCCCC;
	    border-radius: 3px;
	    overflow: auto;
	    padding: 5px;
	}
	
	pre code {
	    background-color: #F8F8F8;
	    border: none;    
	    padding: 0;
	}
	
	code {
	    font-family: Consolas, Monaco, Andale Mono, monospace;
	    background-color:#F8F8F8;
	    border: 1px solid #CCCCCC;
	    border-radius: 3px;
	    padding: 0 0.2em;
	    line-height: 1;
	}
	
	pre > code {
	    border: 0;
	    margin: 0;
	    padding: 0;
	}
	
	
	a{ color: #0645ad; text-decoration:none;}
	a:visited{ color: #0b0080; }
	a:hover{ color: #06e; }
	a:active{ color:#faa700; }
	a:focus{ outline: thin dotted; }
	a:hover, a:active{ outline: 0; }
	
	::-moz-selection{background:rgba(255,255,0,0.3);color:#000}
	::selection{background:rgba(255,255,0,0.3);color:#000}
	
	a::-moz-selection{background:rgba(255,255,0,0.3);color:#0645ad}
	a::selection{background:rgba(255,255,0,0.3);color:#0645ad}
	
	blockquote{
	    color:#666666;
	    margin:0;
	    padding-left: 3em;
	    border-left: 0.5em #EEE solid;
	}
	
	ul, ol { margin: 1em 0; padding: 0 0 0 2em; }
	li p:last-child { margin:0 }
	dd { margin: 0 0 0 2em; }
	
	img { border: 0; -ms-interpolation-mode: bicubic; vertical-align: middle; max-width:100%;}
	
	table { border-collapse: collapse; border-spacing: 0; }
	td { vertical-align: top; }
	
	@media only screen and (min-width: 480px) {
	    body{font-size:14px;}
	}
	
	@media only screen and (min-width: 768px) {
	    body{font-size:16px;}
	}
</style>