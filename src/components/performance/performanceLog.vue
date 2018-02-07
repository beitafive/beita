<template>
	<div class="performanceLog">
		<div  class="co-inner-head">
			<h2 class="co-head-title">
				绩效日志管理
			</h2>
			<el-button  @click="add" v-if="badd"  type="primary" style="padding: 10px 30px;">+ 新增</el-button>
			<el-button  @click="reduce" v-if="breduce"  type="primary" style="padding: 10px 30px;">- 减少</el-button>

			<p style="margin-top:20px;" class="co-search-wrap">
			  	<span class="co-search-condition">
			  		<span class="co-search-name">用户名</span>
					<el-select v-model="user_id" placeholder="请选择用户" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>					
				</span>	
				<el-button  @click="clearSearch" style="padding: 10px 23px;">清空输入</el-button>				
				<el-button type="primary" @click="search" style="padding: 10px 37px;">搜索</el-button>
			</p>
		</div>
		<!-- <span class="page-info">绩效总数：{{count}}</span> -->
		<!--列表展示-->
		<div class="co-inner-content">
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
		      prop="user_name"
		      label="用户"
		      width="150">
		    </el-table-column>
		    <el-table-column
		    	prop="user_id"
				label="用户ID"
				width="120"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="type"
		      label="绩效类型"
		       width="200">
		    </el-table-column>
		    <el-table-column
		    	prop="reason"
				label="原因"
				min-width="200"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="created_at"
				label="创建时间"
				width="200"
		    >
		    </el-table-column>
		    <el-table-column
		    	prop="value"
				label="绩效"
				width="150"
		    >
		    </el-table-column>
		    
		  </el-table>
		  
		</div>
		<!--增加绩效弹窗-->
		<el-dialog title="请填写增加原因" :visible.sync="addTip" size="tiny">
			<div class="addUserInfo">
			    <span class="co-search-condition">
			  		<span class="co-search-name">用户名</span>
					<el-select v-model="add_id" placeholder="请选择用户" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in ownerarr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>					
				</span>	
				<span class="co-search-condition">
			  		<span class="co-search-name">绩效类型</span>
					<el-select v-model="performanceType" placeholder="请选择绩效类型" style="width:220px;padding-right: 12px;">
					    <el-option
					      v-for="item in typearr"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>					
				</span>	
				<span class="co-search-condition">
			  		<span class="co-search-name">绩效值</span>
					<el-input type="text" placeholder="请输入绩效值" v-model="performanceValue" style="width:220px;padding-right: 12px;"></el-input>				
				</span>	
			  	<p>原因</p>
			  	<p><textarea class="content" v-model="addReason" placeholder="请填写原因"></textarea></p>
			</div>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="addTip = false">取 消</el-button>
		    <el-button type="primary" @click="addPerformance()">确 定</el-button>
		  </div>
		</el-dialog>
		
		<!--减少绩效弹窗-->
			<el-dialog title="请填写减少原因" :visible.sync="reduceTip" size="tiny">
				<div class="addUserInfo">
					<span class="co-search-condition">
				  		<span class="co-search-name">用户名</span>
						<el-select v-model="reduce_id" placeholder="请选择用户" style="width:220px;padding-right: 12px;">
						    <el-option
						      v-for="item in ownerarr"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>					
					</span>
					<span class="co-search-condition">
				  		<span class="co-search-name">绩效类型</span>
						<el-select v-model="performanceType" placeholder="请选择绩效类型" style="width:220px;padding-right: 12px;">
						    <el-option
						      v-for="item in typearr"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>					
					</span>	
					<span class="co-search-condition">
				  		<span class="co-search-name">绩效值</span>
						<el-input type="text" placeholder="请输入绩效值" v-model="rePerformanceValue" style="width:220px;padding-right: 12px;"></el-input>				
					</span>	
				  <p>原因</p>
				  <p><textarea class="content" v-model="reduceReason" placeholder="请填写原因"></textarea></p>
				</div>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="reduceTip = false">取 消</el-button>
			    <el-button type="primary" @click="reducePerformance()">确 定</el-button>
			  </div>
			</el-dialog>

		<p v-if="tableData.length"  class="co-page">			  	
		  	<el-button  icon="arrow-left" @click="prePage"  style="margin-right:10px;">上一页</el-button> {{pageIndex}} / {{allCount}} <el-button  @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
		 </p>
	</div>
</template>

<script>
	export default{
		name:'performanceLog',
		data(){
			return{
				count:0,
				user_id:'',
				add_id:'',
				reduce_id:'',
				ownerarr:[],//用户列表
				performanceType:'',//绩效类型
				typearr:[
					{value:'task',label:'任务'},
					{value:'test',label:'测试'},
					{value:'need',label:'需求'},
					{value:'develop_live_bug',label:'开发线上bug'},
					{value:'test_live_bug',label:'测试线上bug'},
					{value:'difficult_2',label:'难度2'},
					{value:'difficult_3',label:'难度3'},
					{value:'difficult_4',label:'难度4'},
					{value:'difficult_5',label:'难度5'},

				],
				tableData:[],
				addTip:false,
				reduceTip:false,
				addReason:'',//增加绩效原因
				reduceReason:'',//减少绩效原因
				performanceValue:'',//增加绩效值
				rePerformanceValue:'',//减少绩效值

				badd:false,//增加绩效权限
				breduce:false,//减少绩效权限
			}
		},
		mounted(){
			let _this = this;
			this.$store.dispatch("getPer",'performance').then(()=>{
				_this.$store.state.perList.includes("performance.add")?this.badd=true:'';	
				_this.$store.state.perList.includes("performance.reduce")?this.breduce=true:'';			
				_this.getList(1);
			})
			this.getUser();
		},
		methods:{
			search(){
				this.getList(1);
			},
			//增加绩效按钮
			add(){
				this.addTip = true;
			},
			reduce(){
				this.reduceTip = true;
			},
			//增加绩效
			addPerformance(){
				let that = this;
				if(that.add_id == ''){
					that.$message('请选择用户')
					return;
				}
				if(that.performanceType == ''){
					that.$message('请选择绩效类型')
					return;
				}
				if(that.performanceValue == ''){
					that.$message('请输入绩效值')
					return;
				}
				if(that.addReason == ''){
					that.$message('请填写增加绩效原因')
					return;
				}
		        $.ajax({
					type:"post",
					url:that.$api.performance.add,
					data:{
						user_id:that.add_id,
						reason:that.addReason,
						type:that.performanceType,
						value:that.performanceValue
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
							that.addTip = false;
							that.performanceType = ''
							that.add_id = ''
							that.performanceValue = ''
							that.addReason = ''
							that.getList(1);
							that.$message({
					            type: 'success',
					            message: '增加成功!',
					            duration: 900
					          });
						}else{
							that.$message(res.error_msg)
						}
					}
				});

			},
			//减少绩效
			reducePerformance(){
				let that = this;
				if(that.reduce_id == ''){
					that.$message('请选择用户')
					return;
				}
				if(that.performanceType == ''){
					that.$message('请选择绩效类型')
					return;
				}
				if(that.rePerformanceValue == ''){
					that.$message('请输入绩效值')
					return;
				}
				if(that.reduceReason == ''){
					that.$message('请填写减少绩效原因')
					return;
				}
		        $.ajax({
					type:"post",
					url:that.$api.performance.reduce,
					data:{
						user_id:that.reduce_id,
						reason:that.reduceReason,
						type:that.performanceType,
						value:that.rePerformanceValue
					},
					dataType:'json',
					success:(res)=>{
						if(res.error == 0){
							that.reduceTip = false;

							that.performanceType = ''
							that.reduce_id = ''
							that.rePerformanceValue = ''
							that.reduceReason = ''
							
							that.getList(1);
							that.$message({
					            type: 'success',
					            message: '减少成功!',
					            duration: 900
					          });
						}else{
							that.$message.error(res.error_msg)
						}
					}
				});

			},
			getList(page){
				let that = this;
				that.tableData = [];
				$.ajax({
					type:'get',
					url:that.$api.performance.get_detail_list,
					dataType:'json',
					data:{
						page:page||1,
						user_id:that.user_id,

					},
					success:function(data){
						if(data.error == 0){
							that.tableData = data.data.res
							that.count = data.data.pagination.item_total
							that.allCount = Math.ceil(data.data.pagination.item_total/10);
							that.pageIndex = data.data.pagination.page|| 1;
							
						}else{
							that.$message(res.error_msg)
							return;
						}
						
					}
				})
			},
			//获取用户列表
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
			clearSearch(){
				this.user_id = ''
			}
		}
	}
</script>
<style>
	.performanceLog{
		float:left;
		background:#fff;
		box-sizing:border-box;
		padding:20px 50px 150px 30px;
	}
	.content{
		width:100%;
		height:160px;
		border:1px solid #DDD;
		resize:none;
		border-radius:5px;
	}
</style>