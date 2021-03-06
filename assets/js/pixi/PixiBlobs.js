
import 'gsap/ColorPropsPlugin';
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import Blobs from '~/assets/js/pixi/blobs/Blobs'
import Displacement from '~/assets/js/pixi/Displacement'

class PixiBlobs {
  constructor(stage, titleBorderSprite, titleAboutBorderSprite, renderer, getter, isMobile = false) {
    this.stage = stage
    this.mask = 'index'
    this.titleBorderSprite = titleBorderSprite
    this.titleAboutBorderSprite = titleAboutBorderSprite
    this.color = 0
    this.renderer = renderer
    this.blobs = new Blobs(isMobile)
    this.setDisplacement(getter)
    let divider = 1
    if(process.browser) {
      if(window.resolution === .5) divider = 2
    }
    this.renderTexture = new PIXI.RenderTexture.create(ResizeHelper.width()/divider, ResizeHelper.height()/divider, PIXI.SCALE_MODES.LINEAR, 2);
    this.renderDispTexture = new PIXI.RenderTexture.create(ResizeHelper.width()/divider, ResizeHelper.height()/divider, PIXI.SCALE_MODES.LINEAR, 2);

    this.init()
  }

  setDisplacement(getter){
    this.displacement = new Displacement()
    this.displacement.load(getter, this.renderer)
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacement.sprite);
    this.displacementFilter.scale.x = 42
    this.displacementFilter.scale.y = 42
    this.stage.addChild(this.displacement.sprite)
    this.titleBorderSprite.filters = [this.displacementFilter];
  }

  init() {
    this.blobContainer = new PIXI.Container()
    this.blobSprite = new PIXI.Sprite(this.renderTexture)
    this.blobSprite.name ='blobSprite'
    this.maskSprite = new PIXI.Sprite(this.renderTexture)
    this.maskSprite.name ='maskSprite'
    this.dispSprite = new PIXI.Sprite(this.renderDispTexture)
    this.stage.addChild(this.blobSprite)
    this.stage.addChild(this.dispSprite)
    this.dispSprite.mask = this.maskSprite
  }
  load(getter) {
    this.blobs.load(getter)
  }
  tick() {
    this.blobs.tick()
    this.displacement.tick()
    if(this.mask === 'about') {
      this.renderer.render(this.titleAboutBorderSprite, this.renderDispTexture)
      this.titleBorderSprite.filters = []
      this.titleAboutBorderSprite.filters = [this.displacementFilter];
    }else{
      this.renderer.render(this.titleBorderSprite, this.renderDispTexture)
      this.titleBorderSprite.filters = [this.displacementFilter];
      this.titleAboutBorderSprite.filters = []
    }
    this.renderer.render(this.blobs.sprite, this.renderTexture)
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
  scale(scale) {
    this.blobs.scaleTo(scale)
  }
  resize(w, h, shapeW = 0) {
    this.displacement.resize(w, h)
    this.renderTexture.resize(w, h)
    this.renderDispTexture.resize(w, h)
    this.blobs.resize && this.blobs.resize(w, h, shapeW)
  }
  setTint(color) {
    if(this.color && this.color === color) return
    this.blobs.toggle && this.blobs.toggle()
    this.color = color
    TweenMax.to(this.blobSprite, 2, { colorProps: { tint: color, format: "number" } })
  }

}

export default PixiBlobs
