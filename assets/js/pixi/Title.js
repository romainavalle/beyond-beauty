import ResizeHelper from '../utils/ResizeHelper';
import { pages } from '~/assets/data.json'
if (process.browser) {
  var Pixi = require('pixi.js')
}
class Title {
  constructor(container, id, idNum, isBordered) {
    this.container = container
    this.id = id
    this.idNum = idNum
    this.isBordered = isBordered
    this.angle = Math.PI / 35
    this.title_array = []
    if(!this.isBordered)this.container.tint = 0xf1f3ee
    //this.init()
  }

  /*init() {
    const border = this.isBordered ? '-border' : ''
    if(!PIXI.loader.resources[this.id+'-title'+border+'-0']){
      for (let index = 0; index < 3; index++) {
        PIXI.loader.add(this.id+'-title'+border+'-'+index, `images/titles${border}/${this.id}-${index}.png`)
      }
    }
  }*/

  load(getter) {
    this.loaded = 0
    this.img_array = []
    const border = this.isBordered ? '-border' : ''
    for (let index = 0; index < 3; index++) {
      const img = new Image()
      img.src = getter(`titles${border}/${this.id}-${index}.png`)
      img.onload = this.dispose.bind(this);
      this.img_array.push(img)
    }
  }

  dispose() {
    this.loaded++
    if (this.loaded != 3) return
    for (let index = 0; index < 3; index++) {
      const imgSprite = new Pixi.Sprite.from(this.img_array[index])
      const title = new Pixi.Sprite()
      title.addChild(imgSprite)
      imgSprite.position.x = -this.img_array[index].width / 4
      imgSprite.position.y = 5000 + pages[this.idNum].titlePosition[index]
      imgSprite.scale.x = .5
      imgSprite.scale.y = .5
      title.interactive = false
      title.position.y = -5035

      this.container.addChild(title)
      this.title_array.push(title)
    }
    this.originalW = this.container.width
    this.originalH = this.container.height
    this.isDisposed = true
    if (this.isFirstResize) setTimeout(() => this.resize(ResizeHelper.width(), ResizeHelper.height()), 1)
    setTimeout(this.reset.bind(this), 20)

  }
  resize(w, h) {
    this.isFirstResize = true
    if (!this.isDisposed) return
    this.container.position.x = w * .5
    const ratio = this.originalW / this.originalH
    let containerW, containerH, screenRatio
    if (w > h) {
      screenRatio = w / (2280 / 2) * 0.7
    } else {
      screenRatio = h / (1760 / 2) * 0.7
    }
    this.container.width = this.originalW * screenRatio
    this.container.height = this.originalH * screenRatio
    this.container.position.x = w * .5
    this.container.position.y = h * .5 - (this.container.height - 5000 * screenRatio) * .5
  }
  reset() {
    this.title_array.forEach(title => {
      TweenMax.set(title, { rotation: this.angle, alpha: 0 })
    });
    this.container.visible = false
  }
  show(delay = 0, time) {
    this.container.visible = true
    TweenMax.staggerTo(this.title_array, time, { delay, rotation: 0, alpha: 1, ease: Quart.easeOut }, .1)
  }
  hide() {
    TweenMax.staggerTo(this.title_array, .7, { rotation: -this.angle, alpha: 0, ease: Cubic.easeIn }, .1, this.reset.bind(this))
  }
}
export default Title
