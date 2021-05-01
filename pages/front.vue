<template>
  <v-app id="inspire">
    <v-app-bar color="primary" dark app>
      <!-- loading条 -->
      <v-progress-linear :active="this.$store.getters.getLoadingState"
                         :indeterminate="this.$store.getters.getLoadingState" absolute bottom background-color="white"
                         color="error">
      </v-progress-linear>
      <v-app-bar-nav-icon class="ml-2">
        <v-avatar size="36">
          <img src="../assets/ic_launcher_round.png" alt="John">
        </v-avatar>
      </v-app-bar-nav-icon>
      <v-toolbar-title>凌霄的博客</v-toolbar-title>
      <v-spacer/>

      <v-row align="center" style="max-width: 400px" v-if="showSearch">
        <v-text-field :autofocus="showSearch" :append-icon-cb="() => {}" placeholder="搜索文章" single-line color="white"
                      hide-details/>
      </v-row>

      <nuxt-link v-for="item in drawerList" :key="item.path" :to="item.path">
        <v-btn
          color="primary" large depressed
          class="white--text"
        >
          <v-icon left dark>{{item.icon}}</v-icon>
          {{item.name}}
        </v-btn>
      </nuxt-link>

      <v-btn icon @click="showSearch = !showSearch">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon dark @click="change2LightOrDark">
        <v-icon>{{lightOrDarkIcon}}</v-icon>
      </v-btn>

      <v-menu offset-y v-if="false">
        <template v-slot:activator="{ on }">
          <v-btn icon dark v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuList"
            :key="front"
            @click="menuClick(item)"
          >
            <v-list-item-title class="px-4">{{ item.name }}</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-menu>

    </v-app-bar>

    <v-main app>
      <v-container fluid @click="onOuterClick">
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app dark fixed padless absolute>
      <v-card
        flat
        tile
        class="primary lighten-1 white--text text-center" style="width: 100%;"
      >
        <v-card-text>
          <v-btn v-for="icon in footerIcon" :key="icon.path" class="mx-4 white--text" icon
                 @click="onFooterClick(icon.path,icon.param)">
            <v-icon size="24px">{{ icon.icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          站点总字数: 194.7k 字 | 总访问量: 38509 次 | 总访问人数: 7317 人 本站已安全运行 {{runningTime}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          <v-btn @click="onFooterClick('https://beian.miit.gov.cn/','')" text>蜀ICP备16028578号</v-btn>
          Copyright © 2018 - {{ new Date().getFullYear() }} — <strong> lingxiao | Powered by vuetify</strong>
        </v-card-text>
      </v-card>
    </v-footer>

    <!-- <div style="position:absolute;width: 100%">
       <vue-particles  :particleOpacity="0.7"
                       linesColor="#ffffff"
                       shapeType="circle"
                       :particleSize="5"
                       :linesWidth="2"
                       :lineLinked="true"
                       :lineOpacity="0.4"
                       :linesDistance="150"
                       :moveSpeed="3"
                       :hoverEffect="true"
                       hoverMode="grab"
                       :clickEffect="true"
                       clickMode="push"  color="#ef0078" style="z-index:0;" :particlesNumber="100">
       </vue-particles>
     </div>-->
<!--    <v-dialog v-model="this.$store.getters.getLoadingState" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          请求数据中...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>-->
  </v-app>
</template>

<script>
  //import colorFul from '@/plugins/click-colorful'
  export default {
    data() {
      return {
        footerIcon: [
          {
            path: 'https://weibo.com/lingxiao123/',
            icon: 'mdi-sina-weibo',
            param: ''
          },
          {
            path: 'https://mail.qq.com/',
            icon: 'mdi-email',
            param: ''
          },
          {
            path: 'http://b.qq.com/webc.htm?new=0&sid=1083514716&o=凌霄的博客&q=7',
            icon: 'mdi-qqchat',
            param: 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no'
          },
          {
            path: '',
            icon: 'mdi-wechat',
            param: ''
          }
        ],
        drawerList: [
          {
            name: '首页',
            icon: 'mdi-home',
            path: '/front/articleList'
          },
          {
            name: '标签',
            icon: 'mdi-label-multiple',
            path: '/front/tags'
          },
          {
            name: '分类',
            icon: 'mdi-electron-framework',
            path: '/front/category'
          },
          {
            name: '归档',
            icon: 'mdi-folder-open',
            path: '/front/timeline'
          },
          {
            name: '友链',
            icon: 'mdi-link-variant',
            path: '/front/friendLink'
          },
          {
            name: '关于',
            icon: 'mdi-information-variant',
            path: '/front/about'
          }
        ],
        showSearch: false,
        menuList: [
          {
            name: '友情链接',
            url: ''
          },
          {
            name: '关于',
            url: 'about'
          }
        ],
        drawer: null,
        runningTime: '',
        lightOrDarkIcon: 'mdi-brightness-6',
        colorBall: '',
        params: '',
        loading: false,
      }
    },
    head() {
      return {
        title: "凌霄的博客",
        meta: [
          {
            hid: 'front-index',
            name: '凌霄的博客名字',
            content: '凌霄的博客描述'
          }
        ]
      }
    },
    watch: {
      currentItem(oldVal, newVal) {
        console.log('oldVal:     ', oldVal, 'newVal:     ', newVal)
      }
    },
    methods: {
      onFooterClick(path, param) {
        window.open(path, '_blank', param)
      },
      change2LightOrDark() {
        if (this.lightOrDarkIcon === 'mdi-brightness-6') {
          this.lightOrDarkIcon = 'mdi-brightness-4'
          this.$vuetify.theme.dark = true
        } else {
          this.lightOrDarkIcon = 'mdi-brightness-6'
          let themeCache = localStorage.getItem('theme_style')
          let themeStyle = JSON.parse(themeCache)
          this.$vuetify.theme.dark = false
          this.$vuetify.theme.themes.light.primary = themeStyle.color
        }

      },
      menuClick(item) {
        this.$router.push(item.url)
      },
      onDrawerClick(path) {
        this.$router.push(path)
      },
      initClickColorful() {
        var params = {
          colors: ['#EC407A', '#66BB6A', '#FFEE58', '#26C6DA'], // 自定义颜色
          size: 30, // 小球大小
          maxCount: 30 // 点击一次出现多少个球
        }
        //params不传，则走默认配置
        this.colorBall = new colorBall(params)

      },
      onOuterClick(e) {
        console.log('>>>>>>>>>>>>', e)

        if (this.colorBall){
          // 绽放一次
          this.colorBall.fly(e.clientX, e.clientY)
        }
        // 绽放5次,间隔300ms
        //color.fly(x, y, 2, 200)
      },
      show_date_time() {
        window.setTimeout(() => {
          this.show_date_time()
        }, 1000)
        let BirthDay = new Date('08-14-2018 12:12:24')//建站日期
        let today = new Date()
        let timeold = (today.getTime() - BirthDay.getTime())
        let sectimeold = timeold / 1000
        let secondsold = Math.floor(sectimeold)
        const msPerDay = 24 * 60 * 60 * 1000
        let e_daysold = timeold / msPerDay
        let daysold = Math.floor(e_daysold)
        let e_hrsold = (daysold - e_daysold) * -24
        let hrsold = Math.floor(e_hrsold)
        let e_minsold = (hrsold - e_hrsold) * -60
        let minsold = Math.floor((hrsold - e_hrsold) * -60)
        let seconds = Math.floor((minsold - e_minsold) * -60)
        this.runningTime = daysold + '天' + hrsold + '小时' + minsold + '分' + seconds + '秒'
      },
      async getTheme() {
        try {
          let resp = await this.$http.get(`/theme/1`)
          let themeStyle = resp.data.data
          this.$vuetify.theme.themes.light.primary = themeStyle.color
          localStorage.setItem('theme_style', JSON.stringify(themeStyle))
          console.log('获取主题信息', themeStyle)
        } catch (e) {
          console.log('获取主题信息失败', e)
        } finally {
        }
      }
    },
    mounted() {
      let date = new Date()
      let hours = date.getHours()
      if (hours > 19) {
        this.lightOrDarkIcon = 'mdi-brightness-4'
        this.$vuetify.theme.dark = true
      } else {
        this.getTheme()
      }
      this.show_date_time()
      require("@/plugins/click-colorful")
      this.initClickColorful()
    }
  }
</script>

<style>
</style>
