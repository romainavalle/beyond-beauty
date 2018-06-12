<template>
  <div class="Slide" :class="readyClass">
    <p class="bottom" v-text="fact.text"></p>
    <p class="top" v-html="fact.html"></p>
  </div>
</template>

<script>



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
    }, 1000)
  }
}

</script>

<style lang="stylus" scoped>
.Slide
  position relative
  width 100%
  max-width 8 * 160 *$unitH
  margin 0 auto
  p
    color transparent
    font-family $hawthorn
    font-size 140 * $unitH
    line-height 1
    position relative
    text-align center
    &.bottom
      -webkit-text-stroke-color black
      -webkit-text-stroke-width 1px
      z-index 2
    &.top
      -webkit-text-stroke-color transparent
      -webkit-text-stroke-width 1px
      position absolute
      color $colors-white
      top 0
      left 0
      right 0
      background radial-gradient(rgba($colors-black, 1) 30%,rgba($colors-black,0) 100%) no-repeat
      background-size 0px 0px
      transition background-size 1s ease-in-out-quad
      background-position center center
      -webkit-background-clip text
  &.ready p.top
    background-size 120vw 120vw


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
