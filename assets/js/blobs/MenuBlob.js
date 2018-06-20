import { $colors } from '~/assets/variables.json'

import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'

class MenuBlob extends BlobMixinNoise{
  constructor(w, h, radius /*, numPoints*/) {
    super(w, h, radius/*, numPoints*/)
  }

  tick() {
    super.tick()
    this.ctx.save()
    this.ctx.beginPath()
    //this.drawShape()
    this.drawShape(this.shapeW, this.centerX, this.centerY)
    this.ctx.fillStyle = $colors['white']//0XCC0000//
    this.ctx.fill()
    this.ctx.restore()
  }
}


export default MenuBlob
