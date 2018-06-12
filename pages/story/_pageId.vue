<template>
    <div class="Story">
      <v-story-top></v-story-top>
      <v-scroll-layout>
        <v-story-content ref="content"></v-story-content>
        <v-facts></v-facts>
      </v-scroll-layout>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vStoryTop from '~/components/story/StoryTop.vue'
import vStoryContent from '~/components/story/StoryContent.vue'
import vFacts from '~/components/facts/Facts.vue'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import vScrollLayout from '~/components/layout/ScrollLayout.vue'

export default {
  data(){
    return {
      scrollTop: 0
    }
  },
  components: { vScrollLayout, vStoryTop, vStoryContent, vFacts },
  computed:{
    ...mapGetters(['currentPageIdNum'])
  },
  methods:{
    ...mapActions(['setCurrentHomeSlideId']),
    tick(){
      if(!window.smooth)return
      if(this.scrollTop != window.smooth.vars.current){
        this.scrollTop = window.smooth.vars.current
      }
      if(this.$refs.content) this.$refs.content.tick(this.scrollTop - ResizeHelper.height())
    },
    resize(w, h) {
      if(this.$refs.content) this.$refs.content.resize(w, h)
    },
    show(){
      this.$refs.content.show()
      this.$nextTick(this.resize(ResizeHelper.width(), ResizeHelper.height()))
    },
    hide(){
      this.$refs.content.hide()
    },
    setMouseWheelListener(){
      this._onWheel = this.onWheel.bind(this)
      this.$el.addEventListener("mousewheel", this._onWheel, false);
      this.$el.addEventListener("DOMMouseScroll", this._onWheel, false);
    },
    removeMouseWheelListener(){
      this.$el.removeEventListener("mousewheel", this._onWheel, false);
      this.$el.removeEventListener("DOMMouseScroll", this._onWheel, false);
    },
    onWheel(e) {
      if(this.wheelTimout) clearTimeout(this.wheelTimout)
      this.wheelTimout = setTimeout(() => {
        if(this.scrollTop <= ResizeHelper.height()){
          e.preventDefault();
          if(e.deltaY > 0){
            if(this.isShown)return
              window.smooth.scrollTo(ResizeHelper.height())
              this.show()
              this.isShown = true
          }else{
            if(!this.isShown)return
              window.smooth.scrollTo(0)
              this.hide()
              this.isShown = false
          }
        }else{

        }
      }, 30)
    }
  },
  mounted(){
    this.setCurrentHomeSlideId(this.currentPageIdNum)
    this.setMouseWheelListener()

  }
}

</script>

<style lang="stylus" scoped>
.Story
  position relative
  width 100%
  .slider
    background white
    position relative
    z-index 2
    .text
      position relative

</style>
