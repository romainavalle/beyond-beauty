<template>
  <div class="StorySpeech" :class="`StorySpeech--${pageData.id}`">
    <h3 v-text="story.name" ref="name" :class="nameClass"></h3>
    <strong v-text="story.date" ref="date" :class="dateClass"></strong>
    <div class="text" ref="text">
      <v-story-speech-part v-for="(paragraph, i) in story.texts" :key="i" :paragraph="paragraph" :id="i" ref="parts"></v-story-speech-part>
    </div>
  </div>
</template>
<script>
import vStorySpeechPart from '~/components/story/StorySpeechPart.vue'
import { mapGetters } from 'vuex'
import ioMixins from '~/components/ioMixins'
import Emitter from '~/assets/js/events'
import SoundHelper from '~/assets/js/utils/SoundHelper'
if(process.browser) {
  var transform = require('dom-transform');
}
export default {
  name: 'StorySpeech',
  data(){
    return {
      nameClass: '',
      dateClass: '',
      paragraphClass: ['','',''],
      shown: false,
      currentPart: -1,
      scrollTop: 0
    }
  },
  mixins:[ioMixins],
  components: {vStorySpeechPart},
  computed:{
    ...mapGetters(['pageData']),
    story(){
      return this.pageData.story
    }
  },
  methods:{
    tick(scrollTop){
      if(!this.active) return
      if(this.currentPart !== -1)this.$refs.parts[this.currentPart].tick()
      if(scrollTop < 0) scrollTop = 0
      if(scrollTop === this.scrollTop)return
      this.scrollTop = scrollTop
      const top = scrollTop - this.contentHeight * (scrollTop/this.mediaHeight)
      transform(this.$el, {translate3d:[0, top.toFixed(1), 0]})
    },
    resize(w, h, mediaHeight) {
      this.mediaHeight = mediaHeight + 320 * h  / 1760
      this.contentHeight =   this.$el.clientHeight + 300 * h  / 1760
    },
    showPart(part) {

      if (this.currentPart===3) return
      if(this.currentPart === part){
        SoundHelper.playPause()
        return
      }
      if(this.currentPart !== -1){
        this.$refs.parts[this.currentPart].hidePart()
        const top = this.$refs.parts[part].$el.offsetTop * this.mediaHeight / this.contentHeight
        if(window.smooth) window.smooth.scrollTo(top)
      }
      this.currentPart = part
      this.$refs.parts[this.currentPart].showPart()
      SoundHelper.createSound(this.pageData.id, this.currentPart)
    },
    reset() {
      TweenMax.set([this.$refs.name, this.$refs.date, this.$refs.text], {opacity: 0, y: 50})
    },
    show() {
      this.currentPart = -1
      TweenMax.to(this.$refs.name, 1, {delay: .3, opacity: 1, y: 0, ease: Quad.easeOut})
      setTimeout(() => {this.nameClass = 'active'}, 600)
      TweenMax.to(this.$refs.date, 1, {delay: .6, opacity: 1, y: 0, ease: Quad.easeOut})
      setTimeout(() => {this.dateClass = 'active'}, 900)
      TweenMax.to(this.$refs.text, 1, {delay: .9, opacity: 1, y: 0, ease: Quad.easeOut})
      setTimeout(() => {this.$set(this.paragraphClass, 0, 'active')}, 1200)
    },
    hide() {
      this.nameClass = ''
      this.dateClass = ''
      SoundHelper.fadeOut()
      for (let index = 0; index < 3; index++) {
        this.$set(this.paragraphClass, index, '')
      }
      TweenMax.to([this.$refs.name, this.$refs.date, this.$refs.text], .5, {opacity: 0, y: 50, ease: Quad.easeIn})
    },
    onSoundEnded() {
      if(this.currentPart < 2){
        this.showPart(this.currentPart + 1)
      }else{
        this.$refs.parts[this.currentPart].hidePart()
      }
    }
  },
  watch: {
    active: function(val) {
      if(!val) {
        SoundHelper.fadeOut()
        this.$refs.parts.forEach(el => {
          el.hidePart()
        })
      }
    }
  },
  beforeDestroy() {
    Emitter.removeListener('SOUND_ENDED', this._onSoundEnded)
    Emitter.removeListener('PART_CLICKED', this._showPart)
  },
  mounted(){
    this._onSoundEnded =  this.onSoundEnded.bind(this)
    this._showPart =  this.showPart.bind(this)
    Emitter.on('SOUND_ENDED', this._onSoundEnded)
    Emitter.on('PART_CLICKED', this._showPart)
    this.reset()
  }
}

</script>

<style lang="stylus" scoped>
.StorySpeech
  position absolute
  width 960 * $unitH
  will-change transform
  h3
    font-size 60 * $unitH
    font-weight normal
    line-height 1.1
    padding-left 240 * $unitH
  strong
    font-size 52 * $unitH
    padding-left 240 * $unitH
    font-weight $light
    margin 14 * $unitV 0 80 * $unitV 0
    display flex
    align-items center
    justify-content flex-start
    &:before
      content ''
      width 120 * $unitH
      height 1px
      display block
      margin-right 40 * $unitH


</style>

<style lang="stylus" >
.StorySpeech
  p
    position relative
  p.text:before
    content attr(data-text)
    top 0
    position absolute
    color transparent
    -webkit-color transparent
    transition background-size .3s ease-out-quad
  p.text.active:before
    background-size 1000px 1000px !important
    transition background-size 1s ease-in-out-quad
  p.text:before
    background radial-gradient(rgba($colors-speechGrey,1) 50%,rgba($colors-speechGrey,0) 100%) no-repeat
    background-size 0px 0px
    background-position center center
    -webkit-background-clip text
  &--natalie-portman
    h3, strong,
    p.html span
      color $colors-natalie-portman
    .number svg .timer
      stroke $colors-natalie-portman
    strong:before
      background-color $colors-natalie-portman

  &--emma-watson
    h3, strong,
    p.html span
      color $colors-emma-watson
    .number svg .timer
      stroke $colors-emma-watson
    strong:before
      background-color $colors-emma-watson

  &--jennifer-lawrence
    h3, strong,
    p.html span
      color $colors-jennifer-lawrence
    .number svg .timer
      stroke $colors-jennifer-lawrence
    strong:before
      background-color $colors-jennifer-lawrence


  &--cara-delevingne
    h3, strong,
    p.html span
      color $colors-cara-delevingne
    .number svg .timer
      stroke $colors-cara-delevingne
    strong:before
      background-color $colors-cara-delevingne


</style>
