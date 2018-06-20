<template>
  <div class="StorySpeechPart" @click="onclick">
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
    },
    tick() {
      if(!this.isActive) return
      const pos = SoundHelper.getPos()
      const pourc = 1 - (pos / this.duration)
      TweenMax.set(this.$refs.timer, {'stroke-dashoffset': pourc * 352})
      if(pos > this.time_array[this.currentSpan]){
        TweenMax.to(this.$spans[this.currentSpan], .3,{opacity: 1, ease:Quad.easeOut})
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
      TweenMax.to(this.$refs.timer, .5,{'stroke-dashoffset': 352, ease: Quad.easeOut})
      TweenMax.to(this.$el, .5,{opacity: .5, ease:Quad.easeInOut})
      this.isActive = false
      TweenMax.to(this.$spans, .3,{opacity: 0, ease:Quad.easeOut, overwrite: 1}, 1)
      Emitter.removeListener('SOUND_LOADED', this._activateSound)
    },
    activateSound() {
      this.duration = SoundHelper.getDuration()
      Emitter.removeListener('SOUND_LOADED', this._activateSound)
      this.isActive = true
      TweenMax.to(this.$refs.load, .3, {'stroke-dashoffset': 0, ease: Quad.easeOut})
    },
    deactivateSound() {
      this.isActive = false
    }
  },
  beforeDestory() {
    TweenMax.killAllTweensOf(this.spans)
    Emitter.removeListener('SOUND_LOADED', this._activateSound)
  },
  mounted(){
    this._activateSound = this.activateSound.bind(this)
    this._deactivateSound = this.deactivateSound.bind(this)
    TweenMax.set(this.$el, {opacity: 0.3})
    this.$spans = [].slice.call(this.$refs.html.querySelectorAll('span'))
    this.time_array = this.$spans.map(el => {return el.dataset.time})
    TweenMax.set(this.$spans, {opacity: 0})
  }
}

</script>

<style lang="stylus" scoped>
.StorySpeechPart
  display flex
  justify-content space-between
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
      color $colors-dGrey
    &.html
      position absolute
      top 0
  .number
    height 210 * $unitH
    width 210 * $unitH
    margin-left -20 * $unitH
    position relative
    span
      position absolute
      text-align center
      width 100%
      line-height 210 * $unitH
      font-size 24 * $unitH
      font-weight $semi
    svg
      position absolute
      top 0
      left 0
      fill none
      width 100%
      height 100%
      transform rotate(-90deg)
      stroke-width 2px
      .load
        stroke $colors-grey
        stroke-dasharray 352
        stroke-dashoffset 352
      .timer
        stroke-dasharray 352
        stroke-dashoffset 352
        transition stroke-dashoffset .1s ease-out-quint
</style>
