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
      const resizeSprite = new Pixi.Sprite.from(this.img_array[index])
      const scaleContainer = new Pixi.Sprite()
      const imgContainer = new Pixi.Sprite()
      const title = new Pixi.Sprite()
      imgContainer.addChild(resizeSprite)
      scaleContainer.addChild(imgContainer)
      title.addChild(scaleContainer)
      imgContainer.position.y = 5000 + pages[this.idNum].titlePosition[index]
      resizeSprite.anchor.x = .5
      resizeSprite.anchor.y = .5
      resizeSprite.pivot.x = .5
      resizeSprite.pivot.y = .5
      imgContainer.anchor.x = .5
      imgContainer.anchor.y = .5
      imgContainer.pivot.x = .5
      imgContainer.pivot.y = .5
      scaleContainer.anchor.x = .5
      scaleContainer.anchor.y = .5
      scaleContainer.pivot.x = .5
      scaleContainer.pivot.y = .5
      title.anchor.x = .5
      title.anchor.y = .5
      title.pivot.x = .5
      title.pivot.y = .5
      title.interactive = false
      title.position.y = -5035

      this.container.addChild(title)
      this.title_array.push(title)
      this.size_array.push({w: resizeSprite.width, h: resizeSprite.height})
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
      const img = this.title_array[i].children[0].children[0].children[0]
      img.width = el.w * screenRatio / 2
      img.height = el.h * screenRatio / 2
    })
    this.container.position.y = - (this.originalH - 5000) * .5 + (this.size_array[0].h  * screenRatio / 2) * .5
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
  hide(isFast) {
    const time = isFast ? 0 : .7
    const stagger = isFast ? 0 : .1
    TweenMax.staggerTo(this.title_array, time, { rotation: -this.angle, alpha: 0, ease: Cubic.easeIn }, stagger, this.reset.bind(this))
  }
  scaleTo(scale, delay, time) {
    this.scale = scale
    let t = 0
    let d = delay
    this.title_array.forEach((el, i) => {
      if(time != 0)t = time - (i * .2)
      if(time != 0)d = delay + i * .2
      TweenMax.to(el.children[0].children[0].scale, t, { x: scale, y: scale, delay: d, ease: Quad.easeInOut })
      const posY =  200 * (1 - scale)
      if(i===0)TweenMax.to(el.children[0].children[0].position, t, { y: 5000 + pages[this.idNum].titlePosition[i] + posY, delay: d, ease: Quad.easeInOut })
      if(i===2)TweenMax.to(el.children[0].children[0].position, t, { y: 5000 + pages[this.idNum].titlePosition[i] - posY, delay: d, ease: Quad.easeInOut })
    })

  }
}
export default Title
