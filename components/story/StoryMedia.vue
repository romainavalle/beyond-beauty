<template>
  <div class="StoryMedia" :class="id">
    <div class="img" v-for="(img,i) in media" :key="i">
      <img :src="getImage(img.src)" :width="img.width" :height="img.height" :alt="id">
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'StoryMedia',
  data(){
    return {
      isShown: false
    }
  },
  computed:{
    ...mapGetters(['pageData']),
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
    this.$imgs.forEach(element => {
      element.style.opacity = 0
    });
  }
}

</script>

<style lang="stylus" scoped>
.StoryMedia
  position relative
  margin-left auto
  width 12 * 160 * $unitH
  .img
    position relative
  .img + .img
    margin-top 160 * $unitV
  img
    transform translateZ(.1px)
    display block
    width 7 * 160 * $unitH
    margin 0 auto
  &.natalie-portman
    .img:nth-child(1) img
      margin-left 3.1 * 160 * $unitH
    .img:nth-child(3) img
      width 10 * 160 * $unitH
      margin-right 0

  &.emma-watson
    .img:nth-child(1) img
      width 10 * 160 * $unitH
      margin-right 0
    .img:nth-child(3) img
      margin-left 2.8 * 160 * $unitH
  &.jennifer-lawrence
    .img:nth-child(1) img
      width 10 * 160 * $unitH
      margin-right 0
  &.cara-delevingne
    .img:nth-child(3) img
      width 9.3 * 160 * $unitH
      margin-right 0

</style>
