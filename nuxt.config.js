
var path = require('path')




const changeLoaderOptions = (loaders) => {
  if (loaders) {
    for (const loader of loaders) {
      let options
      switch (loader.loader) {
        case 'stylus-loader':
          options = {
            import: [
              /*'~rupture/rupture/index.styl',*/
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
      lang: 'fr',
    },
    title: 'Beyond Beauty',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "description beyond beauty" },
      { name: 'theme-color', content: '#0d2755' },
      { name: 'msapplication-TileColor', content: '#0d2755' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      {
        hid: `og:title`,
        property: 'og:title',
        content: 'content title'
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: "description beyond beauty"
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'content title'
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://urldusite/'
      },
      {
        hid: 'og:image:width',
        property: 'og:image:width',
        content: '1200'
      },
      {
        hid: 'og:image:height',
        property: 'og:image:height',
        content: '630'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://urldusite/assets/images/share/facebook.jpg'
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: 'content title'
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: "description"
      },
      {
        hid: 'twitter:site',
        property: 'twitter:site',
        content: ''
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: 'https://urldusite/assets/images/share/twitter.jpg'
      },
      {
        hid: 'twitter:url',
        property: 'twitter:url',
        content: 'https://urldusite/'
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/assets/favicons/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '180x180', href: '/assets/favicons/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/favicons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/favicons/favicon-16x16.png' },
      { rel: 'mask-icon', color: '#0d2755', href: '/assets/favicons/safari-pinned-tab.svg' },
      { rel: 'manifest', href: '/assets/favicons/manifest.webmanifest', crossorigin: "use-credentials" }
    ]
  },
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
