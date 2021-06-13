<template>
  <v-app id="inspire">

    <v-snackbar v-model="this.$store.getters.getSnackbarState.show" :color="this.$store.getters.getSnackbarState.color"
                :timeout="2000" :top="true">
      {{ this.$store.getters.getSnackbarState.text }}
    </v-snackbar>

    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item>
          <v-avatar size="40">
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
          </v-avatar>
          <v-list-item-content>
            <v-list-item-title style="margin-left: 20px;">{{ user_name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider/>

      <v-list dense>
        <v-list-group v-for="item in items" :key="item.name" no-action :prepend-icon="item.icon"
                      v-if="item.keepAlive === 1">
          <!--一级菜单 -->
          <template slot="activator">
            <!-- <v-list-item-action>
              <v-icon >mdi-{{item.action}}</v-icon>
            </v-list-item-action> -->
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <!-- 二级菜单 -->
          <v-list-item v-for="subItem in item.children" :key="subItem.name" :to="subItem.url"
                       @click="onPathChanged(item,subItem)" v-if="subItem.keepAlive === 1">
            <v-list-item-content>
              <v-list-item-title>{{ subItem.name }}</v-list-item-title>
            </v-list-item-content>
            <!-- <v-list-item-action>
              <v-icon>mdi-{{subItem.action}}</v-icon>
            </v-list-item-action> -->
          </v-list-item>
        </v-list-group>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar app :color="darkMode?'':'primary'" dark>
      <!-- loading条 -->
      <v-progress-linear @setLoading="setLoadingState" :active="this.$store.getters.getLoadingState"
                         :indeterminate="this.$store.getters.getLoadingState" absolute bottom background-color="white"
                         color="error">
      </v-progress-linear>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>后台管理系统</v-toolbar-title>
      <v-spacer/>

      <v-btn icon dark @click="change2LightOrDark">
        <v-icon>{{ lightOrDarkIcon }}</v-icon>
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon dark v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuList"
            :key="item.id"
            @click="menuClick(item)"
          >
            <v-list-item-title class="px-4">{{ item.name }}</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-menu>

    </v-app-bar>

    <v-main>
      <!-- 面包屑 -->
      <v-breadcrumbs :items="menuMap">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <!-- 界面内容显示区域 -->

      <div>


        <v-row v-if="loading">
          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="card-avatar, article, actions"></v-skeleton-loader>
            <v-skeleton-loader v-bind="attrs" type="date-picker"></v-skeleton-loader>
          </v-col>

          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="article, actions"></v-skeleton-loader>
            <v-skeleton-loader v-bind="attrs"
                               type="table-heading, list-item-two-line, image, table-tfoot"></v-skeleton-loader>
          </v-col>

          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs"
                               type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"></v-skeleton-loader>
            <v-skeleton-loader v-bind="attrs" type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
          </v-col>
        </v-row>
        <transition mode="out-in">
          <v-container fluid>
            <router-view/>
          </v-container>

        </transition>
      </div>
    </v-main>
    <!-- <v-footer color="primary" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import menus from '../plugins/menu.js'

export default {
  props: {
    source: String

  },
  data: () => ({
    drawer: null,
    attrs: {
      class: 'mb-2',
      boilerplate: false,
      elevation: 2
    },
    menuMap: [],
    user_name: 'admin',
    loading: false,
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'success',
    colors: ['success', 'error', 'warning', 'info'],
    menuList: [
      {
        name: '布局设置',
        action: 'layout'
      },
      {
        name: '退出登录',
        action: 'logout'
      }
    ],
    defMenu: {
      icon: 'mdi-home', name: '首页', url: '/admin', keepAlive: 1,
      children: [{
        name: '统计',
        url: '/admin/home/dashboard',
        keepAlive: 1
      }]
    },
    items: [],
    lightOrDarkIcon: 'mdi-brightness-6',
    primaryColor: '#424242',
    darkMode: false
  }),
  computed: {
    /*items() {
        return menus.drawers;
    },*/
    themes() {
      return menus.themes
    }
  },
  head() {
    return {
      title: '博客后台管理系统',
      meta: [
        {
          hid: 'admin-index',
          name: '博客后台管理系统',
          content: '后台管理系统'
        }
      ]
    }
  },
  methods: {
    change2LightOrDark() {
      if (this.lightOrDarkIcon === 'mdi-brightness-6') {
        this.lightOrDarkIcon = 'mdi-brightness-4'
        this.$vuetify.theme.dark = true
        this.primaryColor = '#424242'
        this.darkMode = true
      } else {
        this.lightOrDarkIcon = 'mdi-brightness-6'
        let themeCache = localStorage.getItem('theme_style')
        let themeStyle = JSON.parse(themeCache)
        this.$vuetify.theme.dark = false
        this.$vuetify.theme.themes.light.primary = themeStyle.color
        this.primaryColor = themeStyle.color
        this.darkMode = false
      }

    },
    menuClick(item) {
      switch (item.action) {
        case 'logout':
          this.logout()
          break
        default:
          break
      }
    },
    onPathChanged(item, subItem) {
      var map = []
      map.push({
        text: item.name,
        disabled: false,
        href: item.url
      })
      map.push({
        text: subItem.name,
        disabled: true,
        href: subItem.url
      })
      this.menuMap = map
      console.log('menuMap: ', this.menuMap)
    },
    async logout() {
      try {
        this.items = [this.defMenu]
        let resp = await this.$http.get('/logout')
        localStorage.setItem('blog_login_token', '')
        this.delCookie()
        this.$router.push('/user/login')
      } catch (e) {
        console.log('获取菜单失败', e)
      }
    },
    async getMenuData() {
      try {
        this.items = [this.defMenu]
        let resp = await this.$http.get('/menu')
        console.log('菜单', resp.data.data)
        this.items = this.items.concat(resp.data.data)
        localStorage.setItem('menu_info', JSON.stringify(resp.data.data))
      } catch (e) {
        console.log('获取菜单失败', e)
      }
    },
    setLoadingState(loading) {
      console.log('设置状态>>>>>>>>>', loading)
    },
    async getTheme(uid) {
      try {
        let resp = await this.$http.get(`/theme/${uid}`)
        let themeStyle = resp.data.data
        themeStyle.id = uid
        this.$vuetify.theme.themes.light.primary = themeStyle.color
        localStorage.setItem('theme_style', JSON.stringify(themeStyle))
        console.log('获取主题信息', themeStyle)
        this.$router.push('/admin/home/dashboard')
      } catch (e) {
        console.log('获取主题信息失败', e)
      } finally {

      }
    },
    delCookie() {
      var keys = document.cookie.match(/[^ =;]+(?==)/g)
      if (keys) {
        for (var i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
          document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
          document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
        }
      }
    }
  },

  mounted() {
    console.log('>>>>>>>>>>>>', this.menuMap)
    //初始化面包屑
    let menu = this.defMenu
    this.items.push(menu)
    this.menuMap[0] = {
      text: menu.name,
      disabled: false,
      href: menu.url
    }
    this.menuMap[1] = {
      text: menu.children[0].name,
      disabled: false,
      href: menu.children[0].url
    }
    this.loading = true
    this.$http.get('/user/verify')
      .then(res => {
        //console.log('登录有效', res.data)
        this.user_name = res.data.data.nickname
        localStorage.setItem('user_info', JSON.stringify(res.data.data))
        this.getTheme(res.data.data.userId)
        this.loading = false
      }).catch(e => {
      this.loading = false
      console.log('登录失败', e)
      this.$router.push('/user/login')
    })
    this.getMenuData()
  }
}
</script>

<style>
.v-enter {
  opacity: 0;
}

.v-enter-active {
  transition: 0.5s;
}

.v-enter-to {
  opacity: 1;
}

.v-leave {
  opacity: 1;
}

.v-leave-to {
  opacity: 0;
}

.v-leave-active {
  transition: 0.5s;
}
</style>
