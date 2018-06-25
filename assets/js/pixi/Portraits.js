
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
    this.portraits.forEach(el => {
      el.load(getter)
      el.setMaskTransition(this.transitionInMask,this.transitionOutMask)
      el.setMaskDisappear(this.disappearMask)
    })
  }
  doReady(){
    this.portraits.forEach(el => {
      el.hideAll()
    })
  }
  resize(w, h) {
    this.portraits.forEach(el => {
      el.resize(w, h)
    })
  }

  hide(id, direction = 'forward') {
    this.transitionOutMask.playOut(direction)
    this.portraits[id].hide(direction)
  }

  show(id, direction = 'forward') {
    this.transitionInMask.playIn(direction)
    this.portraits[id].show(direction);
  }

  tick(){
    this.portraits.forEach((el, i) => {
      el.tick()
    })
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
