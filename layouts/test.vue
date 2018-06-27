<template>
  <div class="beyond-beauty" :class="{'overflow': process.browser}">
    <v-home-canvas ref="homeCanvas"></v-home-canvas>
  </div>
</template>

<script>
import Emitter from '~/assets/js/events'
import NoisePosition from '~/assets/js/blobs/NoisePosition.js'
import Stats from 'stats-js'
import { TweenMax } from 'gsap'
import vHomeCanvas from '~/components/HomeTest.vue'
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
    ...mapActions(['setPacker', 'setMenuOpen', 'setAppLoaded', 'setAppReady','setPageTransition','setCurrentHomeSlideId']),

    pageEnter(el, done) {
      if(this.isPageTransition) this.$refs.homeCanvas.showPage(0,0,'none')
      this.setPageTransition(false)
      done()
      setTimeout(() => {
        this.resize(true)
      }, 100)
    },
    pageLeave(el, done) {
      if(this.isPageTransition){
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
      if(!forceAfterRoute)this.$refs.homeCanvas.resize(w, h)
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
      if(this.$refs.homeCanvas)this.$refs.homeCanvas.tick()
      this.stats.end()
    },
    onLoaded(){
      this.setAppLoaded()

      Emitter.on('GLOBAL:RESIZE', this._resize)
      this.setDebug()
      if(process.browser)this.$refs.homeCanvas.load()
      this.$nextTick(()=>{
        TweenMax.ticker.addEventListener('tick', this._tick)
        console.log('eeee')
        this.resize()
      })
      setTimeout(this.onReady.bind(this), 2000)
    },
    onReady() {
      this.setAppReady()
      if(process.browser){
        this.$refs.homeCanvas.onReady()
        this.setCurrentHomeSlideId(0)

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
  async mounted () {
    this._resize = this.resize.bind(this)
    this._tick = this.tick.bind(this)
    this.$router.beforeEach((to, from, next) => {
      if(!this.isPageTransition) this.$refs.homeCanvas.checkSwitchBeforePageChange()
      if(doNext)next()
    })

     // todo -> promise polyfill
    const path = process.env.NODE_ENV === 'dev' ? '/' : ''
    const assets =  await load.all([{ url: `${path}packed/pack.json`, type: 'json' },{ url: `${path}packed/pack.pack`, type: 'binary' }])

    if(process.browser){
      const unpacker = new MMUnpacker(assets[1], assets[0]);
      window.unpacker = unpacker
      this.setPacker(unpacker)
    }

    this.$nextTick(this.onLoaded.bind(this))
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
