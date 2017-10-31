<template>
	<div>
		<div v-for="(item,index) in bigArr" key="item">
		  <span style="margin-right:10px">{{item.title}}</span><el-checkbox :indeterminate="item.indeterminate" v-model="item.checkAll" @change="bigchange(item)">全选</el-checkbox>
		  <div style="margin: 15px 0;"></div>
		  <el-checkbox v-for="(val,ind) in item.resource" :label="val.title" :key="val" @change="smallchange(item)" v-model="val.check">{{val.title}}</el-checkbox>
		</div>
	</div>
</template>
<script>
  export default {
    data() {
      return {
        bigArr:[{title:'个人设置',id:'1',checkAll:false,indeterminate:false,resource:[{title:'增',id:'1-1',check:false},{title:'删',id:'1-2',check:false},{title:'改',id:'1-3',check:false},{title:'查',id:'1-4',check:false}]},
        {title:'BUG管理',id:'2',checkAll:false,indeterminate:false,resource:[{title:'增',id:'2-1',check:false},{title:'删',id:'2-2',check:false},{title:'改',id:'2-3',check:false},{title:'查',id:'2-4',check:false}]}]
      };
    },
    mounted(){
    	this.test()
    },
    methods: {
      bigchange(item) {
        if(item.checkAll){
        	item.resource.map((val)=>{
        		val.check = true;
        	})
        }else{
        	item.resource.map((val)=>{
        		val.check = false;
        	})
        }
        item.indeterminate = false;
      },
      smallchange(item) {
        let checkedCount = 0;
        let ids= new Array;
        item.resource.map((val)=>{
        	if(val.check){
        		checkedCount++;
        	}
        })
        item.checkAll = checkedCount === item.resource.length;
        item.indeterminate = checkedCount > 0 && checkedCount < item.resource.length;
        this.bigArr.map((item)=>{
        	item.resource.map((val)=>{
        		if(val.check){
        			ids.push(val.id)
        		}
        	})
        })
        console.log(ids.join(','))
      },
      test(){
      	var ceshi = new Promise(function(resolve,reject){
      		console.log(resolve)
      	}).then((res)=>{
      		console.log(123)
      	})
      }
    }
    
  };
</script>