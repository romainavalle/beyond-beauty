
import Title from '~/assets/js/pixi/TitleMobile'


class TitlesMobile {
  constructor(stage) {
    this.stage = stage
    this.init()
  }

  init() {
    this.setupTitle()
    this.setupTitleBorder()
  }

  setupTitle() {
    this.titleSprite = new PIXI.Sprite()
    this.titleSprite.interactive = false

    const titleContainer = new PIXI.Container()
    this.title = new Title(titleContainer, false)
    this.titleSprite.addChild(titleContainer)
    this.stage.addChild(this.titleSprite)
  }

  setupTitleBorder() {
    this.titleBorderSprite = new PIXI.Container()
    this.titleBorderSprite.name = 'titleBorderContainer'
    const titleBorderContainer = new PIXI.Container()
    this.titleBorder = new Title(titleBorderContainer, true)
    this.titleBorderSprite.addChild(titleBorderContainer)
    this.titleBorderAboutSprite = new PIXI.Container()
    this.titleBorderAboutSprite.name = 'titleBorderContainer'
    const titleBorderAboutContainer = new PIXI.Container()
    this.titleBorderAbout = new Title(titleBorderContainer, true)
    this.titleBorderAboutSprite.addChild(titleBorderAboutContainer)
  }

  load(getter) {
    this.titleLoaded = false
    this.titleBorderLoaded = false


    this.baseText = new PIXI.BaseTexture.fromImage(getter('title-mobile.png'))
    this.baseBorderText = new PIXI.BaseTexture.fromImage(getter('title-mobile-border.png'))
    this.baseText.on('loaded', this.onBaseLoaded.bind(this))
    this.baseBorderText.on('loaded', this.onBaseBorderLoaded.bind(this))
  }

  onBaseLoaded() {
    this.titleLoaded = true
    this.onLoaded()
  }

  onBaseBorderLoaded() {
    this.titleBorderLoaded = true
    this.onLoaded()
  }

  onLoaded() {
    if(!this.titleLoaded) return
    if(!this.titleBorderLoaded) return
    this.title.setTexture(this.baseText)
    this.titleBorder.setTexture(this.baseBorderText)
    this.titleBorderAbout.setTexture(this.baseBorderText)
  }


  resize(w, h) {
    this.title.resize(w, h)
    this.titleBorder.resize(w, h)
    this.titleBorderAbout.resize(w, h)
  }






}
export default TitlesMobile
