
class DisappearMask {
  constructor() {
    this.canvasWidth = 872
    this.canvasHeight = 1289
    this.imgW = 872 / 4
    this.imgH = 1289 / 4
    this.frameW = 5
    this.currentMask = -1
    this.currentMaskTween = 0
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
    this.img.src = getter('mask/disappear.png')
    this.img.addEventListener('load', this.tweenUpdate.bind(this))
  }
  disappear() {
    this.currentMaskTween = 0
    this.tweenUpdate()
    TweenMax.to(this, 27, { useFrames: true,  currentMaskTween: 27, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
  }
  appear() {
    this.currentMaskTween = 27
    this.tweenUpdate()
    TweenMax.to(this, 27, { useFrames: true,  currentMaskTween: 0, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
  }

  tweenUpdate() {
    if (this.currentMask === Math.round(this.currentMaskTween)) return
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.currentMask = Math.round(this.currentMaskTween)
    const x = this.currentMask % this.frameW * this.imgW
    const y = Math.floor(this.currentMask / this.frameW) * this.imgH
    this.ctx.drawImage(this.img, x, y, this.imgW, this.imgH, 0, 0, this.canvasWidth, this.canvasHeight);
  }


}

export default DisappearMask
