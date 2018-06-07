<template>
  <div class="beyond-beauty">
    <transition name="menuButton" mode="out-in">
      <component :is="logo"></component>
    </transition>
    <v-home-canvas ref="homeCanvas"></v-home-canvas>
    <v-menu ref="siteMenu"></v-menu>
    <nuxt v-if="isLoaded" ref="page"/>
  </div>
</template>

<script>
import Emitter from '~/assets/js/events'
import Stats from 'stats-js'

import vHomeCanvas from '~/components/HomeCanvas.vue'
import vLogo from '~/components/common/Logo.vue'
import vMenuButton from '~/components/common/vMenuButton.vue'
import vMenu from '~/components/menu/Menu.vue'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'

import { mapActions, mapState } from 'vuex'
if(process.browser){
  require('gsap/ScrollToPlugin')
  var MMUnpacker = require('mm-unpacker')
}
const load = require('load-asset');


export default {
  data(){
    return {
      isLoaded: false
    }
  },
  computed:{
    logo(){
      return this.$route.name === 'index' ? vLogo : vMenuButton
    }
  },
  components:{vHomeCanvas, vMenu, vLogo, vMenuButton},
  methods:{
    ...mapActions(['setPacker', 'setMenuOpen']),
    resize(){
      if(this.page)this.page.resize && this.page.resize(ResizeHelper.width(),ResizeHelper.height())
      this.$refs.homeCanvas.resize(ResizeHelper.width(),ResizeHelper.height())
      this.$refs.siteMenu.resize(ResizeHelper.width(),ResizeHelper.height())
    },
    setDebug() {
      this.stats = new Stats();
      document.body.appendChild( this.stats.domElement );
      this.stats.domElement.style.position = 'fixed';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
    },
    tick(){
      this.stats.begin()
      this.$refs.siteMenu.tick()
      this.$refs.homeCanvas.tick()
      if(this.page)this.page.tick && this.page.tick()
      this.stats.end()
    },
    onReady(){
      Emitter.on('GLOBAL_RESIZE', this.resize.bind(this))
      this.page = this.$refs.page.$children[0]
      this.setDebug()
      if(this.page)this.page.onReady && this.page.onReady()
      if(process.browser)this.$refs.homeCanvas.onReady()
      if(process.browser)this.$refs.siteMenu.onReady()
      this.$nextTick(() => {
        TweenMax.ticker.addEventListener('tick', this.tick.bind(this))
      })

      if(process.browser)this.$nextTick(()=>{
        this.resize()
      })
    }
  },
  created(){
    this.date = new Date()
  },
  async mounted () {
    this.$router.beforeEach((to, from, next) => {
      this.setMenuOpen(false)
      next()
    })
     // todo -> promise polyfill
    const path = process.env.NODE_ENV === 'dev' ? '/' : ''
    const assets =  await load.all([{ url: `${path}packed/pack.json`, type: 'json' },{ url: `${path}packed/pack.pack`, type: 'binary' }])
    if(process.browser){
      const unpacker = new MMUnpacker(assets[1], assets[0]);
      window.unpacker = unpacker
      this.setPacker(unpacker)
    }
    this.isLoaded = true
    this.$nextTick(this.onReady.bind(this))
  }
}
</script>

<style lang="stylus">
.beyond-beauty
  height 100%
  position relative
  width 100%
  &:after
    background url('~/assets/images/noise.jpg')
    background-size 256px 256px
    content ''
    display block
    height 100vh
    left 0
    opacity 0.4
    pointer-events none
    position fixed
    top 0
    width 100vw
    z-index 99999
    mix-blend-mode overlay
  .menuButton-enter-active, .menuButton-leave-active
    transition opacity 1s ease-in-out-quad, transform 1s ease-in-out-quad
  .menuButton-enter, .menuButton-leave-to
    opacity 0
    transform scale(0.6, 0.6)
</style>
