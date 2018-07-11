<template>
  <canvas class="Noise"></canvas>
</template>

<script>

export default {
  name: 'Noise',
  data(){
    return {
      tileSize: 128,
      grain: 1,
      opacity: 0.05,
      tickInt: 0
    }
  },
  computed:{
  },
  methods:{
    resize(w, h) {
      this.w = w
      this.h = h
      this.canvas.width = w
      this.canvas.height = h
      this.secondCanvas.width = w
      this.secondCanvas.height = h
      this.hiddenCanvas.width = this.tileSize
      this.hiddenCanvas.height = this.tileSize
    },
    tick(){
      this.tickInt++
      if(this.tickInt !== 2)return
      this.tickInt = 0
      const texture = this.hiddenCanvasCtx.getImageData(0, 0, this.tileSize, this.tileSize)
      for (var i = 0; i < texture.data.length; i += 4){
        texture.data[i] = texture.data[i + 1] = texture.data[i + 2] = ~~(255 * Math.random())
        texture.data[i + 3] = 255;
      }
      this.hiddenCanvasCtx.putImageData(texture, 0, 0);
      const row = Math.ceil(this.w / this.tileSize)
      const column = Math.ceil(this.h / this.tileSize)
      this.secondCanvasCtx.clearRect(0, 0, this.w, this.h)
      this.secondCanvasCtx.globalAlpha = this.opacity;
      for (var i = 0; i < row; i++) {
        for (var r = 0; r < column; r++) {
          this.secondCanvasCtx.drawImage(this.hiddenCanvas, i * this.tileSize, r * this.tileSize, this.tileSize * this.grain, this.tileSize * this.grain)
        }
      }
      this.canvasCtx.clearRect(0, 0, this.w, this.h)
      this.canvasCtx.drawImage(this.secondCanvas, 0, 0, this.w, this.h)
    }
  },
  mounted(){
    this.hiddenCanvas = document.createElement('canvas')
    this.hiddenCanvasCtx = this.hiddenCanvas.getContext('2d')
    this.secondCanvas = document.createElement('canvas')
    this.secondCanvasCtx = this.secondCanvas.getContext('2d')
    this.canvas = this.$el
    this.canvasCtx = this.canvas.getContext('2d')

  }
}

</script>

<style lang="stylus" scoped>
.Noise
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  pointer-events none
  transform translateZ(.1)
  z-index 999
</style>
