<template>
  <div class="hello">
     <div>
      <span v-for="(value, key) in language">{{value}}</span>
    </div>
    <ul>
      <li v-for="item in country">{{item}}</li>
    </ul>
   <div>
     <button @click="changeLanguage">按钮</button>
   </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      country: ["中国", "美国", "法国", "德国", "韩国", "意大利", "西班牙"],
      language: {
        zh: "中文",
        ch: "英文"
      }
    };
  },
  methods: {
    changeLanguage(){
      this.language.zh = '中国-中文'
    }
  }
};
</script>

<!--STYLE-->
<style scoped>
ul {
  width: 300px;
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  height: 28px;
  border: 1px solid #d8d8d8;
  border-bottom: none;
  padding-left: 5px;
  line-height: 28px;
  cursor: pointer;
}
li:last-child {
  border-bottom: 1px solid #d8d8d8;
}
li:hover {
  background: #d8d8d8;
  color: azure;
}
</style>
