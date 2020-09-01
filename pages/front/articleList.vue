<template>
  <div>
    <v-sheet>
      <v-flex class="d-flex flex-column align-center justify-center">
        <v-carousel cycle interval="4000" height="600px">
          <v-carousel-item v-for="(item,i) in banners" :key="i" :src="item.headImage" @click="readArticle(item.id)">
            <v-flex class="d-flex align-center justify-center" style="width: 100%;height: 100%">
              <v-flex class="d-flex align-center justify-center flex-column">
                <span class="font-weight-medium px-2" style="font-size: 26px">{{item.title}}</span>
                <p class="text-subtitle-1 font-weight-light px-2" style="max-width: 500px">
                  {{item.content}}...
                </p>
              </v-flex>
            </v-flex>
          </v-carousel-item>
        </v-carousel>
        <v-flex class="d-flex align-center justify-center flex-row mt-4">
          <v-icon medium>mdi-lightbulb-on-outline</v-icon>
          <span class="font-weight-medium px-2" style="font-size: 26px">每日一句</span>
        </v-flex>
        <v-card elevation="0" max-width="800px" class="ma-2">
          <v-card-text>
            <span class="font-weight-medium px-2" style="font-size: 20px">
              {{hitokoto.hitokoto}}
            </span>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" class="ml-auto" @click="readArticle(item.id)">
              --{{hitokoto.from}}
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-flex class="d-flex align-center justify-center flex-row mt-4">
          <v-icon medium>mdi-gift-outline</v-icon>
          <span class="font-weight-medium px-2" style="font-size: 26px">我的文章</span>
        </v-flex>
        <v-flex>
          <v-card class="px-6" elevation="0">
            <v-row class="px-6">
              <v-col v-for="item in articleList" :key="item.id" md="4" sm="12" xs="2">
                <v-hover v-slot:default="{ hover }">
                  <v-card class="ma-2" :elevation="hover?10:2">
                    <v-img :src="item.headImage" height="194" @click="readArticle(item.id)">
                      <v-card-title style="position: absolute;bottom: 0px;color: white">{{item.title}}</v-card-title>

                    </v-img>
                    <v-flex class="mx-2 grey--text" style="max-height: 100px">
                      <p class="text-subtitle-1 font-weight-light">
                        {{item.content}}...
                      </p>
                    </v-flex>

                    <v-card-actions>

                      <v-btn text color="grey" class="mx-2 white--text" small>
                        <v-icon left dark small>mdi-clock-outline</v-icon>
                        {{item.updateTime}}
                      </v-btn>
                      <v-btn text color="grey" class="mx-2 white--text" small>
                        <v-icon right dark small>mdi-comment-eye-outline</v-icon>
                        阅读({{item.watchCount}})
                      </v-btn>

                      <v-btn text color="grey" class="mx-2 white--text" small>
                        <v-icon left dark small>mdi-electron-framework</v-icon>
                        {{item.categoryName}}
                      </v-btn>

                      <v-btn text color="green" class="ml-auto" @click="readArticle(item.id)">
                        阅读
                      </v-btn>
                    </v-card-actions>
                    <v-divider></v-divider>
                    <v-card-actions v-if="item.labels">
                      <v-chip-group column>
                        <v-chip color="primary" v-for="label in item.labels" :key="label.id">
                          {{ label.name }}
                        </v-chip>
                      </v-chip-group>
                    </v-card-actions>
                  </v-card>
                </v-hover>

              </v-col>
            </v-row>
          </v-card>
        </v-flex>
        <div class="text-center" v-if="pageCount > 0">
          <v-pagination v-model="pageNum" :length="pageCount" :total-visible="7"></v-pagination>
        </div>

      </v-flex>
    </v-sheet>
  </div>
</template>

<script>
  export default {
    name: 'articleList',
    data() {
      return {
        currentItem: 0,
        items: [],
        articleList: [],
        banners: [],
        pageNum: 1,
        pageCount: 0,
        itemsPerPage: 10,
        hitokoto: ''
      }
    },
    watch: {
      pageNum(val) {
        this.pageNum = val
        this.getArticleList()
      }
    },
    methods: {
      async getBanner() {
        try {
          let resp = await this.$http.get('/front/banner')
          console.log('结果', resp.data.data)
          this.banners = resp.data.data.banners
          this.hitokoto = resp.data.data.hitokoto
        } catch (e) {
          console.log('异常', e)
        } finally {

        }
      },
      async getCategory() {
        try {
          let resp = await this.$http.get('/front/category')
          console.log('结果', resp.data.data)
          this.items = resp.data.data
          this.items.splice(0, 0, {
            id: -1,
            name: '首页'
          })
          this.currentItem = `tab-${this.items[0]}`
        } catch (e) {
          console.log('异常', e)
        } finally {

        }
      },
      async getArticleList() {
        try {
          this.$store.commit('setLoading', true)
          let resp = await this.$http.get('/front/article?pageSize=6&pageNum=' + this.pageNum)
          console.log('文章列表', resp.data.data)
          this.articleList = resp.data.data
          this.pageCount = resp.data.totalPage
          localStorage.setItem('article', JSON.stringify(resp.data))
        } catch (e) {
          console.log('异常', e)
        } finally {
          this.$store.commit('setLoading', false);
        }
      },
      readArticle(id) {
        const { href } = this.$router.resolve("/articleContent?id=" + id);
        window.open(href, '_blank')
      }
    },
    mounted() {
      this.getBanner()
      this.getArticleList()
    }
  }
</script>

<style scoped>

</style>
