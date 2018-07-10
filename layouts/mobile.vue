<template>
  <div class="beyond-beauty" :class="{'overflow': process.browser}">
    <transition name="fade">
      <div class="loader" v-show="!isAppReady"></div>
    </transition>
    <v-mobile-canvas ref="mobileCanvas"></v-mobile-canvas>
  </div>
</template>

<script>
import Emitter from '~/assets/js/events'
import NoisePosition from '~/assets/js/blobs/NoisePosition.js'
import Stats from 'stats-js'
import { TweenMax } from 'gsap'
import vMobileCanvas from '~/components/MobileCanvas.vue'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'

import { mapActions, mapState, mapGetters } from 'vuex'
if(process.browser){
  var MMUnpacker = require('mm-unpacker')
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
  components:{ vMobileCanvas },
  methods:{
    ...mapActions(['setPacker', 'setAppLoaded', 'setAppReady']),
    resize(){
      const w = ResizeHelper.width()
      const h = ResizeHelper.height()
      if(this.isAppReady) {
        this.$refs.mobileCanvas.resize(w, h)
      }
    },

    tick(){
      NoisePosition.tick()
      this.$refs.mobileCanvas.tick()
    },
    onLoaded(){
      this.setAppLoaded()
      Emitter.on('GLOBAL:RESIZE', this._resize)
      this.$refs.mobileCanvas.load()
      this.setAppReady()
      this.resize()
      this.$nextTick(()=>{
        TweenMax.ticker.addEventListener('tick', this._tick)
      })
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
    this._resize = this.resize.bind(this)
    this._tick = this.tick.bind(this)
    const assets =  await load.all([{ url: '/images/pack-mobile/pack.json', type: 'json'},{ url: '/images/pack-mobile/pack.pack', type: 'blob'}])

    if(process.browser){
      const unpacker = new MMUnpacker(assets[1], assets[0]);
      this.setPacker(unpacker)
    }

    this.$nextTick(this.onLoaded.bind(this))
    console.log('%cMade with ❤️ 🧡 💛 💚 💙 💜', "font-weight: bold; color: #f7c8ae;");
    console.log('%c🖌 @LouisAnsa', "font-weight: bold; color: #f7b8b0;");
    console.log('%c🖌 @NahelMoussi', "font-weight: bold; color: #f7cfae;");
    console.log('%c⌨️ @Romaindr', "font-weight: bold; color: #f5d4a4;");

    this.resize()
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
  .loader
    background $colors-bgWhite
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    pointer-events none
    z-index 10
.fade-enter-active,
.fade-leave-active
  transition opacity .5s 1s

.fade-enter,
.fade-leave-to
  opacity 0

</style>
