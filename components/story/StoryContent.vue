<template>
  <div class="StoryContent">
    <div class="content">
      <v-story-speech ref="speech"></v-story-speech>
      <v-story-media ref="media"></v-story-media>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Emitter from '~/assets/js/events'
import vStorySpeech from '~/components/story/StorySpeech.vue'
import vStoryMedia from '~/components/story/StoryMedia.vue'
export default {
  name: 'StoryContent',
  data(){
    return {
      className: '',
      scrollTop: 0
    }
  },
  components:{vStorySpeech,vStoryMedia},
  computed:{
    ...mapGetters(['pageData'])
  },
  methods:{
    tick(scrollTop){
      this.$refs.speech.tick(scrollTop)
    },
    resize(w, h){
      this.$refs.speech.resize(w, h, this.$refs.media.$el.clientHeight)
      this.$refs.media.resize()
    },

    show(){
      this.$refs.speech.show()
      this.$refs.media.show()
      this.soundTimer = setTimeout(() => {this.$refs.speech.showPart(0)}, 1000)
    },
    hide(){
      this.$refs.media.hide()
      this.$refs.speech.hide()
    },
    onReady() {
      this.$refs.media.onReady()
    }
  },
  beforeDestroy(){
    clearTimeout(this.soundTimer)
  },
  mounted(){

  }
}

</script>

<style lang="stylus" scoped>
.StoryContent
  position relative
  pointer-events auto
  .content
    padding-top 320 * $unitV
    padding-bottom 320 * $unitV
    background $colors-dBlack

</style>
