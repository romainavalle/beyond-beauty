
import ResizeHelper from '~/assets/js/utils/ResizeHelper'

if (process.browser) {
  var Pixi = require('pixi.js')
}
class Portait {
  constructor(container, id, color) {
    this.container = container
    this.id = id
    this.color = color
    this.originalW = 1652 / 2
    this.originalH = 2442 / 2
    this.maskInCurrent = 0
    this.maskOutCurrent = 0
    this.maskDisappearCurrent = 0
  }

  load(getter) {
    PIXI.Texture.addToCache(getter(`bust/${this.id}.png`))
    PIXI.Texture.addToCache(getter(`bust/${this.id}-white.png`))
    this.portrait = new Pixi.Sprite(new Pixi.Texture.fromImage(getter(`bust/${this.id}.png`)))
    this.portraitTinted = new Pixi.Sprite(new Pixi.Texture.fromImage(getter(`bust/${this.id}-white.png`)))
    TweenMax.set(this.portraitTinted, { colorProps: { tint: this.color, format: "number" } })
    this.portraitTinted.visible = false
    this.portrait.interactive = false
    this.portrait.buttonMode = false

    this.portraitTinted.interactive = false
    this.portrait.width = this.originalW
    this.portrait.height = this.originalH
    this.portraitTinted.width = this.originalW
    this.portraitTinted.height = this.originalH
    this.container.addChild(this.portraitTinted)
    this.container.addChild(this.portrait)

  }
  setMaskTransition(maskIn, maskOut) {
    this.maskIn = maskIn
    this.maskOut = maskOut
    this.transitionInTexture = new PIXI.Texture.fromCanvas(maskIn.canvas)
    this.maskTransitionIn = new PIXI.Sprite(this.transitionInTexture);
    this.maskTransitionIn.name = 'maskTransitionIn'
    this.maskTransitionIn.interactive = false
    this.container.addChild(this.maskTransitionIn)
    this.transitionOutTexture = new PIXI.Texture.fromCanvas(maskOut.canvas)
    this.maskTransitionOut = new PIXI.Sprite(this.transitionOutTexture);
    this.maskTransitionOut.name = 'maskTransitionIn'
    this.maskTransitionOut.interactive = false
    this.container.addChild(this.maskTransitionOut)
  }
  setMaskDisappear(mask) {
    this.disappearMask = mask
    this.disappearTexture = new PIXI.Texture.fromCanvas(mask.canvas)
    this.maskDisappearTint = new PIXI.Sprite(this.disappearTexture);
    this.maskDisappear = new PIXI.Sprite(this.disappearTexture);
    this.maskDisappearTint.position.x = this.originalW
    this.maskDisappearTint.scale.x = -1
    this.maskDisappear.name = 'maskDisappear'
    this.maskDisappear.interactive = false
    this.maskDisappearTint.interactive = false
    this.container.addChild(this.maskDisappear)
    this.container.addChild(this.maskDisappearTint)
  }
  hideAll() {
    this.container.visible = false
    this.maskTransitionIn.visible = false
    this.maskTransitionOut.visible = false
    this.maskDisappear.visible = false
    this.maskDisappearTint.visible = false
  }
  resize(w, h) {
    const ratio = this.originalW / this.originalH
    let containerW, containerH
    if (w / h < ratio) {
      containerW = w / 4
      containerH = containerW / ratio
    } else {
      containerH = h * 8 / 11
      containerW = containerH * ratio
    }
    this.container.width = containerW
    this.container.height = containerH
    this.container.position.x = this.posX = w * .5 - containerW / 2
    this.container.position.y = this.posY = h * .5 - containerH / 2
  }
  show(direction) {
    this.portrait.mask = this.maskTransitionIn
    this.container.visible = true
    this.maskTransitionIn.visible = true
    this.maskTransitionOut.visible = false
    this.maskDisappear.visible = false
    this.maskDisappearTint.visible = false
    this.resize(ResizeHelper.width(), ResizeHelper.height())
    const dir = direction === 'forward' ? 1 : -1
    TweenMax.fromTo(this.container.position, 1.2, {y: this.posY + (dir * 80), x: this.posX - (dir * 60)}, {y: this.posY, x: this.posX, ease: Quart.easeOut})
  }
  hide(direction) {
    this.maskTransitionIn.visible = false
    this.maskTransitionOut.visible = true
    this.maskDisappear.visible = false
    this.maskDisappearTint.visible = false
    this.portrait.mask = this.maskTransitionOut
    const dir = direction === 'forward' ? 1 : -1
    TweenMax.to(this.container.position, 1, { y: this.posY - (dir * 80), x: this.posX + (dir * 60), ease: Cubic.easeIn,  onComplete: this.onHideComplete.bind(this)})
  }

  onHideComplete(){
    this.container.visible = false
    this.portrait.mask = null
  }
  tick() {
    if(!this.container.visible) return
    if(this.maskIn.currentFrame !== this.maskInCurrent) {
      this.maskInCurrent = this.maskIn.currentFrame
      this.transitionInTexture.update()
    }
    if(this.maskOut.currentFrame !== this.maskOutCurrent) {
      this.maskOutCurrent = this.maskOut.currentFrame
      this.transitionOutTexture.update()
    }
    if(this.disappearMask.currentFrame !== this.maskDisappearCurrent) {
      this.maskDisappearCurrent = this.disappearMask.currentFrame
      this.disappearTexture.update()
    }
  }
  disappear() {
    this.maskTransitionIn.visible = false
    this.maskTransitionOut.visible = false
    this.maskDisappear.visible = true
    this.maskDisappearTint.visible = true
    this.portrait.mask = this.maskDisappear
    this.portraitTinted.mask = this.maskDisappearTint
    this.portraitTinted.visible = true
    this.container.visible = true
    TweenMax.to(this, 1.2, {ease: Quart.easeIn, onComplete: () => {
      this.container.visible = false
      this.portraitTinted.visible = false
    }})
  }
  appear() {
    this.maskTransitionIn.visible = false
    this.maskTransitionOut.visible = false
    this.maskDisappear.visible = true
    this.maskDisappearTint.visible = true
    this.portrait.mask = this.maskDisappear
    this.portraitTinted.mask = this.maskDisappearTint
    this.portraitTinted.visible = true
    this.container.visible = true
    this.resize(ResizeHelper.width(), ResizeHelper.height())
    TweenMax.to(this, 1.2, {ease: Quart.easeIn, onComplete: this.onAppearComplete.bind(this) })
  }

  onAppearComplete(){
    this.maskDisappearTint.visible = false
    this.portraitTinted.visible = false

  }
}
export default Portait
