import Emitter from '~/assets/js/events'

class TransitionMask {
  constructor() {
    this.imgW = 1962 / 9
    this.imgH = 2578 / 8
    this.frameW = 9
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
  playIn(direction = 'forward') {
    this.direction = direction

    let divider = 1
    if(process.browser) {
      if(window.resolution === .5) divider = 2
    }
    if(direction === 'forward'){
      this.currentFrameTween = 0
      TweenMax.to(this, 35 / divider, { useFrames: true,  currentFrameTween: 35, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }else{
      this.currentFrameTween = 59
      TweenMax.to(this, 23 / divider, { useFrames: true,  currentFrameTween: 36, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }
    this.tweenUpdate()
  }
  playOut(direction = 'forward') {

    let divider = 1
    if(process.browser) {
      if(window.resolution === .5) divider = 2
    }
    this.direction = direction
    if(direction === 'forward'){
      this.currentFrameTween = 36
      TweenMax.to(this, 28 / divider, { useFrames: true, currentFrameTween: 64, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }else{
      this.currentFrameTween = 35
      TweenMax.to(this, 35 / divider, { useFrames: true, currentFrameTween: 0, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this) }).timeScale(.5)
    }
    this.tweenUpdate()
  }
  tweenUpdate() {
    if (this.currentFrame === Math.round(this.currentFrameTween)) return
    this.currentFrame = Math.round(this.currentFrameTween)
    if(this.currentFrame === 45 && this.direction === 'forward')Emitter.emit('TRANSITION:FINISHED')
    if(this.currentFrame === 15 && this.direction !== 'forward')Emitter.emit('TRANSITION:FINISHED')
    const x = this.currentFrame % this.frameW * this.imgW
    const y = Math.floor(this.currentFrame / this.frameW) * this.imgH
    const rect = new PIXI.Rectangle(x / this.divider , y / this.divider, this.imgW / this.divider, this.imgH / this.divider);

    this.sprite.texture.frame = rect;
    //this.ctx.drawImage(this.img, x, y, this.imgW, this.imgH, 0, 0, this.canvasWidth, this.canvasHeight);
  }


}

export default TransitionMask
