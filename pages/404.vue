<template>
  <v-app id="inspire" class="error-container">
    <!--<v-img src="http://img.lingxiaomz.top/404?imageView2/2/w/1920/h/1080" max-width="100%"  :aspect-ratio="16/9" class="d-flex align-center justify-center">
    </v-img>-->

    <v-flex class="d-flex flex-column align-center justify-center">
      <h1 class="error-number">404</h1>
      <p class="mini-text">非常不幸</p>
      <p class="error-text mb-4 mt-1">没有找到这个页面!</p>
      <p class="text-subtitle-1 font-weight-light">当前ip:{{ip}}</p>
      <v-btn class="btn mt-5" color="primary" tile v-on:click="back">返回上一页</v-btn>
    </v-flex>

  </v-app>
</template>
<script>
  export default {
    data() {
      return {
        image: require('../assets/404.png'),
        ip: '',
      }
    },
    methods: {
      back() {
        this.$router.back(-1)//返回上一层
      },
      async getRealIp(){
        try {
          let resp = await this.$http.get("/front/realIp");
          console.log("成功", resp.data);
          this.ip = resp.data;
        }catch (e) {
          console.log("失败", e);
        }
      }
    },
    mounted() {
      this.getRealIp();
    }
  }
</script>
<style scoped>
  .page-container {
    font-size: 20px;
    text-align: center;
    color: rgb(192, 204, 218);
  }

  .error-number {
    font-size: 170px;
    color: #fff;
    font-weight: 600;
    margin-bottom: 5px;
    margin-top: 15px;
    text-shadow: 0px 5px 4px rgba(31, 45, 61, 0.10196078431372549);
  }

  .mini-text {
    font-size: 33px;
    font-weight: 700;
    margin-bottom: 0;
    color: #1b55e2;
  }

  .error-container {
    background-image: linear-gradient(to right, #81D4FA, #4DB6AC);
  }

  .error-text {
    font-size: 18px;
    color: #3b3f5c;
    font-weight: 600;
  }
</style>
