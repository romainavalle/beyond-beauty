<template>
    <div class="Slider" :class="transName">
        <div class="slide-content" v-show="active" @mousedown="doMouseDown" @mouseup="doMouseUp" @mouseenter="doMouseEnter" @mouseleave="doMouseLeave">
          <v-slide v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" :id="i" ref="slide"></v-slide>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import SoundHelper from '~/assets/js/utils/SoundHelper'
import Emitter from '~/assets/js/events'
import MouseHelper from '~/assets/js/utils/MouseHelper'
import vSlide from '~/components/facts/Slide.vue'
import ioMixins from '~/components/ioMixins'

export default {
  name: "Slider",
  data(){
    return {
      transName: "",
      isDragging: false,
      current: 2
    }
  },
  mixins: [ioMixins],
  components: { vSlide },
  computed:{
    ...mapGetters(['pageData']),
    ...mapState(['currentFact'])
  },
  methods:{
    ...mapActions(['setCurrentFact']),
    show() {
    },
    hide() {
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
      this.isDragging = false
      if(dir < 0){
        if(this.currentFact === 0){
          this.$refs.slide[this.currentFact].backToZero()
        }else{
          this.setCurrentFact(Math.max(this.currentFact - 1, 0))
          }
      }else{
        if(this.currentFact === 4){
          this.$refs.slide[this.currentFact].backToZero()
        }else{
          this.setCurrentFact(Math.min(this.currentFact + 1, 4))
        }
      }
    },
    doMouseDown() {
      this.isDragging = true
      this.mousePos = MouseHelper.x
    },
    doMouseUp() {
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
      this.$refs.slide[old].hide(val - old)
      this.$refs.slide[val].show(old - val)
    },
    active(val) {
      if(val) {
        SoundHelper.pause()
      }
    }
  },
  beforeDestroy() {
  },
  mounted(){
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
