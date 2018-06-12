<template>
  <div class="beyond-beauty">
    <nuxt ref="page"/>
  </div>
</template>

<script>
import Emitter from '~/assets/js/events'
import Stats from 'stats-js'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import { mapActions, mapState } from 'vuex'
if(process.browser){
  require('gsap')
}

export default {
  data(){
    return {

    }
  },
  computed:{
  },
  methods:{
    ...mapActions(['setMenuOpen']),
    resize(){
      if(this.page)this.page.resize && this.page.resize(ResizeHelper.width(),ResizeHelper.height())
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
      if(this.page)this.page.tick && this.page.tick()
      this.stats.end()
    },
    onReady(){
      Emitter.on('GLOBAL:RESIZE', this.resize.bind(this))
      this.page = this.$refs.page.$children[0]
      this.setDebug()
      if(this.page)this.page.onReady && this.page.onReady()
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
  mounted () {
    const path = process.env.NODE_ENV === 'dev' ? '/' : ''
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
