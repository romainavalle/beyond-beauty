import { $colors } from '~/assets/variables.json'

import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'

class MenuBustBlob extends BlobMixinNoise{
  constructor(w, h) {
    super(w, h)
    this.scale = 0
    this.translate = -10
    this.noiseValue = (Math.round(Math.random() * 40))
  }
  setBlobs(blobs) {
    this.blobs = blobs
  }
  setColor(color) {
    this.color = color
  }
  hide() {
    this.blobs.forEach((el, i) => {
      TweenMax.to(this, .8, {delay: .1, scale: .3, translate: .3, ease: Quart.easeIn})
    })
  }
  show(delay) {
    this.translate = -.5
    this.scale = 0
    this.blobs.forEach((el, i) => {
      TweenMax.to(this, 1.2, {scale: 1, translate: 0, delay: delay + .6 + i * .15, ease: Quart.easeOut})
    })
  }
  tick() {
    super.tick()
    this.blobs.forEach((el, i) => {
      this.ctx.save()
      //this.ctx.translate(el.x / 100 * this.w, el.y / 100 * this.h);
      //this.ctx.rotate((20 + 20 * i) * Math.PI / 180);
      this.ctx.beginPath()
      this.getNoiseValues(this.noiseValue + i * 5)
      const pourcX = el.x / 100 * this.w * this.translate
      const pourcY = el.y / 100 * this.h * (-this.translate)
      this.ctx.translate(pourcX + el.x / 100 * this.w, pourcY + el.y / 100 * this.h);
      this.ctx.rotate(-Math.PI / 4);
      this.ctx.scale(this.scale, this.scale * .8);
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
