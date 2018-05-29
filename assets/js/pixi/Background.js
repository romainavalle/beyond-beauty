if (process.browser) {
  var Pixi = require('pixi.js')
}
class Background {
  constructor (container){
    this.container = container
    this.init()
  }

  init() {
    this.background = new Pixi.Container()
    this.container.addChild(this.background)
  }

  resize(w,h) {
   this.background.width = w
   this.background.height = h
  }

}
export default Background
