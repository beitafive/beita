<template>
	<div class="w-header">
		OA-用户平台
		<div class="set-wrap">
			<span @click="setWrap"><i class="iconfont">&#xe78d;</i>&nbsp;<i class="iconfont">{{setShow ?  "&#xe600;" : "&#xe601;"}}</i></span>
			<ul v-if="setShow">
				<li><router-link tag="a" to="/setinfo">设置</router-link></li>
				<li @click="closeMe"><router-link tag="a" to="/login">退出</router-link></li>
			</ul>			
		</div>
	</div>
</template>

<script>
export default({
	name:'topHeader',
	data(){
		return{
			msg:'',
			username:localStorage.username||"",
			setShow: false, // false 不显示
		}
	},
	mounted(){
		if(this.$store.state.token == null){
			this.$router.push('/login');
		}
		
	},
	methods:{
		setWrap(){
			this.setShow = !this.setShow;
		},
		closeMe(){
			let _this = this;
			$.ajax({
				type:"get",
				url:_this.$api.logout,
				dataType:'json',
				success:(res)=>{
					if(res.error == 0){
						_this.$store.state.token = null;
						localStorage.removeItem("token")
						localStorage.removeItem("role")
						_this.$router.push("/")
					}
				}
			});
		}
	}
})
</script>

<style scoped>
	.w-header{
		height:59px;
		border-bottom: 1px solid #e8e8e8;
		box-sizing: border-box;
		padding:0 30px;
		font-size:22px;
		color:#333;
		line-height:60px;
	}
	.w-header .set-wrap{
		float:right;
		position: relative;
		width: 80px;
		font-size:16px;
		cursor:pointer;
		margin-right:40px;
		text-align: center;
	}
	
	.w-header .set-wrap span{
		position: absolute;
		top: 0;
		left: 0;
		display: inline-block;
		width: 100px;
		height: 59px;
	}
	.w-header .set-wrap span i:nth-of-type(1){
		font-size: 24px;
	}
	
	.w-header .set-wrap ul{
		position: absolute;
		width: 100px;
		list-style: none;
		top: 59px;
		left: 0;
	}
	.w-header .set-wrap ul li{
		width: inherit;
		height: 30px;
		line-height: 30px;
	}
	.w-header .set-wrap ul li a{
		width: 100%;
		height: 100%;
		display: inline-block;
	}
	.w-header .set-wrap ul li a:hover{
		background: #eee;
	}
</style>