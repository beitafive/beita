<template>
	<div class="addApi">
		<div  class="api-select">
			<p class="api-select-head">
				<span>选择项目
				  <el-cascader
				    placeholder="请选择项目"
				    :options="projectarr"
				    filterable
				    style="width:170px;line-height: 1;margin: 0 20px;"
				    v-model="addproject"
				    @change="addprojectchange"
				  ></el-cascader></span>
			  	<span>选择模块
				  <el-cascader
				    placeholder="请选择模块"
				    :options="addmodulearr"
				    filterable
				    style="width:170px;line-height: 1;margin: 0 20px;"
				    v-model="addmodule"
				    @change="addmodulechange"
				  ></el-cascader></span>
			</p>
			<p class="api-select-head">
				<span>状态
					 <el-select v-model="addStatus" placeholder="请选择"  style="width:170px;line-height: 1;margin: 0 20px;">
					    <el-option
					      v-for="item in statusArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					</el-select>
				</span>
				<span>请求协议
					 <el-select v-model="addArgument" placeholder="请选择请求协议"  style="width:170px;line-height: 1;margin: 0 20px;">
					    <el-option
					      v-for="item in argumentArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					</el-select>
				</span>
				<span>请求方式
					 <el-select v-model="addmethodinfo" placeholder="请选择请求方式"  style="width:170px;line-height: 1;margin: 0 20px;">
					    <el-option
					      v-for="item in methodarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					</el-select>
				</span>
			</p>
			<p class="api-select-url">
				URL <el-input type="text" v-model="addurl" placeholder="输入接口URL" style="width: 34%;margin:0 20px;"></el-input>
			</p>
			<p class="api-select-name">
				名称 <el-input type="text" v-model="addtitle" placeholder="输入接口名称" style="width: 34%;margin:0 20px;"></el-input>
			</p>
		</div>
		<div class="api-request">
			<h3>请求头部</h3>
			<p>
				<el-input type="text" placeholder="请求头部" style="width: 420px;margin-right: 5px;" v-model="addHead"></el-input>
				<el-input type="text" placeholder="头部描述" style="width: 420px;margin-right: 10px;" v-model="addHeaderInfo"></el-input>
				<span @click="addHeader(addHead,addHeaderInfo)" style="cursor: pointer;color:#4990E2;">新增</span>
			</p>
			<p v-for="(item,index) in headerArr" key="index"  class="header-list">
				<ul>
					<li v-text="item.header"></li>
					<li v-text="item.headerinfo"></li>
					<li style="cursor: pointer;color: #FA5555;" @click="delHeader(index)">删除</li>
				</ul>
				<span ></span>
			</p>		
		</div>

		<div class="api-request">
			<h3>请求参数</h3>
			<ul class="api-request-tab" >
				<li :class="{select:index == requestNow}" v-for="(item,index) in requestTab" key="index" @click="selectTab(index)">{{item.name}}</li>
			</ul>
			<p  v-if="requestNow == 0">
				<input type="checkbox" class="api-request-checkbox"  v-model="checkboxStatus" style="cursor: pointer;">
				<el-input type="text" placeholder="参数名" style="width: 22%;margin-right: 5px;" v-model="requestName"></el-input>
				<el-input type="text" placeholder="示例" style="width: 22%;margin-right: 5px;" v-model="requestDemo"></el-input>
				 <el-select v-model="paramType" placeholder="参数类型"  style="width:170px;line-height: 1;margin-right: 5px;">
					    <el-option
					      v-for="item in paramArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					</el-select>
				<el-input type="text" placeholder="参数说明" style="width: 22%;margin-right: 10px;" v-model="paramInfo"></el-input>
				<span style="cursor: pointer;color:#4990E2;" @click="addRequest(requestName,requestDemo,paramType,paramInfo)">新增</span>
			</p>
			<p  v-if="requestNow == 0" v-for="(item,index) in requestArr" key="index"  class="header-list">
				<input type="checkbox" class="api-request-checkbox" v-model="item.checkstatus" style="cursor: pointer;">
				<el-input type="text" placeholder="参数名" style="width: 22%;margin-right: 5px;" v-model="item.requestName"></el-input>
				<el-input type="text" placeholder="示例" style="width: 22%;margin-right: 5px;" v-model="item.requestDemo"></el-input>
				<el-select v-model="item.paramType" placeholder="参数类型"  style="width:170px;line-height: 1;margin-right: 5px;">
				    <el-option
				      v-for="item in paramArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value"
				      :disabled="item.disabled">
				    </el-option>
				</el-select>
				<el-input type="text" placeholder="参数说明" style="width: 22%;margin-right: 10px;" v-model="item.paramInfo"></el-input>
				<span style="cursor: pointer;color: #FA5555;" @click="delRequest(index)">删除</span>
			</p>
			<el-input
			  type="textarea"
			  :autosize="{ minRows: 8}"
			  style="width:676px;margin-bottom: 20px;min-height: 200px;"
			  placeholder="请输入内容"
			  v-if="requestNow == 1"
			  v-model="reqTextarea">
			</el-input>
		</div>

		<div class="api-request">
			<h3>响应参数</h3>
			<ul class="api-request-tab" >
				<li :class="{select:index == responseParamsNow}" v-for="(item,index) in responseTabArr" key="index" @click="resTab(index)">{{item.name}}</li>
			</ul>

			<p  v-if="responseParamsNow == 0">
				<input type="checkbox" class="api-request-checkbox"  v-model="resCheckboxStatus" style="cursor: pointer;">
				<el-input type="text" placeholder="参数名" style="width: 22%;margin-right: 5px;" v-model="responseName"></el-input>
				<el-input type="text" placeholder="示例" style="width: 22%;margin-right: 5px;" v-model="responseDemo"></el-input>
				 <el-select v-model="resParamType" placeholder="参数类型"  style="width:170px;line-height: 1;margin-right: 5px;">
					    <el-option
					      v-for="item in responseTypeArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					</el-select>
				<el-input type="text" placeholder="参数说明" style="width: 22%;margin-right: 10px;" v-model="responseParamInfo"></el-input>
				<span style="cursor: pointer;color:#4990E2;" @click="addResponseArr(responseName,responseDemo,resParamType,responseParamInfo)">新增</span>
			</p>

			<p  v-if="responseParamsNow == 0" v-for="(item,index) in responseArr" key="index"  class="header-list">
				<input type="checkbox" class="api-request-checkbox" v-model="item.resCheckStatus" style="cursor: pointer;">
				<el-input type="text" placeholder="参数名" style="width: 22%;margin-right: 5px;" v-model="item.responseName"></el-input>
				<el-input type="text" placeholder="示例" style="width: 22%;margin-right: 5px;" v-model="item.responseDemo"></el-input>
				<el-select v-model="item.resParamType" placeholder="参数类型"  style="width:170px;line-height: 1;margin-right: 5px;">
				    <el-option
				      v-for="item in responseTypeArr"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value"
				      :disabled="item.disabled">
				    </el-option>
				</el-select>
				<el-input type="text" placeholder="参数说明" style="width: 22%;margin-right: 10px;" v-model="item.responseParamInfo"></el-input>
				<span style="cursor: pointer;color: #FA5555;" @click="delResponse(index)">删除</span>
			</p>
			<el-input
			  type="textarea"
			  :autosize="{ minRows: 8}"
			  style="width:676px;margin-bottom: 20px;min-height: 200px;"
			  placeholder="请输入内容"
			  v-if="responseParamsNow == 1"
			  v-model="resTextarea">
			</el-input>
		</div>

		<div class="api-request">
			<h3>响应结果</h3>
			<ul class="api-request-tab" >
				<li :class="{select:index == responseNow}" v-for="(item,index) in responseTab" key="index" @click="selectResponseTab(index)">{{item.name}}</li>
			</ul>
			<el-input
			  type="textarea"
			  :autosize="{ minRows: 8}"
			  style="width:676px;margin-bottom: 20px;"
			  placeholder="请输入内容"
			  v-if="responseNow == 0"
			  v-model="response.restextarea0">
			</el-input>
			<el-input
			  type="textarea"
			  :autosize="{ minRows: 8}"
			  style="width:676px;margin-bottom: 20px;"
			  placeholder="请输入内容"
			  v-if="responseNow == 1"
			  v-model="response.restextarea1">
			</el-input>
			<el-input
			  type="textarea"
			  :autosize="{ minRows: 8}"
			  style="width:676px;margin-bottom: 20px;"
			  placeholder="请输入内容"
			  v-if="responseNow == 2"
			  v-model="response.restextarea2">
			</el-input>
		</div>
		<p style="text-align: center;">
			<el-button type="primary" @click="addNewApi" style="width:100px;margin:0 20px 0 100px"> 保 存 </el-button>
			<router-link to="/oaApi"><el-button type="info" style="width:100px"> 取 消 </el-button></router-link>
		</p>
	</div>
</template>

<script>
	export default{
		name:'addApi',
		data(){
			return{
				//项目列表
				projectarr:[],
				//添加-项目
				addproject:[],
				addprojectinfo:'',
				//添加-模块
				addmodulearr:[],
				addmodule:[],
				addmoduleinfo:'',
				//添加-请求方式
				addmethod:'',
				addmethodinfo:'GET',
				addtitle:'',//添加-标题
				addurl:'',//添加-url
				addrequest:'',//添加-request
				addresponse:'',//添加-response
			

				methodarr:[{value:'POST',label:'POST'},{value:'GET',label:'GET'},{value:'PUT',label:'PUT'},{value:'DELETE',label:'DELETE'},{value:'HEAD',label:'HEAD'}],//请求方式列表
				addStatus:'ALLOW',//请求状态
				statusArr:[{value:'ALLOW',label:'启用'},{value:'FORBID',label:'禁用'}], //请求状态列表
				addArgument:'HTTP',//请求协议
				argumentArr:[{value:'HTTP',label:'HTTP'},{value:'HTTPS',label:'HTTPS'}],//请求协议列表
				addHead:'',//新增请求头部
				addHeaderInfo:'',//新增请求头部描述
				headerArr:[],//请求头部列表
				//响应参数
				responseParamsNow:0,//响应参数tab
				responseParams:{
					type:0,
					responseP:''
				},
				resTextarea:'',//响应参数源数据
				responseArr:[],//响应参数列表
				responseName:'',//响应-参数名
				responseDemo:'',//响应-示例
				resCheckstatus:true,//响应-是否必选-输入
				resCheckboxStatus:false,//响应-是否必选-列表
				responseParamInfo:'',//响应-参数说明
				resParamType:"字符串",//响应-参数类型-列表
				responseTypeArr:[{value:'字符串',label:'字符串'},{value:'数字',label:'数字'}],//响应-参数类型
				responseTabArr:[{"name":"表单[form-data]"},{"name":"源数据[raw]"}],//响应参数tab
				//请求参数
				requestNow:0, //当前请求参数tab
				request:{
					type:0,
					requestParmas:''
				},
				reqTextarea:'',//请求参数源数据
				requestTab:[{"name":"表单[form-data]"},{"name":"源数据[raw]"}],//请求参数tab
				requestArr:[],//请求参数列表
				requestName:'',//请求-参数名称
				requestDemo:'',//请求-示例
				paramInfo:'',//请求-参数说明
				checkstatus: true,//请求-必选参数-输入
				checkboxStatus:false,//请求-必选参数-列表
				paramType:"字符串",//请求-请求类型
				paramArr:[{value:'字符串',label:'字符串'},{value:'数字',label:'数字'}],//请求-参数类型

				responseNow:0,//响应结果
				responseTab:[{"name":"响应结果1"},{"name":"响应结果2"},{"name":"响应结果3"}],//响应结果tab
				response:{
					restextarea0:'',//响应结果0
					restextarea1:'',//响应结果1
					restextarea2:'',//响应结果2
				},

			}
		},
		mounted(){
			this.getProject();
		},
		methods:{
			//获取项目列表
			getProject(x){
				let that = this;
				$.ajax({
					type:"get",
					data:{
						page:x||1
					},
					dataType:'json',
					url:that.$api.get_project_list,
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_msg)
							return;
						}
						that.projectarr = data.data.project_arr;
					}
				});
			},
			//添加，项目拉下事件
			addprojectchange(value){
				this.addprojectinfo = value[0];
				this.addmodule = [];
				this.addmodulearr = [];
				let that = this;
				$.ajax({
					type:"get",
					url:that.$api.get_module_list,
					data:{
						project_id:value[0]
					},
					dataType:'json',
					success:function(res){
						let data = res;
						if(data.error == 0){
							that.addmodulearr = data.data.module_arr;
						}
						if(data.error == 1){
							that.$message(data.error_msg)
						}
					}
				});
			},
			//添加，模块下拉事件
			addmodulechange(value){
				this.addmoduleinfo = value[0];
			},
			//添加请求头部信息
			addHeader(header,headerinfo){
				if(header == ''){
					this.$message("请输入请求头部");
					return false;
				}
				if(headerinfo == ''){
					this.$message("请输入头部描述");
					return false;
				}
				let head ={
					'header':header,
					'headerinfo':headerinfo
				}
				
				this.headerArr.push(head);
				this.addHead = '';
				this.addHeaderInfo = '';
				
			},
			//删除请求头部信息
			delHeader(index){
				this.headerArr.splice(index,1);
				
			},
			//请求参数头部tab
			selectTab(index){
				this.requestNow = index;
				if(index == 0){
					// this.reqTextarea = '';
					this.request.type = 0;
					this.request.requestParmas = this.requestArr;
				}
				if(index == 1){
					// this.requestArr = [];
					this.request.type = 1;
					this.request.requestParmas = this.reqTextarea;
				}
				
			},
			//响应参数tab
			resTab(index){
				this.responseParamsNow = index;
				if(index == 0){				
					this.responseParams.type = 0;
					this.responseParams.responseP = this.responseArr;
				}
				if(index == 1){
					this.responseParams.type = 1;
					this.responseParams.responseP = this.resTextarea;
				}
				
			},
			//添加请求参数
			addRequest(requestName,requestDemo,paramType,paramInfo){
				if(requestName == '' || requestDemo=='' || paramType == ''|| paramInfo=='' ){
					this.$message("参数信息不完整");
					return false;
				}
				let head ={
					'checkstatus':this.checkboxStatus,
					'requestName':requestName,
					'requestDemo':requestDemo,
					'paramType':paramType,
					'paramInfo':paramInfo,
				}
				this.requestArr.push(head);
				this.checkboxStatus = false;
				this.requestName = '';
				this.requestDemo = '';
				this.paramType = '字符串';
				this.paramInfo = '';
			},
			//添加响应参数
			addResponseArr(responseName,responseDemo,resParamType,responseParamInfo){
				if(responseName == '' || responseDemo == '' || resParamType == '' || responseParamInfo == ''){
					this.$message("参数信息不完整");
					return false;
				}
				let resArr ={
					'resCheckStatus':this.resCheckboxStatus,
					'responseName':responseName,
					'responseDemo':responseDemo,
					'resParamType':resParamType,
					'responseParamInfo':responseParamInfo,
				}
				this.responseArr.push(resArr);
				this.resCheckboxStatus = false;
				this.responseName = '';
				this.responseDemo = '';
				this.resParamType = '字符串';
				this.responseParamInfo = '';
			},
			//删除请求参数
			delRequest(index){
				this.requestArr.splice(index,1);
			},
			//删除响应参数
			delResponse(index){
				this.responseArr.splice(index,1);
			},
			//响应结果tab
			selectResponseTab(index){
				this.responseNow = index;
			},
			//添加页面
			addNewApi(){
				let that = this;
				if(that.request.type == 0){
					that.request.requestParmas = that.requestArr;
				}else{
					that.request.requestParmas = that.reqTextarea;
				}
				if(that.responseParams.type == 0){
					that.responseParams.responseP = that.responseArr;
				}else{
					that.responseParams.responseP = that.resTextarea;
				}
				
				$.ajax({
					type:"post",
					data:{
						project_id:that.addprojectinfo,
						module_id:that.addmoduleinfo,
						title:that.addtitle,
						url:that.addurl,
						method:that.addmethodinfo,
						head:that.headerArr,
						request:JSON.stringify(that.request),
						response_params: JSON.stringify(that.responseParams),
						response:that.response,
						status:that.addStatus,
						tcp:that.addArgument
					},
					dataType:'json',
					url:that.$api.api.add,
					success:function(res){
						let data = res
						if(data.error==1){
							that.$message(data.error_msg);
							return;
						}
						if(data.error==0){
							that.dialogVisible = false;
							that.addtitle = "";
							that.addurl = '';
							that.addrequest = '';
							that.addresponse = '';
							that.addmodule = [];
							that.addmoduleinfo = '';
							that.addproject = [];
							that.addprojectinfo = '';
							that.addmethod = [];
							that.addmethodinfo = '';
							that.$message("添加成功");
							that.$router.push('/oaApi');
						}
					}
				});
			},
		}
	}
</script>
<style>
	.addApi{
		float:left;
		width:85%;
		background:#fff;
		color: #494949;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.addApi .api-select{
		font-size: 14px;

	}
	.addApi .api-select .api-select-head{
		margin:0;
		padding:10px 20px;
		background: #EEEFF6;

	}
	.addApi .api-select-url{
		margin:0;
		padding: 16px 16px 0 16px;
		border-left: 1px solid #EEEFF6; 
		border-right: 1px solid #EEEFF6; 
	}
	.addApi .api-select-name{
		margin:0;
		padding: 16px 16px 16px 16px;
		border-left: 1px solid #EEEFF6; 
		border-right: 1px solid #EEEFF6; 
		border-bottom: 1px solid #EEEFF6; 
		border-radius: 0 0 4px 4px;
	}
	.addApi .api-request{
		margin-top: 20px;
		padding: 0 20px;
		border: 1px solid #EEEFF6;
	}
	.addApi .api-request h3{
		font-weight: normal;
		font-size: 18px;
		color: #494949;
	}
	.addApi .api-request ul{
		padding: 0;
		display: table;
	}
	.addApi .api-request .header-list li{
		display: inline-block;
		min-height: 36px;
		line-height: 36px;
		padding: 0 10px;
	}
	.addApi .api-request .header-list li:nth-of-type(1){
		width: 400px;
		/*height: 36px;*/
		margin-right: 10px;
		border: 1px solid #bfcbd9;
		border-radius: 4px;
	}
	.addApi .api-request .header-list li:nth-of-type(2){
		width: 400px;
		/*height: 36px;*/
		border: 1px solid #bfcbd9;
		border-radius: 4px;
	}
	.addApi .api-request .api-request-checkbox{
		width: 16px;
		height: 16px;
	}
	.addApi .api-request .api-request-tab{
		padding:0;
		/*width: 260px;*/
		display: table;
		border: 1px solid #6F7E95;
		border-radius:4px;
		color: #6F7E95;
		box-sizing: border-box;
	}
	.addApi .api-request .api-request-tab .select{
		color: #FFFFFF;
		background: #6F7E95;		
	}
	.addApi .api-request .api-request-tab li{
		display: inline-block;
		width: 130px;
		height: 36px;
		line-height: 36px;
		font-size: 14px;
		list-style: none;
		text-align:center;
		
	}
	.addApi .api-request .api-request-tab li:first-child{
		border-radius: 4px 0 0 4px;
	}
	.addApi .api-request .api-request-tab li:last-child{
		border-radius: 0 4px 4px 0;
	}
</style>