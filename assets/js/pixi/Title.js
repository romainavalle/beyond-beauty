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
    this.scale = 1
    this.angle = Math.PI / 35
    this.title_array = []
    this.size_array = []
    if(!this.isBordered)this.container.tint = 0xf1f3ee
  }

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
      this.imgSprite = new Pixi.Sprite.from(this.img_array[index])
      const title = new Pixi.Sprite()
      const titleContainer = new Pixi.Sprite()
      titleContainer.addChild(this.imgSprite)
      title.addChild(titleContainer)
      this.imgSprite.position.x = 0
      this.imgSprite.position.y = 5000 + pages[this.idNum].titlePosition[index]
      this.imgSprite.scale.x = .5
      this.imgSprite.scale.y = .5
      this.imgSprite.anchor.x = .5
      this.imgSprite.anchor.y = .5
      this.imgSprite.pivot.x = .5
      this.imgSprite.pivot.y = .5
      titleContainer.anchor.x = .5
      titleContainer.anchor.y = .5
      titleContainer.pivot.x = .5
      titleContainer.pivot.y = .5
      title.anchor.x = .5
      title.anchor.y = .5
      title.pivot.x = .5
      title.pivot.y = .5
      title.interactive = false
      title.position.y = -5035

      this.container.addChild(title)
      this.title_array.push(title)
      this.size_array.push({w: this.imgSprite.width, h: this.imgSprite.height})
    }
    this.originalW = this.container.width
    this.originalH = this.container.height
    this.isDisposed = true

    if (this.isFirstResize) setTimeout(() => this.resize(ResizeHelper.width(), ResizeHelper.height()), 1)
  }
  resize(w, h) {
    this.isFirstResize = true
    if (!this.isDisposed) return
    const ratio = this.originalW / this.originalH
    let containerW, containerH, screenRatio
    if (w > h) {
      screenRatio = w / (2280 / 2) * 0.7
    } else {
      screenRatio = h / (1760 / 2) * 0.7
    }
    this.size_array.forEach((el, i) => {
      //const img = this.title_array[i].children[0].children[0]
      //el.width = el.w * screenRatio
      //el.height = el.h * screenRatio
    })

    this.container.position.x = w * .5
    this.container.position.y = h - (this.container.height - 5000 * screenRatio) * .5
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
  scaleTo(scale, delay, time) {
    this.scale = scale
    this.title_array.forEach((el, i) => {
      TweenMax.to(el.children[0].children[0].scale, .7, { x: .5 * scale, y: .5 * scale, delay: delay + i * .2 })
    })

  }
}
export default Title
