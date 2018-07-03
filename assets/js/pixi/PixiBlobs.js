
import 'gsap/ColorPropsPlugin';
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import Blobs from '~/assets/js/pixi/blobs/Blobs'
import Displacement from '~/assets/js/pixi/Displacement'

class PixiBlobs {
  constructor(stage, titleBorderSprite, renderer, getter) {
    this.stage = stage
    this.titleBorderSprite = titleBorderSprite
    this.color = 0

    this.setDisplacement(getter)

    this.blobs = new Blobs()
    this.renderer = renderer
    this.renderTexture = new PIXI.RenderTexture.create(ResizeHelper.width(), ResizeHelper.height(),PIXI.settings.SCALE_MODE.LINEAR);
    this.init()
  }
  setDisplacement(getter){
    this.displacement = new Displacement()
    this.displacement.load(getter)
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacement.sprite);
    this.displacementFilter.scale.x = 80
    this.displacementFilter.scale.y = 80
    this.stage.addChild(this.displacement.sprite)
  }
  init() {
    this.blobContainer = new PIXI.Container()
    this.blobSprite = new PIXI.Sprite(this.renderTexture)
    this.maskSprite = new PIXI.Sprite(this.renderTexture)
    this.stage.addChild(this.blobSprite)
    this.stage.addChild(this.maskSprite)
    this.stage.addChild(this.titleBorderSprite)
    this.titleBorderSprite.mask = this.maskSprite

    this.titleBorderSprite.filters = [this.displacementFilter];
  }
  tick() {
    this.blobs.tick()
    this.renderer.render(this.blobs.sprite, this.renderTexture)
    this.displacement.tick()
  }
  show() {
    this.blobs.show()
  }
  showMouse() {
    this.blobs.showMouse()
  }
  hideMouse() {
    this.blobs.hideMouse()
  }
  hide() {
    this.blobs.hide()
  }
  resize(w, h, shapeW = 0) {
    this.displacement.resize(w, h)
    this.renderTexture.resize(w, h)
    this.blobs.resize && this.blobs.resize(w, h, shapeW)
  }
  setTint(color) {
    if(this.color && this.color === color) return
    this.color = color
    this.blobs.toggle && this.blobs.toggle()
    TweenMax.to(this.blobSprite, 2, { colorProps: { tint: color, format: "number" } })
  }

}

export default PixiBlobs
