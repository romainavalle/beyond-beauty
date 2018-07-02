import { $colors } from '~/assets/variables.json'

import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'

class MenuBlob extends BlobMixinNoise{
  constructor(w, h, radius ) {
    super(w, h, radius)
  }

  tick(rot, scale) {
    super.tick()
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.translate(this.centerX, this.centerY)
    this.ctx.rotate(rot * Math.PI / 180)
    this.ctx.scale(scale, scale)
    this.ctx.translate(-this.centerX, -this.centerY)
    this.drawShape(this.shapeW, this.centerX, this.centerY)
    this.ctx.fillStyle = 'white'//0XCC0000//
    this.ctx.fill()
    this.ctx.restore()
  }
}


export default MenuBlob
