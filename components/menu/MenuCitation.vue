<template>
  <li class="MenuCitation">
   <strong v-text="citation.author" ref="author"></strong>
   <div class="text">
     <p v-for="(text,i) in texts" :key="i" v-text="text" ref="text"></p>
   </div>
  </li>
</template>

<script>
export default {
  name: "menuCitation",

  props:['citation'],
  computed:{
   texts(){
      return this.citation.text.split('<br>')
    },
  },
  methods:{
    show(delay) {
      TweenMax.set(this.$refs.author, {opacity: 0})
      TweenMax.set(this.$refs.text, {opacity: 0, x: 20})
      TweenMax.set(this.$el, {autoAlpha: 1})
      TweenMax.to(this.$refs.author, 1,{delay, opacity: 1, ease: Quad.easeOut})
      TweenMax.staggerTo(this.$refs.text, .5,{delay, opacity: 1, x: 0, ease: Quad.easeOut}, .1)
    },
    hide() {
      TweenMax.to(this.$el, .5, {autoAlpha: 0, ease: Quad.easeIn})
    }
  },
  mounted() {
    TweenMax.set(this.$el, {autoAlpha: 0})
  }
}

</script>

<style lang="stylus" scoped>
.MenuCitation
  position absolute
  display flex
  flex-wrap nowrap
  width 100%
  strong
    font-weight normal
    font-size 21 * $unitH
    color $colors-grey
    width 400 * $unitH
  p
    color $colors-white
    font-size 25 * $unitH
</style>
