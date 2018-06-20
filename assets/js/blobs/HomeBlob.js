import { $colors } from '~/assets/variables.json'

import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'

class HomeBlob extends BlobMixinNoise{
  constructor(w, h, shapeW) {
    super(w, h, shapeW)
  }

  tick() {
    super.tick()

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW, this.centerOutsideX, this.centerOutsideY)
    this.ctx.strokeStyle = '#ffffff'//0XCC0000//
    this.ctx.lineWidth = 2
    this.ctx.stroke()
    this.ctx.restore()

    this.getNoiseValues(1)

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW * 1.1, this.centerX, this.centerY)
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.lineWidth = 1
    this.ctx.globalAlpha = 0.5
    this.ctx.stroke()
    this.ctx.restore()
  }
}









export default HomeBlob