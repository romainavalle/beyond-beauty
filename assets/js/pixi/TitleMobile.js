import ResizeHelper from '../utils/ResizeHelper';
import { pages } from '~/assets/data.json'
import CustomEase from "gsap/CustomEase";

class TitleMobile {
  constructor(container, isBordered) {
    this.container = container
    this.isBordered = isBordered
    if(!this.isBordered)this.container.tint = 0xf1f3ee
  }

  setTexture(baseTexture) {
    this.title = new PIXI.Sprite(new PIXI.Texture.from(baseTexture))
    this.container.addChild(this.title)
    this.title.anchor.set(.5, .5)
    this.originalW = this.container.width
    this.originalH = this.container.height
    this.resize(this.w, this.h)
  }


  resize(w, h) {
    this.w = w
    this.h = h
    if(!this.title) return
    const ratio = this.originalW / this.originalH
    this.title.width = w / 2
    this.title.height = w / 2 / ratio
    this.container.position.x = w / 2
    this.container.position.y = h / 2 - this.title.height * .5
  }


}
export default TitleMobile
