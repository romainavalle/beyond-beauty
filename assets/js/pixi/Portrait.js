
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import TransitionMask from "~/assets/js/pixi/Transition"
import DisappearMask from "~/assets/js/pixi/Disappear"


class Portait {
  constructor(container, id, idNum, color) {
    this.container = container
    this.idNum = idNum
    this.id = id
    this.color = color
    this.originalW = 1652 / 2
    this.originalH = 2442 / 2
    this.firstResize = true

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
    potraitTexture.frame = new PIXI.Rectangle(900 * this.idNum / divider, 0, 897 / divider, 1289 / divider)
    this.portrait = new PIXI.Sprite(potraitTexture)
    //this.portrait.texture.baseTexture.mipmap = true;
    const potraitTintedTexture = new PIXI.Texture.from(base)
    potraitTintedTexture.frame = new PIXI.Rectangle(900 * this.idNum / divider, 1300 / divider, 897 / divider, 1289 / divider)
    this.portraitTinted = new PIXI.Sprite(potraitTintedTexture)
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
    this.container.addChild(this.maskTransitionIn.mask)
    this.container.addChild(this.maskTransitionOut.mask)
    this.maskDisappear.setTexture(disappear)
    this.maskDisappearTint.setTexture(disappear)
    this.container.addChild(this.maskDisappear.mask)
    this.container.addChild(this.maskDisappearTint.mask)
    this.maskDisappearTint.mask.scale.x = -1

    if(this.firstResize) {
      this.firstResize = false
      this.show()
      this.maskTransitionOut.playOut()
      this.maskDisappear.disappear()
      this.maskDisappearTint.disappear()
    }

  }

  hideAll() {
    this.container.visible = false
    this.maskTransitionIn.mask.visible = false
    this.maskTransitionOut.mask.visible = false
    this.maskDisappear.mask.visible = false
    this.maskDisappearTint.mask.visible = false
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
    this.maskTransitionIn.mask.width = containerW
    this.maskTransitionIn.mask.height = containerH
    this.maskTransitionOut.mask.width = containerW
    this.maskTransitionOut.mask.height = containerH
    this.maskDisappear.mask.width = containerW
    this.maskDisappear.mask.height = containerH
    this.maskDisappearTint.mask.width = containerW
    this.maskDisappearTint.mask.height = containerH

    this.portraitTinted.width = containerW
    this.portraitTinted.height = containerH
    this.portrait.width = containerW
    this.portrait.height = containerH
    this.container.width = containerW
    this.container.height = containerH
    this.container.position.x = this.posX = w * .5 - containerW / 2
    this.container.position.y = this.posY = h * .5 - containerH / 2

  }
  show(direction) {
    this.portrait.mask = this.maskTransitionIn.mask

    this.maskTransitionIn.playIn(direction)
    this.container.visible = true
    this.maskTransitionIn.mask.visible = true
    this.maskTransitionOut.mask.visible = false
    this.maskDisappear.mask.visible = false
    this.maskDisappearTint.mask.visible = false
    this.resize(ResizeHelper.width(), ResizeHelper.height())
    const dir = direction === 'forward' ? 1 : -1
    TweenMax.fromTo(this.container.position, 1.2, {y: this.posY + (dir * 80), x: this.posX - (dir * 60)}, {y: this.posY, x: this.posX, ease: Quart.easeOut})
  }
  hide(direction) {
    this.portrait.mask = this.maskTransitionOut.mask

    this.maskTransitionOut.playOut(direction)
    this.maskTransitionIn.mask.visible = false
    this.maskTransitionOut.mask.visible = true
    this.maskDisappear.mask.visible = false
    this.maskDisappearTint.mask.visible = false
    const dir = direction === 'forward' ? 1 : -1
    TweenMax.to(this.container.position, 1, { y: this.posY - (dir * 80), x: this.posX + (dir * 60), ease: Cubic.easeIn,  onComplete: this.onHideComplete.bind(this)})
  }

  onHideComplete(){
    this.container.visible = false
    this.portrait.mask = null
  }
  disappear() {
    this.maskDisappear.disappear()
    this.maskDisappearTint.disappear()

    this.maskTransitionIn.mask.visible = false
    this.maskTransitionOut.mask.visible = false
    this.maskDisappear.mask.visible = true
    this.maskDisappearTint.mask.visible = true
    this.portrait.mask = this.maskDisappear.mask
    this.portraitTinted.mask = this.maskDisappearTint.mask
    this.portraitTinted.visible = true
    this.container.visible = true
    TweenMax.to(this, 1.2, {ease: Quart.easeIn, onComplete: () => {
      this.container.visible = false
      this.portraitTinted.visible = false
    }})
  }
  appear() {
    this.maskDisappear.appear()
    this.maskDisappearTint.appear()

    this.maskTransitionIn.mask.visible = false
    this.maskTransitionOut.mask.visible = false
    this.maskDisappear.mask.visible = true
    this.maskDisappearTint.mask.visible = true
    this.portraitTinted.visible = true
    this.portrait.mask = this.maskDisappear.mask
    this.portraitTinted.mask = this.maskDisappearTint.mask
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
