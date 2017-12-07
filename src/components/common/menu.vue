<template>
	<div class="w-menu">
		<el-menu :default-active="menuIndex" class="el-menu-vertical-demo" @select="menuselect" >
			<!-- 外层循环渲染 -->
	      	<el-submenu v-for="(items,indexs) in menuList" :index="indexs.toString()" key="indexs">
	      		<template slot="title">
	      			<i class="iconfont" v-html="items.icon"></i>&nbsp; {{items.name}}
	      		</template>
	      		<!-- 内层循环渲染 -->
	      		<el-menu-item v-for="(item,index) in items.children" :index="item.index" key="index">
	      			<router-link tag="span" :to="item.router">
	      				&nbsp;&nbsp;<i class="iconfont" v-html="item.icon"></i>&nbsp;{{item.name}}
	      			</router-link>
	      		</el-menu-item>
	      	</el-submenu>
	   </el-menu>  
	</div>
</template>

<script>
export default({
	name:'menu',
	data(){
		return{
			menuIndex:'',
			menuList:[]
		}
	},
	mounted(){
  		this.getMenuList();
  	},
  	methods: {
	  	//组件选中
	    menuselect(index){
	    	this.menuIndex = index;
	    	sessionStorage.menuIndex = index;
		},
		//获取MenuList
		getMenuList(){
			let _this = this;
			$.ajax({
				type:"get",
				url:_this.$api.get_menu_list,
				dataType:"json",
				success:(res)=>{
					if(res.error == 0){
						_this.menuList = res.data;
						setTimeout(()=>{
							_this.menuIndex = sessionStorage.menuIndex;						
						},200)
					}
				}
			});
		}
	}	
})
</script>

<style scoped>
	.w-menu{
		float:left;
		width:15%;
		height:100%;
		background: #eef1f6;
		position: fixed;
		top: 60px;
		width: 200px;
		overflow-y: scroll;
	}
	
	.w-menu span{
		display: block;
	}
	.w-menu i{
		font-size: 14px;
	}
	
</style>