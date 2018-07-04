<template>
    <div class="Story">
      <v-story-top></v-story-top>
      <div class="scrollContent" ref="scrollContent">
        <v-scroll-layout>
          <v-story-content ref="content"></v-story-content>
          <v-facts ref="facts"></v-facts>
          <v-push ref="push"></v-push>
        </v-scroll-layout>
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ScrollMixins from '~/components/ScrollMixins.js'
import vStoryTop from '~/components/story/StoryTop.vue'
import vStoryContent from '~/components/story/StoryContent.vue'
import vFacts from '~/components/facts/Facts.vue'
import vPush from '~/components/story/StoryPush.vue'
import Emitter from '~/assets/js/events';


export default {
  data(){
    return {
    }
  },
  components: { vStoryTop, vStoryContent, vFacts, vPush },
  computed:{
    ...mapGetters(['currentPageIdNum'])
  },
  mixins:[ScrollMixins],
  methods:{
    ...mapActions(['setCurrentHomeSlideId']),
    tick(){
      this.checkScroll()
      this.$refs.content.tick(this.scrollTop)
      this.$refs.facts.tick()
      this.$refs.push.tick()
    },
    load(){
      this.$refs.facts.load()
    },
    resize(w, h) {
      this.$refs.content.resize(w, h)
      this.$refs.facts.resize(w, h)
    },
    show(){
      this.$refs.content.show()
    },
    hide(){
      this.$refs.content.hide()
    }
  },

  mounted(){
    this.setCurrentHomeSlideId(this.currentPageIdNum)
    Emitter.emit('SET_MOUSE_TYPE', {type: 'learn'})

  }
}

</script>

<style lang="stylus" scoped>
.Story
  position relative
  width 100%
  pointer-events none
  .scrollContent
    position relative
    width 100%
    height 100vh

</style>
