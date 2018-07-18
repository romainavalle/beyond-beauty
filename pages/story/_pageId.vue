<template>
    <div class="Story">
      <v-story-top ref="top"></v-story-top>
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
import { mapActions, mapGetters, mapState } from 'vuex';
import ScrollMixins from '~/components/ScrollMixins.js'
import vStoryTop from '~/components/story/StoryTop.vue'
import vStoryContent from '~/components/story/StoryContent.vue'
import vFacts from '~/components/facts/Facts.vue'
import vPush from '~/components/story/StoryPush.vue'
import Emitter from '~/assets/js/events';


export default {

  head () {
    return {
      title: `Beyond Beauty | ${this.pages[this.currentPageIdNum].pageName}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Four women mainly known for their appearances. Discover their inner beauty. Learn more about ${this.pages[this.currentPageIdNum].name}.`
        },
        {
          hid: `og:title`,
          property: 'og:title',
          content: `Beyond Beauty | ${this.pages[this.currentPageIdNum].pageName}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `Four women mainly known for their appearances. Discover their inner beauty. Learn more about ${this.pages[this.currentPageIdNum].name}.`
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `https://www.beyond-beauty.co/story/${this.pages[this.currentPageIdNum].id}/`
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `https://www.beyond-beauty.co/images/share/${this.pages[this.currentPageIdNum].id}.jpg`
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: `Beyond Beauty | ${this.pages[this.currentPageIdNum].pageName}`,
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: `https://www.beyond-beauty.co/images/share/${this.pages[this.currentPageIdNum].id}.jpg`
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: `Four women mainly known for their appearances. Discover their inner beauty. Learn more about ${this.pages[this.currentPageIdNum].name}.`
        },
        {
          hid: 'twitter:url',
          property: 'twitter:url',
          content: `https://www.beyond-beauty.co/story/${this.pages[this.currentPageIdNum].id}/`
        }
      ]
    }
  },
  data(){
    return {
    }
  },
  components: { vStoryTop, vStoryContent, vFacts, vPush },
  computed:{
    ...mapState(['pages']),
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
    },
    onReady() {
      this.doReady()
      this.$refs.top.onReady()
      this.$refs.content.onReady()
      this.$refs.push.onReady()
    },
    hidePush() {
      this.$refs.push.hide()
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
