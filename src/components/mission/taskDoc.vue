<template>
	<div class="w-taskdoc">
		<h2>{{msg.title}}</h2>
		<div class="doc-time">
			<p><i>创建时间</i> <span> {{msg.created_at}}</span></p>
			<p><i>执行者</i> <span v-if="msg.owner_name"> {{msg.owner_name}}</span></p>
			<p><i>提出者</i> <span v-if="msg.submit_user_name"> {{msg.submit_user_name}}</span></p>	
		</div>
		<div class="doc-content">内容：</div>
		<div v-html="msg.html"  class="markdown"></div>
		<h4 v-if="needinfo != false">需求ID：{{needinfo.id}}</h4>
		<div v-html="needinfo.html"></div>
	</div>
</template>

<script>
	export default{
		name:'taskdoc',
		data(){
			return{
				msg:'',
				needinfo:''
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
/*	html { font-size: 100%; overflow-y: scroll; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }

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
	    border-bottom: 1px solid #CCCCCC;
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
	} */
/*	.markdown {
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