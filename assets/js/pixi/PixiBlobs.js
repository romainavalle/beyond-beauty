
import 'gsap/ColorPropsPlugin';
if (process.browser) {
  var Pixi = require('pixi.js')
}
class PixiBlobs {
  constructor(stage, titleBorderSprite, displacementTexture, blobs) {
    this.stage = stage
    this.titleBorderSprite = titleBorderSprite
    this.color = 0
    this.displacementTexture = displacementTexture
    this.blobs = blobs
    this.init()
  }
  init() {
    this.blobContainer = new Pixi.Sprite()
    this.blobSprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.blobs.canvas));
    this.mask = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.blobs.canvas));

    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementTexture);
    this.displacementFilter.scale.x = 80
    this.displacementFilter.scale.y = 80
    this.blobContainer.addChild(this.titleBorderSprite)
    this.blobContainer.addChild(this.displacementTexture)
    this.blobContainer.mask = this.mask
    this.stage.addChild(this.blobSprite)
    this.stage.addChild(this.blobContainer)
    this.stage.addChild(this.mask)
    this.titleBorderSprite.filters = [this.displacementFilter];
  }
  tick(followMouse = false) {
    this.blobs.tick(followMouse)
    this.blobSprite.texture.update()
    this.mask.texture.update()
  }
  show() {
    this.blobs.show()
  }
  hide() {
    this.blobs.hide()
  }
  resize(w, h, shapeW = 0) {
    this.displacementTexture.width = w
    this.displacementTexture.height = h
    this.blobs.resize(w, h, shapeW)
  }
  setTint(color) {
    if(this.color && this.color === color) return
    this.color = color
    this.blobs.toggle && this.blobs.toggle()
    TweenMax.to(this.blobSprite, 2, { colorProps: { tint: color, format: "number" } })
  }

}

export default PixiBlobs
