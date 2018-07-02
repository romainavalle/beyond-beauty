import ResizeHelper from '../utils/ResizeHelper';
import { pages } from '~/assets/data.json'
import CustomEase from "gsap/CustomEase";

class Title {
  constructor(container, id, idNum, isBordered) {
    this.container = container
    this.id = id
    this.idNum = idNum
    this.isBordered = isBordered
    this.scale = 1
    this.angle = Math.PI / 35
    this.title_array = []
    this.size_array = []
    if(!this.isBordered)this.container.tint = 0xf1f3ee
  }

  load(getter) {
    this.loaded = 0
    this.img_array = []
    const border = this.isBordered ? '-border' : ''
    for (let index = 0; index < 3; index++) {
      const img = new Image()
      img.src = getter(`titles${border}/${this.id}-${index}.png`)
      img.onload = this.dispose.bind(this);
      this.img_array.push(img)
    }
  }

  setTexture(baseTexture, array) {
    console.log("ee")
    array.forEach((el, i) => {
      console.log(el)
      const texture = new PIXI.Texture.from(baseTexture)
      texture.frame = new PIXI.Rectangle(el.x, el.y, el.w, el.h)
      const resizeSprite = new PIXI.Sprite(texture)
      const scaleContainer = new PIXI.Sprite()
      const imgContainer = new PIXI.Sprite()
      const title = new PIXI.Sprite()
      imgContainer.addChild(resizeSprite)
      scaleContainer.addChild(imgContainer)
      title.addChild(scaleContainer)
      imgContainer.position.y = 5000 + pages[this.idNum].titlePosition[i] * (ResizeHelper.height() / 1440)
      resizeSprite.anchor.x = .5
      resizeSprite.anchor.y = .5
      resizeSprite.pivot.x = .5
      resizeSprite.pivot.y = .5
      imgContainer.anchor.x = .5
      imgContainer.anchor.y = .5
      imgContainer.pivot.x = .5
      imgContainer.pivot.y = .5
      scaleContainer.anchor.x = .5
      scaleContainer.anchor.y = .5
      scaleContainer.pivot.x = .5
      scaleContainer.pivot.y = .5
      title.anchor.x = .5
      title.anchor.y = .5
      title.pivot.x = .5
      title.pivot.y = .5
      title.interactive = false
      title.position.y = -5100

      this.container.addChild(title)
      this.title_array.push(title)
      this.size_array.push({w: el.w, h: el.h})
    })
    this.originalW = this.container.width
    this.originalH = this.container.height
    this.isDisposed = true

    if (this.isFirstResize) setTimeout(() => this.resize(ResizeHelper.width(), ResizeHelper.height()), 1)
  }

  dispose() {
    this.loaded++
    if (this.loaded != 3) return
    for (let index = 0; index < 3; index++) {

      PIXI.Texture.addToCache(this.img_array[index])
      const resizeSprite = new PIXI.Sprite.from(this.img_array[index])
      const scaleContainer = new PIXI.Sprite()
      const imgContainer = new PIXI.Sprite()
      const title = new PIXI.Sprite()
      imgContainer.addChild(resizeSprite)
      scaleContainer.addChild(imgContainer)
      title.addChild(scaleContainer)
      imgContainer.position.y = 5000 + pages[this.idNum].titlePosition[index] * (ResizeHelper.height() / 1440)
      resizeSprite.anchor.x = .5
      resizeSprite.anchor.y = .5
      resizeSprite.pivot.x = .5
      resizeSprite.pivot.y = .5
      imgContainer.anchor.x = .5
      imgContainer.anchor.y = .5
      imgContainer.pivot.x = .5
      imgContainer.pivot.y = .5
      scaleContainer.anchor.x = .5
      scaleContainer.anchor.y = .5
      scaleContainer.pivot.x = .5
      scaleContainer.pivot.y = .5
      title.anchor.x = .5
      title.anchor.y = .5
      title.pivot.x = .5
      title.pivot.y = .5
      title.interactive = false
      title.position.y = -5100

      this.container.addChild(title)
      this.title_array.push(title)
      this.size_array.push({w: resizeSprite.width, h: resizeSprite.height})
    }
    this.originalW = this.container.width
    this.originalH = this.container.height
    this.isDisposed = true

    if (this.isFirstResize) setTimeout(() => this.resize(ResizeHelper.width(), ResizeHelper.height()), 1)
  }
  getLineHeightArray () {
    let lhArray = []
    if(this.scale === 1){
      lhArray = pages[this.idNum].titlePosition
    }else if(this.scale === .65){
      lhArray = pages[this.idNum].titlePositionMid
    }else{
      lhArray = pages[this.idNum].titlePositionSml
    }
    return lhArray
  }
  resize(w, h) {

    this.isFirstResize = true
    if (!this.isDisposed) return
    const ratio = this.originalW / this.originalH
    let containerW, containerH, screenRatio
    if (w / h > ratio) {
      screenRatio = w / (2880 / 2)
    } else {
      screenRatio = h / (1760 / 2)
    }
    this.screenRatio = screenRatio
    const lhArray = this.getLineHeightArray()
    this.size_array.forEach((el, i) => {
      const title = this.title_array[i]
      const resizeSprite = this.title_array[i].children[0].children[0].children[0]
      const imgContainer = this.title_array[i].children[0].children[0]
      imgContainer.position.y = 5000 + lhArray[i] * screenRatio
      resizeSprite.width = el.w * screenRatio
      resizeSprite.height = el.h * screenRatio
      title.position.y = -5000 - 100 * screenRatio
    })
    this.container.position.y = - (this.originalH - 5000) * .5 + (this.size_array[0].h * screenRatio / 2) * .5
  }
  reset() {
    this.container.visible = false
  }
  show(delay = 0, time, direction = 'forward') {
    if(direction !== 'none'){

      const dir = direction === "forward" ? 1  : -1
      this.title_array.forEach(title => {
        TweenMax.set(title, { rotation: dir * this.angle, alpha: 0 })
      });
      this.container.visible = true
      TweenMax.staggerTo(this.title_array, time, { delay, rotation: 0, alpha: 1, ease: Quart.easeOut }, .1)
    }
  }
  hide(isFast, direction = 'forward') {
    const time = isFast ? 0 : .7
    const stagger = isFast ? 0 : .1
    const dir = direction === "forward" ? 1  : -1
    TweenMax.staggerTo(this.title_array, time, { rotation: -dir * this.angle, alpha: 0, ease: Cubic.easeIn }, stagger, this.reset.bind(this))
  }
  scaleTo(scale, delay, time, isPageTransition) {
    this.scale = scale
    let t = 0
    let d = delay
    const stagger = isPageTransition ? .3 : .1
    const ease = isPageTransition ? CustomEase.create("custom", "M0,0,C0.254,0.12,0.312,2.108,0.574,2.108,0.854,2.108,0.832,0.986,1,1") : Power4.easeInOut
    this.title_array.forEach((el, i) => {
      if(time != 0)t = time - (i * stagger)
      //if(isPageTransition)t = time
      if(time != 0)d= delay + (i * stagger)
      TweenMax.to(el.children[0].children[0].scale, t, { x: scale, y: scale, delay: d, ease})

      const lhArray = this.getLineHeightArray()
      TweenMax.to(el.children[0].children[0].position, t, { y: 5000 + lhArray[i] * this.screenRatio, delay: d, ease})
    })
  }

  pageTransition(){

  }
}
export default Title
