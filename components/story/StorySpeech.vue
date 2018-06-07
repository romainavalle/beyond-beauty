<template>
  <div class="StorySpeech" :class="`speech-${currentPageId}`">
    <h3 v-text="story.name" :data-text="story.name" ref="name" :class="nameClass"></h3>
    <strong v-text="`– ${story.date}`" :data-text="`– ${story.date}`" ref="date" :class="dateClass"></strong>
    <div class="text" ref="text">
      <v-story-speech-part v-for="(paragraph, i) in story.texts" :key="i" :paragraph="paragraph" :id="i" ref="parts"></v-story-speech-part>
    </div>
  </div>
</template>
<script>
import { pages } from '~/assets/data.json'
import vStorySpeechPart from '~/components/story/StorySpeechPart.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'StorySpeech',
  data(){
    return {
      pages,
      nameClass: '',
      dateClass: '',
      paragraphClass: ['','',''],
      shown: false,
      currentPart: -1
    }
  },
  components: {vStorySpeechPart},
  computed:{
    ...mapGetters(['currentPageId']),
    story(){
      return this.pages[this.currentPageId].story
    }
  },
  methods:{
    tick(){
      if(this.currentPart !== -1)this.$refs.parts[this.currentPart].tick()
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
  position relative
  padding-top 160 * $unitV
  padding-bottom 160 * $unitV
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
    background radial-gradient(rgba(#4e4e4b,1) 50%,rgba(#4e4e4b,0) 100%) no-repeat
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
  &.speech-0
    .number span,
    p.html span
      color #f7c8ae
    .number svg .timer
      stroke #f7c8ae
    h3:before,
    strong:before
      background radial-gradient(rgba(#f7c8ae,1) 50%,rgba(#f7c8ae,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text
  &.speech-1
    .number span,
    p.html span
      color #f7b8b0
    .number svg .timer
      stroke #f7b8b0
    h3:before,
    strong:before
      background radial-gradient(rgba(#f7b8b0,1) 50%,rgba(#f7b8b0,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text

  &.speech-2
    .number span,
    p.html span
      color #f7cfae
    .number svg .timer
      stroke #f7cfae
    h3:before,
    strong:before
      background radial-gradient(rgba(#f7cfae,1) 50%,rgba(#f7cfae,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text

  &.speech-3
    .number span,
    p.html span
      color #f5d4a4
    .number svg .timer
      stroke #f5d4a4
    h3:before,
    strong:before
      background radial-gradient(rgba(#f5d4a4,1) 50%,rgba(#f5d4a4,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      -webkit-background-clip text

</style>
