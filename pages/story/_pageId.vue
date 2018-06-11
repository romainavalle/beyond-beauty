<template>
  <section class="Story">
    <v-story-top></v-story-top>
    <v-story-content ref="content"></v-story-content>

    <div class="slider">
      <div class="text">
      <p>ELLE DEVIENT<br>AMBASSADRICE<br>DE L'ESPOIR POUR LA<br>FINCA ET VOYAGE EN<br>OUGANDE AU GUATEMALA<br>ET EN EQUATEUR</p>
      <p class="bottom">ELLE DEVIENT<br>AMBASSADRICE<br>DE <span>L'ESPOIR</span> POUR LA<br>FINCA ET VOYAGE EN<br><span>OUGANDE</span> AU GUATEMALA<br>ET EN EQUATEUR</p>
      </div>
    </div>
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
      if(this.isShown){
        TweenMax.to(window, .5, {scrollTo: {y: ResizeHelper.height() + 1, autoKill: false}, overwrite: 1})
      }
    },
    show(){
      this.resize(ResizeHelper.width(), ResizeHelper.height())
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
            if(this.isShown)return
            TweenMax.to(window, 1, {scrollTo: {y: ResizeHelper.height() + 1, autoKill: false}, overwrite: 1, ease: Quad.easeOut, onStart:() => {
              this.show()
              this.isShown = true
            }})
          }else{
            if(!this.isShown)return
            TweenMax.to(window, 1, {scrollTo: {y: 0, autoKill: false}, overwrite: 1, ease: Quad.easeOut, onStart:() => {
              this.hide()
              this.isShown = false
            }})
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
  .slider
    background white
    position relative
    z-index 2
    .text
      position relative
    p
      font-size 140 * $unitH
      text-align center
      font-family $hawthorn
      color transparent
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: black;
      position relative
      &.bottom
        position absolute
        top 0
        left 0
        right 0
        span
          color $colors-black
</style>
