<template>
  <li class="TimelineDate">
    <button @click="setCurrentFact(num)" :class="{'active': currentFact === num}"><span v-text="fact.year" class="text"></span><span class="point"></span></button>
  </li>
</template>

<script>


import { mapActions, mapState } from 'vuex'
export default {
  name: "TimelineDate",
  data(){
    return {
    }
  },
  props: ['fact', 'num'],
  computed:{
    ...mapState(['currentFact'])
  },
  methods:{
    ...mapActions(['setCurrentFact']),
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
.TimelineDate
  position relative
  width 60 * $unitH
  display block
  text-align center
  button
    font-size 20 * $unitH
    font-weight $semi
    color $colors-timelineBlack
    margin 0 auto
    display flex
    flex-direction column
    align-items center
    justify-content flex-end
    &.active
      .text
        opacity 1
        transform translateY(-70 * $unitV)
        transition all .8s ease-out-quart
      .point:after
        opacity 1
        transition opacity .8s ease-out-quart
    .text
      display block
      opacity .5
      line-height 1
      transform translateY(-35 * $unitV)
      transition all .6s ease-in-quad
    .point
      height  5px
      width  5px
      position relative
      &:after,
      &:before
        display block
        content ''
        height  100%
        width  100%
        border-radius 50%
        position absolute
        top 0
        left 0
      &:after
        transition opacity .6s ease-in-quad
        background $colors-timelineBlack
        opacity 0
      &:before
        background $colors-grey
</style>
