<template>
    <div class="Story">
      <v-story-top></v-story-top>
      <div class="scrollContent" ref="scrollContent">
        <v-scroll-layout>
          <div class="padding"></div>
          <v-story-content ref="content"></v-story-content>
          <v-facts ref="facts"></v-facts>
        </v-scroll-layout>
      </div>
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
    ...mapActions(['setCurrentHomeSlideId', 'setStoryVisible']),
    tick(){
      if(!window.smooth)return
      if(this.scrollTop != window.smooth.vars.current){
        this.scrollTop = window.smooth.vars.current
      }
      if(this.$refs.content) this.$refs.content.tick(this.scrollTop - ResizeHelper.height())
      if(this.$refs.facts) this.$refs.facts.tick()

    },
    resize(w, h) {
      if(this.$refs.content) this.$refs.content.resize(w, h)
      if(this.$refs.facts) this.$refs.facts.resize(w, h)
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
      if(this.scrollTop < 3){
        e.preventDefault();
        if(e.deltaY > 0){
          if(this.isShown)return
            this.show()
            TweenMax.to(this.$refs.scrollContent, 1, {yPercent: 0, ease: Circ.easeOut, onComplete: () => {
              if(window.smooth)window.smooth.addEvents()
              this.setStoryVisible(true)
            }})
            this.isShown = true
        }else{
          if(!this.isShown)return
            this.setStoryVisible(false)
            if(window.smooth)window.smooth.removeEvents()
            TweenMax.to(this.$refs.scrollContent, 1, {yPercent: 100, ease: Cubic.easeIn})
            this.isShown = false
            this.hide()

        }
      }else{

      }
    }
  },
  mounted(){
    this.setCurrentHomeSlideId(this.currentPageIdNum)
    this.setMouseWheelListener()
    TweenMax.set(this.$refs.scrollContent,  {yPercent: 100})

    this.$nextTick(()=>{

      if(window.smooth)window.smooth.removeEvents()
    })

  }
}

</script>

<style lang="stylus" scoped>
.Story
  position relative
  width 100%
  .scrollContent
    position relative
    width 100%
    height 100vh
  .padding
    position relative
    width 100%
</style>
