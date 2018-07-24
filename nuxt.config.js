
var path = require('path')




const changeLoaderOptions = (loaders) => {
  if (loaders) {
    for (const loader of loaders) {
      let options
      switch (loader.loader) {
        case 'stylus-loader':
          options = {
            import: [
              '~rupture/rupture/index.styl',
              path.resolve(__dirname, 'assets/stylus/vars/index.styl')
            ]
          }
          break;
      }
      if (options) {
        Object.assign(loader.options, options)
      }
    }
  }
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Beyond Beauty',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "Four women primarily known for their appearances. Discover their inner beauty." },
      { name: 'theme-color', content: '#e1dfd7' },
      { name: 'msapplication-TileColor', content: '#e1dfd7' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      {
        hid: `og:title`,
        property: 'og:title',
        content: 'Beyond Beauty'
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: "Four women primarily known for their appearance. Discover their inner beauty."
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'Beyond Beauty'
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.beyond-beauty.co/'
      },
      {
        hid: 'og:image:width',
        property: 'og:image:width',
        content: '1605'
      },
      {
        hid: 'og:image:height',
        property: 'og:image:height',
        content: '840'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://www.beyond-beauty.co/images/share/general.jpg'
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: 'Beyond Beauty'
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: "Four women primarily known for their appearances. Discover their inner beauty."
      },
      {
        hid: 'twitter:site',
        property: 'twitter:site',
        content: 'Beyond Beauty'
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: 'https://www.beyond-beauty.co/images/share/general.jpg'
      },
      {
        hid: 'twitter:url',
        property: 'twitter:url',
        content: 'https://www.beyond-beauty.co/'
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
      { rel: 'manifest', href: '/favicons/manifest.webmanifest', crossorigin: "use-credentials" }
    ]
  },
  modules: [
    '@nuxtjs/pwa',
    ['@nuxtjs/google-analytics', {
      id: 'UA-122129754-1'
    }]
  ],
  router: {
    base: '/'
  },

  generate: {
    dir: 'beyond-beauty',
    routes: function () {
      var routes_array = []
      var data = JSON.parse(require('fs').readFileSync(`./assets/data.json`, 'utf-8'))
      for (let index = 0; index < data.pages.length; index++) {
        routes_array.push('/story/'+data.pages[index].pageId)

      }
      return routes_array
    }
  },
  /*
  ** Customize the progress bar color
  */
 loading: { color: '#ffffff' },
  plugins: [
    '~plugins/vuex-router-sync.js'
  ],
  css: [
    {src: '~/assets/stylus/main.styl', lang: 'stylus'}
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      const vueLoader = config.module.rules.find(rule => rule.loader === 'vue-loader')
      const { options: { loaders } } = vueLoader || { options: {} }
      if (loaders) {
        for (const loader of Object.values(loaders)) {
          changeLoaderOptions(Array.isArray(loader) ? loader : [loader])
        }
      }
      config.module.rules.forEach(rule => changeLoaderOptions(rule.use))
    }
  },


}
