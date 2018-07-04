
class TitleAbout {
  constructor(container, idNum, isBordered, pos) {
    this.x = pos.x
    this.y = pos.y
    this.container = container
    this.idNum = idNum
    this.isBordered = isBordered
  }

  setTexture(baseTexture, pos) {
    this.pos = pos
    let divider = 1
    if(process.browser) {
      if(window.resolution === .5) divider = 2
    }
    const texture = new PIXI.Texture.from(baseTexture)
    texture.frame = new PIXI.Rectangle(this.pos.x / divider, this.pos.y / divider, this.pos.w / divider, this.pos.h / divider)
    this.titleImg = new PIXI.Sprite(texture)
    this.posTitle = new PIXI.Sprite()
    this.posTitle.addChild(this.titleImg)
    this.container.addChild(this.posTitle)
  }

  resize(w, h) {
    this.w = w
    this.h = h
    this.screenRatioH = w / (2880)
    this.screenRatioV = h / (1760)
    this.titleImg.width = this.pos.w * this.screenRatioH * 2
    this.titleImg.height = this.pos.h * this.screenRatioH * 2
    this.posTitle.position.x = this.x * this.screenRatioH
    this.posTitle.position.y = this.y * this.screenRatioV
  }

  show(delay) {
    const from = this.idNum < 2 ? -100 * this.w / (2880) : 100 * this.w / (2880)
    TweenMax.fromTo(this.titleImg, 1, {alpha: 0}, {delay, alpha: 1, ease: Quart.easeOut})
    TweenMax.fromTo(this.titleImg.position, 1, {x: from * this.screenRatioH }, {delay, x: 0, ease: Quart.easeOut })
  }

  hide() {
    const from = this.idNum < 2 ? 100 * this.w / (2880) : -100 * this.w / (2880)
    TweenMax.to(this.titleImg, 1, { alpha: 1, ease: Power4.easeIn})
    TweenMax.to(this.titleImg.position, 1, {x: this.x * this.screenRatioH, ease: Power4.easeIn })
  }
}
export default TitleAbout
