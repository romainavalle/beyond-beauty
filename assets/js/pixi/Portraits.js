
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

  load(getter, renderer) {
    this.baseLoaded = false
    this.maskLoaded = false
    this.transitionLoaded = false
    this.disappearLoaded = false

    let urlResolution = ''
    if(process.browser) {
      if(window.resolution === .5) urlResolution = '@0.5x'
    }
    this.renderer = renderer
    this.baseText = new PIXI.BaseTexture.fromImage(getter('bust/busts'+ urlResolution +'.jpg'))
    this.baseMaskText = new PIXI.BaseTexture.fromImage(getter('bust/mask'+ urlResolution +'.png'))
    this.transitionText = new PIXI.BaseTexture.fromImage(getter('mask/transition'+ urlResolution +'.png'))
    this.disappearText = new PIXI.BaseTexture.fromImage(getter('mask/disappear'+ urlResolution +'.png'))
    renderer.textureManager.updateTexture(this.baseText);
    renderer.textureManager.updateTexture(this.baseMaskText);
    renderer.textureManager.updateTexture(this.transitionText);
    renderer.textureManager.updateTexture(this.disappearText);
    this._onBaseLoaded =     this.onBaseLoaded.bind(this)
    this._onMaskLoaded = this.onMaskLoaded.bind(this)
    this._onTransitionLoaded = this.onTransitionLoaded.bind(this)
    this._onDisappearLoaded = this.onDisappearLoaded.bind(this)
    this.baseText.on('loaded', this._onBaseLoaded)
    this.baseMaskText.on('loaded', this._onMaskLoaded)
    this.transitionText.on('loaded', this._onTransitionLoaded)
    this.disappearText.on('loaded', this._onDisappearLoaded)
  }
  onBaseLoaded() {
    this.baseLoaded = true
    this.onLoaded()
  }
  onMaskLoaded() {
    this.maskLoaded = true
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
    if(!this.maskLoaded) return
    if(!this.transitionLoaded) return
    if(!this.disappearLoaded) return
    this.baseText.off('loaded', this._onBaseLoaded)
    this.baseMaskText.off('loaded', this._onMaskLoaded)
    this.transitionText.off('loaded', this._onTransitionLoaded)
    this.disappearText.off('loaded', this._onDisappearLoaded)
    this.portraits.forEach(el => {
      el.setTexture(this.baseText,this.baseMaskText, this.transitionText, this.disappearText, this.renderer)
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
