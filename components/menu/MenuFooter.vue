<template>
  <footer class="MenuFooter">
    <ul>
      <li><a href="#" @click.prevent="onClick('facebook')">facebook</a></li>
      <li><a href="#" @click.prevent="onClick('twitter')">twitter</a></li>
    </ul>
  </footer>
</template>

<script>
import Sharer from '@merci-michel/mm-sharer'
export default {
  name: "MenuFooter",
  methods:{
    onClick(network) {
      let url = 'https://www.beyond-beauty.co/'
      if(this.$route.name === 'story-pageId')url += 'story/'+this.$route.params.pageId
      if(network === 'facebook') {
        Sharer.facebook(url);
      }else{
        Sharer.twitter('Four women primarily known for their appearance. Discover their true inner beauty.',['BeyondBeauty','Girl','Girlpower'] ,url);
      }
    },
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
  text-transform uppercase
  display flex
  bottom 160 * $unitH
  right 160 * $unitH
  z-index 1
  ul
    display flex
  li
    width 160 * $unitH
    height 40 * $unitH
  a
    color $colors-white
    font-size 14 * $unitH
    letter-spacing 3 * $unitH
    display block
    font-weight $semi
    line-height 1
    margin-bottom -20 * $unitH
    margin-right -20 * $unitH
    padding 20 * $unitH
    text-align right
    text-transform uppercase
    transition opacity .3s
    transition opacity .3s

    &:hover
      opacity .6
  +below('l')
    a
      font-size 16 * $unitH
      bottom 158 * $unitH
  +above('hd')
    a
      font-size 12 * $unitH
      bottom 162 * $unitH
</style>
