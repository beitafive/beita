<template>
	<div class="w-content">
		<h3>{{msg.project_name}}<span>{{msg.title}}</span></h3>
		<p>创建时间：{{msg.created_at}}</p>
		<p>简介：{{msg.short_desc}}</p>
		<p v-html="'内容：'+msg.html">内容：</p>
		<h4>版本进度</h4>
		<p>任务总数:{{task.task_amount}}</p>
		<p>进度:{{task.progress}}%</p>
		<p>已完成的任务总数:{{task.task_finished_amount}}</p>
		<h4>进度详情</h4>
		<el-table
		    :data="taskList"
		    border
		    style="width: 301px;margin-left:300px;">
		    <el-table-column
		      prop="realname"
		      label="姓名"
		      width="100">
		    </el-table-column>
		    <el-table-column
		      prop="amount"
		      label="任务总数"
		      width="100">
		    </el-table-column>
		    <el-table-column
		      prop="point_amount"
		      label="工时总量 "
		      width="100">
		    </el-table-column>
		  </el-table>
	</div>
</template>

<script>
	export default({
		name:'content',
		data(){
			return{
				id:'',
				msg:'',			//概括
				task:'',		//任务概括
				taskList:[],	//任务列表
			}
		},
		created(){
			this.id = this.$route.query.id;
		},
		mounted(){
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.version.get,
				data:{
					id:that.id
				},
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error == 0){
						that.msg = data.data.task;
						that.task = data.data.stat;
						that.taskList = data.data.stat_rows;
					}
					if(data.error == 1){
						that.$message(data.error_message);
					}
				}
			});
		}
	})
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
	.w-content h3{
		font-size:50px;
		text-align: center;
	}
	.w-content h4{
		font-size:36px;
		text-align: center;
		margin-bottom:20px;
	}
	.w-content h3 span{
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