<template>
    <div class="Story">
      <v-story-top></v-story-top>
      <div class="scrollContent" ref="scrollContent">
        <v-scroll-layout>
          <v-story-content ref="content"></v-story-content>
          <v-facts ref="facts"></v-facts>
          <router-link :to="{name:'story-pageId', params: { pageId: pages[nextPageIdNum].pageId }}" class="push" v-text="pages[nextPageIdNum].pageName" @click.native="setPageTransition(true)"></router-link>
        </v-scroll-layout>
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import vStoryTop from '~/components/story/StoryTop.vue'
import vStoryContent from '~/components/story/StoryContent.vue'
import vFacts from '~/components/facts/Facts.vue'
import vScrollLayout from '~/components/layout/ScrollLayout.vue'
import Emitter from '~/assets/js/events';


export default {
  data(){
    return {
      scrollTop: 0,
      isShown: false
    }
  },
  components: { vScrollLayout, vStoryTop, vStoryContent, vFacts },
  computed:{
    ...mapState(['pages']),
    ...mapGetters(['currentPageIdNum', 'nextPageIdNum'])
  },
  methods:{
    ...mapActions(['setCurrentHomeSlideId', 'setStoryVisible', "setPageTransition"]),
    tick(){
      if(!window.smooth)return
      if(this.scrollTop != window.smooth.vars.current){
        this.scrollTop = window.smooth.vars.current
      }
      if(this.$refs.content) this.$refs.content.tick(this.scrollTop)
      if(this.$refs.facts) this.$refs.facts.tick()
    },
    resize(w, h) {
      this.w = w
      this.h = h
      if(this.$refs.content) this.$refs.content.resize(w, h)
      if(this.$refs.facts) this.$refs.facts.resize(w, h)
    },
    show(){
      this.$refs.content.show()
      this.$nextTick(this.resize(this.w, this.h))
    },
    hide(){
      this.$refs.content.hide()
    },
    setMouseWheelListener(){
      window.addEventListener("mousewheel", this._doWheel, false);
      window.addEventListener("DOMMouseScroll", this._doWheel, false);
    },
    removeMouseWheelListener(){
      window.removeEventListener("mousewheel", this._doWheel, false);
      window.removeEventListener("DOMMouseScroll", this._doWheel, false);
    },
    setMouseWheelListenerEl(){
      this.$el.addEventListener("mousewheel", this._doWheel, false);
      this.$el.addEventListener("DOMMouseScroll", this._doWheel, false);
    },
    removeMouseWheelListenerEl(){
      this.$el.removeEventListener("mousewheel", this._doWheel, false);
      this.$el.removeEventListener("DOMMouseScroll", this._doWheel, false);
    },
    doWheel(e) {
      if(this.scrollTop < 50){
        e.preventDefault();
        if(e.deltaY > 0){
          this.panBottom()
        }else{
          this.panUp()
        }
      }
    },
    panBottom() {
      if(this.isShown)return
      this.show()
      TweenMax.to(this.$refs.scrollContent, .5, {yPercent: 0, ease: Circ.easeOut, onComplete: () => {
        if(window.smooth) window.smooth.addEvents()
        this.removeMouseWheelListener()
        this.setMouseWheelListenerEl()
        this.setStoryVisible(true)
      }})
      this.isShown = true
    },
    panUp() {
      if(!this.isShown)return
      this.setStoryVisible(false)
      this.removeMouseWheelListenerEl()
      this.setMouseWheelListener()
      if(window.smooth) window.smooth.removeEvents()
      TweenMax.to(this.$refs.scrollContent, .5, {yPercent: 100, ease: Cubic.easeIn})
      this.isShown = false
      this.hide()
    }
  },
  beforeDestroy() {
    this.removeMouseWheelListener()
    this.removeMouseWheelListenerEl()
    Emitter.removeListener('PAGE_SCROLL', this._panBottom)
  },
  mounted(){
    this._doWheel = this.doWheel.bind(this)
    this._panBottom = this.panBottom.bind(this)

    this.setCurrentHomeSlideId(this.currentPageIdNum)
    TweenMax.set(this.$refs.scrollContent,  {yPercent: 100})
    this.setStoryVisible(false)
    this.setMouseWheelListener()
    this.$nextTick(()=>{
      window.smooth.removeEvents()
      window.smooth.resize()
    })
    Emitter.emit('SET_MOUSE_TYPE', {type: 'learn'})
    Emitter.on('PAGE_SCROLL', this._panBottom)

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
  .push
    display block
    position relative
    width 100%
    height 50vh
    text-indent -50000px
</style>
