
<template>
  <div class="aboutText">
    <div class="content">
      <p><span class="line">A tribute<span class="img" v-if="packer"><img :src="getURI('about/emma-watson.jpg')" alt="emma watson"></span>to</span><span class="line">four inspiring</span><span class="line">women<span class="img" v-if="packer"><img :src="getURI('about/jennifer-lawrence.jpg')" alt="jennifer lawrence"></span>primarily</span><span class="line">known for their</span><span class="line">appearance</span><span class="line">although they</span><span class="line">stand<span class="img" v-if="packer"><img :src="getURI('about/natalie-portman.jpg')" alt="natalie portman"></span>up &amp; act</span><span class="line"> for the greater</span><span class="line">good.<span class="img" v-if="packer"><img :src="getURI('about/cara-delevingne.jpg')" alt="cara delevingne"></span>true</span><span class="line">inner beauty.</span></p>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AboutText',
  data(){
    return {
      isShown: false,
      isReady: false
    }
  },
  computed:{
    ...mapGetters(['getURI']),
    ...mapState(['packer'])
  },
  methods:{
    onReady() {
      if(this.isReady) return
      this.isReady = true
      this.$nextTick(() => {
        this.$lines.forEach((element, i) => {
          if(element.querySelector('img')) element.style.zIndex = 2
          element.style.opacity = 0
        });
      })
    },
    show() {
      if(this.isShown)return
      this.isShown = true
      TweenMax.staggerFromTo(this.$lines, .8, {y: '100%', opacity: 0}, {delay:1, y: '0%', opacity: 1, clearProps: 'transform', ease: Quad.easeOut}, .1)
    },
    hide() {
      if(!this.isShown)return
      this.isShown = false
      const array = [...this.$lines].reverse()
      TweenMax.staggerTo(this.$lines, .8, {y: '100%', opacity: 0, ease: Quad.easeOut}, .1)
    },
    tick() {
      if(this.active) {
        if(window.smooth.vars.current - this.begin > 0)this.show()
      }
    },
  },
  watch: {
  },
  mounted(){
    this.$lines = [].slice.call(this.$el.querySelectorAll('.line'))
  }
}

</script>

<style lang="stylus" scoped>
.aboutText
  position relative
  pointer-events auto
  background $colors-dBlack
  .content
    padding-top 320 * $unitV
    padding-bottom 320 * $unitV
    p
      text-align center
      font-size 238 * $unitH
      font-weight 500
      line-height 0.85
      font-family $hawthorn
      color $colors-dBlack
      -webkit-text-stroke-color $colors-white
      -webkit-text-stroke-width .25px
      text-transform uppercase
    .line
      display block
      position relative
    .img
      display inline-block
      position relative
      vertical-align bottom
      width 387 * $unitH
      height .85 * 238 * $unitH
    img
      display block
      width 437 * $unitH
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)

</style>
