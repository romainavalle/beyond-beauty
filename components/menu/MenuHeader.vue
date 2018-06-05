<template>
  <header class="MenuHeader">
    <button class="close" @click="setMenuOpen(false)">
      close
    </button>
    <ul>
      <li><router-link :to="{'name': 'index'}">index</router-link></li>
      <li><a href="#">about</a></li>
    </ul>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "MenuHeader",
  methods:{
    ...mapActions(['setMenuOpen']),
    show(delay) {
      TweenMax.to(this.$el, 1, {delay, autoAlpha: 1, ease: Quad.easeOut})
      TweenMax.staggerFromTo(this.$el.querySelectorAll('li'), 1, {autoAlpha: 0}, {delay: delay + .2, autoAlpha: 1, ease: Quad.easeOut}, .1)
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
.MenuHeader
  position absolute
  display flex
  flex-wrap nowrap
  width 100%
  font-size 21 * $unitH
  text-transform uppercase
  display flex
  top 139 * $unitV // 160 - fontsize
  left 160 * $unitH
  z-index 1
  ul
    display flex
  button
    width 400 * $unitH
  button, a
    font-weight $semi
    display block
    text-align left
    text-transform uppercase
    color $colors-white
  li
    width 160 * $unitH
</style>
