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
  playIn(direction = 'forward') {
    this.direction = direction
    if(direction === 'forward'){
      this.currentFrameTween = 0
      TweenMax.to(this, 35, { useFrames: true,  currentFrameTween: 35, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }else{
      this.currentFrameTween = 59
      TweenMax.to(this, 23, { useFrames: true,  currentFrameTween: 36, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }
    this.tweenUpdate()
  }
  playOut(direction = 'forward') {
    this.direction = direction
    if(direction === 'forward'){
      this.currentFrameTween = 36
      TweenMax.to(this, 23, { useFrames: true, currentFrameTween: 59, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }else{
      this.currentFrameTween = 35
      TweenMax.to(this, 35, { useFrames: true, currentFrameTween: 0, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }
    this.tweenUpdate()
  }
  tweenUpdate() {
    if (this.currentFrame === Math.round(this.currentFrameTween)) return
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.currentFrame = Math.round(this.currentFrameTween)
    if(this.currentFrame === 45 && this.direction === 'forward')Emitter.emit('TRANSITION:FINISHED')
    if(this.currentFrame === 15 && this.direction !== 'forward')Emitter.emit('TRANSITION:FINISHED')
    const x = this.currentFrame % this.frameW * this.imgW
    const y = Math.floor(this.currentFrame / this.frameW) * this.imgH
    this.ctx.drawImage(this.img, x, y, this.imgW, this.imgH, 0, 0, this.canvasWidth, this.canvasHeight);
  }


}

export default TransitionMask
