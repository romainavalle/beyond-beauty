<template>
  <button class="Sound" :class="{'muted': muteSound, 'white': white}"  @click="doToggleSound" v-show="route.name !== 'about'"><em></em>sound</button>
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
  align-items center
  bottom 150 * $unitH
  color $colors-black
  display flex
  font-size 14 * $unitH
  font-weight $semi
  justify-content center
  letter-spacing $unitH * 4
  line-height 1
  padding-bottom 10 * $unitH
  padding-top 10 * $unitH
  pointer-events auto
  position fixed
  right  180 * $unitH
  text-transform uppercase
  transition letter-spacing .3s ease-in-quad, transform .5s ease-out-quart 1s
  transition opacity .5s ease-out-quart
  &.white
    color $colors-white
    em:before
      border 1px solid $colors-white
    em:after
      background $colors-white
  &.muted
    opacity .5
    em
      transform scale(1, 1)
      &:after
        transform scale(0, 0)
  em
    height 6px
    margin-right 10px
    position relative
    transform scale(.5, .5)
    width 6px
    transition transform .5s ease-out-quart
    &:before,
    &:after
      bottom 0
      content ''
      display block
      left 0
      position absolute
      right 0
      top 0
    &:before
      border 1px solid $colors-grey
      border-radius 50%
    &:after
      transition transform .5s ease-out-quart
      background $colors-grey
      border-radius 50%
</style>
