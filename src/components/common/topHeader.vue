<template>
	<div class="w-header">
		OA-用户平台
		<div class="set-wrap">
			<!-- <b>积分：{{point}}</b> -->
			<div @mouseenter="showWrap" @mouseleave="cancelWrap">
				<span><i class="iconfont">&#xe78d;</i>&nbsp;<i class="iconfont">{{setShow ?  "&#xe600;" : "&#xe601;"}}</i></span>
				<ul v-if="setShow"  style="border: 1px solid #eee;background: #eef1f6;margin:0;padding: 0;">
					<li><router-link tag="a" to="/setinfo">设置</router-link></li>
					<li @click="closeMe"><a href="javascript:;">退出</a></li>
				</ul>	
			</div>
					
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
			this.$router.push('/');
		}
		// this.$store.dispatch('changePoint').then(function(){})
	},
	computed:{
		// point(){
		// 	return this.$store.getters.getpoint;
		// }
	},
	methods:{
		showWrap(){
			this.setShow = true;
		},
		cancelWrap(){
			this.setShow = false;
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

		position: fixed;
		z-index: 666;
		width: 100%;
		background:#f8f8f8;
	}
	.w-header .set-wrap{
		float:right;
		position: relative;
		width: 80px;
		height: 59px;
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
	.w-header .set-wrap b{
		position: absolute;
		top: 0;
		right: 100px;
		display: inline-block;
		width: 120px;
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
		height: 40px;
		line-height: 40px;
	}
	.w-header .set-wrap ul li a{
		width: 100%;
		height: 100%;
		display: inline-block;
	}
	.w-header .set-wrap ul li a:hover{
		background: #ccc;
	}
</style>