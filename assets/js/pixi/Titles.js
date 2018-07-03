
import Title from '~/assets/js/pixi/Title'
import Emitter from '~/assets/js/events'
import { pages } from '~/assets/data.json'


class Titles {
  constructor(stage) {
    this.stage = stage
    this.titles = []
    this.titlesBorder = []
    this.titlesMouseBorder = []
    this.scale = 1
    this.isShown = false
    this.originalYpos = 0
    this.yPos = 0
    this.init()
  }

  init() {
    this.setupTitle()
    this.setupTitleBorder()
  }

  setupTitle() {
    this.titleSprite = new PIXI.Sprite()

    this.titleSprite.interactive = true
    this.titleSprite.buttonMode = true
    this.titleSprite.on('click', () => Emitter.emit('CANVAS_CLICK'))
    this.titleSprite.on('mouseout', () => Emitter.emit('HIDE_MOUSE'))
    this.titleSprite.on('mouseover', () => {
      let obj
      if(this.scale === 1) obj = {type: 'discover'}
      if(this.scale === .55) obj = {type: 'learn'}
      if(this.scale === .36) obj = {type: 'next'}
      Emitter.emit('SET_MOUSE_TYPE', obj)
      Emitter.emit('SHOW_MOUSE')
    })
    pages.forEach((page, i) => {
      const titleContainer = new PIXI.Container()
      const title = new Title(titleContainer, page.id, i)
      this.titleSprite.addChild(titleContainer)
      this.titles.push(title)
    });
    this.stage.addChild(this.titleSprite)
  }

  setupTitleBorder() {
    this.titleBorderSprite = new PIXI.Container()
    pages.forEach((page, i) => {
      const titleBorderContainer = new PIXI.Container()
      const title = new Title(titleBorderContainer, page.id, i, true)
      this.titleBorderSprite.addChild(titleBorderContainer)
      this.titlesBorder.push(title)
    });
  }

  load(getter) {
    this.titleLoaded = false
    this.titleBorderLoaded = false

    let urlResolution = ''
    if(process.browser) {
      if(window.resolution === .5) urlResolution = '@0.5x'
    }
    this.baseText = new PIXI.BaseTexture.fromImage(getter('titles/titles'+ urlResolution +'.png'))
    this.baseBorderText = new PIXI.BaseTexture.fromImage(getter('titles/titles-border'+ urlResolution +'.png'))
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

    pages.forEach((page, i) => {
      this.titles[i].setTexture(this.baseText, page.title)
      this.titlesBorder[i].setTexture(this.baseBorderText, page.titleBorder)
    })
  }

  doReady(){
    pages.forEach((page, i) => {
      this.titlesBorder[i].reset()
      this.titles[i].reset()
    })
  }

  resize(w, h) {
    pages.forEach((page, i) => {
      this.titlesBorder[i].resize(w, h)
      this.titles[i].resize(w, h)
    })
    this.originalYpos = h / 2
    this.titleSprite.position.x = this.titleBorderSprite.position.x = w / 2
    this.titleSprite.position.y = this.titleBorderSprite.position.y = this.originalYpos + this.yPos
  }

  hide(id, isFast = false, direction = 'forward') {
    if(!this.isShown) return
    this.isShown = false
    this.titlesBorder[id].hide(isFast, direction)
    this.titles[id].hide(isFast, direction)
  }

  show(id, delay, time, direction = 'forward') {
    if(this.isShown) return
    this.isShown = true
    this.titlesBorder[id].show(delay * .6, time, direction)
    this.titles[id].show(delay * .6, time, direction)
  }

  scaleTo(id, scale, delay, time, isPageTransition = false) {
    this.scale = scale

    for (let index = 0; index < this.titles.length; index++) {
      if(id === index) {
        this.titlesBorder[id].scaleTo(scale, delay, time, isPageTransition)
        this.titles[id].scaleTo(scale, delay, time, isPageTransition)
      }else{
        this.titles[index].scaleTo(this.scale, 0, 0)
        this.titlesBorder[index].scaleTo(this.scale, 0, 0)
      }
    }
  }

  goToYPos(yPos, time){
    this.yPos = yPos
    TweenMax.to([this.titleBorderSprite.position, this.titleSprite.position], time,{y: this.originalYpos + yPos, ease: Power2.easeInOut})
  }

}
export default Titles
