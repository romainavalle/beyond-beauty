importScripts('/_nuxt/workbox.3de3418b.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "beyond-beauty",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/app.951b1bee5480921720d1.js",
    "revision": "da5b2a9661d8e43197cd44a044c3fc44"
  },
  {
    "url": "/_nuxt/layouts/default.b3daa0f8c6cdb9e20c1b.js",
    "revision": "f9eb98de2920480b7f48d45f8c9afb88"
  },
  {
    "url": "/_nuxt/layouts/pageTransition.1e659be321d0fc5dbdc9.js",
    "revision": "8936c060b2266db9097069a9b5d38426"
  },
  {
    "url": "/_nuxt/manifest.a9ca5691c923381ae782.js",
    "revision": "67652bc29cb2728fd82d81c4f62c39e6"
  },
  {
    "url": "/_nuxt/pages/*.1146a47a374d022eedcc.js",
    "revision": "78376e2b68bf6c03dce68115703d1111"
  },
  {
    "url": "/_nuxt/pages/about.c337e8c94952d4d7aa6d.js",
    "revision": "be649714ad3947a5c54a3db66acd4baf"
  },
  {
    "url": "/_nuxt/pages/index.c4949fc599aad2cf5b99.js",
    "revision": "9fd3ec1949865d3106e3f52980a351b0"
  },
  {
    "url": "/_nuxt/pages/story/_pageId.501d92103a4d71fa1e00.js",
    "revision": "42f4d30bc7e4c66a63d4e6ee6e8af7bc"
  },
  {
    "url": "/_nuxt/vendor.5e5af47b8e86e21c9942.js",
    "revision": "436a7fb408ce33d5fecce4707f19034c"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

