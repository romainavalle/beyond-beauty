<template>
  <footer class="MenuFooter">
    <ul>
      <li><a href="#">facebook</a></li>
      <li><a href="#">twitter</a></li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: "MenuFooter",
  methods:{
    show(delay) {
      TweenMax.to(this.$el, 1, {delay, autoAlpha: 1, ease: Quad.easeOut})
    },
    hide() {
      TweenMax.to(this.$el, 1, {autoAlpha: 0, ease: Quad.easeOut})
      }
  },
  mounted() {
    TweenMax.set(this.$el, {autoAlpha: 0})
  }
}
</script>

<style lang="stylus" scoped>
.MenuFooter
  position absolute
  display flex
  flex-wrap nowrap
  font-size 14 * $unitH
  text-transform uppercase
  display flex
  bottom 158 * $unitV //160 - 2 lineheight
  right 160 * $unitH
  z-index 1
  ul
    display flex
  li
    width 160 * $unitH
  a
    font-weight $semi
    display block
    text-align right
    text-transform uppercase
    color $colors-white
</style>
