<template>
  <div>
    <div class="block img-section">
      <el-carousel trigger="click" height="936px">
        <el-carousel-item v-for="item in imgs" :key="item.id">
          <img :src="item.imgUrl" class="navImg" />
        </el-carousel-item>
      </el-carousel>
      <div class="login-box">
        <div class="login-box-left">
          <div class="topImg">
            <i class="fa fa-location-arrow" aria-hidden="true"></i>个人信息
          </div>
          <div>
            <el-form ref="form" :model="form" label-width="60px">
              <el-form-item label="姓名：">
                <el-input v-model="form.name" clearable></el-input>
              </el-form-item>

              <el-form-item label="电话：">
                <el-input v-model="form.phone" clearable></el-input>
              </el-form-item>
              <el-form-item label="性别：">
                <el-radio-group v-model="form.resource">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="区域：">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="春熙路" value="CXL"></el-option>
                  <el-option label="孵化园" value="FHY"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="验证：">
                <el-switch v-model="form.delivery"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">signIn</el-button>
                <el-button>signOut</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="login-box-right">
          <h2>There Is No Beauty But Beauty</h2>
          <P>我们每个人一生都在追求生活的美好，却忽略了匆忙路途中的每一处美，静下心来，你会发现美好就在你身边。</P>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgs: [
        { id: 0, imgUrl: require("../assets/navImg/slider_01.jpg") },
        { id: 1, imgUrl: require("../assets/navImg/slider_02.jpg") },
        { id: 3, imgUrl: require("../assets/navImg/slider_03.jpg") }
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
     this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        });
    }
  }
};
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.img-section::after {
  clear: both;
}
.navImg {
  width: 100%;
}
.topImg {
  color: #1f1f1f;
  margin-bottom: 20px;
}
.topImg > i {
  display: inline-block;
  width: 23px;
  height: 23px;
  background: #409eff;
  color: white;
  text-align: center;
  line-height: 23px;
  border-radius: 3px;
  margin-right: 8px;
}
.img-section::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
}
.login-box {
  display: flex;
  width: 1170px;
  height: 460px;
  /* background: white; */
  position: absolute;
  top: 0;
  z-index: 3;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  padding: 18px;
}
.login-box > div {
  width: 582px;
}
.login-box .el-input__inner {
  width: 380px;
}

/*左侧登录信息CSS*/
.login-box-left {
  border: 1px solid #ededed;
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.1);
  background-color: #f2f3f5bd;
  border-radius: 2px;
  padding: 20px 0 40px 20px;
}
.login-box-right {
  color: #ffffff;
  padding: 40px;
}
.login-box-right h2 {
  font-size: 52px;
  font-weight: 400;
  text-transform: capitalize;
  display: block;
  margin: 0;
  position: relative;
}
.login-box-right p {
  font-size: 21px;
  font-weight: 300;
  margin: 0;
  line-height: inherit;
}
</style>