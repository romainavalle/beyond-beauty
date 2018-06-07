<template>
  <div class="StoryMedia">
    <div class="img">
      <img :src="getImage(1)" alt="">
    </div>
    <div class="img">
      <img :src="getImage(2)" alt="">
    </div>
    <div class="img">
      <img :src="getImage(3)" alt="">
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { pages } from '~/assets/data.json'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
export default {
  name: 'StoryMedia',
  data(){
    return {
      currentPart: -1,
      isShown: false
    }
  },
  computed:{
    ...mapGetters(['currentPageId', 'getURI']),
    id() {
      return pages[this.currentPageId].id
    }

  },
  methods:{
    getImage(id) {
      return this.getURI(`speech/${this.id}-${id}.png`)
    },
    tick(scrollTop){
      TweenMax.set(this.$el, {y: scrollTop > 0 ? 0 : -scrollTop})
      if(scrollTop >= 0) {
        this.show()
      }else{
        this.hide()
      }
    },
    resize(w, h, contentHeight) {
      this.contentHeight = contentHeight
    },
    showPart(part) {
      if(this.currentPart === part)return
      const direction = part > this.currentPart ? 1 : -1
      if(this.currentPart !== -1) this.hideImg(direction)
      this.currentPart = part
      if(this.currentPart !== -1) this.showImg(direction)
    },
    hideImg(direction) {
      TweenMax.to(this.imgs[this.currentPart], .5, {y: -direction * ResizeHelper.height() / 2, opacity: 0, ease: Quad.easeIn, overwrite: 1})
    },
    showImg(direction) {
      TweenMax.fromTo(this.imgs[this.currentPart], .7, {y: direction * ResizeHelper.height() / 2, opacity: 0}, {delay: this.isShown ? .4 : 0, y: 0, opacity: 1, ease: Quad.easeOut, overwrite: 1})
    },
    show() {
      if(this.isShown)return
      this.isShown = true
      TweenMax.to(this.$el, 1,{autoAlpha: 1, ease: Quad.easeOut})
    },
    hide() {
      if(!this.isShown)return
      this.isShown = false
      TweenMax.to(this.$el, .5,{autoAlpha: 0, ease: Quad.easeIn})
    }
  },
  mounted(){
    this.imgs = [].slice.call(this.$el.querySelectorAll('.img'))
    TweenMax.set(this.$el, {autoAlpha: 0})
    TweenMax.set(this.imgs, {opacity: 0})
  }
}

</script>

<style lang="stylus" scoped>
.StoryMedia
  position fixed
  width 12 * 160 * $unitH
  height 100vh
  top 0
  right 0
  .img
    position absolute
    top 0
    left 0
    right 0
    bottom 0
  img
    display block
    position absolute
    width 7 * 160 * $unitH
    top 50%
    left 50%
    transform translate(-50%, -50%)
</style>
