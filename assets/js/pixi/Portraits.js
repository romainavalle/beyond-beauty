
import Portrait from "~/assets/js/pixi/Portrait"
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import { pages } from '~/assets/data.json'

if (process.browser) {
  var Pixi = require('pixi.js')
}
class Portraits {
  constructor(stage) {
    this.stage = stage
    this.portraits = []
    this.init()
  }

  init() {
    this.setupPortrait()
  }

  setupPortrait() {
    this.portraitsprite = new Pixi.Sprite()
    pages.forEach(page => {
      const portraitContainer = new Pixi.Container()
      const portrait = new Portrait(portraitContainer, page.id, page.color)
      this.portraitsprite.addChild(portraitContainer)
      this.portraits.push(portrait)
    });
    this.stage.addChild(this.portraitsprite)
  }

  load(getter) {
    pages.forEach((page, i) => {
      setTimeout(() => {
        this.portraits[i].load(getter)
      }, i * 30)
    })
    setTimeout(() => {
      this.resize(ResizeHelper.width(),ResizeHelper.height())
    }, 200)
  }

  resize(w, h) {
    pages.forEach((page, i) => {
      this.portraits[i].resize(w, h)
    })
  }

  hide(id) {
    this.portraits[id].hide()
  }

  show(id, delay) {
    this.portraits[id].show(delay);
  }

  disappear(id, delay) {
    this.portraits[id].disappear(delay);
  }

}
export default Portraits
