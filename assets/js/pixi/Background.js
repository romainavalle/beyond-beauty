import { $colors } from '~/assets/variables.json';

class Background {
  constructor(container) {
    this.container = container
    this.init()
  }

  init() {
    this.background = new PIXI.Graphics();
    this.background.beginFill($colors['d-black']);
    this.background.drawRect(0, 0, 1000, 600);
    this.background.alpha = 0
    this.container.addChild(this.background)

  }

  resize(w, h) {
    this.background.width = w
    this.background.height = h
  }

  show(time = 1) {
    TweenMax.to(this.background, time, {alpha: 1, ease: Quad.easeInOut})
  }
  hide() {
    TweenMax.to(this.background, 1, {alpha: 0, ease: Quad.easeInOut})
  }
}
export default Background
