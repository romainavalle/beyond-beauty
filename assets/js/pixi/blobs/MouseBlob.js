import MouseHelper from '~/assets/js/utils/MouseHelper'
class MouseBlob{
  constructor(shapeW = 200) {
    this.scale = 0
    this.rotation = 0
    this.color = 'white'
    this.shapeW = shapeW
    this.ticker = 0
    this.init()
  }
  init() {
    this.sprite = new PIXI.Sprite()
    this.graphs = [
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
    ]
    this.graphs.forEach((element, i) => {
    this.sprite.addChild(element.graph)
    })
  }
  show() {
    this.rotation = 0
    TweenMax.to(this, 1, {rotation: '+=30', scale: 1, ease: Power4.easeOut})
  }
  hide() {
    TweenMax.to(this, .5, {rotation: '+=30', scale: 0, ease: Power4.easeOut})
  }
  drawShape() {
    this.graphs.forEach((element, i) => {
      element.graph.clear()
      element.graph.beginFill(0xffffff )
      element.graph.drawCircle(0, 0, this.shapeW)
      element.direction = 1 - Math.random() * 2
      element.posX = (Math.cos(i / 8 * Math.PI * 2) * this.shapeW * .15)
      element.posY = (Math.sin(i / 8 * Math.PI * 2) * this.shapeW * .15)
      element.rotation = Math.random() * 360 * Math.PI * 2
      element.graph.endFill();
    });
  }

  resize(w, h, shapeW = 0) {
    this.shapeW = shapeW
    this.drawShape()
  }

  tick(color = 0xFFFFFF) {
    this.ticker += .008
    this.sprite.position.x = MouseHelper.easeSlowX
    this.sprite.position.y = MouseHelper.easeSlowY
    for (let index = 0; index < this.graphs.length; index++) {
      const element = this.graphs[index];
      element.graph.position.x = element.posX  + (Math.cos(this.ticker * (index + 1) / 8 * Math.PI * 2) * this.shapeW * .05) * element.direction
      element.graph.position.y = element.posY + (Math.sin(this.ticker * (index + 1) / 8 * Math.PI * 2) * this.shapeW * .05) * element.direction
      element.graph.scale.x = .95 + Math.cos(this.ticker * (index + 1) / 10 * Math.PI * 2) * .09
      element.graph.scale.y = .9 + Math.sin(this.ticker * (index + 1) / 10 * Math.PI * 2) * .09
      element.graph.rotation = element.rotation + element.direction * this.ticker / 360
    }
    this.sprite.rotation = this.rotation * Math.PI / 180
    this.sprite.scale.x = this.scale
    this.sprite.scale.y = this.scale
  }
}









export default MouseBlob
