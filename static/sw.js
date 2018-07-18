importScripts('/_nuxt/workbox.3de3418b.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "beyond-beauty",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/app.57de5e3086bf80c28f26.js",
    "revision": "b85b06a136c6b9cff2d4187b25a21524"
  },
  {
    "url": "/_nuxt/layouts/default.d9ec0c7dff3b7de7af3a.js",
    "revision": "30b1c50a467347f93dd5cd746aad208f"
  },
  {
    "url": "/_nuxt/layouts/pageTransition.1e659be321d0fc5dbdc9.js",
    "revision": "8936c060b2266db9097069a9b5d38426"
  },
  {
    "url": "/_nuxt/manifest.03ca16aed7b0086b6f92.js",
    "revision": "620eb51348e2f9ee7107b7bf56204b23"
  },
  {
    "url": "/_nuxt/pages/*.1146a47a374d022eedcc.js",
    "revision": "78376e2b68bf6c03dce68115703d1111"
  },
  {
    "url": "/_nuxt/pages/about.07422216f5f9044a750d.js",
    "revision": "24427826cc59950b47a062ca8f353907"
  },
  {
    "url": "/_nuxt/pages/index.c4949fc599aad2cf5b99.js",
    "revision": "9fd3ec1949865d3106e3f52980a351b0"
  },
  {
    "url": "/_nuxt/pages/story/_pageId.f057bc3addccef20d522.js",
    "revision": "49aa5a9564cb2774a24a4892113ef6b8"
  },
  {
    "url": "/_nuxt/vendor.98f174c97ed70aaa1597.js",
    "revision": "85d654ddf3e62c9279b34a1e9a442cea"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

