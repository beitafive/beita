<template>
	<div class="w-needdoc">
		<h2>{{msg.title}}</h2>
		<p>ID：{{msg.id}}</p>
		<p>标题：{{msg.title}}</p>
		<p>提出者：{{msg.submit_user}}</p>
		<p>负责人：{{msg.response_user_name}}</p>
		<p>创建日期：{{msg.created_at}}</p>
		<p>状态：{{msg.status_name}}</p>
		<p>期望上线日期：{{msg.expect_online_at}}</p>
		<p>需求日志：</p>
		<p v-html="msg.log"></p>
		<p v-html="'内容：<br>'+msg.html" class="markdown"></p>
	</div>
</template>

<script>
	export default{
		name:'needdoc',
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
					url:that.$api.need.get,
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
							that.$message(data.error_msg);
						}
					}
				});
			}
		}
	}
</script>

<style scoped >
	.w-needdoc{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.w-needdoc h2{
		/*font-size:50px;*/
		text-align: center;
	}
	.w-needdoc h2 span{
		font-size:20px;
		color:#3c3c3c;
		font-weight: 100;
		margin-left:20px;
	}
	.w-needdoc p{
		margin: 50px 0 20px 50px;
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
	/*html { font-size: 100%; overflow-y: scroll; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }

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
	}*/
	/*.markdown {
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
.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6,
.markdown pre,
.markdown code,
.markdown blockquote,
.markdown ol,
.markdown ul,
.markdown li,
.markdown p,
.markdown section,
.markdown header,
.markdown footer {
  float: none;
  margin: 0;
  padding: 0;
}
.markdown h1,
.markdown p,
.markdown ul,
.markdown ol,
.markdown pre,
.markdown blockquote {
  margin-top: 20px;
  margin-bottom: 20px;
}
.markdown h1 {
  position: relative;
  display: inline-block;
  display: table-cell;
  padding: 20px 0 40px;
  margin: 0;
  overflow: hidden;
}
.markdown h1:after {
  content: "====================================================================================================";
  position: absolute;
  bottom: 20px;
  left: 0;
}
.markdown h1 + * {
  margin-top: 0;
}
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
  position: relative;
  margin-bottom: 20px;
}
.markdown h2:before,
.markdown h3:before,
.markdown h4:before,
.markdown h5:before,
.markdown h6:before {
  content: "## ";
  display: inline;
}
.markdown h3:before {
  content: "### ";
}
.markdown h4:before {
  content: "#### ";
}
.markdown h5:before {
  content: "##### ";
}
.markdown h6:before {
  content: "###### ";
}
.markdown li {
  position: relative;
  display: block;
  padding-left: 34px;
  padding-left: 4ch;
}
.markdown li:after {
  position: absolute;
  top: 0;
  left: 0;
}
.markdown ul > li:after {
  content: "*";
}
.markdown ol {
  counter-reset: ol;
}
.markdown ol > li:after {
  content: counter(ol) ".";
  counter-increment: ol;
}
.markdown pre {
  margin-left: 34px;
  padding-left: 4ch;
}
.markdown blockquote {
  position: relative;
  padding-left: 17px;
  padding-left: 2ch;
  overflow: hidden;
}
.markdown blockquote:after {
  content: ">\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>\A>";
  white-space: pre;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  line-height: 20px;
}
.markdown strong:before,
.markdown strong:after {
  content: "__";
  display: inline;
}
.markdown u:before,
.markdown u:after {
  content: "++";
  display: inline;
  text-decoration: underline;
}
.markdown em:before,
.markdown em:after {
  content: "*";
  display: inline;
}
.markdown a {
  text-decoration: none;
}
.markdown a:before {
  content: "[";
  display: inline;
  color: #333333;
}

.markdown a:after {
  content: "](" attr(href) ")";
  display: inline;
  color: #333333;
}
.markdown code {
  font-weight: 100;
  background: #eee;
}
.markdown code:before,
.markdown code:after {
  content: "`";
  display: inline;
}
.markdown pre code:before,
.markdown pre code:after {
  content: none;
}
.markdown hr {
  position: relative;
  height: 20px;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
  border: 0;
  margin-bottom: 20px;
}
.markdown hr:after {
  content: "----------------------------------------------------------------------------------------------------";
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  word-wrap: break-word;
}
@-moz-document url-prefix() {
  .w-content .markdown h1 {
    display: block;
  }
}
.markdown-ones ol > li:after {
  content: "1.";
}*/
</style>