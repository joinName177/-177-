<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <div class="cont">1</div>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <div class="cont">2</div>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">
        <div class="cont">3</div>
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">
        <div class="cont">4</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "second"
    };
  }
};
</script>
<style scoped>
</style>