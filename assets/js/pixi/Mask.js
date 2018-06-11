import Emitter from '~/assets/js/events'

if (process.browser) {
  var Pixi = require('pixi.js')
}
class Mask {
  constructor(container) {
    this.container = container
    this.originalW = 1652 / 2
    this.originalH = 2442 / 2
    this.currentMaskTween = 0
    this.currentMask = 0
    this.mask_array = []
  }

  load(getter) {
    let id
    for (let index = 0; index < 81; index++) {
      id = index
      if (index < 10) id = '0' + index
      const maskStep = new Pixi.Sprite.fromImage(getter(`mask/transition/transition_bust_${id}.png`))
      maskStep.interactive = false
      maskStep.width = this.originalW
      maskStep.height = this.originalH
      this.mask_array.push(maskStep)
      this.container.addChild(maskStep)
    }
  }
  resize(w, h) {
    const ratio = this.originalW / this.originalH
    let containerW, containerH
    if (w / h < ratio) {
      containerW = w / 4
      containerH = containerW / ratio
    } else {
      containerH = h * 8 / 11
      containerW = containerH * ratio

    }
    this.container.width = containerW
    this.container.height = containerH
    this.container.position.x = this.posX = w * .5 - containerW / 2
    this.container.position.y = this.posY = h * .5 - containerH / 2
  }
  show(delay = 0) {
    this.currentMaskTween = 0
    this.currentMask = 0
    TweenMax.to(this, 42, { useFrames: true, delay: 0, currentMaskTween: 42, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
  }
  hide() {
    TweenMax.to(this, 38, { useFrames: true, currentMaskTween: 80, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this), onComplete: this.onHideComplete.bind(this) }).timeScale(.5)
  }
  onHideComplete(){
     this.currentMaskTween = 0
  }
  tweenUpdate() {
    if(this.currentMask === Math.round(this.currentMaskTween))return
    this.mask_array[this.currentMask].visible = false
    this.currentMask = Math.round(this.currentMaskTween)
    this.mask_array[this.currentMask].visible = true
  }
}
export default Mask
