
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
    this.isShown = false
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
    this.titleSprite.position.x = this.titleBorderSprite.position.x = w / 2
    this.titleSprite.position.y = this.titleBorderSprite.position.y = h / 2
  }

  hide(id, isFast = false) {
    if(!this.isShown) return
    this.isShown = false
    this.titlesBorder[id].hide(isFast)
    this.titles[id].hide(isFast)
  }

  show(id, delay, time) {
    if(this.isShown) return
    this.isShown = true
    this.titlesBorder[id].show(delay * .6, time)
    this.titles[id].show(delay * .6, time)
  }

  scaleTo(id, scale, delay, time) {
    this.scale = scale
    for (let index = 0; index < this.titles.length; index++) {
      if(id === index) {
        this.titlesBorder[id].scaleTo(scale, delay, time)
        this.titles[id].scaleTo(scale, delay, time)
      }else{
        this.titles[index].scaleTo(this.scale, 0, 0)
        this.titlesBorder[index].scaleTo(this.scale, 0, 0)
      }
    }
  }
}
export default Titles
