
import Title from "~/assets/js/pixi/Title"
import { pages } from '~/assets/data.json'

if (process.browser) {
  var Pixi = require('pixi.js')
}
class Titles {
  constructor(stage) {
    this.stage = stage
    this.titles = []
    this.titlesBorder = []
    this.init()
  }

  init() {
    this.setupTitle()
    this.setupTitleBorder()
  }

  setupTitle() {
    this.titleSprite = new Pixi.Sprite()
    pages.forEach(page => {
      const titleContainer = new Pixi.Container()
      const title = new Title(titleContainer, page.id)
      this.titleSprite.addChild(titleContainer)
      this.titles.push(title)
    });
    this.stage.addChild(this.titleSprite)
  }

  setupTitleBorder() {
    this.titleBorderSprite = new Pixi.Container()
    pages.forEach(page => {
      const titleBorderContainer = new Pixi.Container()
      const title = new Title(titleBorderContainer, page.id, true)
      this.titleBorderSprite.addChild(titleBorderContainer)
      this.titlesBorder.push(title)
    });
  }

  load() {
    pages.forEach((page, i) => {
      this.titlesBorder[i].load()
      this.titles[i].load()
    })
  }

  resize(w, h) {
    pages.forEach((page, i) => {
      this.titlesBorder[i].resize(w, h)
      this.titles[i].resize(w, h)
    })
  }

  hide(id) {
    this.titlesBorder[id].hide()
    this.titles[id].hide()
  }

  show(id, delay) {
    this.titlesBorder[id].show(delay * .6)
    this.titles[id].show(delay * .6)
  }

}
export default Titles
