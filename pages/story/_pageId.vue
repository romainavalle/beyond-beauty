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
import vStoryTop from '~/components/story/StoryTop.vue'
import vStoryContent from '~/components/story/StoryContent.vue'
import vFacts from '~/components/facts/Facts.vue'
import vPush from '~/components/story/StoryPush.vue'
import vScrollLayout from '~/components/layout/ScrollLayout.vue'
import Emitter from '~/assets/js/events';


export default {
  data(){
    return {
      scrollTop: 0,
      isShown: false
    }
  },
  components: { vScrollLayout, vStoryTop, vStoryContent, vFacts, vPush },
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
      this.$refs.content.tick(this.scrollTop)
      this.$refs.facts.tick()
      this.$refs.push.tick()
    },
    load(){
      this.$refs.facts.load()
    },
    resize(w, h) {
      this.w = w
      this.h = h
      this.$refs.content.resize(w, h)
      this.$refs.facts.resize(w, h)
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
      window.addEventListener("wheel", this._doWheel, false);
    },
    removeMouseWheelListener(){
      window.removeEventListener("mousewheel", this._doWheel, false);
      window.removeEventListener("wheel", this._doWheel, false);
    },
    setMouseWheelListenerEl(){
      this.$el.addEventListener("mousewheel", this._doWheel, false);
      this.$el.addEventListener("wheel", this._doWheel, false);
    },
    removeMouseWheelListenerEl(){
      this.$el.removeEventListener("mousewheel", this._doWheel, false);
      this.$el.removeEventListener("wheel", this._doWheel, false);
    },
    doWheel(e) {
      if(this.scrollTop < 50){
        e.preventDefault();
        if(e.deltaY > 0){
          this.panDown()
        }else{
          this.panUp()
        }
      }
    },
    panDown() {
      if(this.isShown)return
      this.show()
      Emitter.emit('PAGE:PANDOWN')
      TweenMax.to(this.$refs.scrollContent, .5, {yPercent: 0, ease: Circ.easeOut, onComplete: () => {
        window.smooth.addEvents(true)
        this.removeMouseWheelListener()
        this.setMouseWheelListenerEl()
        this.setStoryVisible(true)
      }})
      this.isShown = true
    },
    panUp() {
      if(!this.isShown)return
      Emitter.emit('PAGE:PANUP')
      this.setStoryVisible(false)
      this.removeMouseWheelListenerEl()
      this.setMouseWheelListener()
      window.smooth.vars.target = 0
      window.smooth.removeEvents(true)
      TweenMax.to(this.$refs.scrollContent, .5, {yPercent: 100, ease: Cubic.easeIn})
      this.isShown = false
      this.hide()
    }
  },
  beforeDestroy() {
    this.removeMouseWheelListener()
    this.removeMouseWheelListenerEl()
    Emitter.removeListener('PAGE_SCROLL', this._panDown)
  },
  mounted(){
    this._doWheel = this.doWheel.bind(this)
    this._panDown = this.panDown.bind(this)

    this.setCurrentHomeSlideId(this.currentPageIdNum)
    TweenMax.set(this.$refs.scrollContent,  {yPercent: 100})
    this.setStoryVisible(false)
    this.setMouseWheelListener()
    this.$nextTick(()=>{
      window.smooth.removeEvents(true)
      window.smooth.resize()
    })
    Emitter.emit('SET_MOUSE_TYPE', {type: 'learn'})
    Emitter.on('PAGE_SCROLL', this._panDown)

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
