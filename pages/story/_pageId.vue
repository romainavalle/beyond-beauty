<template>
  <section class="Story">
    <v-story-top></v-story-top>
    <v-story-content ref="content"></v-story-content>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vStoryTop from '~/components/story/StoryTop.vue'
import vStoryContent from '~/components/story/StoryContent.vue'
import ScrollHelper from '~/assets/js/utils/ScrollHelper'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'

export default {
  data(){
    return {
      scrollTop: 0
    }
  },
  components: { vStoryTop, vStoryContent },
  computed:{
    ...mapGetters(['currentPageId'])
  },
  methods:{
    ...mapActions(['setCurrentHomeSlideId']),
    tick(){
      if(this.scrollTop != ScrollHelper.scrollTop){
        this.scrollTop = ScrollHelper.scrollTop
      }
      if(this.$refs.content) this.$refs.content.tick(this.scrollTop - ResizeHelper.height())
    },
    resize(w, h) {
      if(this.$refs.content) this.$refs.content.resize(w, h)
    },
    show(){
      this.$refs.content.show()
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
            TweenMax.to(window, 1, {scrollTo: {y: ResizeHelper.height() + 1}, overwrite: 1, ease: Quad.easeOut})
            if(this.isShown)return
            this.show()
            this.isShown = true
          }else{
            TweenMax.to(window, 1, {scrollTo: {y: 0}, overwrite: 1, ease: Quad.easeOut})
            if(!this.isShown)return
            this.hide()
            this.isShown = false
          }
        }else{

        }
      }, 30)
    }
  },
  mounted(){
    this.setCurrentHomeSlideId(this.currentPageId)
    this.setMouseWheelListener()
  }
}

</script>

<style lang="stylus" scoped>
.Story
  position relative
  width 100%
</style>
