<template>
  <div class="StorySpeech" :class="`StorySpeech--${pageData.id}`">
    <h3 v-text="story.name" :data-text="story.name" ref="name" :class="nameClass"></h3>
    <strong v-text="`– ${story.date}`" :data-text="`– ${story.date}`" ref="date" :class="dateClass"></strong>
    <div class="text" ref="text">
      <v-story-speech-part v-for="(paragraph, i) in story.texts" :key="i" :paragraph="paragraph" :id="i" ref="parts"></v-story-speech-part>
    </div>
  </div>
</template>
<script>
import vStorySpeechPart from '~/components/story/StorySpeechPart.vue'
import { mapGetters } from 'vuex'
import ioMixins from '~/components/ioMixins'
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
      if(scrollTop < 0) scrollTop = 0
      if(scrollTop === this.scrollTop)return
      this.scrollTop = scrollTop
      TweenMax.set(this.$el, {y: scrollTop - (scrollTop * this.contentHeight)})
      if(this.currentPart !== -1)this.$refs.parts[this.currentPart].tick()
    },
    resize(w, h) {
      this.contentHeight = this.$el.clientHeight / (this.$parent.$el.clientHeight)
    },
    showPart(part) {
      if(this.currentPart !== -1)this.$refs.parts[this.currentPart].hidePart()
      this.currentPart = part
      this.$refs.parts[this.currentPart].showPart()
    },
    reset() {
      TweenMax.set([this.$refs.name, this.$refs.date, this.$refs.text], {opacity: 0, y: 50})
    },
    show() {
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
      for (let index = 0; index < 3; index++) {
        this.$set(this.paragraphClass, index, '')
      }
      TweenMax.to([this.$refs.name, this.$refs.date, this.$refs.text], .5, {opacity: 0, y: 50, ease: Quad.easeIn})
    }
  },
  mounted(){
    this.reset()
  }
}

</script>

<style lang="stylus" scoped>
.StorySpeech
  position absolute
  width 960 * $unitH
  h3
    font-size 148 * $unitH
    font-weight normal
    line-height 1.1
    color $colors-grey
    padding-left 320 * $unitH
  strong
    font-size 52 * $unitH
    padding-left 320 * $unitH
    font-weight normal
    margin 60 * $unitV 0 60 * $unitV 60 * $unitH
    display block


</style>

<style lang="stylus" >
.StorySpeech
  h3, strong, p
    position relative
  h3:before,
  strong:before,
  p.text:before
    content attr(data-text)
    top 0
    position absolute
    color transparent
    -webkit-color transparent
    transition background-size .3s ease-out-quad
  h3.active:before
    background-size 500px 500px !important
  strong.active:before
    background-size 500px 500px !important
  p.text.active:before
    background-size 1000px 1000px !important
    transition background-size 1s ease-in-out-quad
  p.text:before
    background radial-gradient(rgba($colors-grey,1) 50%,rgba($colors-grey,0) 100%) no-repeat
    background-size 0px 0px
    background-position center center
    -webkit-background-clip text
  h3
    font-size 148 * $unitH
    font-weight normal
    line-height 1.1
    color $colors-grey
  strong
    font-size 52 * $unitH
    font-weight normal
    margin 60 * $unitV 0 60 * $unitV 60 * $unitH
    display block
  &--natalie-portman
    .number span,
    p.html span
      color $colors-natalie-portman
    .number svg .timer
      stroke $colors-natalie-portman
    h3:before,
    strong:before
      background radial-gradient(rgba($colors-natalie-portman,1) 50%,rgba($colors-natalie-portman,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text
  &--emma-watson
    .number span,
    p.html span
      color $colors-emma-watson
    .number svg .timer
      stroke $colors-emma-watson
    h3:before,
    strong:before
      background radial-gradient(rgba($colors-emma-watson,1) 50%,rgba($colors-emma-watson,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text

  &--jennifer-lawrence
    .number span,
    p.html span
      color $colors-jennifer-lawrence
    .number svg .timer
      stroke $colors-jennifer-lawrence
    h3:before,
    strong:before
      background radial-gradient(rgba($colors-jennifer-lawrence,1) 50%,rgba($colors-jennifer-lawrence,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text

  &--cara-delevingne
    .number span,
    p.html span
      color $colors-cara-delevingne
    .number svg .timer
      stroke $colors-cara-delevingne
    h3:before,
    strong:before
      background radial-gradient(rgba($colors-cara-delevingne,1) 50%,rgba($colors-cara-delevingne,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text

</style>
