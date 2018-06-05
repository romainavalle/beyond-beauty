<template>
  <div class="StoryTop">
    <div class="title">
      <h1 v-text="pages[currentPageId].pageName"></h1>
      <div class="h2" ref="title">
        <h2 v-text="pages[currentPageId].name"></h2>
        <div class="text-top"  :class="className" v-text="pages[currentPageId].name"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { pages } from '~/assets/data.json'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      pages,
      className: ''
    }
  },
  computed:{
    ...mapGetters(['currentPageId'])
  },
  methods:{
  },
  mounted(){

    TweenMax.fromTo(this.$refs.title, .5,{autoAlpha: 0}, {delay: 1, autoAlpha: 1, ease: Quad.easeOut, onComplete:() => {
      setTimeout(() => { this.className = 'show' }, 1000)
    }})
  }
}

</script>

<style lang="stylus" scoped>
.StoryTop
  height 100%
  overflow hidden
  position absolute
  width 100%
  top 0
  left 0
  display flex
  justify-content center
  align-items flex-end
  .title
    height 280 * $unitH
    position relative
  h1
    position absolute
    left -5000px
  h2, .text-top
    font-size 52 * $unitH
    text-align center
    line-height 1
    font-weight $light
  h2
    color $colors-grey
  .text-top
    top 0
    position absolute
    background radial-gradient(rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%) no-repeat
    background-size 0px 0px
    background-position center center
    color transparent
    -webkit-color transparent
    transition background-size 1s ease-in-out-quad
    -webkit-background-clip text
    &.show
      background-size 600px 600px

</style>
