import { $colors } from '~/assets/variables.json'

import BlobMixinNoise from '~/assets/js/blobs/BlobMixinNoise'

class DragBlob extends BlobMixinNoise{
  constructor(w, h, shapeW, centerX, centerY) {
    super(w, h, shapeW, centerX, centerY)
    this.dOusitdeX = 0
    this.scale = 0
    this.rotation = 0
  }
  show(delay) {
    this.rotation = 0
    TweenMax.to(this, 1, {delay, rotation: '+=30', scale: 1, ease: Power4.easeOut})
  }
  hide() {
    this.scale = 0
  }
  doClick() {
    TweenMax.to(this, .1, {scale:1, ease: Power4.easeIn, repeat: 1, yoyo:true})
  }
  doMouseEnter() {
    TweenMax.to(this, 1,{rotation: '+=15', scale: 1.1, ease: Power4.easeOut})
  }
  doMouseLeave() {
    TweenMax.to(this, 1,{rotation: '+=15', scale: 1, ease: Power4.easeOut})
  }
  setDeformation(dist){
    this.dOusitdeX = dist
  }

  tick() {
    super.tick()

    this.centerOutsideX = this.centerX + this.dOusitdeX * Math.cos(this.rotation * Math.PI / 180)
    this.centerOutsideY = this.centerY - this.dOusitdeX * Math.sin(this.rotation * Math.PI / 180)

    this.ctx.save()
    this.ctx.translate(this.centerX, this.centerY)
    this.ctx.rotate(this.rotation * Math.PI / 180)
    this.ctx.scale(this.scale, this.scale)
    this.ctx.translate(-this.centerX, -this.centerY)
    this.ctx.beginPath()
    this.drawShape(this.shapeW + 20, this.centerOutsideX, this.centerOutsideY)
    this.ctx.fillStyle = $colors.bgWhite//0XCC0000//
    this.ctx.fill()
    this.ctx.restore()

    this.ctx.restore()
    this.ctx.save()
    this.ctx.translate(this.centerX, this.centerY)
    this.ctx.rotate(this.rotation * Math.PI / 180)
    this.ctx.scale(this.scale, this.scale)
    this.ctx.translate(-this.centerX, -this.centerY)
    this.ctx.beginPath()
    this.drawShape(this.shapeW, this.centerX, this.centerY)
    this.ctx.strokeColor = $colors.timelineBlack
    this.ctx.lineWidth = 2
    this.ctx.fillStyle = $colors.bgWhite
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()


  }
}









export default DragBlob
