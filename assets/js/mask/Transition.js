import Emitter from '~/assets/js/events'

class TransitionMask {
  constructor() {
    this.canvasWidth = 872
    this.canvasHeight = 1289
    this.imgW = 872 / 4
    this.imgH = 1289 / 4
    this.frameW = 9
    this.currentFrame = -1
    this.currentFrameTween = 0
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
  playIn() {
    this.currentFrameTween = 0
    this.tweenUpdate()
    TweenMax.to(this, 35, { useFrames: true,  currentFrameTween: 35, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
  }
  playOut() {
    this.currentFrameTween = 36
    this.tweenUpdate()
    TweenMax.to(this, 23, { useFrames: true, currentFrameTween: 59, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
  }
  tweenUpdate() {
    if (this.currentFrame === Math.round(this.currentFrameTween)) return
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.currentFrame = Math.round(this.currentFrameTween)
    if(this.currentFrame === 45)Emitter.emit('TRANSITION:FINISHED')
    const x = this.currentFrame % this.frameW * this.imgW
    const y = Math.floor(this.currentFrame / this.frameW) * this.imgH
    this.ctx.drawImage(this.img, x, y, this.imgW, this.imgH, 0, 0, this.canvasWidth, this.canvasHeight);
  }


}

export default TransitionMask
