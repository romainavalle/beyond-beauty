importScripts('/_nuxt/workbox.3de3418b.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "beyond-beauty",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/app.2826a2af65a099110b39.js",
    "revision": "47468119a1fec5d04cd263df49206630"
  },
  {
    "url": "/_nuxt/layouts/default.728d44fc5faddda66f7c.js",
    "revision": "2ec73b5ecb5076a828eb72d118ac9b1c"
  },
  {
    "url": "/_nuxt/layouts/pageTransition.1e659be321d0fc5dbdc9.js",
    "revision": "8936c060b2266db9097069a9b5d38426"
  },
  {
    "url": "/_nuxt/manifest.a62e64aae90cc28f582b.js",
    "revision": "c73bce79337e5890464ffcb4e593d1dd"
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
    "url": "/_nuxt/pages/index.d4fe7fdec4e079c54082.js",
    "revision": "654fbc219433650a7d9d754795f29fd4"
  },
  {
    "url": "/_nuxt/pages/story/_pageId.ab50d6750abf70bd1cc0.js",
    "revision": "d7ff5afe7ad69c724a3ad4771237982d"
  },
  {
    "url": "/_nuxt/vendor.98f174c97ed70aaa1597.js",
    "revision": "85d654ddf3e62c9279b34a1e9a442cea"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

