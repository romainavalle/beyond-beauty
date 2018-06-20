import { $colors } from '~/assets/variables.json'

import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'

class MenuBustBlob extends BlobMixinNoise{
  constructor(w, h) {
    super(w, h)
    this.noiseValue = (Math.round(Math.random() * 40))
  }
  setBlobs(blobs) {
    this.blobs = blobs
  }
  setColor(color) {
    this.color = color
  }
  tick() {
    super.tick()
    this.blobs.forEach((el, i) => {
      this.ctx.save()
      //this.ctx.translate(el.x / 100 * this.w, el.y / 100 * this.h);
      //this.ctx.rotate((20 + 20 * i) * Math.PI / 180);
      this.ctx.beginPath()
      this.getNoiseValues(this.noiseValue + i * 5)
      this.ctx.translate(el.x / 100 * this.w, el.y / 100 * this.h);
      this.ctx.rotate((40 + 40 * i) * Math.PI / 180);
      this.ctx.scale(1, .8);
      this.drawShape(el.shapeW / 100 * this.w, 0, 0)
      this.ctx.fillStyle = this.color//
      this.ctx.fill()
      //this.ctx.rotate(-(20 + 20 * i) * Math.PI / 180);
      //this.ctx.translate(-el.x / 100 * this.w, -el.y / 100 * this.h);
      this.ctx.restore()
    })
  }
}









export default MenuBustBlob
