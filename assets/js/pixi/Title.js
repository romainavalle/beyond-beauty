if (process.browser) {
  var Pixi = require('pixi.js')
}
class Title {
  constructor (container, id, isBordered){
    this.container = container
    this.id = id
    this.isBordered = isBordered
    this.angle = Math.PI / 25
    this.title_array = []
    this.init()
  }

  init() {
    const border = this.isBordered ? '-border' : ''
    if(!PIXI.loader.resources[this.id+'-title'+border+'-0']){
      for (let index = 0; index < 3; index++) {
        PIXI.loader.add(this.id+'-title'+border+'-'+index, `images/titles${border}/${this.id}-${index}.png`)
      }
    }
  }

  load() {
    PIXI.loader.load(this.setup.bind(this));
  }

  setup (loader, ressources) {
    const border = this.isBordered ? '-border' : ''
    let h = 50
    for (let index = 0; index < 3; index++) {
      const img = new Pixi.Sprite(ressources[this.id+'-title'+border+'-'+index].texture)
      const title = new Pixi.Sprite()
      title.addChild(img)
      img.position.x = -img.width / 4
      img.position.y = 5000 + h
      h += img.height / 2 + 0
      img.scale.x = .5
      img.scale.y = .5
      title.interactive = false
      title.position.y = -5000
      TweenMax.set(title, {rotation: this.angle, alpha: 0})
      this.container.addChild(title)
      this.title_array.push(title)
    }
    this.originalW = this.container.width
    this.originalH = this.container.height

  }
  resize(w,h) {

    this.container.position.x = w * .5
    const ratio = this.originalW / this.originalH
    let containerW, containerH, screenRatio
    if(w > h) {
      screenRatio = w / (2280 / 2) * 0.7
    }else{
      screenRatio = h / (1760 / 2) * 0.7
    }
    this.container.width = this.originalW * screenRatio
    this.container.height = this.originalH * screenRatio
    this.container.position.x = w * .5
    this.container.position.y = h * .5 - (this.container.height - 5000 * screenRatio) * .5
  }
  show(delay = 0){
    TweenMax.staggerTo(this.title_array, 1, {delay, rotation: 0, alpha: 1, ease: Quad.easeOut}, .1)
  }
  hide(){
    TweenMax.staggerTo(this.title_array, .75, {rotation: -this.angle, alpha: 0, ease: Quint.easeIn}, .1, () => {
      this.title_array.forEach(title => {
        TweenMax.set(title, {rotation: this.angle, alpha: 0})
      });
    })
  }
}
export default Title
