import { $colors } from '~/assets/variables.json'

import BlobMixin from '~/assets/js/blobs/BlobMixin'

class DragBlob extends BlobMixin{
  constructor(shapeW, w, h, centerX, centerY) {
    super(shapeW, w, h, centerX, centerY)
    this.dOusitdeX = 0
  }

  setDeformation(dist){
    this.dOusitdeX = dist
  }
  tick() {
    super.tick()

    this.centerOutsideX = this.centerX + this.dOusitdeX

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW + 20, this.centerOutsideX, this.centerOutsideY)
    this.ctx.fillStyle = $colors.bgWhite//0XCC0000//
    this.ctx.fill()
    this.ctx.restore()

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW, this.centerX, this.centerY)
    this.ctx.strokeColor = $colors.black
    this.ctx.fillStyle = $colors.bgWhite
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()
  }
}









export default DragBlob
