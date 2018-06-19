import { $colors } from '~/assets/variables.json'

import BlobMixin from '~/assets/js/blobs/BlobMixin'

class MenuBlob extends BlobMixin{
  constructor(shapeW, w, h, centerX, centerY) {
    super(shapeW, w, h, centerX, centerY)
  }

  tick() {
    super.tick()

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW, this.centerOutsideX, this.centerOutsideY)
    this.ctx.fillStyle = $colors['white']//0XCC0000//
    this.ctx.fill()
    this.ctx.restore()
  }
}









export default MenuBlob
