import { $colors } from '~/assets/variables.json'
import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'

class MenuButtonBlob extends BlobMixinNoise{
  constructor(w, h, shapeW, centerX, centerY) {
    super(w, h, shapeW, centerX, centerY)
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
