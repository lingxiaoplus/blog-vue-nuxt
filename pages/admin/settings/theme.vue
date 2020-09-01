<template>
  <div>
    <v-row>

      <v-col cols="2">
        <v-card-text class="font-weight-bold">选择颜色：</v-card-text>
      </v-col>
      <v-col cols="10">
        <v-color-picker v-model="color" show-swatches hide-canvas hide-inputs></v-color-picker>
      </v-col>


      <v-col cols="2">
        <v-card-text class="font-weight-bold">文章列表样式：</v-card-text>
      </v-col>
      <v-col cols="10">
        <v-select
          transition="slide-x-transition"
          style="max-width: 240px"
          :items="articelListStyle"
          v-model="themeStyle.articleStyle"
          label="请选择文章列表样式"
        ></v-select>
      </v-col>


      <v-col cols="2">
        <v-card-text class="font-weight-bold">首页图片：</v-card-text>
      </v-col>
      <v-col cols="10">
        <v-row>
          <v-col cols="6">
            <v-text-field
              :value="themeStyle.homeImage"
              label="当前图片"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" tile>选择图片</v-btn>
            <v-btn color="blue text--lighten-1" tile>使用必应美图</v-btn>
          </v-col>
        </v-row>
      </v-col>


      <v-col cols="2">
        <v-card-text class="font-weight-bold">抽屉菜单顶部图片：</v-card-text>
      </v-col>

      <v-col cols="10">
        <v-row>
          <v-col cols="6">
            <v-text-field
              :value="themeStyle.slideImage"
              label="当前图片"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" tile>选择图片</v-btn>
          </v-col>
        </v-row>

      </v-col>


      <v-col cols="2">
        <v-card-text class="font-weight-bold">页面格言：</v-card-text>
      </v-col>
      <v-col cols="10">
        <v-row>
          <v-col cols="6">
            <v-text-field :value="themeStyle.motto"
                          label="当前的格言"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" tile>使用一言API</v-btn>
          </v-col>
        </v-row>
        <p class="text--disabled">
          这句话会显示在每个页面的页脚，如果不希望显示，请留空。
          若调用一言 API，则每次页面刷新后都会显示不同的格言。此 API 来自 LWL，虽然此来源较为安全，但还请注意安全风险。
        </p>
      </v-col>


      <v-col cols="2">
        <v-card-text class="font-weight-bold">页脚内容：</v-card-text>
      </v-col>
      <v-col cols="10">
        <v-textarea clearable label="请输入页脚内容" :value="themeStyle.footer"></v-textarea>
      </v-col>

      <v-col cols="2">
        <v-card-text class="font-weight-bold">自动夜间模式：</v-card-text>
      </v-col>
      <v-col cols="10">
        <v-switch
          v-model="themeStyle.autoNight"
          color="primary"
          :label="`自动夜间模式: ${themeStyle.autoNight?'开启':'关闭'}`"
        ></v-switch>
      </v-col>


      <v-col cols="2">
        <v-card-text class="font-weight-bold">SEO 关键词：</v-card-text>
      </v-col>
      <v-col cols="10">
        <v-text-field
          :value="themeStyle.seoKeyword"
          label="当前图片"
        ></v-text-field>
        <p class="text--disabled">用半角逗号分割关键词，数量在5个以内最佳。留空代表不开启此功能。</p>

      </v-col>

      <v-col cols="12" flat class="d-flex justify-end">
        <v-btn color="primary" tile class="mr-4" @click="saveTheme()" :loading="loading">保存更改</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //color: '',
        type: 'hex',
        articelListStyle: ['网格', '简介', '单列'],
        articleStyle: '',
        autoNight: true,
        themeStyle: {
          color: '',
          articleStyle: '',
          homeImage: 'https://cn.bing.com/th?id=OHR.LakeGullMN_ZH-CN5281494536_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp',
          slideImage: 'https://s1.ax1x.com/2018/05/13/CD6QFH.jpg',
          motto: '一言API https://v1.hitokoto.cn',
          footer: '',
          autoNight: true,
          seoKeyword: ''
        },
        loading: false
      }
    },

    computed: {
      color: {
        get() {
          return this[this.type]
        },
        set(v) {
          this[this.type] = v
          console.log('set color: ', v,"vuetify theme: ", this.$vuetify.theme.themes)
          this.$vuetify.theme.themes.light.primary = v.hex
          this.$vuetify.theme.themes.dark.primary = v.hex
          this.themeStyle.color = v.hex
          // Light theme
          //this.$vuetify.theme.themes.light.primary = '#4caf50'
          // Dark theme
          //this.$vuetify.theme.themes.dark.primary = '#4caf50'
        }
      }

    },
    mounted() {
      let theme_style = JSON.parse(localStorage.getItem('theme_style'))
      this.themeStyle = theme_style
      this.color = this.$vuetify.theme.themes.light.primary
    },
    methods: {
      showColor() {
        if (typeof this.color === 'string') return this.color
        return JSON.stringify(Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2))
          return color
        }, {}), null, 2)
      },
      async saveTheme() {
        try {
          this.$store.commit('setLoading', true)
          this.loading = true
          let resp = await this.$http.post('/theme', this.themeStyle)
          this.$message.success('保存成功')
          //this.themeStyle.color = this.$vuetify.theme.themes.light.primary;
          localStorage.setItem('theme_style', JSON.stringify(this.themeStyle))
        } catch (e) {
          console.log('保存主题失败', e)
          this.$message.error(e.response.data.message ? e.response.data.message : '保存失败，请稍后再试')
        } finally {
          this.$store.commit('setLoading', false)
          this.loading = false
        }
      }
    }
  }


</script>

<style>
</style>
