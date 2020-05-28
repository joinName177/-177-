<template>
  <div class="parent">
    <h1>{{msg}}</h1>
    <span>方式一：父传子props，子传父this.$emit</span>
    <p>child组件传递过来的内容:{{content}}</p>
    <l-child data-msg="我是你爸爸" @transferData="gettranValue"></l-child>
  </div>
</template>
<script>
//引入子组件
const child = () => import("@/components/myChild/vue-transfer-data/Child");
export default {
  data() {
    return {
      msg: "父组件",
      content: ""
    };
  },
  components: {
    "l-child": child
  },
  methods: {
    gettranValue(msg) {
      this.content = msg.content;
    }
  }
};
</script>
<style scoped>
.parent {
    border: 1px solid #FFC107;
    box-shadow: 0 0 5px 1px #d8d8d8;
}
</style>
