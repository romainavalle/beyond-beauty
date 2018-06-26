<template>
  <div class="beyond-beauty" :class="{'overflow': process.browser}">
    <v-loader></v-loader>
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
      isLoaded: false,
      process
    }
  },
  computed:{
    ...mapState(['isAppReady', 'isPageTransition']),
    ...mapGetters(['route'])
  },
  components:{vHomeCanvas, vMenu, vLogo, vMenuButton, vLoader, vMouse, vSound},
  methods:{
    ...mapActions(['setPacker', 'setMenuOpen', 'setAppReady','setPageTransition']),
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
      NoisePosition.tick()
      MouseHelper.tick()
      if(this.$refs.mouse)this.$refs.mouse.tick()
      if(this.$refs.logo)this.$refs.logo.tick()
      if(this.$refs.siteMenu)this.$refs.siteMenu.tick()
      if(this.$refs.menuButton)this.$refs.menuButton.tick()
      if(this.$refs.homeCanvas)this.$refs.homeCanvas.tick()
      if(this.$refs.page && this.$refs.page.$children[0])this.$refs.page.$children[0].tick && this.$refs.page.$children[0].tick()
      if(this.route.name === "story-pageId")this.$refs.sound.tick()
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
        this.checkButton(null, this.$route)
        if(process.browser){
          this.$refs.homeCanvas.onReady()
          this.$refs.siteMenu.onReady()
          this.$nextTick(()=>{
            TweenMax.ticker.addEventListener('tick', this._tick)
            this.resize()
          })
        }
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
      SoundHelper.fadeOut()
      this.checkButton(from, to)
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
    console.log('%cMade with ❤️ 🧡 💛 💚 💙 💜', "font-weight: bold; color: #f7c8ae;");
    console.log('%c🖌 @LouisAnsa', "font-weight: bold; color: #f7b8b0;");
    console.log('%c🖌 @NahelMoussi', "font-weight: bold; color: #f7cfae;");
    console.log('%c⌨️ @Romaindr', "font-weight: bold; color: #f5d4a4;");
    window.addEventListener("blur", () => {
      SoundHelper.fadeOut()
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
