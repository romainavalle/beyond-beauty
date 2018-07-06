
<template>
  <div class="aboutCreditImages">
    <img v-for="(image,i) in images" :src="getURI(image)" :key="i" ref="images" alt="credits" v-if="packer">
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import transform from 'dom-transform'
import MouseHelper from '~/assets/js/utils/MouseHelper'
export default {
  data(){
    return {
      top: 0,
      tweeningTop: 0,
      isShown: false
    }
  },
  computed:{
    ...mapGetters(['getURI']),
    ...mapState(['packer'])
  },
  props:['images'],
  methods:{
    show(id) {
      this.isShown = true
      this.$refs.images[id].style.zIndex = 1
      TweenMax.to(this.$refs.images[id], .3, { opacity: 1, overwrite: 1, ease: Power3.easeOut})
    },
    hide(id) {
      this.$refs.images[id].style.zIndex = 0
      TweenMax.to(this.$refs.images[id], .3, { opacity: 0, ease: Power3.easeOut, overwrite: 1, onComplete: () => { this.isShown = false }})
    },
    goTo(top) {
      TweenMax.to(this, .5, { tweeningTop: top, ease: Linear.easeInOut})
    },
    tick(){
      transform(this.$el, {translate3d: [MouseHelper.easeSlowX, MouseHelper.easeSlowY + window.smooth.vars.current, 0]})
    }
  },
  watch: {
    packer() {
      this.$nextTick(()=>{
        this.$refs.images.forEach(element => {
          element.style.opacity = 0
        });
      })
    }
  },
  mounted(){
    if(this.packer){
      this.$refs.images.forEach(element => {
        element.style.opacity = 0
      });
    }
  }
}

</script>

<style lang="stylus" scoped>
.aboutCreditImages
  position fixed
  top 0
  left 0
  width 5 * 160 * $unitH
  img
    position absolute
    top 0
    left 0
    display block
    will-change opacity
    width 100%
    transform translate(-50%, -50%)
</style>
