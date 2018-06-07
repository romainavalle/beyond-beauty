<template>
  <div class="StoryContent">
    <div class="content">
      <v-story-speech ref="speech"></v-story-speech>
      <v-story-media ref="media"></v-story-media>
    </div>
  </div>
</template>
<script>
import { pages } from '~/assets/data.json'
import { mapGetters } from 'vuex'
import Emmiter from '~/assets/js/events'
import vStorySpeech from '~/components/story/StorySpeech.vue'
import vStoryMedia from '~/components/story/StoryMedia.vue'
import SoundHelper from '~/assets/js/utils/SoundHelper'
export default {
  name: 'StoryContent',
  data(){
    return {
      pages,
      className: '',
      scrollTop: 0,
      currentPart: -1
    }
  },
  components:{vStorySpeech,vStoryMedia},
  computed:{
    ...mapGetters(['currentPageId'])
  },
  methods:{
    tick(scrollTop){
      this.$refs.speech.tick(scrollTop)
      this.$refs.media.tick(scrollTop)
    },
    resize(w, h){
      this.$refs.media.resize(w, h, this.$el.clientHeight)
    },
    goPart(part = -1) {
      if(part !== -1){
        this.currentPart = part
      }else{
        this.currentPart++
      }
      if (this.currentPart===3) return
      this.$refs.speech.showPart(this.currentPart)
      this.$refs.media.showPart(this.currentPart)
      SoundHelper.createSound(pages[this.currentPageId].id, this.currentPart)
    },
    show(){
      this.currentPart = -1
      this.$refs.speech.show()
      this.soundTimer = setTimeout(this.goPart.bind(this), 1000)
    },
    hide(){
      this.$refs.speech.hide()
    }
  },
  beforeDestroy(){
    clearTimeout(this.soundTimer)
    Emmiter.removeListener('PART_CLICKED', this._goPart)
    Emmiter.removeListener('SOUND_ENDED', this._goPart)
  },
  mounted(){
    this._goPart = this.goPart.bind(this)
    Emmiter.on('PART_CLICKED', this._goPart)
    Emmiter.removeListener('SOUND_ENDED', this._goPart)

  }
}

</script>

<style lang="stylus" scoped>
.StoryContent
  position relative
  padding-top 100vh
  .content
    background $colors-dBlack
</style>
