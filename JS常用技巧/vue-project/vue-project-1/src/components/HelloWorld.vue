<template>
  <div class="container">
    <div class="wrap-l">
      <ul class="l_list">
        <li v-for="item in navArr">{{item.title}}<i class="fa {{item.icon}}" aria-hidden="true"></i></li>
      </ul>
    </div>
    <div class="wrap-r">2</div>
  </div>
</template>
<script>
export default {
  name: "#example-1",
  data() {
    return {
      navArr: [
        {title:"导航栏",icon:'fa-envelope-open'},
        {title:"导航栏",icon:'fa-university'},
        {title:"导航栏",icon:'fa-calendar-check-o'},
        {title:"导航栏",icon:'fa-credit-card-alt'},
      ]
    };
  }
};
</script>
<!--STYLE-->
<style scoped lang='scss'>
@import "helloWorld.scss";
</style>
