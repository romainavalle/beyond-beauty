<template>
  <div class="beyond-beauty" :class="{'overflow': process.browser}">
    <v-loader></v-loader>
    <transition name="menuButton" mode="out-in" @beforeEnter="beforeEnter" @enter="enter" @leave="leave" @css="false" v-show="isAppReady">
      <v-logo v-if="logo" ref="logo"></v-logo>
      <v-menu-button v-else ref="menuButton"></v-menu-button>
    </transition>
    <v-home-canvas ref="homeCanvas"></v-home-canvas>
    <v-menu ref="siteMenu"></v-menu>
    <transition name="pageTrans" mode="out-in" @enter="pageEnter" @leave="pageLeave" @css="false">
      <nuxt ref="page" :key="route.params.pageId || route.name"/>
    </transition>
  </div>
</template>

<script>
import Emitter from '~/assets/js/events'
import NoisePosition from '~/assets/js/blobs/NoisePosition.js'
import Stats from 'stats-js'
import { TweenMax } from 'gsap'
import vHomeCanvas from '~/components/HomeCanvas.vue'
import vLogo from '~/components/common/Logo.vue'
import vMenuButton from '~/components/common/MenuButton.vue'
import vLoader from '~/components/common/Loader.vue'
import vMenu from '~/components/menu/Menu.vue'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'

import { mapActions, mapState, mapGetters } from 'vuex'
if(process.browser){
  var MMUnpacker = require('mm-unpacker')
  require('intersection-observer')
  require('gsap/Draggable')
  require('gsap/ThrowPropsPlugin')
}
const load = require('load-asset');


export default {
  data(){
    return {
      isLoaded: false,
      process
    }
  },
  computed:{
    ...mapState(['isAppReady', 'isPageTransition']),
    ...mapGetters(['route']),
    logo(){
      return this.route.name === 'index'
    },
    menuButtonRef() {
      return this.$route.name === 'index' ? 'logo' : 'menuButton'
    }
  },
  components:{vHomeCanvas, vMenu, vLogo, vMenuButton, vLoader},
  methods:{
    ...mapActions(['setPacker', 'setMenuOpen', 'setAppReady','setPageTransition']),
    pageEnter(el, done) {
      TweenMax.set(this.$refs.page.$children[0].$el, {yPercent: 0})
      this.setPageTransition(false)
      this.$refs.homeCanvas.showPage(0,1)
      done()
    },
    pageLeave(el, done) {
      if(this.isPageTransition){
        TweenMax.to(this.$refs.page.$children[0].$el, .8,{yPercent: -50, ease: Expo.easeOut})
        this.$refs.homeCanvas.pageTrans()
        setTimeout(() => {
          done()
        }, 800)
      }else{
        done()
      }
    },
    beforeEnter(el){
      TweenMax.set(el, {opacity: 0})
      TweenMax.set(el.querySelector('canvas'), {scale: 0})
    },
    enter(el, done){
      TweenMax.to(el, 1, {opacity: 1, delay: .5, ease: Quad.easeOut, clearProps: 'all'})
      TweenMax.to(el.querySelector('canvas'), 1, {delay: .5, scale: 1, ease: Quad.easeOut, clearProps: 'all', onComplete: done})
    },
    leave(el, done){
      TweenMax.to(el.querySelector('canvas'), .8, {delay: .2, scale: 0.5, ease: Quad.easeIn})
      TweenMax.to(el, 1, {opacity: 0, ease: Quad.easeIn, onComplete: done})
    },
    resize(forceAfterRoute = false){
      if(this.$refs.page)this.$refs.page.$children[0].resize && this.$refs.page.$children[0].resize(ResizeHelper.width(),ResizeHelper.height())
      if(!forceAfterRoute)this.$refs.homeCanvas.resize(ResizeHelper.width(),ResizeHelper.height())
      if(!forceAfterRoute)this.$refs.siteMenu.resize(ResizeHelper.width(),ResizeHelper.height())
      if(this.$refs.logo && !forceAfterRoute )this.$refs.logo.resize(ResizeHelper.width(),ResizeHelper.height())
      if(this.$refs.menuButton && !forceAfterRoute )this.$refs.menuButton.resize(ResizeHelper.width(),ResizeHelper.height())
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
      NoisePosition.tick()
      this.stats.begin()
      if(this.$refs.logo)this.$refs.logo.tick()
      if(this.$refs.siteMenu)this.$refs.siteMenu.tick()
      if(this.$refs.menuButton)this.$refs.menuButton.tick()
      if(this.$refs.homeCanvas)this.$refs.homeCanvas.tick()
      if(this.$refs.page && this.$refs.page.$children[0])this.$refs.page.$children[0].tick && this.$refs.page.$children[0].tick()
      this.stats.end()
    },
    onReady(){
      this._resize = this.resize.bind(this)
      this._tick = this.tick.bind(this)

      Emitter.on('GLOBAL:RESIZE', this._resize)
      this.page = this.$refs.page.$children[0]
      this.setDebug()
      if(this.page)this.$refs.page.$children[0].onReady && this.$refs.page.$children[0].onReady()
      if(process.browser)this.$refs.homeCanvas.load()
      setTimeout(() => {
        this.setAppReady()
        if(process.browser)this.$refs.homeCanvas.onReady()
        if(process.browser)this.$refs.siteMenu.onReady()
        if(this.$refs.menuButton)this.$refs.menuButton.show()
        if(this.$refs.logo)this.$refs.logo.show()
          if(process.browser)this.$nextTick(()=>{
            TweenMax.ticker.addEventListener('tick', this._tick)
            this.resize()
          })
      },500)
    }
  },
  beforeDestroy(){
    if(process.browser){
      Emitter.removeListener('GLOBAL:RESIZE', this._resize)
      TweenMax.ticker.removeEventListener('tick', this._tick)
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
    this.$router.afterEach((to, from) => {
      this.resize(true)

      setTimeout(() => {
        if(this.$refs.menuButton)this.$refs.menuButton.show()
        if(this.$refs.logo)this.$refs.logo.show()
      }, 1000)
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
    console.log('%cMade with ❤️ 🧡 💛 💚 💙 💜', "font-weight: bold; color: #f7c8ae;");
    console.log('%c🖌 @LouisAnsa', "font-weight: bold; color: #f7b8b0;");
    console.log('%c🖌 @NahelMoussi', "font-weight: bold; color: #f7cfae;");
    console.log('%c⌨️ @Romaindr', "font-weight: bold; color: #f5d4a4;");

  }
}
</script>

<style lang="stylus">
.beyond-beauty
  height 100%
  position relative
  width 100%
  &.overflow
    overflow hidden
  /*&:after
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
    mix-blend-mode overlay*/
</style>
