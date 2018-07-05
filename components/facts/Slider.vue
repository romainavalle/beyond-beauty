<template>
    <div class="Slider" :class="transName">
        <div class="slide-content" v-show="active" @mousedown="doMouseDown" @mouseup="doMouseUp" @mouseenter="doMouseEnter" @mouseleave="doMouseLeave">
          <v-slide v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" :id="i" :images="images" ref="slide"></v-slide>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import SoundHelper from '~/assets/js/utils/SoundHelper'
import Emitter from '~/assets/js/events'
import MouseHelper from '~/assets/js/utils/MouseHelper'
import vSlide from '~/components/facts/Slide.vue'
import FactImages from '~/assets/js/facts/FactImages'
import ioMixins from '~/components/ioMixins'

export default {
  name: "Slider",
  data(){
    return {
      transName: "",
      isDragging: false,
      current: 2,
      images: {},
      isLoaded: false
    }
  },
  mixins: [ioMixins],
  components: { vSlide },
  computed:{
    ...mapGetters(['pageData', 'currentPageId', 'getURI']),
    ...mapState(['currentFact'])
  },
  methods:{
    ...mapActions(['setCurrentFact']),
    show() {
      this.$nextTick(()=>{
        this.resize(this.w, this.h)
      })
      this.load()
      SoundHelper.pause()
    },
    hide() {
    },
    load() {
      if(this.isLoaded) return
      this.isLoaded = true
      this.images.load(this.getURI)
      for (let index = 0; index < this.$refs.slide.length; index++) {
        this.$refs.slide[index].load()
      }

    },
    resize(w, h){
      this.w = w
      this.h = h
      for (let index = 0; index < this.$refs.slide.length; index++) {
        this.$refs.slide[index].resize(w, h)
      }
    },
    tick() {
      if(!this.active)return
        this.images.tick()


      if(!this.isDragging){
        for (let index = 0; index < this.$refs.slide.length; index++) {
          this.$refs.slide[index].tick()
        }
      }else{
        const max = this.w / 8
        const dir = this.mousePos - MouseHelper.x
        if(Math.abs(dir) > max)this.goNext(dir)
        this.$refs.slide[this.currentFact].tick(-dir)
      }

    },
    goNext(dir) {
      if(dir < 0){
        if(this.currentFact === 0){
          this.$refs.slide[this.currentFact].backToZero()
          this.isDragging = false
        }else{
          this.setCurrentFact(Math.max(this.currentFact - 1, 0))
          }
      }else{
        if(this.currentFact === 4){
          this.isDragging = false
          this.$refs.slide[this.currentFact].backToZero()
        }else{
          this.setCurrentFact(Math.min(this.currentFact + 1, 4))
        }
      }
    },
    doMouseDown() {

      this.$refs.slide[this.currentFact].doMouseOut()
      this.isDragging = true
      this.mousePos = MouseHelper.x
      Emitter.emit('SCALE_MOUSE_DOWN')
    },
    doMouseUp() {
      Emitter.emit('SCALE_MOUSE_UP')
      if(this.isDragging)this.$refs.slide[this.currentFact].backToZero()
      this.isDragging = false
    },
    doMouseEnter(){
      Emitter.emit('SET_MOUSE_TYPE', {type: 'drag'})
      Emitter.emit('SHOW_MOUSE')
    },
    doMouseLeave() {
      Emitter.emit('HIDE_MOUSE')
    }
  },
  watch:{
    currentFact(val, old) {
      //this.$refs.slide[this.currentFact].doMouseOut()
      this.$refs.slide[old].hide(val - old, this.isDragging ? .7 : 1)
      this.$refs.slide[val].show(old - val, this.isDragging ? .7 : 1)
      this.isDragging = false
    },
    active(val) {
      if(val) {
        this.show()
      }
    }
  },
  beforeDestroy() {
  },
  mounted(){
    this.images = new FactImages(this.currentPageId)
  }
}

</script>

<style lang="stylus" scoped>
.Slider
  margin-top 180 * $unitV
  position relative
  width 100%
  user-select none
  cursor -webkit-grab
  .slide-content
    position relative
    width 100%
    max-width 9 * 160 * $unitH
    height 6 * 140 * .9 * $unitH // 6 line * 140 unit font-size * line height
    margin 0 auto

</style>
