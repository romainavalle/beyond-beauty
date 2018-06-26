import Blob from '~/assets/js/canvasBlob/Blob'
import ResizeHelper from '~/assets/js/utils/ResizeHelper';

class Blobs {
  constructor(debug = false) {
    this.debug = debug
    this.alpha = 1
    this.scale = 1
    this.init()
  }
  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')
    this.blobs = []
    const w = ResizeHelper.width()
    const h = ResizeHelper.height()
    for (let index = 0; index < 10; index++) {
      const blob = new Blob(this.ctx, index, false)
      blob.resize(w, h)
      blob.setBlob()
      this.blobs.push(blob)
    }
  }
  show() {
    /*this.alpha = 0
    this.scale = 0*/
    TweenMax.to(this, .3, { alpha: 1 })
    TweenMax.to(this, 3, { scale: 1, ease: Elastic.easeOut })
  }
  toggle() {
    TweenMax.to(this, .25, { scale: .5, ease: Power4.easeIn, repeat: 1, yoyo: true, yoyoEase: Bounce.easeOut })
  }

  hide() {
    this.alpha = 0
    this.scale = 0
  }
  tick() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].render(this.scale, this.alpha);;
    }
  }

  resize(w, h) {
    this.canvas.width = w
    this.canvas.height = h
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].resize(w, h)
    }
  }

}

export default Blobs
