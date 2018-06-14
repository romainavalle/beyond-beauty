<template>
    <canvas class="Drag" ref="canvas"></canvas>
</template>
<script>

import SimplexNoise from 'simplex-noise'
import MouseHelper from '~/assets/js/utils/MouseHelper'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import { $colors } from '~/assets/variables.json'
import ioMixins from '~/components/ioMixins'

export default {
  name: "Drag",
  data(){
    return {
      w: ResizeHelper.width() / 2880 * 720,
      shapeW: ResizeHelper.width() / 2880 * 100,
      time: 0,
      centerX: (ResizeHelper.width() / 2880 * 720) / 2,
      centerY: (ResizeHelper.width() / 2880 * 720) / 2
    }
  },
  mixins:[ioMixins],
  computed:{
  },
  methods:{
    tick() {
      if(!this.active)return
      const mouseX = MouseHelper.x - (ResizeHelper.width() / 2)
      const mouseY = MouseHelper.y - (ResizeHelper.height() - (210 * ResizeHelper.width() / 2880))
      let dX = 0, dY = 0
      if(Math.abs(mouseY) < this.w / 2 - this.shapeW) {
        dY = mouseY - this.centerY
      } else {
        dY = - this.centerY
      }
      if(Math.abs(mouseX) < this.w / 2 - this.shapeW) {
        dX = mouseX - this.centerX
      } else {
        dX = - this.centerX
      }
      this.centerX += dX / 50
      this.centerY += dY / 50
      this.ctx.clearRect(0, 0, this.w, this.w)
      this.ctx.save()
      this.ctx.translate(this.w / 2, this.w / 2)
      this.ctx.scale(1.2, 1.2)
      this.ctx.beginPath()
      this.drawShape()
      this.ctx.fillStyle = $colors.bgWhite
      this.ctx.fill()
      this.ctx.restore()

      this.ctx.save()
      this.ctx.translate(this.w / 2, this.w / 2)
      this.ctx.beginPath()
      this.drawShape()
      this.ctx.strokeColor = $colors.black
      this.ctx.fillStyle = $colors.bgWhite
      this.ctx.stroke()
      this.ctx.fill()
      this.ctx.restore()
    },

    drawShape() {
      let angle = 0
      let count = 40
      let slice = Math.PI * 2 / count
      let radius = this.shapeW
      let points = []
      this.time++

      for(let i = 0; i < count; i++) {
        let x = Math.cos(angle)
        let y = Math.sin(angle)
        let displacement = radius + (this.noise.noise3D(x, y, this.time * 0.005) * 5)
        x = this.centerX + x * displacement
        y = this.centerY + y * displacement
        points.push({ x, y })
        angle += slice
      }
      this.ctx.moveTo(points[0].x, points[0].y)
      this.curveThrough(points)
    },

    curveThrough(points) {
      var i, n, a, b, x, y
      for (i = 1, n = points.length - 1; i < n; i++) {
          a = points[i]
          b = points[i + 1] || points[0]
          x = (a.x + b.x) * 0.5
          y = (a.y + b.y) * 0.5
          this.ctx.quadraticCurveTo(a.x, a.y, x, y)
      }
      a = points[i]
      b = points[i + 1] || points[0]
      this.ctx.quadraticCurveTo(a.x, a.y, b.x, b.y)
    },

    resize(w, h) {
      this.w = w / 2880 * 720
      this.$refs.canvas.width = this.w
      this.$refs.canvas.height = this.w
    }
  },
  mounted(){
    this.ctx = this.$refs.canvas.getContext('2d')
    this.noise = new SimplexNoise(Math.random())
  }
}

</script>

<style lang="stylus" scoped>
.Drag
  position absolute
  width 720 * $unitH
  height 720 * $unitH
  left 50%
  margin-left -360 * $unitH
  margin-top -200 * $unitH
</style>
