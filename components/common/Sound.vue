<template>
  <button class="Sound" :class="{'muted': muteSound, 'white': white}"  @click="doToggleSound" v-show="route.name !== 'about'">
    <svg viewBox="0 0 8 8">
      <circle  cx="4" cy="4" r="1" class="point"/>
      <circle  cx="4" cy="4" r="3" class="bottom"/>
    </svg>
    <span>sound</span>
  </button>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import SoundHelper from '~/assets/js/utils/SoundHelper'
export default {
  name: 'Sound',
  data(){
    return {
      factTop: 0,
      factBottom: 0,
      active: false
    }
  },
  computed:{
    ...mapState(['muteSound', 'route']),
    white() {
      return this.route.name !== 'index' && !this.active
    }
  },
  methods:{
    ...mapActions(['toggleSound']),
    doToggleSound() {
      this.toggleSound()
      SoundHelper.toggleMute(this.muteSound)
    },
    resize(w, h) {
      this.w = w
      this.h = h
      this.factTop = 0
      this.$facts = document.querySelector('.Facts')
      if(this.$facts){
        this.factTop = this.$facts.offsetTop - h + (w / 2880) * 160
        this.factBottom = this.factTop + this.$facts.clientHeight
      }
    },
    tick(){
      if(this.factTop === 0) return
      if(window.smooth) {
        if(window.smooth.vars.current > this.factTop && window.smooth.vars.current < this.factBottom){
          if(!this.active) this.active = true
        }else{
          if(this.active) this.active = false
        }
      }
    }
  },
  beforeDestroy() {
  },
  mounted(){

  }
}

</script>

<style lang="stylus" scoped>
.Sound
  bottom 140 * $unitH
  padding 20 * $unitH
  pointer-events auto
  position fixed
  right  140 * $unitH
  text-transform uppercase
  transition opacity .5s ease-out-quart
  &.white
    color $colors-white
    em:before
      border 1px solid $colors-white
    em:after
      background $colors-white
  &.muted
    opacity .5
    .point
      transform scale(0, 0)
      opacity 0
    .bottom
      transform scale(1, 1)
      opacity 1
  span
    display inline-block
    letter-spacing $unitH * 4
    line-height 1
    font-size 14 * $unitH
    font-weight $semi
    color $colors-black
  svg
    fill none
    stroke white
    display inline-block
    width 14 * $unitH
    height 14 * $unitH
    stroke $colors-black
    margin-right 10 * $unitH
    transform translateY(2 * $unitH)
    circle
      transition all .5s ease-in-out-quart
      transform-origin 7 * $unitH 7 * $unitH
    .point
      transform scale(1, 1)
      fill $colors-black
    .bottom
      transform scale(0, 0)
      opacity 0
</style>
