<template>
<transition  @enter="enter" @leave="leave" appear @css="false">
  <button v-show="displayed" class="Sound" :class="{'muted': muteSound, 'white': white}"  @click="doToggleSound" aria-label="mute sound">
    <svg viewBox="0 0 8 8">
      <circle  cx="4" cy="4" r="1" class="point"/>
      <circle  cx="4" cy="4" r="3" class="bottom"/>
    </svg>
    <span>sound</span>
  </button>
</transition>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import Emitter from '~/assets/js/events';
import SoundHelper from '~/assets/js/utils/SoundHelper'
export default {
  name: 'Sound',
  data(){
    return {
      storyContentTop: 0,
      storyContentBottom: 0,
      active: false
    }
  },
  computed:{
    ...mapState(['muteSound', 'route']),
    white() {
      return this.route.name === 'story-pageId'
    },
    displayed() {
      if(this.route.name === 'index') {
        return true
      }else if(this.route.name === 'story-pageId'){
        if(this.active)return true
        return false
      }else{
        return false
      }
    }
  },
  methods:{
    ...mapActions(['toggleSound']),
    enter(el, done) {
      TweenMax.to(el, .5, {autoAlpha: 1, clearProps: 'all', onComplete: done})
    },
    leave(el, done) {
      TweenMax.to(el, .3, {autoAlpha: 0, onComplete: done})
    },
    doToggleSound() {
      this.toggleSound()
      SoundHelper.toggleMute(this.muteSound)
    },
    resize(w, h) {
      this.w = w
      this.h = h
      this.$storyContent = document.querySelector('.StoryContent')
      if(this.$storyContent){
        this.storyContentTop = 0
        this.storyContentBottom = this.storyContentTop + this.$storyContent.clientHeight
      }
    },
    tick(){
      if(window.smooth) {
        if(window.smooth.vars.current >= this.storyContentTop && window.smooth.vars.current < this.storyContentBottom && this.pageDown){
          if(!this.active) this.active = true
        }else{
          if(this.active) this.active = false
        }
      }
    },
    onPageDown() {
      this.pageDown = true
    },
    onPageUp() {
      this.pageDown = false
    }
  },
  beforeDestroy() {
    Emitter.removeListener('PAGE:PANDOWN',this._onPageDown)
    Emitter.removeListener('PAGE:PANUP',this._onPageUp)
  },
  mounted(){
    this._onPageDown = this.onPageDown.bind(this)
    this._onPageUp = this.onPageUp.bind(this)
    Emitter.on('PAGE:PANDOWN',this._onPageDown)
    Emitter.on('PAGE:PANUP',this._onPageUp)
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
  z-index 10
  &.white
    span
      color $colors-white
    svg
      stroke $colors-white
      .point
        fill $colors-white
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
  +below('l')
    bottom 138 * $unitH
    span
      font-size 16 * $unitH
    svg
      transform translateY(1 * $unitH)
  +above('hd')
    bottom 142 * $unitH
    span
      font-size 12 * $unitH
    svg
      transform translateY(03 * $unitH)
</style>
