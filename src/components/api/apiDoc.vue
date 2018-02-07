<template>
	<div class="w-apidoc">
		<h2>{{msg.title}}</h2>
		<p>项目：{{msg.project_name}}</p>
		<p>模块：{{msg.module_name}}</p>
		<p>状态：{{msg.status == 'ALLOW'?'启用':'禁用'}}</p>
		<p>请求协议：{{msg.tcp}}</p>
		<p>URL：{{msg.url}}</p>
		<p>请求方式：{{msg.method}}</p>
		<p>请求头部：
			<el-table
		    :data="header"
		    border
		    style="width: 100%;margin-top: 20px;">
			    <el-table-column
			      prop="header"
			      label="头部"
			      width="300">
			    </el-table-column>
			    <el-table-column
			      prop="headerinfo"
			      label="头部信息"
			      >
			    </el-table-column>
		  </el-table>
		</p>
		<p>请求参数：
			<el-table
		    :data="requestInfo"
		    v-if="request.type == 0"
		    border
		    style="width: 100%;margin-top: 20px;">
			    <el-table-column			     
			      label="必选"
			      width="80">
			     <template scope="scope">
			     	<span>{{scope.row.checkstatus == true ? '是':'否'}}</span>
			     </template>
			    </el-table-column>
			    <el-table-column
			      prop="requestName"
			      label="参数名"
			      min-width="200">
			    </el-table-column>
			    <el-table-column
			      prop="requestDemo"
			      label="示例"
			      min-width="200">
			    </el-table-column>
			    <el-table-column
			      prop="paramType"
			      label="参数类型"
			      min-width="200">
			    </el-table-column>
			    <el-table-column
			      prop="paramInfo"
			      label="参数说明"
			      min-width="200">
			    </el-table-column>
		  </el-table>
		  <p v-if="request.type == 1">
		  	{{request.requestParmas}}
		  </p>
		</p>
		<p>响应参数：
			<el-table
		    :data="responseParamsInfo"
		    v-if="responseParams.type == 0"
		    border
		    style="width: 100%;margin-top: 20px;">
			    <el-table-column			     
			      label="必选"
			      width="80">
			     <template scope="scope">
			     	<span>{{scope.row.resCheckStatus == true ? '是':'否'}}</span>
			     </template>
			    </el-table-column>
			    <el-table-column
			      prop="responseName"
			      label="参数名"
			      min-width="200">
			    </el-table-column>
			    <el-table-column
			      prop="responseDemo"
			      label="示例"
			      min-width="200">
			    </el-table-column>
			    <el-table-column
			      prop="resParamType"
			      label="参数类型"
			      min-width="200">
			    </el-table-column>
			    <el-table-column
			      prop="responseParamInfo"
			      label="参数说明"
			      min-width="200">
			    </el-table-column>
		  </el-table>
		  <p v-if="responseParams.type == 1">
		  	{{responseParams.responseP}}
		  </p>
		</p>
		<p class="responseTab">
			<el-tabs v-model="activeName" >
			    <el-tab-pane label="响应结果1" name="first"><tree-view :data="responseInfo.restextarea0" ></tree-view></el-tab-pane>
			    <el-tab-pane label="响应结果2" name="second"><tree-view :data="responseInfo.restextarea1" ></tree-view></el-tab-pane>
			    <el-tab-pane label="响应结果3" name="third"><tree-view :data="responseInfo.restextarea2" ></tree-view></el-tab-pane>
			</el-tabs>
		</p>
			
	</div>
</template>

<script>

	export default{
		name:'apiDoc',
		data(){
			return{
				msg:'',
				activeName: 'first',
				header:[],//请求头部
				//请求参数信息
				request:{
					type:0,
					requestParmas:''
				},
				requestInfo:[],//请求参数列表
				//响应参数列表总信息
				responseParams:{
					type:0,
					responseP:''
				},
				responseParamsInfo:[],//响应参数列表
				responseInfo:{},//响应结果
				info1:{},
				resShow:true

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
					url:that.$api.api.get,
					data:{
						id:that.$route.query.id
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.msg = data.data;	
							that.header = that.msg.head != ''?JSON.parse(that.msg.head):[]; 	
							//请求参数
							if(that.msg.request != null){
								that.request = that.msg.request != ''?JSON.parse(that.msg.request):{};
								that.requestInfo = that.request.requestParmas 								
							}else{
								that.requestInfo = []
								that.request = {
									type:0,
									requestParmas:''
								}
							}
							//响应参数
							if(that.msg.response_params != null){
								that.responseParams = that.msg.response_params != '' ? JSON.parse(that.msg.response_params):{}; 
								that.responseParamsInfo = that.responseParams.responseP; 
							}else{
								that.responseParams = {
									type:0,
									responseP:''
								}
							}
							
							//响应结果 
							if( that.msg.response != ''){
								that.responseInfo = JSON.parse(that.msg.response)
								that.resShow = true;
								that.responseInfo.restextarea0 = JSON.parse(that.responseInfo.restextarea0)
								that.responseInfo.restextarea1 = JSON.parse(that.responseInfo.restextarea1)
								that.responseInfo.restextarea2 = JSON.parse(that.responseInfo.restextarea2)

							}else{
								var info = {restextarea0:1,restextarea1:2,restextarea2:3}
								// that.resShow = false;
								that.responseInfo = info 
								

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
	.w-apidoc{
		width:900px;
		min-height:1000px;
		background:#fff;
		margin: 20px auto 50px;
		box-shadow:0 0 5px 5px #ccc;
		padding:30px 50px;
		font-family: "microsoft yahei";
	}
	.w-apidoc h2{
		font-size:50px;
		text-align: center;
	}
	.w-apidoc h2 span{
		font-size:20px;
		color:#3c3c3c;
		font-weight: 100;
		margin-left:20px;
	}
	.w-apidoc p{
		margin: 50px 0 20px 50px;
		font-size:18px;
	}
	.w-apidoc .responseTab span{
		display: inline-block;
		min-height: 100px;
	}
</style>