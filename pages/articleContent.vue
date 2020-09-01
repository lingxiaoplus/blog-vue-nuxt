<template>
  <v-app id="inspire">
    <v-snackbar v-model="snackbar" color="error" :timeout="3000" :bottom="true">
      {{ snackbarText }}
    </v-snackbar>
    <v-progress-linear :active="loading" indeterminate absolute top color="pink" height="5">
    </v-progress-linear>
    <v-card class="overflow-hidden" elevation="0">
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
      <v-app-bar color="primary" dark flat elevate-on-scroll elevation="6" shrink-on-scroll prominent
                 :src="article.headImage"
                 extension-height="100" extended scroll-target="#scrolling-techniques-2">
        <template v-slot:img="{ props }">
          <v-img v-bind="props" gradient="to top right, rgba(19,84,122,.1), rgba(128,208,199,.4)"></v-img>
        </template>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>{{article.title}}</v-toolbar-title>
        <v-spacer/>


        <v-menu>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon v-on="{ ...tooltip, ...menu }" @click="createQrImage">
                  <v-icon>mdi-desktop-classic</v-icon>
                </v-btn>
              </template>
              <span>在其他设备上继续阅读</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item>
              <!--:logoSrc="imageUrl"-->
              <no-ssr>
                <vue-qr
                  :text="qr_content" :gifBgSrc="bgGifUrl" :dotScale="0.4" :callback="test" :size="200"></vue-qr>
              </no-ssr>
            </v-list-item>
          </v-list>
        </v-menu>

        <!--<v-btn icon @click="createQrImage">
          <v-icon>mdi-desktop-classic</v-icon>
        </v-btn>-->

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-sheet id="scrolling-techniques-2" class="overflow-y-auto" max-height="1200">

        <v-container class="pa-6" id="scrolling-container">
          <!--文章内容-->
          <v-layout row wrap>
            <v-hover v-slot:default="{ hover }">
              <v-card :elevation="hover?12:2" style="width: 100%;">
                <!-- <v-img :src="article.headImage" >
                <v-card-title style="position: absolute;bottom: 0px;color: white">{{article.title}}</v-card-title>
              </v-img> -->
                <v-card-text>
                  <no-ssr>
                    <mavon-editor v-model="article.content"
                                  :toolbarsFlag="false" defaultOpen="preview" :subfield="false"
                                  :editable="false" :navigation="false" :previewBackground="primaryColor"
                    ></mavon-editor>
                  </no-ssr>
                </v-card-text>
                <v-card-actions class="d-flex">
                  <el-link class="pa-2" style="color: #909399"><i class="el-icon-time el-icon--left">
                    {{article.createAt}}</i></el-link>

                  <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>

                  <v-menu bottom origin="center center" transition="scale-transition">
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-share-variant</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item v-for="(item, i) in shareList" :key="i" @click="onShareItem(item)">
                        <v-list-item-icon>
                          <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                </v-card-actions>
              </v-card>
            </v-hover>

            <v-flex class="py-4" xs12 md12>
              <v-form ref="form" lazy-validation>
              <v-card elevation="0">
                <v-card-title>发表评论</v-card-title>


                <v-card-actions>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="昵称" v-model="commentData.username" :rules="[rules.base]" prepend-icon="mdi-account-alert-outline "></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="邮箱" v-model="commentData.email" :rules="[rules.base,rules.email]" prepend-icon="mdi-email-check-outline"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-actions>

                <v-card-actions>
                  <v-text-field label="网站(如果有)http(s)://" prepend-icon="mdi-link" v-model="commentData.website" ></v-text-field>
                </v-card-actions>

                <v-card-actions>
                  <v-textarea :label="commentContentHint"
                              v-model="commentData.content" counter
                              prepend-icon="mdi-android-messages" :rules="[rules.base,rules.content]"></v-textarea>
                </v-card-actions>

                <v-card-actions class="d-flex">
                  <v-btn color="primary" class="ml-auto" tile min-width="86px" @click="addComment">发射</v-btn>
                </v-card-actions>
              </v-card>
              </v-form>
            </v-flex>

            <v-flex class="py-4" xs12 md12>
              <v-card elevation="2">
                <v-card-title>当前评论</v-card-title>

                <v-list>
                  <v-list-group
                    v-for="item in comments"
                    :key="item.id"
                    v-model="item.active"
                    no-action
                  >

                    <template v-slot:activator>
                      <v-list-item-icon>
                        <v-avatar color="primary" size="40">
                          <span class="white--text headline">{{item.username.substring(0,1)}}</span>
                        </v-avatar>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title v-text="item.username"></v-list-item-title>
                        <v-list-item-subtitle v-text="item.createAt"></v-list-item-subtitle>
                        <v-list-item-subtitle v-text="item.content"></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn text @click="replay(item)">
                          回复
                        </v-btn>
                      </v-list-item-action>
                    </template>

                    <v-list-item
                      v-if="item.replies"
                      v-for="subItem in item.replies"
                      :key="subItem.id"
                      @click=""
                    >
                      <v-list-item-icon>
                        <v-avatar color="primary" size="40">
                          <span class="white--text headline">{{subItem.username.substring(0,1)}}</span>
                        </v-avatar>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="subItem.username"></v-list-item-title>
                        <v-list-item-subtitle v-text="subItem.createAt"></v-list-item-subtitle>
                        <v-list-item-title v-text="subItem.content"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                </v-list>

              </v-card>


            </v-flex>

          </v-layout>


        </v-container>

      </v-sheet>
      <v-fab-transition class="mx-2">
        <v-btn key="keyboard_arrow_up" color="green" fixed fab large dark bottom right @click="backTop">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-fab-transition>

    </v-card>


  </v-app>
</template>

<script>
  // 引入markdown组件
  //import markdown from '../../components/markdown';

  export default {
    data() {
      return {
        currentItem: 0,
        snackbar: false,
        snackbarText: '',
        loading: true,
        article: {
          id: '',
          title: '',
          content: '',
          headImage: ''
        },
        shareList: [
          {
            icon: 'mdi-folder-image',
            title: '生成分享图'
          },
          {
            icon: 'mdi-sina-weibo',
            title: '分享到 微博'
          },
          {
            icon: 'mdi-qqchat',
            title: '分享到 qq'
          },
          {
            icon: 'mdi-wechat',
            title: '分享到 微信'
          }
        ],
        rules: {
          base: value => value.length > 0 || '请填写内容',
          content: value => value.length < 500 || '评论内容长度不符合规范',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'e-mail格式不正确'
          }
        },
        commentContentHint: '说点什么...',
        pageNum: 1,
        pageSize: 5,
        articleId: '',
        comments: [],
        userInfo: '',
        imageUrl: require('../assets/website_logo.png'),
        bgGifUrl: require('../assets/dog.gif'),
        qr_content: '',
        isTop: false,
        primaryColor: '#fbfbfb',
        commentData:{
          parentId: '',
          userId: '',
          articleId: '',
          content: '',
          username: '',
          email: '',
          website: '',
        }
      }
    },
    watch: {
      currentItem(oldVal, newVal) {

      }
    },
    head() {
      return {
        title: this.article.title,
        meta: [
          {
            hid: 'article-content',
            name: '文章内容',
            content: '文章内容'
          }
        ]
      }
    },
    methods: {
      backTop() {
        if (this.isTop) return
        var sheet = document.getElementById('scrolling-techniques-2')
        var timer = setInterval(function() {
          //let osTop = document.documentElement.scrollTop || document.body.scrollTop || sheet.scrollTop;
          let osTop = sheet.scrollTop
          let ispeed = Math.floor(-osTop / 5)
          document.documentElement.scrollTop = 0
          //document.documentElement.scrollTop = document.body.scrollTop = sheet.scrollTop = osTop + ispeed;
          sheet.scrollTop = osTop + ispeed
          console.log('距离', sheet.scrollTop)
          this.isTop = true
          if (osTop === 0) {
            clearInterval(timer)
          }
        }, 30)
      },
      test(dataUrl) {
        console.log('二维码', dataUrl)
      },
      childEventHandler: function(res) {
        // res会传回一个data, 包含属性mdValue和htmlValue，具体含义请自行翻译
        this.article.content = res
      },
      async getArticleContent(id) {
        try {
          this.loading = true
          let response = await this.$http.get('/front/article/' + id)
          //console.log("结果", response.data.data);
          this.article = response.data.data
          //this.article.editContent = response.data.data.content;
        } catch (e) {
          console.log('查询文章失败', e.response.data)
          this.snackbar = true
          this.snackbarText = e.response.data.message ? e.response.data.message : '网络异常，请稍后再试'
        } finally {
          this.loading = false
        }
      },
      onShareItem(item) {

      },
      async getComments(id) {
        try {
          this.loading = true
          let resp = await this.$http.get(`/front/comments/${id}
                ?pageNum=${this.pageNum}&pageSize=${this.pageSize}`)
          this.comments = resp.data.data
        } catch (e) {
          this.snackbar = true
          this.snackbarText = e.response.data? e.response.data.message : '网络异常，请稍后再试'
        } finally {
          this.loading = false
        }
      },
      async addComment() {
        let pass = this.$refs.form.validate();
        if (!pass){
          return ;
        }
        try {
          let resp = await this.$http.post('/comment',this.commentData)
          console.log(resp.data)
          this.$message({
            message: '评论提交成功',
            type: 'success'
          })
          this.getComments(this.articleId)
        } catch (e) {
          console.log('评论失败', e)
          this.snackbar = true
          this.snackbarText = e.response.data.message ? e.response.data.message : '网络异常，请稍后再试'
        }

      },
      replay(item){
        this.commentContentHint = '对@' + item.username + ' 说点什么...'
        this.commentData.parentId = item.id
      },
      async getUserInfo() {
        let user_info = JSON.parse(localStorage.getItem('user_info'))
        console.log('用户信息', user_info)
        if (!user_info) {
          let res = await this.$http.get('/user/verify')
          user_info = res.data.data
          localStorage.setItem('user_info', JSON.stringify(res.data.data))
        }
        this.userInfo = user_info
        this.commentData.username = user_info.nickname
        this.commentData.email = user_info.email
      },
      createQrImage(){

      }
    },
    mounted() {
      let date = new Date()
      let hours = date.getHours()
      if (hours > 19) {
        //this.lightOrDarkIcon = 'mdi-brightness-4';
        this.$vuetify.theme.dark = true
        //this.primaryColor = colors.grey.darken1
      }

      let href = window.location.href
      console.log('链接', href)
      this.qr_content = href
      let tmpUrlSearch = window.location.search
      let tmpParas = GetRequestParameters(tmpUrlSearch)
      let id = tmpParas['id'] //提取code参数, 用于获取openid
      this.articleId = id
      this.commentData.articleId = id;
      this.getArticleContent(id)
      this.getComments(id)
      this.getUserInfo()
    }
  }

  export const GetRequestParameters = (locationsearch) => {
    let url = locationsearch
    let theRequest = new Object()
    if (url.indexOf('?') != -1) {
      let str = url.substr(1)
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1])
      }
    }
    return theRequest
  }
</script>

<style>

</style>
