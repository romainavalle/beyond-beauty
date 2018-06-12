<template>
  <div class="vs-section" ref="vs">
    <slot></slot>
  </div>
</template>

<script>

if (process.browser) {
  var S = require('~/assets/js/utils/Scroll')
  var Scroll = S.default
}
export default {
  mounted () {
    if(process.browser){
      this.$nextTick(() => {
        this.initScroll()
      })
    }
  },
  methods: {
    initScroll () {
      const section = this.$refs.vs
      window.smooth = new Scroll({
        native: false,
        preload: false,
        section: section,
        ease: 0.05,
        vs: {
          touchMultiplier: 2,
          mouseMultiplier: 0.3
        }
      })
      window.smooth.init()
      setTimeout(() => {window.smooth.resize()}, 100)
    }
  },

  beforeDestroy () {
    window.smooth && window.smooth.destroy()
    window.smooth = null
  }
}
</script>

<style lang="stylus">
.is-virtual-scroll
    overflow hidden

  .is-native-scroll
    &.y-scroll
      overflow-y scroll
      overflow-x hidden
    &.x-scroll
      overflow-y hidden
      overflow-x scroll

  .vs-section
    position fixed
    top 0
    right 0
    left 0
    width 100%
    height auto
    margin auto
    will-change transform
    z-index 5

  .vs-scrollbar
    display block
    position absolute
    transition transform .6s
    z-index 10
    &.vs-vertical
      top 0
      right -5px
      bottom 0
      width 15px
      height 100%
      transform translate3d(5px,0,0)
    &.vs-horizontal
      bottom -5px
      left 0
      right 0
      width 100%
      height 15px
      transform translate3d(0,5px,0)
    .vs-scrolldrag
      width 100%
      height auto
      background #ccc
      cursor pointer

  .is-dragging .vs-scrollbar.vs-horizontal,
  .is-dragging .vs-scrollbar.vs-vertical,
  .vs-scrollbar.vs-horizontal:hover,
  .vs-scrollbar.vs-vertical:hover
    transform none

  .vs-scroll-view
    position relative
    width 1px
</style>
