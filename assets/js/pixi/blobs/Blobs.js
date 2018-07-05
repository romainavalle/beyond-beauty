import Blob from '~/assets/js/pixi/blobs/Blob'
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
import MouseBlob from '~/assets/js/pixi/blobs/MouseBlob'

class Blobs {
  constructor() {
    this.sprite = new PIXI.Sprite()
    this.sprite.name = 'blobs'
    this.alpha = 1
    this.scale = 1
    this.init()
  }
  init() {
    this.mouseBlob = new MouseBlob()
    this.sprite.addChild(this.mouseBlob.sprite)
    this.blobs = []
    const w = ResizeHelper.width()
    const h = ResizeHelper.height()
    for (let index = 0; index < 10; index++) {
      const blob = new Blob(index)
      blob.resize(w, h)
      blob.setBlob()
      this.sprite.addChild(blob.blobGraph)
      this.blobs.push(blob)
    }
  }
  showMouse() {
    this.mouseBlob.show()
  }
  hideMouse() {
    this.mouseBlob.hide()
  }
  show() {
    this.alpha = 1
    this.scale = 1
    //TweenMax.to(this, .3, { alpha: 1 })
    //TweenMax.to(this, 3, { scale: this.actualScale, ease: Power4.easeOut })
  }
  toggle() {
    TweenMax.to(this, 1, { scale: 1.2, ease: CustomEase.create("custom", "M0,0,C0.3,0,0.298,1.044,0.498,1.044,0.704,1.044,0.698,0,1,0")/*ease: Power4.easeIn, repeat: 1, yoyo: true, yoyoEase: Bounce.easeOut*/ })
  }
  scaleTo(scale) {
    this.actualScale = scale
    let delay = .5
    let time = 1
    if(scale === 1) {
      delay = .5
      time = 1
    }
    TweenMax.to(this, time, {delay, scale: this.actualScale, ease: Power4.easeOut })
  }
  hide() {
    this.alpha = 0
    this.scale = 0
    TweenMax.killTweensOf(this)
  }
  tick() {
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].tick(this.scale, this.alpha);
    }
    this.mouseBlob.tick()
  }

  resize(w, h, shapeW) {
    this.mouseBlob.resize(w, h, shapeW)
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].resize(w, h)
    }
  }

}

export default Blobs
