<template>
  <div class="StorySpeechPart" @click="onclick" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" :class="{'active': this.isActive}">
    <div class="number">
      <svg viewBox="0 0 116 116">
        <circle  cx="58" cy="58" r="56" class="load" ref="load"/>
        <circle  cx="58" cy="58" r="56" class="timer" ref="timer"/>
      </svg>
      <span>0 {{id + 1}}</span>
    </div>
    <div class="content">
      <p v-text="paragraph.text" :data-text="paragraph.text" :class="paragraphClass" class="text"></p>
      <p v-html="paragraph.html" class="html" ref="html"></p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
//import Utils from '~/assets/js/utils/Utils'
import Emitter from '~/assets/js/events'
import SoundHelper from '~/assets/js/utils/SoundHelper'
export default {
  name: 'StorySpeechPart',
  data(){
    return {
      paragraphClass: '',
      duration: 0,
      isActive: false,
      currentSpan: 0
    }
  },
  props:['paragraph', 'id'],
  computed:{
    ...mapGetters(['pageData'])
  },
  methods:{
    onclick() {
      Emitter.emit('PART_CLICKED', this.id)
      Emitter.emit('HIDE_MOUSE')
    },
    onMouseEnter() {
      if(this.isActive) {
        if(SoundHelper.isPlaying()) {
          Emitter.emit('SET_MOUSE_TYPE', {type: 'pause'})
        }else{
          Emitter.emit('SET_MOUSE_TYPE', {type: 'listen'})
        }
      } else {
        Emitter.emit('SET_MOUSE_TYPE', {type: 'listen'})
      }
      Emitter.emit('SHOW_MOUSE')
    },
    onMouseLeave() {
      Emitter.emit('HIDE_MOUSE')
    },
    tick() {
      if(!this.isActive) return
      const pos = SoundHelper.getPos()
      const pourc = 1 - (pos / this.duration)
      this.$refs.timer.style.strokeDashoffset = pourc * 292
      if(pos > this.time_array[this.currentSpan]){
        const textSplit = this.$spans[this.currentSpan].innerText.split(' ')
        const text = '<span>' + textSplit.join('</span> <span>') + '</span>'
        let time =  this.duration - this.time_array[this.currentSpan]
        if(this.time_array[this.currentSpan + 1])time = this.time_array[this.currentSpan + 1] - this.time_array[this.currentSpan]
        const stagger = (time - .6) / textSplit.length
        this.$spans[this.currentSpan].innerHTML = text
        this.$spans[this.currentSpan].style.opacity = 1
        TweenMax.staggerFromTo(this.$spans[this.currentSpan].querySelectorAll('span'), .3,{opacity: 0}, {opacity: 1, ease:Quad.easeOut}, stagger)
        this.currentSpan++
      }
    },
    showPart() {
      this.currentSpan = 0
      TweenMax.to(this.$el, .5,{opacity: 1, ease:Quad.easeInOut})
      this.paragraphClass = 'active'
      TweenMax.to(this.$refs.load, 3, {'stroke-dashoffset': 60, ease: Quad.easeOut})
      Emitter.on('SOUND_LOADED', this._activateSound)
    },
    hidePart() {
      this.paragraphClass = ''
      TweenMax.to(this.$refs.timer, .5,{'stroke-dashoffset': 292, ease: Quad.easeOut})
      TweenMax.to(this.$el, .5,{opacity: .5, ease:Quad.easeInOut})
      this.isActive = false
      TweenMax.to(this.$refs.html.querySelectorAll('span'), .3,{opacity: 0, ease:Quad.easeOut, overwrite: 1}, 1)
      Emitter.removeListener('SOUND_LOADED', this._activateSound)
    },
    activateSound() {
      this.duration = SoundHelper.getDuration()
      Emitter.removeListener('SOUND_LOADED', this._activateSound)
      this.isActive = true
      TweenMax.to(this.$refs.load, .3, {'stroke-dashoffset': 0, ease: Quad.easeOut})
    }
  },
  beforeDestory() {
    TweenMax.killAllTweensOf(this.$spans[this.currentSpan].querySelectorAll('span'))
    Emitter.removeListener('SOUND_LOADED', this._activateSound)
  },
  mounted(){
    this._activateSound = this.activateSound.bind(this)
    this.$el.style.opacity = .3

    this.$spans = [].slice.call(this.$refs.html.querySelectorAll('span'))
    this.time_array = this.$spans.map(el => {return parseFloat(el.dataset.time)})
    this.$spans.forEach(element => {
      element.style.opacity = 0
    });
  }
}

</script>

<style lang="stylus" scoped>
.StorySpeechPart
  display flex
  justify-content space-between
  cursor pointer
  & + .StorySpeechPart
    margin-top 60 * $unitV
  .content
    width 640 * $unitH
    position relative
  p
    font-size 26 * $unitH
    font-weight normal
    line-height 40 * $unitH
    &.text
      color $colors-speechdGrey
    &.html
      position absolute
      top 0
  .number
    height 210 * $unitH
    width 210 * $unitH
    margin-left -19 * $unitH
    position relative
    span
      position absolute
      text-align center
      width 100%
      line-height 210 * $unitH
      font-size 20 * $unitH
      color $colors-speechdGrey
      font-weight $semi
      letter-spacing -2 * $unitH
    svg
      position absolute
      top 0
      left 0
      fill none
      width 100%
      height 100%
      transform rotate(-211deg)
      stroke-width 2px
      .load
        stroke $colors-speechdGrey
        stroke-dasharray 352
        stroke-dashoffset 352
      .timer
        stroke-dasharray 352
        stroke-dashoffset 352
        transition stroke-dashoffset .1s ease-out-quint
  &.active
    .number span
      color $colors-speechGrey
    svg .load
      stroke $colors-speechGrey
</style>
