import Blobs from '~/assets/js/canvasBlob/Blobs'
import Displacement from '~/assets/js/Displacement'
import 'gsap/ColorPropsPlugin';
if (process.browser) {
  var Pixi = require('pixi.js')
}
class PixiBlobs {
  constructor(stage, titleBorderSprite) {
    this.stage = stage
    this.titleBorderSprite = titleBorderSprite
    this.init()
  }
  init() {
    this.displacement = new Displacement()
    this.blobs = new Blobs()
    const blobContainer = new Pixi.Sprite()
    this.blobSprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.blobs.canvas));
    this.mask = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.blobs.canvas));
    this.displacementTexture = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.displacement.canvas));
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementTexture);
    blobContainer.addChild(this.titleBorderSprite)
    blobContainer.addChild(this.displacementTexture)
    blobContainer.mask = this.mask
    this.stage.addChild(this.blobSprite)
    this.stage.addChild(blobContainer)
    this.stage.addChild(this.mask)
    this.titleBorderSprite.filters = [this.displacementFilter];

    this.displacementFilter.scale.x = 80
    this.displacementFilter.scale.y = 80
  }
  tick() {
    this.blobs.tick()
    this.displacement.tick();
    this.displacementTexture.texture.update();
    this.blobSprite.texture.update()
    this.mask.texture.update()
  }
  resize(w, h) {
    this.displacementTexture.width = w
    this.displacementTexture.height = h
    this.blobs.resize(w, h)
  }
  setTint(color) {
    TweenMax.to(this.blobSprite, 2, { colorProps: { tint: color, format: "number" } })
  }

}

export default PixiBlobs
