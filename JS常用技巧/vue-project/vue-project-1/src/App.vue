<template>
  <div class="container" id="app">
    <div class="Router-view wrap-l">
      <router-link
        :to="{path:i.tag}"
        active-class="active"
        v-for="(i,index) in routerview"
        :key="index"
        tag="a"
      >
        
        <span>{{i.routers}}</span>
        <i :class="i.icon"></i>
      </router-link>
    </div>

    <div class="wrap-r">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      routerview: [
        {
          routers: "导航栏1",
          icon: "fa fa-envelope-open",
          tag: "HelloWorld"
        },
        {
          routers: "导航栏2",
          icon: "fa fa-university",
          tag: "/One"
        },
        {
          routers: "导航栏3",
          icon: "fa fa-calendar-check-o",
          tag: "/Two"
        },
        {
          routers: "导航栏4",
          icon: "fa fa-credit-card-alt",
          tag: "/Start"
        }
      ]
    };
  }
};
</script>
<!--STYLE-->
<style scoped lang='scss'>
@import "/components/helloWorld.scss";
</style>
