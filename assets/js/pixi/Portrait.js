if (process.browser) {
  var Pixi = require('pixi.js')
}
class Portait {
  constructor (container, id){
    this.container = container
    this.id = id
    this.step = 0
    this.currentMaskTween = 0
    this.currentMask = 0
    this.mask_array = []
    this.init()
  }

  init() {
    if(!PIXI.loader.resources[this.id]){
      PIXI.loader.add(this.id, `images/bust/${this.id}.png`)
    }
    let id
    if(!PIXI.loader.resources['mask0']){
      for (let index = 0; index < 86; index++) {
        id = index
        if(index < 10) id = '0' + index
        PIXI.loader.add("mask"+index, `images/mask/transition_bust_${id}.png`)
      }
    }
  }

  load() {
    PIXI.loader.load(this.setup.bind(this));
  }

  setup (loader, ressources) {
    this.portrait = new Pixi.Sprite(ressources[this.id].texture)
    this.portrait.interactive = false
    this.portrait.height = 800
    this.portrait.width = 450
    this.container.addChild(this.portrait)
    for (let index = 0; index < 86; index++) {
      const maskStep = new Pixi.Sprite(ressources['mask'+index].texture)
      maskStep.interactive = false
      maskStep.visible = false
      maskStep.height = 800
      maskStep.width = 450
      this.container.addChild(maskStep)
      this.mask_array.push(maskStep)
    }

    this.portrait.mask = this.mask_array[0]
    this.mask_array[this.currentMask].visible = true
  }
  resize(w,h) {
    this.container.position.x = w * .5 - 225
    this.container.position.y = h * .5 - 400
  }
  show(delay = 0){
    TweenMax.to(this, 1, {delay, currentMaskTween: 44, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this)})
  }
  hide(){
    TweenMax.to(this, 1, {currentMaskTween: 85, ease: Linear.easeInOut, onUpdate: this.tweenUpdate.bind(this),onComplete: () => {this.currentMaskTween = 0}})
  }
  tweenUpdate() {
    this.mask_array[this.currentMask].visible = false
    this.currentMask = Math.round(this.currentMaskTween)
    this.portrait.mask = this.mask_array[this.currentMask]
    this.mask_array[this.currentMask].visible = true
  }


}
export default Portait
