<template>
	<div class="w-menu">
		<el-menu :default-active="menuIndex" :active="menuIndex"  class="el-menu-vertical-demo" @select="menuselect" >
			<!-- 外层循环渲染 -->
	      	<el-submenu v-for="(items,indexs) in menuList" :index="indexs.toString()" key="indexs">
	      		<template slot="title">
	      			{{items.name}}
	      		</template>
	      		<!-- 内层循环渲染 -->
	      		<el-menu-item v-for="(item,index) in items.children" :index="item.index" key="index">
	      			<router-link tag="span" :to="item.router">
	      				&nbsp;&nbsp;{{item.name}}
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
				url:"/api.php?s=front/menu/get_menu",
				dataType:"json",
				success:(res)=>{
					if(res.error == 0){
						_this.menuList = JSON.parse(res.data);
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
		height:500px;
		/*border:1px solid #e7e7e7;*/
	}
	.w-menu span{
		display: block;
	}
</style>