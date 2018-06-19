<template>
  <div class="Slide" :class="readyClass">
    <p class="bottom" v-html="fact.text" ref="bottom"></p>
    <p class="top" v-html="fact.html" ref="top"></p>
  </div>
</template>

<script>

if (process.browser) {
  var SplitText = require('gsap/SplitText')
}

export default {
  name: "Slide",
  data(){
    return {
      readyClass: ''
    }
  },
  props: ['fact'],
  computed:{

  },
  methods:{
    show(){
    },
    hide(){
    }
  },
  mounted(){
    setTimeout(() => {
      this.readyClass = 'ready'
    }, 2200)
    new SplitText(this.$refs.bottom, {type: 'lines', linesClass: 'line'})
  }
}

</script>

<style lang="stylus" scoped>
.Slide
  position absolute
  top 0
  left 0
  p
    color transparent
    font-family $hawthorn
    font-size 140 * $unitH
    line-height .9
    position relative
    text-align center
    text-transform uppercase
    &.bottom
      -webkit-text-stroke-color $colors-timelineBlack
      -webkit-text-stroke-width .5px
      z-index 2
    &.top
      -webkit-text-stroke-color transparent
      -webkit-text-stroke-width .5px
      position absolute
      color $colors-bgWhite
      top 0
      left 0
      right 0
      background radial-gradient(rgba($colors-timelineBlack, 1) 30%,rgba($colors-timelineBlack,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text
      will-change background, opacity
  &.ready p.top
    background-size 120vw 120vw
    transition background-size 3s ease-out-quart


</style>
<style lang="stylus">
.Slide
  p.top
    span
      color transparent
      -webkit-color transparent
      -webkit-text-stroke-color transparent
      -webkit-text-stroke-width 0px

</style>

