<template>
  <div class="beyond-beauty" :class="{'overflow': process.browser}">
      <nuxt ref="page"/>
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
import vNoise from '~/components/common/Noise.vue'
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
    ...mapState(['isAppReady'])
  },
  components:{},
  methods:{
    ...mapActions(['setPacker',  'setAppReady']),

    resize(){
      const w = ResizeHelper.width()
      const h = ResizeHelper.height()

      if(this.isAppReady) {
        if(this.$refs.page)this.$refs.page.$children[0].resize(w, h)
      }
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
      if(this.$refs.page)this.$refs.page.$children[0].tick()
    },
    onLoaded(){

      Emitter.on('GLOBAL:RESIZE', this._resize)
      this.page = this.$refs.page.$children[0]
      //this.setDebug()
      if(this.page)this.$refs.page.$children[0].load && this.$refs.page.$children[0].load()
      this.$nextTick(()=>{
        this.setAppReady()
        TweenMax.ticker.addEventListener('tick', this._tick)
      })
    },
    onReady() {
      console.log('ready')
      if(this.page)this.$refs.page.$children[0].onReady && this.$refs.page.$children[0].onReady(true)
      this.resize()
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
    const assets =  await load.all([{ url: '/images/pack/pack.json', type: 'json'},{ url: '/images/pack/pack.pack', type: 'blob'}])
    if(process.browser){
      const unpacker = new MMUnpacker(assets[1], assets[0]);
      this.setPacker(unpacker)
    }

    this.$nextTick(this.onLoaded.bind(this))
    console.log('%cMade with ❤️ 🧡 💛 💚 💙 💜', "font-weight: bold; color: #f7c8ae;");
    console.log('%c🖌 @LouisAnsa', "font-weight: bold; color: #f7b8b0;");
    console.log('%c🖌 @NahelMoussi', "font-weight: bold; color: #f7cfae;");
    console.log('%c⌨️ @Romaindr', "font-weight: bold; color: #f5d4a4;");
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
