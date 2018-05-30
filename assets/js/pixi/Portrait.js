import Emitter from '~/assets/js/events'

if (process.browser) {
  var Pixi = require('pixi.js')
}
class Portait {
  constructor (container, id, color){
    this.container = container
    this.id = id
    this.color = color
    this.step = 0
    this.originalW = 1652 / 2
    this.originalH = 2442 / 2
    this.currentMaskTween = 0
    this.currentMaskDisappearTween = 0
    this.currentMask = 0
    this.currentMaskDisappear = 0
    this.mask_array = []
    this.maskDisappearPortrait_array = []
    this.maskDisappearTint_array = []
    //this.init()
  }

  /*init() {
    if(!PIXI.loader.resources[this.id]){
      PIXI.loader.add(this.id, `images/bust/${this.id}.png`)
    }
    if(!PIXI.loader.resources[this.id+'_white']){
      PIXI.loader.add(this.id+'_white', `images/bust/${this.id}-white.png`)
    }
    let id
    if(!PIXI.loader.resources['mask_transition_0']){
      for (let index = 0; index < 81; index++) {
        id = index
        if(index < 10) id = '0' + index
        PIXI.loader.add("mask_transition_"+index, `images/mask/transition/transition_bust_${id}.png`)
      }
    }
    if(!PIXI.loader.resources['mask_disappear_0']){
      for (let index = 0; index < 13; index++) {
        id = index
        if(index < 10) id = '0' + index
        PIXI.loader.add("mask_disappear_"+index, `images/mask/disappear/disappear_bust_${id}.png`)
      }
    }
  }*/

  load() {
    //PIXI.loader.load(this.setup.bind(this));
  //}

  //setup (loader, ressources) {
    //this.portrait = new Pixi.Sprite(ressources[this.id].texture)
    //this.portraitTinted = new Pixi.Sprite(ressources[this.id+'_white'].texture)
    this.portrait = new Pixi.Sprite.fromImage(window.unpacker.getAsURI(`bust/${this.id}.png`))
    this.portraitTinted = new Pixi.Sprite.fromImage(window.unpacker.getAsURI(`bust/${this.id}-white.png`))
    TweenMax.set(this.portraitTinted, {colorProps: {tint: this.color,format:"number"}})
    this.portraitTinted.visible = false
    this.portrait.interactive = true
    this.portrait.buttonMode = true
    this.portraitTinted.interactive = false
    this.portrait.on('click', () => Emitter.emit('PORTRAIT_CLICK'))
    this.portrait.width = this.originalW
    this.portrait.height = this.originalH
    this.portraitTinted.width = this.originalW
    this.portraitTinted.height = this.originalH
    this.container.addChild(this.portraitTinted)
    this.container.addChild(this.portrait)
    let id
    for (let index = 0; index < 81; index++) {
      id = index
      if(index < 10) id = '0' + index
      //const maskStep = new Pixi.Sprite(ressources['mask_transition_'+index].texture)
      const maskStep = new Pixi.Sprite.fromImage(window.unpacker.getAsURI(`mask/transition/transition_bust_${id}.png`))
      maskStep.interactive = false
      maskStep.visible = false
      maskStep.width = this.originalW
      maskStep.height = this.originalH
      this.mask_array.push(maskStep)
      this.container.addChild(maskStep)
    }

    for (let index = 0; index < 13; index++) {
      id = index
      if(index < 10) id = '0' + index
      const maskStep = new Pixi.Sprite.fromImage(window.unpacker.getAsURI(`mask/disappear/disappear_bust_${id}.png`))
      //const maskStep = new Pixi.Sprite(ressources['mask_disappear_'+index].texture)
      maskStep.interactive = false
      maskStep.visible = false
      maskStep.width = this.originalW
      maskStep.height = this.originalH
      this.maskDisappearPortrait_array.push(maskStep)
      this.container.addChild(maskStep)
    }
    for (let index = 0; index < 13; index++) {
      id = index
      if(index < 10) id = '0' + index
      const maskStep = new Pixi.Sprite.fromImage(window.unpacker.getAsURI(`mask/disappear/disappear_bust_${id}.png`))
      //const maskStep = new Pixi.Sprite(ressources['mask_disappear_'+index].texture)
      maskStep.interactive = false
      maskStep.visible = false
      maskStep.width = this.originalW
      maskStep.scale.x = -1
      maskStep.position.x =  this.originalW
      maskStep.height = this.originalH
      this.maskDisappearTint_array.push(maskStep)
      this.container.addChild(maskStep)
    }
    this.portrait.mask = this.mask_array[0]
    this.mask_array[this.currentMask].visible = true
  }
  resize(w,h) {
    const ratio = this.originalW / this.originalH
    let containerW, containerH
    if(w / h < ratio) {
      containerW = w / 4
      containerH = containerW / ratio
    }else{
      containerH = h * 8/11
      containerW = containerH * ratio

    }
    this.container.width = containerW
    this.container.height = containerH
    this.container.position.x = w * .5 - containerW / 2
    this.container.position.y = h * .5 - containerH / 2
  }
  show(delay = 0){
    delay *= 60
    this.currentMaskTween = 0
    this.currentMask = 0
    this.portrait.mask = this.mask_array[0]
    this.mask_array[this.currentMask].visible = true
    TweenMax.to(this, 42, {useFrames: true, delay, currentMaskTween: 42, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this)})
  }
  hide(){
    TweenMax.to(this, 38, {useFrames: true, delay: 20, currentMaskTween: 80, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this),onComplete: () => {this.currentMaskTween = 0}})
  }
  disappear(){
    this.currentMaskDisappearTween = 0
    this.currentMaskDisappear = 0
    this.mask_array[this.currentMask].visible = false
    this.portraitTinted.visible = true
    TweenMax.to(this, 12, {useFrames: true, currentMaskDisappearTween: 12, ease: Linear.easeInOut, onUpdate: this.tweenDisappearUpdate.bind(this),onComplete: () => {
      this.portrait.mask = this.mask_array[0]
      this.mask_array[0].visible = true
      this.maskDisappearPortrait_array[this.currentMaskDisappear].visible = false
      this.maskDisappearTint_array[this.currentMaskDisappear].visible = false
      }
    })
  }
  tweenUpdate() {
    this.mask_array[this.currentMask].visible = false
    this.currentMask = Math.round(this.currentMaskTween)
    this.portrait.mask = this.mask_array[this.currentMask]
    this.mask_array[this.currentMask].visible = true
  }
  tweenDisappearUpdate() {
    this.maskDisappearPortrait_array[this.currentMaskDisappear].visible = false
    this.maskDisappearTint_array[this.currentMaskDisappear].visible = false

    this.currentMaskDisappear = Math.round(this.currentMaskDisappearTween)

    this.portrait.mask = this.maskDisappearPortrait_array[this.currentMaskDisappear]
    this.portraitTinted.mask = this.maskDisappearTint_array[this.currentMaskDisappear]
    this.maskDisappearPortrait_array[this.currentMaskDisappear].visible = true
    this.maskDisappearTint_array[this.currentMaskDisappear].visible = true
  }


}
export default Portait
