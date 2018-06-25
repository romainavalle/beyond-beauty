import { $colors } from '~/assets/variables.json'

import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'
import MouseHelper from '~/assets/js/utils/MouseHelper'

class MouseBlob extends BlobMixinNoise{
  constructor(w, h, shapeW = 0) {
    super(w, h, shapeW)
    this.scale = 0
    this.rotation = 0
    this.color = 'white'
  }
  setBlobs(blobs) {
    this.blobs = blobs
  }
  setColor(color) {
    this.color = color
  }
  show() {
    this.rotation = 0
    TweenMax.to(this, 1, {rotation: '+=30', scale: 1, ease: Power4.easeOut})
  }
  hide() {
    TweenMax.to(this, 1, {rotation: '+=30', scale: 0, ease: Power4.easeOut})
  }

  tick(follow = false) {
    super.tick()
    this.ctx.save()
    if(follow){
      this.centerX = MouseHelper.easeX
      this.centerY = MouseHelper.easeY
    }
    this.ctx.translate(this.centerX, this.centerY)
    this.ctx.rotate(this.rotation * Math.PI / 180)
    this.ctx.scale(this.scale, this.scale)
    this.ctx.translate(-this.centerX, -this.centerY)
    this.ctx.beginPath()
    this.drawShape(this.shapeW, this.centerX, this.centerY)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    this.ctx.restore()
  }
}









export default MouseBlob
