
import Title from '~/assets/js/pixi/Title'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import { pages } from '~/assets/data.json'

if (process.browser) {
  var Pixi = require('pixi.js')
}
class Titles {
  constructor(stage) {
    this.stage = stage
    this.titles = []
    this.titlesBorder = []
    this.scale = 1
    this.init()
  }

  init() {
    this.setupTitle()
    this.setupTitleBorder()
  }

  setupTitle() {
    this.titleSprite = new Pixi.Sprite()
    pages.forEach((page, i) => {
      const titleContainer = new Pixi.Container()
      const title = new Title(titleContainer, page.id, i)
      this.titleSprite.addChild(titleContainer)
      this.titles.push(title)
    });
    this.stage.addChild(this.titleSprite)
  }

  setupTitleBorder() {
    this.titleBorderSprite = new Pixi.Container()
    pages.forEach((page, i) => {
      const titleBorderContainer = new Pixi.Container()
      const title = new Title(titleBorderContainer, page.id, i, true)
      this.titleBorderSprite.addChild(titleBorderContainer)
      this.titlesBorder.push(title)
    });
  }

  load(getter) {
    pages.forEach((page, i) => {
      this.titlesBorder[i].load(getter)
      this.titles[i].load(getter)
    })
  }

  doReady(){
    pages.forEach((page, i) => {
      this.titlesBorder[i].reset()
      this.titles[i].reset()
    })
  }

  resize(w, h) {
    pages.forEach((page, i) => {
      this.titlesBorder[i].resize(w, h)
      this.titles[i].resize(w, h)
    })
    this.titleSprite.position.x = this.titleBorderSprite.position.x = (1 - this.scale) * w / 2
    this.titleSprite.position.y = this.titleBorderSprite.position.y = (1 - this.scale) * h / 2
  }

  hide(id) {
    this.titlesBorder[id].hide()
    this.titles[id].hide()
  }

  show(id, delay, time) {
    this.titlesBorder[id].show(delay * .6, time)
    this.titles[id].show(delay * .6, time)
  }

  scaleTo(scale, delay, time) {
    this.scale = scale
    TweenMax.to([this.titleBorderSprite.scale, this.titleSprite.scale], time, { delay, x: scale, y: scale, ease:Quad.easeInOut })
    TweenMax.to([this.titleBorderSprite.position, this.titleSprite.position], time, { delay, x: (1 - this.scale) * ResizeHelper.width() / 2, y: (1 - this.scale) * ResizeHelper.height() / 2, ease:Quad.easeInOut })
  }
}
export default Titles
