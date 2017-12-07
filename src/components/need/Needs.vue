<template>
	<div class="w-needs">
		<div  class="anchu-inner-head">
			<h2 class="anchu-head-title">
				需求管理
				<router-link to="/addneed" v-if="badd">
					<button class="addUser">+ 添加需求</button>			
				</router-link>
			</h2>
			<p style="margin-top:20px;" class="anchu-search-wrap">
				<span class="anchu-search-condition">
			  		<span class="anchu-search-name">ID</span>
			  		<el-input v-model="needs_id" placeholder="请输入ID" style="width:220px;padding-right: 12px;"></el-input>					
				</span><br>
				<span class="anchu-search-condition">
					<span class="anchu-search-name">项目</span>
					<el-cascader
				    placeholder="请选择项目"
				    :options="options"
				    filterable
				    style="width:220px;padding-right: 12px;"
				    v-model="selectProject"
				    @change="findprojectchange"
				  ></el-cascader>					
				</span>
				<span class="anchu-search-condition">
			  		<span class="anchu-search-name">标题</span>
			  		<el-input v-model="f_title" placeholder="请输入标题" style="width:220px;padding-right: 12px;"></el-input>					
				</span>
				<span class="anchu-search-condition">
			  		<span class="anchu-search-name">状态</span>
					  <el-select v-model="findStatus" placeholder="请选择状态" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in statusArr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>					
				</span>
				<br>
				<span class="anchu-search-condition">
					<span class="anchu-search-name">负责人</span>
					<el-select v-model="response_user_id" placeholder="请选择负责人" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</span>
				<span class="anchu-search-condition">
					<span class="anchu-search-name">提出人</span>
					<el-select v-model="owner_id" placeholder="请选择提出人" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</span>

			   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
			  <el-button type="primary" icon="search" @click="getList('1')">搜索</el-button>
			</p>
		</div>
		<span class="page-info">需求总数：{{count}}</span>
		<div class="anchu-inner-content">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="70">
			    </el-table-column>
			    <el-table-column
			      prop="project_name"
			      label="项目名称"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="标题"
			      >
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      prop="status_name"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="submit_user"
			      label="提出人"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="response_user_name"
			      label="负责人"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      label="创建日期"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="expect_online_at"
			      label="期望上线日期"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200"
			      >
			      <template scope="scope">
			      	<el-button type="text" size="small" v-if="scope.row.status=='WAIT'" @click="handleNeedsTip(scope.row)">处理</el-button>
			      	<el-button type="text" size="small" v-if="scope.row.status=='WAIT'" @click="refuseNeedsTip(scope.row)">拒绝</el-button>
			      	<el-button type="text" size="small" v-if="scope.row.is_task == 1 && scope.row.status=='HANDLE'" @click="confirmNeedsTip(scope.row)">确认</el-button>
			      	<router-link :to="{path:'/createNeedTask',query:{id:scope.row.id,pageIndex:pageIndex}}" v-if="scope.row.status=='HANDLE'">
				        <el-button type="text" size="small">创建任务</el-button>
			      	</router-link>
			      	<el-button type="text" size="small" v-if="(scope.row.status=='WAIT' || scope.row.status=='HANDLE')&&bdel" @click="finishNeedsTip(scope.row)">删除</el-button>
			      	<router-link :to="{path:'/editneed',query:{id:scope.row.id,pageIndex:pageIndex}}" v-if="bedit" >
				        <el-button type="text" size="small">编辑</el-button>
			      	</router-link>
			        <!-- <el-button type="text" size="small" @click="closeItem(scope.$index,scope.row)"  v-if="bdel">删除</el-button> -->
			        <router-link :to="{path:'/needDoc',query:{id:scope.row.id}}" target="_blank" v-if="bread">
				        <el-button type="text" size="small">查看</el-button>			       
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			  <p v-if="tableData.length"  class="anchu-page">
			  	
			  	<el-button  icon="arrow-left" @click="prePage"  style="margin-right:10px;">上一页</el-button> {{pageIndex}} / {{allCount}} <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
		</div>
		<!--处理需求弹窗-->
		<el-dialog
		  title="提示"
		  :visible.sync="hTip"
		  size="tiny">
		  <span>是否处理此条需求？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="hTip = false">取 消</el-button>
		    <el-button type="primary" @click="handleNeeds">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 拒绝需求弹窗 -->
		<el-dialog
		  title="请填写拒绝原因"
		  :visible.sync="rTip"
		  size="tiny">
		  <div class="refuse-info">
			  <p>原因</p>
			  <textarea class="content" v-model="refuseReason" placeholder="请填写原因"></textarea>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="rTip = false">取 消</el-button>
		    <el-button type="primary" @click="refuseNeeds">确 定</el-button>
		  </span>
		</el-dialog>
		<!--确认需求弹窗-->
		<el-dialog
		  title="提示"
		  :visible.sync="cTip"
		  size="tiny">
		  <span>是否确认此条需求？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="cTip = false">取 消</el-button>
		    <el-button type="primary" @click="confrimNeeds">确 定</el-button>
		  </span>
		</el-dialog>
		<!--删除弹窗-->
		<el-dialog
		  title="提示"
		  v-model="bTip"
		  size="tiny">
		  <span>确认要删除此条需求吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="bTip = false">取 消</el-button>
		    <el-button type="primary" @click="finishNeeds">确 定</el-button>
		  </span>
		</el-dialog>

	</div>
</template>

<script>
export default({
	name:'Needs',
	data(){
		return{
			tableData:[],			//列表数据
			pageIndex:1,			//页面下标
			count:'',				//总条数
			allCount:'',			//总页数
			options:[],				//项目下拉框数据
			needs_id: '',			//需求id--搜索条件
			owner_id:'',			//提出人id--搜素条件
			response_user_id: '',	//负责人ID--搜索条件
			ownerarr:[],			//提出者列表
			
			selectProject:[],
			findprojectinfo:'',
			f_title:'',				//搜索 - 标题
			findStatus:'',			//搜索 - 状态
			statusArr:[{value:'WAIT',label:'等待中'},{value:'HANDLE',label:'处理中'},{value:'CONFIRMED',label:'开发中'},{value:'FINISHED',label:'已完成'},{value:'TESTED',label:'测试通过'},{value:'ONLINE',label:'已上线'},{value:'CLOSED',label:'已关闭'},{value:'REFUSED',label:'已拒绝'},{value:'DELETED',label:'已删除'}],			//状态 - 列表
			
			cTip:false,			//确认二次弹窗
			rTip:false,			//拒绝二次弹窗
			fTip:false,			//完成二次确认弹窗
			bTip:false,			//删除二次确认弹窗
			hTip:false,			//处理二次确认弹窗
			id:'',				//完成||删除时需要的列表id
			
			badd:false,				//添加
			bedit:false,			//编辑
			bfinish:false,			//完成
			bdel:false,				//删除
			bread:false,			//查看
			bconfirm:false,			//确认
			brefuse:false,			//拒绝

			refuseReason:'',		//拒绝原因
			status: '',				//需求状态
			a:2,

		}
	},
	mounted(){
		let _this = this;
		this.pageIndex = this.$store.state.pageIndex;
		this.$store.dispatch("getPer","need").then((res)=>{
			_this.$store.state.perList.includes("need.add")?this.badd=true:'';
			_this.$store.state.perList.includes("need.edit")?this.bedit=true:'';		
			_this.$store.state.perList.includes("need.finish")?this.bfinish=true:'';
			_this.$store.state.perList.includes("need.read")?this.bread=true:'';
			_this.$store.state.perList.includes("need.del")?this.bdel=true:'';	
			_this.$store.state.perList.includes("need.confirm")?this.bconfirm=true:'';
			_this.$store.state.perList.includes("need.refuse")?this.brefuse=true:'';
			_this.getList(this.pageIndex);
			
		});
		this.getProject();
		this.getUser();
	},
	methods:{
		//更改需求状态
		changeNeedStatus(status,id,log){
			let that = this;
			$.ajax({
				type:"post",
				url:that.$api.need.change_status,
				dataType:'json',
				data:{
					status:status,
					id:that.id,
					log:log,
				},
				success:(res)=>{
					if(res.error == 0){
						that.getList(that.pageIndex);
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		},
		//处理确认弹窗
		handleNeedsTip(row){
			this.id = row.id;
			this.refuseReason = '';
			this.status = 'HANDLE';
			this.hTip = true;
		},
		//确认处理
		handleNeeds(){
			this.refuseReason = '';
			this.changeNeedStatus(this.status,this.id,this.refuseReason);
			this.hTip = false;
		},
		//拒绝弹窗
		refuseNeedsTip(row){
			this.id = row.id;
			this.status = 'REFUSED';
			this.rTip = true;

		},
		//确认拒绝
		refuseNeeds(){
			this.changeNeedStatus(this.status,this.id,this.refuseReason);
			this.rTip = false;
		},
		//显示确认需求弹窗
		confirmNeedsTip(row){
			this.id = row.id;
			this.status = 'CONFIRMED';
			this.cTip = true;
		},
		//确认需求
		confrimNeeds(){
			this.refuseReason = '';
			this.changeNeedStatus(this.status,this.id,this.refuseReason);
			this.cTip = false;
		},
		//显示删除弹窗
		finishNeedsTip(row){
			this.id = row.id;
			this.status = 'DELETED';
			this.bTip = true;
		},
		finishNeeds(){
			this.refuseReason = '';
			this.changeNeedStatus(this.status,this.id,this.refuseReason);
			this.bTip = false;
		},
		//获取提出者列表
		getUser(){
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.get_user_list,
				dataType:'json',
				success:function(res){
					let data = res
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					if(data.error == 0){	
						that.ownerarr = that.ownerarr.concat(data.data.user_arr);
					}
				}
			});
		},
		//获取项目列表
		getProject(){
			let that = this;
			$.ajax({
				type:"get",
				url:that.$api.get_project_list,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						return;
					}
					that.options = data.data.project_arr;
				}
			});
		},
		//下一页
		nextPage(){
			if(this.pageIndex==this.allCount){
				this.$message.error("没有下一页")
				return
			}
			this.pageIndex++;
			this.getList(this.pageIndex);
		},
		//上一页
		prePage(){
			if(this.pageIndex == 1){
				this.$message.error("没有上一页")
				return
			}
			this.pageIndex--;
			this.getList(this.pageIndex)
		},
		//获取需求列表
		getList(x){
			let that = this;
			$.ajax({
				type:"get",
				data:{
					page:x||1,
					project_id:that.findprojectinfo,
					title:that.f_title,
					status:that.findStatus,
					id: that.needs_id,
					submit_user_id: that.owner_id,
					response_user_id: that.response_user_id
				},
				url:that.$api.need.getlist,
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_msg)
						that.tableData = [];
						return;
					}
					that.count = data.data.count;
					that.tableData = data.data.requirement_arr;
					that.pageIndex = x || 1;
					that.allCount = Math.ceil(data.data.count/10);
				}
			});
		},
		//获取checkbox的值
		findprojectchange(value){
			this.findprojectinfo = value[0];			
		},
		//清空搜索框
		clearSearch(){
			this.selectProject = [];
			this.f_title = '';
			this.findStatus = '';
			this.findprojectinfo = '';
			this.needs_id = '';
			this.owner_id = '';
			this.response_user_id = '';
		}
	},
	destroyed(){
		this.$store.state.pageIndex = 1;
	}
})
</script>

<style>
	.w-needs{
		float:left;
		width:85%;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.w-needs .tables{
		width:100%;
		margin-top:20px;
		border-top:1px solid #ddd;
		padding-top:20px;
	}
	.w-needs .tables p{
		margin-top:50px;
		text-align: center;
		font-size:14px;
	}
	.w-needs .content,.w-needs .updateContent{
		width:75%;
		float:right;
		height:160px;
		border:1px solid #DDDDDD;
		resize:none;
	}
	.w-needs .refuse-info p{
		margin:0 0 10px 0;
		font-size:14px;
		color:#333;
	}
	.w-needs .refuse-info textarea{
		width:100%;
		height:160px;
		border:1px solid #DDD;
		resize:none;
		border-radius:5px;
		overflow-x: hidden;
		margin-bottom: 20px;
	}

</style>