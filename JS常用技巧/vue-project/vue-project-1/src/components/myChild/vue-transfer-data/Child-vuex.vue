<template>
   <div class="child">
        <h4>{{msg}}</h4>
        <P>接收父组件传递的值:<span>{{dataMsg}}</span></p>
        <p>这本书的作者是：{{ $store.state.author }}</p>
        <el-button type="primary" @click="transmitValue">传值给父组件</el-button>
   </div>
</template>
<script>

export default {
    data(){
        return{
            msg:'子组件',
            tranInfo:{
                content:'这是传递的一段信息'
            }
        }
    },
    props:['dataMsg'],
    methods:{
        transmitValue:function(){
             this.$emit('transferData',this.tranInfo.content)
        }
    }
}
</script>
<style scoped>
.child{
  border: 1px solid #2196F3;
  margin: 10px;
  padding: 10px;
}
.child span{
    color: red;
}
</style>