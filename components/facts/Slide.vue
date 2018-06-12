<template>
  <div class="Slide">
    <p class="bottom" v-text="fact.text"></p>
    <p class="top" v-html="fact.html"></p>
  </div>
</template>

<script>



export default {
  name: "Slide",
  data(){
    return {
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
    position relative
    text-align center
    &.bottom
      -webkit-text-stroke-color: black;
      -webkit-text-stroke-width: 1px;
    &.top
      position absolute
      top 0
      left 0
      right 0
      span
        color $colors-black
</style>
<style lang="stylus">
.Slide
  p.top
    span
      color $colors-black
</style>
