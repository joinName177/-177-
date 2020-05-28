<template>
  <div class="parent">
    <h1>{{msg}}</h1>
    <span>方式二：VUEX</span>
    <p>父组件接手到的内容：{{ username }}</p>
    <p class="option_btn">
      <el-input placeholder="请输入内容" v-model="inputTxt" clearable></el-input>
      <el-button type="success" @click="setAuthor">传参</el-button>
    </p>
    <v-child data-msg="我是你爸爸" @transferData="gettranValue"></v-child>
  </div>
</template>
<script>
const vchild = () =>
  import("@/components/myChild/vue-transfer-data/Child-vuex");
export default {
  data() {
    return {
      msg: "父组件",
      username: "",
      inputTxt: ""
    };
  },
  components: {
    "v-child": vchild
  },
  methods: {
    gettranValue(msg) {
      this.username = msg;
    },
    setAuthor: function() {
      this.$store.commit("newAuthor", this.inputTxt);
    }
  }
};
</script>
<style scoped>
    .option_btn{
        display: flex;
    }
    .el-input{
        margin-right: 5px;
    }
</style>