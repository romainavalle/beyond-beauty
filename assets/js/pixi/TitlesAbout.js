
import TitleAbout from '~/assets/js/pixi/TitleAbout'


class TitlesAbout {
  constructor(stage) {
    this.stage = stage
    this.titles = []
    this.titlesBorder = []
    this.isShown = false
    this.init()
  }

  init() {
    this.position_array = [
      {x: 1600, y: 390},
      {x: 1600, y: 710},
      {x: 135, y: 1220},
      {x: 135, y: 1540}
    ]
    this.setupTitle()
    this.setupTitleBorder()
  }

  setupTitle() {
    this.titleSprite = new PIXI.Sprite()
    this.titleSprite.interactive = false
    this.titleSprite.buttonMode = false
    for (let index = 0; index < 4; index++) {
      const titleContainer = new PIXI.Container()
      const title = new TitleAbout(titleContainer, index, false, this.position_array[index])
      this.titleSprite.addChild(titleContainer)
      this.titles.push(title)
    }
    this.stage.addChild(this.titleSprite)
  }

  setupTitleBorder() {
    this.titleBorderSprite = new PIXI.Container()
    this.titleBorderSprite.name = 'titleBorderContainer'

    for (let index = 0; index < 4; index++) {
      const titleContainer = new PIXI.Container()
      const title = new TitleAbout(titleContainer, index, true, this.position_array[index])
      this.titleBorderSprite.addChild(titleContainer)
      this.titlesBorder.push(title)
    }
  }

  load(getter, renderer) {
    this.titleLoaded = false
    this.titleBorderLoaded = false

    let urlResolution = ''
    if(process.browser) {
      if(window.resolution === .5) urlResolution = '@0.5x'
    }
    this.baseText = new PIXI.BaseTexture.fromImage(getter('titles/titles'+ urlResolution +'.png'))
    this.baseBorderText = new PIXI.BaseTexture.fromImage(getter('titles/titles-border'+ urlResolution +'.png'))
    renderer.textureManager.updateTexture(this.baseText);
    renderer.textureManager.updateTexture(this.baseBorderText);
    this._onBaseLoaded = this.onBaseLoaded.bind(this)
    this._onBaseBorderLoaded = this.onBaseBorderLoaded.bind(this)
    this.baseText.on('loaded', this._onBaseLoaded)
    this.baseBorderText.on('loaded', this._onBaseBorderLoaded)
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
    this.baseText.off('loaded', this._onBaseLoaded)
    this.baseBorderText.off('loaded', this._onBaseBorderLoaded)

    const pos_array = [
      [
        {x: 1200, y: 900, w: 418, h:113},
        {x: 1625, y: 900, w: 733, h:143},
        {x: 1680, y: 1100, w: 493, h:137},
        {x: 1200, y: 1100, w: 456, h:135}
      ],
      [
        {x: 1100, y: 1150, w: 418, h:113},
        {x: 1600, y: 1150, w: 733, h:142},
        {x: 1600, y: 1300, w: 493, h:137},
        {x: 1100, y: 1300, w: 456, h:135}
      ]
    ]

    for (let index = 0; index < 4; index++) {
      this.titles[index].setTexture(this.baseText, pos_array[0][index])
      this.titlesBorder[index].setTexture(this.baseBorderText, pos_array[1][index])
    }
  }

  resize(w, h) {
    for (let index = 0; index < 4; index++) {
      this.titlesBorder[index].resize(w, h)
      this.titles[index].resize(w, h)
    }
  }
  show(delay) {
    if(this.isShown) return
    this.isShown = true
    for (let index = 0; index < 4; index++) {
      this.titles[index].show(delay + (index % 2) * .3)
      this.titlesBorder[index].show(delay + (index % 2) * .3)
    }
  }

  hide() {
    if(!this.isShown) return
    this.isShown = false
    for (let index = 0; index < 4; index++) {
      this.titles[index].hide()
      this.titlesBorder[index].hide()
    }
  }


}
export default TitlesAbout
