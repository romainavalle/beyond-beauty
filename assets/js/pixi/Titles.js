
import Title from '~/assets/js/pixi/Title'
import Emitter from '~/assets/js/events'
import { pages } from '~/assets/data.json'

if (process.browser) {
  var Pixi = require('pixi.js')
}
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
    this.titleSprite = new Pixi.Sprite()

    this.titleSprite.interactive = true
    this.titleSprite.buttonMode = true
    this.titleSprite.on('click', () => Emitter.emit('CANVAS_CLICK'))
    this.titleSprite.on('mouseout', () => Emitter.emit('HIDE_MOUSE'))
    this.titleSprite.on('mouseover', () => {
      let obj
      if(this.scale === 1) obj = {type: 'discover'}
      if(this.scale === .65) obj = {type: 'learn'}
      if(this.scale === .45) obj = {type: 'next'}
      Emitter.emit('SET_MOUSE_TYPE', obj)
      Emitter.emit('SHOW_MOUSE')
    })
    pages.forEach((page, i) => {
      const titleContainer = new Pixi.Container()
      const title = new Title(titleContainer, page.id, i)
      this.titleSprite.addChild(titleContainer)
      this.titles.push(title)
    });
    this.stage.addChild(this.titleSprite)
  }

  setupTitleBorder() {
    this.titleBorderSprite = new Pixi.Container()
    this.titleBorderMouseSprite = new Pixi.Container()
    pages.forEach((page, i) => {
      const titleBorderContainer = new Pixi.Container()
      const titleBorderContainerMouse = new Pixi.Container()
      const title = new Title(titleBorderContainer, page.id, i, true)
      const titleMouse = new Title(titleBorderContainerMouse, page.id, i, true)
      this.titleBorderSprite.addChild(titleBorderContainer)
      this.titleBorderMouseSprite.addChild(titleBorderContainerMouse)
      this.titlesBorder.push(title)
      this.titlesMouseBorder.push(titleMouse)
    });
  }

  load(getter) {
    pages.forEach((page, i) => {
      this.titlesMouseBorder[i].load(getter)
      this.titlesBorder[i].load(getter)
      this.titles[i].load(getter)
    })
  }

  doReady(){
    pages.forEach((page, i) => {
      this.titlesMouseBorder[i].reset()
      this.titlesBorder[i].reset()
      this.titles[i].reset()
    })
  }

  resize(w, h) {
    pages.forEach((page, i) => {
      this.titlesMouseBorder[i].resize(w, h)
      this.titlesBorder[i].resize(w, h)
      this.titles[i].resize(w, h)
    })
    this.originalYpos = h / 2
    this.titleSprite.position.x = this.titleBorderMouseSprite.position.x = this.titleBorderSprite.position.x = w / 2
    this.titleSprite.position.y = this.titleBorderMouseSprite.position.y = this.titleBorderSprite.position.y = this.originalYpos + this.yPos
  }

  hide(id, isFast = false, direction = 'forward') {
    if(!this.isShown) return
    this.isShown = false
    this.titlesMouseBorder[id].hide(isFast, direction)
    this.titlesBorder[id].hide(isFast, direction)
    this.titles[id].hide(isFast, direction)
  }

  show(id, delay, time, direction = 'forward') {
    if(this.isShown) return
    this.isShown = true
    this.titlesMouseBorder[id].show(delay * .6, time, direction)
    this.titlesBorder[id].show(delay * .6, time, direction)
    this.titles[id].show(delay * .6, time, direction)
  }

  scaleTo(id, scale, delay, time, isPageTransition = false) {
    this.scale = scale
    for (let index = 0; index < this.titles.length; index++) {
      if(id === index) {
        this.titlesMouseBorder[id].scaleTo(scale, delay, time, isPageTransition)
        this.titlesBorder[id].scaleTo(scale, delay, time, isPageTransition)
        this.titles[id].scaleTo(scale, delay, time, isPageTransition)
      }else{
        this.titles[index].scaleTo(this.scale, 0, 0)
        this.titlesBorder[index].scaleTo(this.scale, 0, 0)
        this.titlesMouseBorder[index].scaleTo(this.scale, 0, 0)
      }
    }
  }

  goToYPos(yPos, time){
    this.yPos = yPos
    TweenMax.to([this.titleBorderMouseSprite.position, this.titleBorderSprite.position, this.titleSprite.position], time,{y: this.originalYpos + yPos, ease: Power2.easeInOut})
  }

}
export default Titles
