
class DisappearMask {
  constructor() {
    this.imgW = 1990 / 5
    this.imgH = 2940 / 5
    this.frameW = 5
    this.currentFrame = -1
    this.currentFrameTween = 0
    this.direction = 'forward'
    this.divider = 1
    if(process.browser) {
      if(window.resolution === .5) this.divider = 2
    }
  }


  setTexture(base) {
    this.sprite = new PIXI.Sprite(new PIXI.Texture.from(base))
    this.sprite.interactive = false
  }

  disappear() {
    this.currentFrameTween = 0
    this.tweenUpdate()
    TweenMax.to(this, 24, { useFrames: true,  currentFrameTween: 24, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
  }
  appear() {
    this.currentFrameTween = 24
    this.tweenUpdate()
    TweenMax.to(this, 24, { useFrames: true,  currentFrameTween: 0, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
  }

  tweenUpdate() {
    if (this.currentFrame === Math.round(this.currentFrameTween)) return
    this.currentFrame = Math.round(this.currentFrameTween)
    const x = this.currentFrame % this.frameW * this.imgW
    const y = Math.floor(this.currentFrame / this.frameW) * this.imgH
    const rect = new PIXI.Rectangle(x / this.divider , y / this.divider, this.imgW / this.divider, this.imgH / this.divider);
    // console.log(croped);
    this.sprite.texture.frame = rect;
    //this.ctx.drawImage(this.img, x, y, this.imgW, this.imgH, 0, 0, this.canvasWidth, this.canvasHeight);
  }


}

export default DisappearMask
