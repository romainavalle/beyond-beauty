
import Portrait from "~/assets/js/pixi/Portrait"
import TransitionMask from "~/assets/js/mask/Transition"
import DisappearMask from "~/assets/js/mask/Disappear"
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
    this.transitionInMask = new TransitionMask()
    this.transitionOutMask = new TransitionMask()
    this.disappearMask = new DisappearMask()
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
    this.transitionInMask.loadMask(getter)
    this.transitionOutMask.loadMask(getter)
    this.disappearMask.loadMask(getter)
    pages.forEach((page, i) => {
      this.portraits[i].load(getter)
      this.portraits[i].setMaskTransition(this.transitionInMask,this.transitionOutMask)
      this.portraits[i].setMaskDisappear(this.disappearMask)
    })
  }
  doReady(){
    pages.forEach((page, i) => {
      this.portraits[i].hideAll()
    })
  }
  resize(w, h) {
    pages.forEach((page, i) => {
      this.portraits[i].resize(w, h)
    })
  }

  hide(id) {
    this.transitionOutMask.playOut()
    this.portraits[id].hide()
  }

  show(id) {
    this.transitionInMask.playIn()
    this.portraits[id].show();
  }

  disappear(id) {
    this.disappearMask.disappear()
    this.portraits[id].disappear();
  }
  appear(id) {
    this.disappearMask.appear()
    this.portraits[id].appear();
  }

}
export default Portraits
