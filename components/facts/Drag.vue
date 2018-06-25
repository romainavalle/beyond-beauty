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
      return {w: ResizeHelper.width() / 2880 * 320, h: ResizeHelper.width() / 2880 * 320}
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
      const shapeW = ResizeHelper.width() / 2880 * 100
      this.blob = new DragBlob(this.canvasSize.w, this.canvasSize.h, shapeW)
    },
    resize(w, h) {
      this.$refs.canvas.width = this.canvasSize.w
      this.$refs.canvas.height = this.canvasSize.h
      this.blob.resize(this.canvasSize.w, this.canvasSize.h)
      this.setSnapValue()

    },
    setSnapValue(){
      const padding = (ResizeHelper.width() / 2880 * 160) + (ResizeHelper.width() / 2880 * 25)
      const timelineW = ResizeHelper.width() - padding * 2 // width - padding
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
      TweenMax.to(this.$el, .5,{x: this.snapValues[val], ease: Quad.easeOut, onComplete: () => {
        this.draggable[0].update()
      }})
    }
  },
  mounted(){
    this.setSnapValue()
    this.oldX = this.snapValues[this.currentFact]
    TweenMax.set(this.$el, {x: this.oldX})
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
  height 320 * $unitH
  width 320 * $unitH
  bottom 0 * $unitH
  canvas
    position relative
    margin-left -160 * $unitH
</style>
