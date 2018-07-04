

import TransitionMask from '~/assets/js/mask/Transition'


class FactImages {
  constructor(id) {
    this.canvasWidth = 800
    this.canvasHeight = 800
    this.currentImage = 0
    this.currentFrame = 0
    this.id = id
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.image_array = []
    this.init()
  }

  init(){
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    this.ctx = this.canvas.getContext('2d')
    this.transitionMask = new TransitionMask()
  }

  load(getter) {
    this.transitionMask.loadMask(getter)
    for (let index = 0; index < 5; index++) {
      const img = new Image()
      img.src = getter(`facts/${this.id}-${index}.jpg`)
      this.image_array.push(img)
    }
  }
  show(img) {
    this.currentImage = img
    this.isVertical = this.image_array[this.currentImage].width < this.image_array[this.currentImage].height
    this.transitionMask.show()
  }

  hide() {
    this.transitionMask.hide()
  }

  resize(w, h){
    this.w = w
    this.h = h
  }

  tick() {
    if(this.transitionMask.currentFrame === this.currentFrame) return
    this.currentFrame = this.transitionMask.currentFrame
    this.x = (this.isVertical ? 160 : 0)
    this.y = (this.isVertical ? 0 : 160)
    this.width = (this.isVertical ? 480 : 800)
    this.height = (this.isVertical ? 800 : 480)
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.ctx.drawImage(this.transitionMask.canvas, 0, 0, this.width, this.height, this.x-5, this.y-5, this.width + 10, this.height + 10);
    this.ctx.globalCompositeOperation = 'source-in';
    this.ctx.drawImage(this.image_array[this.currentImage], 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    this.ctx.globalCompositeOperation = '';
    this.ctx.restore()

  }

}

export default FactImages
