<template>
  <div class="beyond-beauty">
    <v-logo></v-logo>
    <v-home-canvas ref="homeCanvas"></v-home-canvas>
    <v-menu ref="siteMenu"></v-menu>
    <nuxt v-if="isLoaded"/>
  </div>
</template>

<script>
import Emitter from '~/assets/js/events'
import Stats from 'stats-js'

import vHomeCanvas from '~/components/HomeCanvas.vue'
import vLogo from '~/components/Logo.vue'
import vMenu from '~/components/menu/Menu.vue'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'

import { mapActions, mapState } from 'vuex'
if(process.browser){
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
  },
  components:{vHomeCanvas, vMenu, vLogo},
  methods:{
    ...mapActions(['setPacker', 'setMenuOpen']),
    resize(){
     this.$children[0].$children.forEach(child => {
        child.resize && child.resize(ResizeHelper.width(),ResizeHelper.height())
      })
      this.$refs.homeCanvas.resize(ResizeHelper.width(),ResizeHelper.height())
      this.$refs.siteMenu.resize(ResizeHelper.width(),ResizeHelper.height())
    },
    setDebug() {
      this.stats = new Stats();
      document.body.appendChild( this.stats.domElement );
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
    },
    tick(){
      this.stats.begin()
      this.$children[0].$children.forEach(child => {
        child.tick && child.tick()
      })
      this.$refs.siteMenu.tick()
      this.$refs.homeCanvas.tick()
      this.stats.end()
      requestAnimationFrame(this.tick.bind(this));

    },
    onReady(){
      this.isLoaded = true
      Emitter.on('GLOBAL_RESIZE', this.resize.bind(this))
      this.setDebug()
      this.$children[0].$children.forEach(child => {
        child.onReady && child.onReady()
      })
      if(process.browser)this.$refs.homeCanvas.onReady()
      if(process.browser)this.$refs.siteMenu.onReady()
      this.$nextTick(this.tick.bind(this))

      if(process.browser)this.$nextTick(()=>{
        this.resize()
      })
      this.$router.beforeEach((to, from, next) => {
       this.setMenuOpen()
        next()
      })
    }
  },

  async mounted () {
     // todo -> promise polyfill
    const path = process.env.NODE_ENV === 'dev' ? '/' : ''
    const assets =  await load.all([{ url: `${path}packed/pack.json`, type: 'json' },{ url: `${path}packed/pack.pack`, type: 'binary' }])
    if(process.browser){
      const unpacker = new MMUnpacker(assets[1], assets[0]);
      window.unpacker = unpacker
      this.setPacker(unpacker)
    }
    this.$nextTick(this.onReady.bind(this))
  }
}
</script>

<style lang="stylus">
.beyond-beauty
  height 100%
  position relative
  width 100%
</style>
