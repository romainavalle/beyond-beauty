<template>
  <div class="beyond-beauty">
    <v-home-canvas ref="homeCanvas"></v-home-canvas>
    <nuxt/>
  </div>
</template>

<script>
import Emitter from '~/assets/js/events'
import Stats from 'stats-js'
import vHomeCanvas from '~/components/HomeCanvas.vue'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
export default {
  components:{vHomeCanvas},
  methods:{
    resize(){
     this.$children[0].$children.forEach(child => {
        child.resize && child.resize(ResizeHelper.width(),ResizeHelper.height())
      })
      this.$refs.homeCanvas.resize(ResizeHelper.width(),ResizeHelper.height())
    },
    setDebug() {
      this.stats = new Stats();
      document.body.appendChild( this.stats.domElement );
      // Align top-left
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
    },
    tick(){
      this.stats.begin()
      this.$children[0].$children.forEach(child => {
        child.tick && child.tick()
      })
      this.$refs.homeCanvas.tick()
      this.stats.end()
      requestAnimationFrame(this.tick.bind(this));

    }
  },

  mounted () {
    Emitter.on('GLOBAL_RESIZE', this.resize.bind(this))
    this.setDebug()
    setTimeout(this.tick.bind(this), 1000)
  }
}
</script>

<style lang="stylus">
.beyond-beauty
  height 100%
  position relative
  width 100%
</style>
