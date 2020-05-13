<template>
  <div class="container">
    <div class="wrap-l">
      <ul class="l_list">
        <li v-for="item in navArr">{{item.title}}<i :class="item.class" aria-hidden="true"></i></li>
      </ul>
    </div>
    <div class="wrap-r">2</div>
  </div>
</template>
<script>
export default {
  // name: "#example-1",
  data() {
    return {
      navArr: [
        {title:"导航栏",class:'fa fa-envelope-open'},
        {title:"导航栏",class:'fa fa-university'},
        {title:"导航栏",class:'fa fa-calendar-check-o'},
        {title:"导航栏",class:'fa fa-credit-card-alt'},
      ]
    };
  }
};
</script>
<!--STYLE-->
<style scoped lang='scss'>
@import "helloWorld.scss";
</style>
