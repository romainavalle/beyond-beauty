<template>
  <div class="StoryMedia" :class="id">
    <div class="img" v-for="(img,i) in media" :key="i">
      <img :src="getImage(img.src)" :width="img.width" :height="img.height" :alt="id">
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
export default {
  name: 'StoryMedia',
  data(){
    return {
      isShown: false
    }
  },
  computed:{
    ...mapGetters(['pageData', 'getURI']),
    id() {
      return this.pageData.id
    },
    media(){
      return this.pageData.story.media
    }
  },
  methods:{
    getImage(src) {
      const path = process.env.NODE_ENV === 'dev' ? '/' : ''
      return `${path}images/speech/${src}`
    },
    show() {
      if(this.isShown)return
      this.isShown = true
      TweenMax.staggerTo(this.$imgs, 2, {delay: 1, opacity: 1}, .5)
    },
    hide() {
      if(!this.isShown)return
      this.isShown = false
      TweenMax.to(this.$imgs, .5, {opacity: 0, ease: Quad.easeIn, overwrite: 1})
    },
    load() {

    }
  },
  mounted(){
    this.$imgs = [].slice.call(this.$el.querySelectorAll('.img'))
    TweenMax.set(this.$imgs, {opacity: 0})
  }
}

</script>

<style lang="stylus" scoped>
.StoryMedia
  position relative
  width 12 * 160 * $unitH
  margin-left auto
  .img
    position relative
  .img + .img
    margin-top 160 * $unitV
  img
    display block
    width 7 * 160 * $unitH
    margin 0 auto
</style>
