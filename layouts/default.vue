<template>
  <div class="beyond-beauty" :class="{'overflow': process.browser}">
    <v-loader ref="loader"></v-loader>
    <v-logo ref="logo"></v-logo>
    <v-menu-button  ref="menuButton"></v-menu-button>
    <v-menu ref="siteMenu"></v-menu>
    <v-home-canvas ref="homeCanvas"></v-home-canvas>
    <transition name="pageTrans" mode="out-in" @enter="pageEnter" @leave="pageLeave" @css="false">
      <nuxt ref="page" :key="route.params.pageId || route.name"/>
    </transition>
    <v-sound ref="sound"></v-sound>
    <v-mouse ref="mouse"></v-mouse>
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
import vMouse from '~/components/common/Mouse.vue'
import vSound from '~/components/common/Sound.vue'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import SoundHelper from '~/assets/js/utils/SoundHelper'
import MouseHelper from '~/assets/js/utils/MouseHelper'

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
      process
    }
  },
  computed:{
    ...mapState(['isAppReady', 'isPageTransition', 'isMenuOpen', 'route', 'currentHomeSlideId']),
    ...mapGetters(['getPageIdNum'])
  },
  components:{vHomeCanvas, vMenu, vLogo, vMenuButton, vLoader, vMouse, vSound},
  methods:{
    ...mapActions(['setPacker', 'setMenuOpen', 'setAppLoaded','setPageTransition']),
    checkButton(from, to){
      if(!from) {
        if(to.name === 'index') {
          this.$refs.logo.show()
        }
        if(to.name === 'story-pageId') {
          this.$refs.menuButton.show()
        }
      }else{
        if(to.name !== from .name){
          if(from.name === 'index') {
            this.$refs.logo.hide()
            setTimeout(() => {this.$refs.menuButton.show()}, 1000)
          }
          if(from.name === 'story-pageId') {
            setTimeout(() => {this.$refs.logo.show()}, 1000)
            this.$refs.menuButton.hide()
          }
        }
      }
    },
    pageEnter(el, done) {
      TweenMax.set(this.$refs.page.$children[0].$el, {yPercent: 0})
      if(this.isPageTransition) this.$refs.homeCanvas.showPage(0,0,'none')
      this.setPageTransition(false)
      done()
      setTimeout(() => {
        this.resize(true)
      }, 100)
    },
    pageLeave(el, done) {
      if(this.isPageTransition){
        TweenMax.to(this.$refs.page.$children[0].$el, .8,{yPercent: -50, ease: Expo.easeOut})
        this.$refs.homeCanvas.pageTransition()
        setTimeout(() => {
          done()
        }, 1200)
      }else{
        done()
      }
    },
    resize(forceAfterRoute = false){
      const w = ResizeHelper.width()
      const h = ResizeHelper.height()
      if(this.$refs.page)this.$refs.page.$children[0].resize && this.$refs.page.$children[0].resize(w, h)
      if(!forceAfterRoute)this.$refs.homeCanvas.resize(w, h)
      if(!forceAfterRoute)this.$refs.siteMenu.resize(w, h)
      this.$refs.sound.resize(w, h)
    },
    setDebug() {
      this.stats = new Stats();
      document.body.appendChild( this.stats.domElement );
      this.stats.domElement.style.position = 'fixed';
      this.stats.domElement.style.right = '0px';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
    },
    tick(){
      this.stats.begin()
      if(!this.isAppReady) {
        this.$refs.loader.tick()
      }else{
        this.$refs.logo.tick()
        this.$refs.siteMenu.tick()
        this.$refs.menuButton.tick()
        this.$refs.page.$children[0].tick()
        if(this.route.name === "story-pageId")this.$refs.sound.tick()
      }
      NoisePosition.tick()
      MouseHelper.tick()
      this.$refs.mouse.tick()
      this.$refs.homeCanvas.tick()
      this.stats.end()
    },
    onLoaded(){
      this.setAppLoaded()

      Emitter.on('GLOBAL:RESIZE', this._resize)
      this.page = this.$refs.page.$children[0]
      this.setDebug()
      if(process.browser)this.$refs.homeCanvas.load()
      this.$nextTick(()=>{
        TweenMax.ticker.addEventListener('tick', this._tick)
      })
    },
    onReady() {
      this.resize()
      if(this.page)this.$refs.page.$children[0].onReady && this.$refs.page.$children[0].onReady()
      this.checkButton(null, this.$route)
      if(process.browser){
        this.$refs.homeCanvas.onReady()
        this.$refs.siteMenu.onReady()

      }
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
  watch: {
    isAppReady() {
      this.onReady()
    }
  },
  created() {
  },
  async mounted () {
    if(process.browser) {
      // document.fonts.load('10pt "Hawthorn')
      window.resolution = 1
    }
    this._resize = this.resize.bind(this)
    this._tick = this.tick.bind(this)
    this.$router.beforeEach((to, from, next) => {
      SoundHelper.fadeOut()
      this.checkButton(from, to)
      if(!this.isPageTransition) this.$refs.homeCanvas.checkSwitchBeforePageChange()
      let doNext = true
      if(from.name === 'index' && to.name === 'story-pageId' && this.isMenuOpen) {
        if(this.getPageIdNum(to.params.pageId) === this.currentHomeSlideId){
          setTimeout(next, 800)
          doNext = false
        }
      }
      if(from.name === 'story-pageId' && to.name === 'index' && this.isMenuOpen && window.smooth.vars.current < 50) {
          setTimeout(next, 800)
          doNext = false
      }
      this.$nextTick(()=>{this.setMenuOpen(false)})
      Emitter.emit('HIDE_MOUSE');
      if(doNext)next()
    })
     // todo -> promise polyfill
    const assets =  await load.all([{ url: '/images/pack/pack.json', type: 'json', crossOrigin: 'Anonymous' },{ url: '/images/pack/pack.pack', type: 'blob', crossOrigin: 'Anonymous' }])

    if(process.browser){
      const unpacker = new MMUnpacker(assets[1], assets[0]);
      this.setPacker(unpacker)
    }

    this.$nextTick(this.onLoaded.bind(this))
    console.log('%cMade with ❤️ 🧡 💛 💚 💙 💜', "font-weight: bold; color: #f7c8ae;");
    console.log('%c🖌 @LouisAnsa', "font-weight: bold; color: #f7b8b0;");
    console.log('%c🖌 @NahelMoussi', "font-weight: bold; color: #f7cfae;");
    console.log('%c⌨️ @Romaindr', "font-weight: bold; color: #f5d4a4;");
    window.addEventListener("blur", () => {
      SoundHelper.pause()
    }, false);
  }
}
</script>

<style lang="stylus">
@import './../assets/stylus/base/font.styl'
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
