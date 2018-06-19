import { $colors } from '~/assets/variables.json'
import BlobMixin from '~/assets/js/blobs/BlobMixin'

class MenuButtonBlob extends BlobMixin{
  constructor(shapeW, w, h, centerX, centerY) {
    super(shapeW, w, h, centerX, centerY)
  }

  tick() {
    super.tick()

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW, this.centerX, this.centerY)
    this.ctx.fillStyle = $colors.bgWhite//0XCC0000//
    this.ctx.fill()
    this.ctx.restore()
  }
}









export default MenuButtonBlob
