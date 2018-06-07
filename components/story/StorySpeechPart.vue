<template>
  <div class="StorySpeechPart" :class="`part-${currentPageId}`" @click="onclick">
    <div class="number">
      <svg viewBox="0 0 116 116">
        <circle  cx="58" cy="58" r="56" class="load" ref="load"/>
        <circle  cx="58" cy="58" r="56" class="timer" ref="timer"/>
      </svg>
      <span>0 {{id + 1}}</span>
    </div>
    <p v-text="paragraph" :data-text="paragraph" :class="paragraphClass"></p>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
//import Utils from '~/assets/js/utils/Utils'
import Emmiter from '~/assets/js/events'
import SoundHelper from '~/assets/js/utils/SoundHelper'
export default {
  name: 'StorySpeechPart',
  data(){
    return {
      paragraphClass: '',
      duration: 0,
      isActive: false
    }
  },
  props:['paragraph', 'id'],
  computed:{
    ...mapGetters(['currentPageId'])
  },
  methods:{
    onclick() {
      Emmiter.emit('PART_CLICKED', this.id)
    },
    tick() {
      if(!this.isActive) return
      const pourc = 1 - (SoundHelper.getPos() / this.duration)
      TweenMax.set(this.$refs.timer, {'stroke-dashoffset': pourc * 352})
    },
    showPart() {
      //TweenMax.to(window, 1, {scrollTo: {y: Utils.offset(this.$el).top}, overwrite: 1, ease: Quad.easeOut})
      TweenMax.to(this.$el, .5,{opacity: 1, ease:Quad.easeInOut})
      this.paragraphClass = 'active'
      TweenMax.to(this.$refs.load, 3, {'stroke-dashoffset': 60, ease: Quad.easeOut})
      Emmiter.on('SOUND_LOADED', this.activateSound.bind(this))
    },
    hidePart() {
      this.paragraphClass = ''
      TweenMax.to(this.$refs.timer, .5,{'stroke-dashoffset': 352, ease: Quad.easeOut})
      TweenMax.to(this.$el, .5,{opacity: .5, ease:Quad.easeInOut})
      this.isActive = false
      Emmiter.removeListener('SOUND_LOADED', this.activateSound.bind(this))
    },
    activateSound() {
      this.duration = SoundHelper.getDuration()
      Emmiter.removeListener('SOUND_LOADED', this.activateSound.bind(this))
      this.isActive = true
      TweenMax.to(this.$refs.load, .3, {'stroke-dashoffset': 0, ease: Quad.easeOut})
    },
    deactivateSound() {
      this.isActive = false
    }
  },
  beforeDestory() {
    Emmiter.removeListener('SOUND_LOADED', this.activateSound.bind(this))
  },
  mounted(){
    this._activateSound = this.activateSound.bind(this)
    this._deactivateSound = this.deactivateSound.bind(this)
    TweenMax.set(this.$el, {opacity: 0.5})
  }
}

</script>

<style lang="stylus" scoped>
.StorySpeechPart
  display flex
  justify-content space-between
  & + .StorySpeechPart
    margin-top 60 * $unitV
  p
    font-size 26 * $unitH
    font-weight normal
    line-height 40 * $unitH
    color $colors-grey
    width 640 * $unitH
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
