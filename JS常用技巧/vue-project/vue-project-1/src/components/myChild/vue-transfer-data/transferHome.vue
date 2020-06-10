<template>
  <div class="wrap">
    <!-- <h2>{{windowTips}}</h2> -->
    <div class="wrap-content">
      <l-Parent />
      <l-Parent-vuex />  
    </div>
  </div>
</template>
<script>
const Parent = () => import("@/components/myChild/vue-transfer-data/Parent");
const ParentVuex = () =>
  import("@/components/myChild/vue-transfer-data/Parent-vuex");
export default {
  data() {
    return {
      windowTips: "VUE传值",
    };
  },
  components: {
    "l-Parent": Parent,
    "l-Parent-vuex": ParentVuex
  },
  beforeCreate() {
      // console.group("beforeCreate 创建前状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el); //undefined
      // console.log("%c%s", "color:red", "data   : " + this.$data); //undefined
      // console.log("%c%s", "color:red", "message: " + this.message);
    },
    created() {
      // console.group("created 创建完毕状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el); //undefined
      // console.log("%c%s", "color:red", "data   : " + this.$data); //已被初始化
      // console.log("%c%s", "color:red", "message: " + this.message); //已被初始化
    },
    beforeMount() {
      // console.group("beforeMount 挂载前状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el); //已被初始化
      // console.log(this.$el);
      // console.log("%c%s", "color:red", "data   : " + this.$data); //已被初始化
      // console.log("%c%s", "color:red", "message: " + this.message); //已被初始化
    },
    mounted() {
      // console.group("mounted 挂载结束状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el); //已被初始化
      console.log(this.$el);
      // console.log("%c%s", "color:red", "data   : " + this.$data); //已被初始化
      // console.log("%c%s", "color:red", "message: " + this.message); //已被初始化
      console.log(this.$route.query)
      console.log(this.$route.query.name)
      console.log(this.$route.query.code)
    },
    beforeUpdate(){
      // console.group("beforeUpdate 更新前状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el);
      // console.log(this.$el);
      // console.log("%c%s", "color:red", "data   : " + this.$data);
      // console.log("%c%s", "color:red", "message: " + this.message);
      
    },
    updated() {
      // console.group("updated 更新完成状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el);
      // console.log(this.$el);
      // console.log("%c%s", "color:red", "data   : " + this.$data);
      // console.log("%c%s", "color:red", "message: " + this.message);
    },
    beforeDestroy() {
      // console.group("beforeDestroy 销毁前状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el);
      // console.log(this.$el);
      // console.log("%c%s", "color:red", "data   : " + this.$data);
      // console.log("%c%s", "color:red", "message: " + this.message);
    },
    destroyed: function() {
      // console.group("destroyed 销毁完成状态===============》");
      // console.log("%c%s", "color:red", "el     : " + this.$el);
      // console.log(this.$el);
      // console.log("%c%s", "color:red", "data   : " + this.$data);
      // console.log("%c%s", "color:red", "message: " + this.message);
    }
};
</script>
<!--scoped 样式只在当前组件生效-->
<style scoped>
.wrap-content {
  padding: 5px;
}
.parent {
  border: 1px solid #ffc107;
  box-shadow: 0 0 5px 1px #d8d8d8;
  margin-bottom: 5px;
  padding: 5px;
}
</style>