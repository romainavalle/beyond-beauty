<template>
  <div class="Drag">
    <canvas ref="canvas" :class="{'grab': grabClass}" @mouseenter="doMouseEnter" @mouseleave="doMouseLeave"></canvas>
  </div>
</template>
<script>

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import DragBlob from '~/assets/js/blobs/DragBlob'
import { $colors } from '~/assets/variables.json'
import ioMixins from '~/components/ioMixins'
import Emitter from '~/assets/js/events'
import { mapActions, mapState } from 'vuex';


export default {
  name: "Drag",
  data(){
    return {
      grabClass: false
    }
  },
  mixins:[ioMixins],
  computed:{
    ...mapState(['currentFact']),
    canvasSize() {
      const size = Math.max(ResizeHelper.width() / 2880 * 300, 100)
      return {w: size, h: size}
    }
  },
  methods:{
    ...mapActions(['setCurrentFact']),
    tick() {
      if(!this.active)return
      this.blob.tick()
      const x = this.oldX - this.draggable[0].x
      this.oldX = this.draggable[0].x
      this.blob.setDeformation(x)
      this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
      this.ctx.drawImage(this.blob.canvas, 0, 0, this.canvasSize.w, this.canvasSize.h);
    },
    setDragBlob() {
      this.blob = new DragBlob(this.canvasSize.w, this.canvasSize.h)
    },
    resize(w, h) {
      this.$refs.canvas.width = this.canvasSize.w
      this.$refs.canvas.height = this.canvasSize.h
      this.$refs.canvas.style.width = this.canvasSize.w + 'px'
      this.$refs.canvas.style.height = this.canvasSize.h + 'px'
      this.blob.resize(this.canvasSize.w, this.canvasSize.h, Math.max(w / 2880 * 80, 40))

      this.setSnapValue(w)
      TweenMax.to(this.$el, .8,{y: '-50%', x: this.snapValues[this.currentFact], overwrite: 1, ease: Power4.easeOut, onComplete: () => {
        this.draggable[0].update()
      }})

    },
    setSnapValue(w){
      const padding = (w / 2880 * 160) + (w / 2880 * 25)
      const timelineW = w - padding * 2 // width - padding
      this.snapValues = []
      for (let index = 0; index < 5; index++) {
        this.snapValues.push(Math.round(padding + timelineW / 4 * index))
      }
    },
    show(delay) {
      this.blob.show(delay)
    },
    hide(){
      this.blob.hide()
    },
    doMouseEnter() {
      this.blob.doMouseEnter()
    },
    doMouseLeave() {
      this.blob.doMouseLeave()

    }
  },
  watch: {
    currentFact(val) {
      if(val === this.snapValues.indexOf(Math.round(this.draggable[0].x))) return
      TweenMax.to(this.$el, .8,{y: '-50%', x: this.snapValues[val], overwrite: 1, ease: Power4.easeOut, onComplete: () => {
        this.draggable[0].update()
      }})
    }
  },
  mounted(){
    this.setSnapValue(ResizeHelper.width())
    this.oldX = this.snapValues[this.currentFact]
    TweenMax.set(this.$el, {y: '-50%', x: this.oldX})
     this.draggable = Draggable.create(this.$el , {
        type:"x",
        cursor: '-webkit-grab',
        dragClickables: true,
        allowNativeTouchScrolling: false,
        force3D: true,
        edgeResistance:1,
        dragResistance:.3,
        maxDuration: .6,
        zIndexBoost: false,
        lockAxis:true,
        throwProps:true,
        snap: {
          x: this.snapValues
        },
        onThrowComplete: () => {
          this.setCurrentFact( this.snapValues.indexOf(Math.round(this.draggable[0].x)))
        },
        onDragEnd: () => {
        }
      });
    this.ctx = this.$refs.canvas.getContext('2d')
    this.setDragBlob()
    Emitter.on('DRAG:GOTO', (e) => { this.setCurrentFact(e.val) })
  }
}

</script>

<style lang="stylus" scoped>
.Drag
  position absolute
  //width 100vw
  //height 400 * $unitV
  height 300 * $unitH
  width 300 * $unitH
  top 50%
  canvas
    position absolute
    top 50%
    left 0
    width 100%
    height 100%
    transform translate(-50%, -50%)
</style>
