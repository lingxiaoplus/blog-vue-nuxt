<template>
  <div class="ma-4">
    <v-flex class="d-flex align-center justify-center flex-row mt-4">
      <!--<v-icon medium>mdi-lightbulb-on-outline</v-icon>-->
      <p class="font-weight-medium px-2" style="font-size: 26px">友情链接</p>
    </v-flex>

    <v-container v-if="loading">
      <v-row>
        <v-col v-for="count in 6" :key="count" cols="12" md="3">
          <v-skeleton-loader type="article, actions"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>

    <v-row no-gutters v-else>
      <v-col v-for="(item,index) in items" :key="item.title" cols="12" sm="3">
        <v-card class="ma-2 animated fadeInDown" :style="[{'animation-delay': (index + 1)*0.1 + 's'}]" elevation="4" dark :color="colorList[index]">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="item.name"></v-card-title>
              <v-card-subtitle v-text="item.description"></v-card-subtitle>
              <v-btn color="white" text>传送门</v-btn>
            </div>
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="item.src"></v-img>
            </v-avatar>
          </div>
        </v-card>

      </v-col>
    </v-row>

    <v-card tile elevation="0" class="animated fadeInDown">
      <v-card-title>交换要求</v-card-title>
      <v-card-text>
        交换前请先行加上本博链接。仅交换内页，首页仅根据个人喜好添加。
        认真做站（即建站超过 1 年），更新频率至少 1 月 1 次，百度收录需要大于 500，原则上仅接受生活、技术类博客
      </v-card-text>
      <v-card-text>友链无法访问会即时删除，不会额外通知。</v-card-text>
    </v-card>

  </div>
</template>

<script>
  export default {
    name: 'friendLink',
    data() {
      return {
        items: [],
        colorList: '',
        loading: true,
      }
    },
    methods: {
      async getLinks() {
        try {
          this.loading = true;
          let resp = await this.$http.get('/front/link')
          this.items = resp.data.data
        } catch (e) {
          console.log('异常', e)
        }finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      this.getLinks()
      this.colorList = this.$uiUtil.colorList
    }
  }
</script>

<style scoped>

</style>
