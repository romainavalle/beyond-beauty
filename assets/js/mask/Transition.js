import Emitter from '~/assets/js/events'

class TransitionMask {
  constructor() {
    this.canvasWidth = 872
    this.canvasHeight = 1289
    this.imgW = 872 / 4
    this.imgH = 1289 / 4
    this.frameW = 9
    this.isTweening = false
    this.currentFrame = -1
    this.currentFrameTween = 0
    this.direction = 'forward'
    this.init()
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    this.ctx = this.canvas.getContext('2d')
  }
  loadMask(getter) {
    this.img = new Image()
    this.img.src = getter('mask/transition.png')
    this.img.addEventListener('load', this.tweenUpdate.bind(this))
  }
  show() {
    if(this.isTweening)return
    this.isTweening = true
    TweenMax.to(this, 35, { useFrames: true,  currentFrameTween: 35, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this), onComplete: ()=>{
      this.isTweening = false
    } })
    this.tweenUpdate()
  }
  hide() {

    TweenMax.to(this, 30, { useFrames: true, currentFrameTween: 68, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this), onComplete: ()=>{
      this.currentFrameTween = 0
      this.isTweening = false
      if(this.isHideRequested)this.hide()
    } })
    this.tweenUpdate()
  }
  tweenUpdate() {
    if (this.currentFrame === Math.round(this.currentFrameTween)) return
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.currentFrame = Math.round(this.currentFrameTween)
    const x = this.currentFrame % this.frameW * this.imgW
    const y = Math.floor(this.currentFrame / this.frameW) * this.imgH
    this.ctx.drawImage(this.img, x, y, this.imgW, this.imgH, 0, 0, this.canvasWidth, this.canvasHeight);
  }


}

export default TransitionMask
