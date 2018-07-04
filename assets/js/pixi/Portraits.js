
import Portrait from "~/assets/js/pixi/Portrait"
import { pages } from '~/assets/data.json'


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
    this.portraitsprite = new PIXI.Sprite()
    this.portraitsprite.name = 'portraitsprite'
    pages.forEach((page, i) => {
      const portraitContainer = new PIXI.Container()
      portraitContainer.name = 'portraitContainer'
      const portrait = new Portrait(portraitContainer, page.id, i, page.color)
      this.portraitsprite.addChild(portraitContainer)
      this.portraits.push(portrait)
    });
    this.stage.addChild(this.portraitsprite)
  }

  load(getter) {
    this.baseLoaded = false
    this.transitionLoaded = false
    this.disappearLoaded = false

    let urlResolution = ''
    if(process.browser) {
      if(window.resolution === .5) urlResolution = '@0.5x'
    }
    this.baseText = new PIXI.BaseTexture.fromImage(getter('bust/busts'+ urlResolution +'.png'))
    this.transitionText = new PIXI.BaseTexture.fromImage(getter('mask/transition'+ urlResolution +'.png'))
    this.disappearText = new PIXI.BaseTexture.fromImage(getter('mask/disappear'+ urlResolution +'.png'))
    let time = new Date()
    this.baseText.on('loaded', this.onBaseLoaded.bind(this))
    this.transitionText.on('loaded', this.onTransitionLoaded.bind(this))
    this.disappearText.on('loaded', this.onDisappearLoaded.bind(this))
  }
  onBaseLoaded() {
    this.baseLoaded = true
    this.onLoaded()
  }
  onTransitionLoaded() {
    this.transitionLoaded = true
    this.onLoaded()
  }
  onDisappearLoaded() {
    this.disappearLoaded = true
    this.onLoaded()
  }
  onLoaded() {
    if(!this.baseLoaded) return
    if(!this.transitionLoaded) return
    if(!this.disappearLoaded) return
    this.portraits.forEach(el => {
      el.setTexture(this.baseText, this.transitionText, this.disappearText)
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
    this.portraits[id].hide(direction)
  }

  show(id, direction = 'forward') {
    this.portraits[id].show(direction);
  }

  disappear(id) {
    this.portraits[id].disappear();
  }
  appear(id) {
    this.portraits[id].appear();
  }

}
export default Portraits
