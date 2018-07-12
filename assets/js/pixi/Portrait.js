
import TransitionMask from "~/assets/js/pixi/Transition"
import DisappearMask from "~/assets/js/pixi/Disappear"


class Portait {
  constructor(container, id, idNum, color) {
    this.container = container
    this.idNum = idNum
    this.id = id
    this.color = color
    this.originalW = 872
    this.originalH = 1289

    this.maskDisappearTint = new DisappearMask()
    this.maskDisappear = new DisappearMask()
    this.maskTransitionIn = new TransitionMask()
    this.maskTransitionOut = new TransitionMask()
  }

  setTexture(base, transition, disappear) {
    let divider = 1
    if(process.browser) {
      if(window.resolution === .5) divider = 2
    }
    const potraitTexture = new PIXI.Texture.from(base)
    potraitTexture.frame = new PIXI.Rectangle(900 * this.idNum / divider, 0, 872 / divider, 1289 / divider)
    this.portrait = new PIXI.Sprite(potraitTexture)
    //this.portrait.texture.baseTexture.mipmap = true;
    const potraitTintedTexture = new PIXI.Texture.from(base)
    potraitTintedTexture.frame = new PIXI.Rectangle(900 * this.idNum / divider, 1300 / divider, 872 / divider, 1289 / divider)
    this.portraitTinted = new PIXI.Sprite(potraitTintedTexture)
    this.portraitTintedBlob = new PIXI.Sprite(potraitTintedTexture)
    //this.portraitTinted.texture.baseTexture.mipmap = true;
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
    this.maskTransitionIn.setTexture(transition)
    this.maskTransitionOut.setTexture(transition)
    this.container.addChild(this.maskTransitionIn.sprite)
    this.container.addChild(this.maskTransitionOut.sprite)
    this.maskDisappear.setTexture(disappear)
    this.maskDisappearTint.setTexture(disappear)
    this.container.addChild(this.maskDisappear.sprite)
    this.container.addChild(this.maskDisappearTint.sprite)
    this.maskDisappearTint.sprite.scale.x = -1

  }

  hideAll() {
    this.container.visible = false
    this.maskTransitionIn.sprite.visible = false
    this.maskTransitionOut.sprite.visible = false
    this.maskDisappear.sprite.visible = false
    this.maskDisappearTint.sprite.visible = false
  }
  resize(w, h) {
    this.w = w
    this.h = h
    const ratio = this.originalW / this.originalH
    let containerW, containerH
    if (w / h < 2880 / 1760) {
      this.screenRatio = w / 2880
    } else {
      this.screenRatio = h / 1760

    }
    containerW = this.originalW * this.screenRatio
    containerH = this.originalH * this.screenRatio
    this.maskTransitionIn.sprite.width = containerW
    this.maskTransitionIn.sprite.height = containerH
    this.maskTransitionOut.sprite.width = containerW
    this.maskTransitionOut.sprite.height = containerH
    this.maskDisappear.sprite.width = containerW
    this.maskDisappear.sprite.height = containerH
    this.maskDisappearTint.sprite.width = containerW
    this.maskDisappearTint.sprite.height = containerH

    this.portraitTinted.width = containerW
    this.portraitTinted.height = containerH
    this.portrait.width = containerW
    this.portrait.height = containerH
    this.container.width = containerW
    this.container.height = containerH
    this.container.position.x = this.posX = w * .5 - containerW / 2
    this.container.position.y = this.posY = h * .5 - containerH / 2.1

  }
  show(direction) {
    this.portrait.mask = this.maskTransitionIn.sprite

    this.maskTransitionIn.playIn(direction)
    this.container.visible = true
    this.maskTransitionIn.sprite.visible = true
    this.maskTransitionOut.sprite.visible = false
    this.maskDisappear.sprite.visible = false
    this.maskDisappearTint.sprite.visible = false
    const dir = direction === 'forward' ? 1 : -1

    TweenMax.fromTo(this.container.position, 1.2, {y: this.posY + (dir * 80), x: this.posX - (dir * 60)}, {y: this.posY, x: this.posX, ease: Quart.easeOut})
    this.resize(this.w, this.h)
  }
  hide(direction) {
    this.portrait.mask = this.maskTransitionOut.sprite

    this.maskTransitionOut.playOut(direction)
    this.maskTransitionIn.sprite.visible = false
    this.maskTransitionOut.sprite.visible = true
    this.maskDisappear.sprite.visible = false
    this.maskDisappearTint.sprite.visible = false
    const dir = direction === 'forward' ? 1 : -1

    TweenMax.to(this.container.position, 1, { y: this.posY - (dir * 80), x: this.posX + (dir * 60), ease: Cubic.easeIn,  onComplete: this.onHideComplete.bind(this)})
    this.resize(this.w, this.h)
  }

  onHideComplete(){
    this.container.visible = false
    this.portrait.mask = null
  }
  disappear() {
    this.maskDisappear.disappear()
    this.maskDisappearTint.disappear()

    this.maskTransitionIn.sprite.visible = false
    this.maskTransitionOut.sprite.visible = false
    this.maskDisappear.sprite.visible = true
    this.maskDisappearTint.sprite.visible = true
    this.portrait.mask = this.maskDisappear.sprite
    this.portraitTinted.mask = this.maskDisappearTint.sprite
    this.portraitTinted.visible = true
    this.container.visible = true

    TweenMax.to(this, 1.2, {ease: Quart.easeIn, onComplete: () => {
      this.container.visible = false
      this.portraitTinted.visible = false
    }})
    this.resize(this.w, this.h)
  }
  appear() {
    this.resize(this.w, this.h)

    this.maskDisappear.appear()
    this.maskDisappearTint.appear()

    this.maskTransitionIn.sprite.visible = false
    this.maskTransitionOut.sprite.visible = false
    this.maskDisappear.sprite.visible = true
    this.maskDisappearTint.sprite.visible = true
    this.portraitTinted.visible = true
    this.portrait.mask = this.maskDisappear.sprite
    this.portraitTinted.mask = this.maskDisappearTint.sprite
    this.container.visible = true
    TweenMax.to(this, 1.2, {ease: Quart.easeIn, onComplete: this.onAppearComplete.bind(this) })
    this.resize(this.w, this.h)

  }

  onAppearComplete(){
    this.maskDisappearTint.visible = false
    this.portraitTinted.visible = false

  }
}
export default Portait
