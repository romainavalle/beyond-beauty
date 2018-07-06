
import 'gsap/ColorPropsPlugin';
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import Blobs from '~/assets/js/pixi/blobs/Blobs'
import Displacement from '~/assets/js/pixi/Displacement'

class PixiBlobs {
  constructor(stage, titleBorderSprite, titleAboutBorderSprite, renderer, getter) {
    this.stage = stage
    this.mask = 'about'
    this.titleBorderSprite = titleBorderSprite
    this.titleAboutBorderSprite = titleAboutBorderSprite
    this.color = 0
    this.setDisplacement(getter)
    this.blobs = new Blobs()
    this.renderer = renderer
    this.renderTexture = new PIXI.RenderTexture.create(ResizeHelper.width(), ResizeHelper.height());
    this.renderDispTexture = new PIXI.RenderTexture.create(ResizeHelper.width(), ResizeHelper.height());

    this.init()
  }

  setDisplacement(getter){
    this.displacement = new Displacement()
    this.displacement.load(getter)
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacement.sprite);
    this.displacementFilter.scale.x = 80
    this.displacementFilter.scale.y = 80
    this.stage.addChild(this.displacement.sprite)
    this.titleBorderSprite.filters = [this.displacementFilter];
    this.titleAboutBorderSprite.filters = [this.displacementFilter];
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
    }else{
      this.renderer.render(this.titleBorderSprite, this.renderDispTexture)
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
