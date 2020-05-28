<template>
  <div class="container" id="app">
    <div class="Router-view wrap-l">
      <el-row>
        <el-col :span="12">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#272c33"
            text-color="#c8c9ce "
            active-text-color="#ffffff"
            :router="true"
            v-for="(item, index) in $router.options.routes"
            :key="index"
          >
            <el-submenu
              v-if="item.children"
              :index="item.name"
              :route="item.path"
              class="edit_wrapper"
              @mouseover.native="overShow"
              @mouseout.native="outHide"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
                <i class="iconfont icon-shenpi edit" v-show="haha"></i>
              </template>
              <el-submenu
                v-if="item1.children"
                v-for="(item1, index) in item.children"
                :key="item1.name"
                :index="item1.name"
                :route="item1.path"
              >
                <template slot="title">
                  <i :class="item1.icon"></i>
                  <span slot="title">{{item1.name}}</span>
                </template>
                <el-submenu
                  v-for="(item2, index) in item1.children"
                  :key="item2.name"
                  v-if="item2.children"
                  :index="item2.name"
                  :route="item2.path"
                >
                  <template slot="title">
                    <i :class="item2.icon"></i>
                    <span slot="title">{{item2.name}}</span>
                  </template>
                  <el-submenu
                    v-for="(item3, index) in item2.children"
                    :key="item3.name"
                    v-if="item3.children"
                    ::index="item3.name"
                    :route="item3.path"
                  >
                    <template slot="title">
                      <i :class="item3.icon"></i>
                      <span slot="title">{{item3.name}}</span>
                    </template>
                    <el-menu-item
                      v-for="(item4, index) in item3.children"
                      :key="item3.name"
                      v-if="item4.children == null"
                      :index="item4.name"
                      :route="item4.path"
                    >
                      <span>{{item4.name}}</span>
                    </el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-for="(item3, index) in item2.children"
                    :key="item3.name"
                    v-if="item3.children == null"
                    :index="item3.name"
                    :route="item3.path"
                  >
                    <span>{{item3.name}}</span>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-for="(item2, index) in item1.children"
                  :key="item2.name"
                  v-if="item2.children == null"
                  :index="item2.name"
                  :route="item2.path"
                >
                  <span>{{item2.name}}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-for="(item1, index) in item.children"
                :key="item1.name"
                v-if="item1.children == null"
                :index="item1.name"
                :route="item1.path"
              >
                <span>{{item1.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.children == null" :index="item.name" :route="item.path">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
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
       myName:"czq",
       haha:false
    };
  },
  methods:{
    outHide(){

    },
    overShow(){

    },
    handleOpen(){

    },
    handleClose(){

    }
  }
};
</script>
<!--STYLE-->
<style scoped lang='scss'>
@import "/components/helloWorld.scss";
</style>
