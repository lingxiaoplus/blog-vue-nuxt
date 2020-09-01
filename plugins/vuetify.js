import Vue from 'vue';
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
Vue.use(Vuetify,{
  icons: {
    iconfont: 'mdi',
  },
  dark: false,
  themes: {
    light: {
      primary: colors.lightBlue,
      secondary: colors.grey.darken1,
      accent: colors.shades.black,
      error: colors.red.accent3,
    },
    dark:{
      primary: colors.grey.darken3,
      secondary: colors.grey.darken3,
      accent: colors.grey.darken3,
      error: colors.grey.darken3,
    },
    options: {
      customProperties: true,
    },
  },
})
