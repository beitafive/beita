<template>
	<div class="w-needs">
		<h2 style="margin-bottom:20px;">需求管理</h2>
		<router-link to="/addneed">
			<button class="addUser">+ 添加需求</button>			
		</router-link>
		<p style="margin-top:20px;"><el-cascader
		    placeholder="请选择项目"
		    :options="options"
		    filterable
		    style="width:200px;"
		    v-model="selectProject"
		    @change="findprojectchange"
		  ></el-cascader>
		  <el-select v-model="findStatus" placeholder="请选择状态">
		    <el-option
		      v-for="item in statusArr"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
		  <el-input v-model="f_title" placeholder="请输入内容" style="width:200px;"></el-input>
		   <el-button type="primary" icon="circle-cross" @click="clearSearch">清空</el-button>
		  <el-button type="primary" icon="search" @click="getList('1')">搜索</el-button>
		</p>
		<div class="tables">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="ID"
			      width="80">
			    </el-table-column>
			    <el-table-column
			      prop="project_name"
			      label="项目名称"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="标题"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="ep"
			      label="紧急程度"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      width="100">
			      <template scope="scope">
			      	{{scope.row.status=='FINISHED'?'已完成':'进行中'}}
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="submit_user"
			      label="提出者"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="220">
			      <template scope="scope">
			      	<el-button type="text" size="small" v-if="scope.row.status=='WAIT'" @click="finishItem(scope.row)">完成</el-button>
			      	<router-link :to="{path:'/editneed',query:{id:scope.row.id}}">
				        <el-button type="text" size="small">编辑</el-button>
			      	</router-link>
			        <el-button type="text" size="small" @click="closeItem(scope.$index,scope.row)" style="margin:0 10px">删除</el-button>
			        <router-link :to="{path:'/needDoc',query:{id:scope.row.id}}" target="_blank">
				        <el-button type="text" size="small">查看</el-button>			       
			        </router-link>
			      </template>
			    </el-table-column>
			 </el-table>
			  <p><span style="margin-right:100px;">需求总数：{{count}}</span><el-button type="primary" icon="arrow-left" @click="prePage">上一页</el-button> {{pageIndex}} / {{allCount}} <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
		</div>
		<!--完成弹窗-->
		<el-dialog
		  title="提示"
		  :visible.sync="fTip"
		  size="tiny">
		  <span>请确认此条需求已完成！</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="fTip = false">取 消</el-button>
		    <el-button type="primary" @click="confrimFinish">确 定</el-button>
		  </span>
		</el-dialog>
		<!--删除弹窗-->
		<el-dialog
		  title="提示"
		  :visible.sync="bTip"
		  size="tiny">
		  <span>确认要删除此条需求吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="bTip = false">取 消</el-button>
		    <el-button type="primary" @click="confrimDelete">确 定</el-button>
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
			
			selectProject:[],
			findprojectinfo:'',
			f_title:'',				//搜索 - 标题
			findStatus:'',			//搜索 - 状态
			statusArr:[{value:'WAIT',label:'进行中'},{value:'FINISHED',label:'已完成'}],			//状态 - 列表
			
			fTip:false,			//完成二次确认弹窗
			bTip:false,			//删除二次确认弹窗
			id:'',				//完成||删除时需要的id
		}
	},
	mounted(){
		this.getProject();
		this.getList();
	},
	methods:{
		//显示确认完成弹窗
		finishItem(row){
			this.id = row.id;
			this.fTip = true;
		},
		confrimFinish(){
			let that = this;
			$.ajax({
				type:"post",
				url:"/api.php?s=/requirement/change_status",
				dataType:'json',
				data:{
					id:that.id
				},
				success:(res)=>{
					if(res.error == 0){
						that.fTip = false;
						that.getList(that.pageIndex);
					}else{
						that.$message.error(res.error_msg)
					}
				}
			});
		},
		//显示删除弹窗
		closeItem(index,row){
			this.id = row.id;
			this.bTip = true;
		},
		//确认删除
		confrimDelete(){
			let that = this;
			$.ajax({
				type:"post",
				url:"/api.php?s=api/requirement/delete",
				dataType:'json',
				data:{
					id:that.id
				},
				success:(res)=>{
					if(res.error == 0){
						that.$message.success("删除成功")
						that.bTip = false;
						that.getList(that.pageIndex);
					}else{
						that.$message.error("删除失败")
					}
				}
			});
		},
		//获取项目列表
		getProject(){
			let that = this;
			$.ajax({
				type:"get",
				url:"/api.php?s=/get_all_project",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
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
					status:that.findStatus
				},
				url:"/api.php?s=/get_requirement_list",
				dataType:'json',
				success:function(res){
					let data = res;
					if(data.error==1){
						that.$message(data.error_message)
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
			this.findprojectinfo = '';
		}
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
	.w-needs .addUser{
		font-size:14px;
		width:98px;height:28px;
		border:1px solid #ddd;
		background-color: #fff;
		border-radius:3px;
		cursor:pointer;
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
</style>