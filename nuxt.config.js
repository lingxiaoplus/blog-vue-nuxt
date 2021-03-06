let remove_console = []

if (process.env.NODE_ENV === 'production') {
  remove_console.push("transform-remove-console")
}
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [{
      src: '@/plugins/element-ui',
      ssr: false
    },
    '@/plugins/vuetify',
    {
      src: '@/plugins/axios',
      ssr: false
    },
    {
      src: '@/plugins/vue-mavon-editor',
      ssr: false
    },
    {
      src: "@/plugins/echarts",
      ssr: false
    }
  ],
  css: ['element-ui/lib/theme-chalk/index.css', 'assets/main.css'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', "@nuxtjs/sitemap"],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    //publicPath: process.env.PATH_TYPE === 'gray' ? '/_nuxt/' : 'https://blog.lingxiaomz.top/_nuxt/',
    analyze: true, // 使用webpack-bundle-analyzer来可视化包以及如何优化它们
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'svg'],
    vendor: ['element-ui'], //防止多次打包
    babel: {
      'plugins': [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ],
        ...remove_console,
      ]
    }
  },
  env: {
    PATH_TYPE: process.env.PATH_TYPE
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },
  sitemap: {
    path: '/sitemap.xml',
    gzip: true,
    hostname: "https://blog.lingxiaomz.top",
    exclude: [
      "/admin",
      "/admin/**",
      "/404",
    ],
    defaults: {
      priority: .5,
      lastmod: "2020-08-24",
      changefreq: "monthly"
    },
    routes: [
      '/front',
      '/front/articleList',
      '/front/about',
      {
        url: '/front/category',
        changefreq: 'daily',
        priority: 1,
        lastmod: '2020-08-24'
      }
    ]
  }
}
