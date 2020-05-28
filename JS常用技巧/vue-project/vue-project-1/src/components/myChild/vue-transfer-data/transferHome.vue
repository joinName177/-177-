<template>
  <div class="wrap">
    <!-- <h2>{{windowTips}}</h2> -->
    <div class="wrap-content">
        <l-Parent/>
        <l-Parent-vuex/>
    </div>
  </div>
</template>
<script>
const Parent = () => import('@/components/myChild/vue-transfer-data/Parent')
const ParentVuex = () => import('@/components/myChild/vue-transfer-data/Parent-vuex')
export default {
  data() {
    return {
      windowTips: "VUE传值"
    };
  },
  components: {
    "l-Parent": Parent,
    "l-Parent-vuex": ParentVuex
  }
};
</script>
<!--scoped 样式只在当前组件生效-->
<style scoped>
 .wrap-content{
     padding: 5px;
 }
 .parent {
    border: 1px solid #FFC107;
    box-shadow: 0 0 5px 1px #d8d8d8;
    margin-bottom: 5px;
    padding: 5px;
}
</style>