import NoisePosition from '~/assets/js/blobs/NoisePosition.js'
import MouseHelper from '~/assets/js/utils/MouseHelper'
class MouseBlob{
  constructor(shapeW = 200) {
    this.scale = 0
    this.rotation = 0
    this.color = 'white'
    this.totalPoints = 40
    this.shapeW = shapeW
    this.tickInt = 0
    this.init()
  }
  init() {
    this.sprite = new PIXI.Sprite()
    this.graph = new PIXI.Graphics()
    this.sprite.addChild(this.graph)
    this.noiseValues = NoisePosition.noiseValues
  }
  show() {
    this.rotation = 0
    TweenMax.to(this, 1, {rotation: '+=30', scale: 1, ease: Power4.easeOut})
  }
  hide() {
    TweenMax.to(this, .5, {rotation: '+=30', scale: 0, ease: Power4.easeOut})
  }
  drawShape(radius, centerX, centerY) {
    let points = []
    let x = 0, y = 0, angle = 0
    const slice = Math.PI * 2 / this.totalPoints
    for(let i = 0; i < this.totalPoints; i++) {
      x = Math.cos(angle)
      y = Math.sin(angle)
      x = centerX + (radius + this.noiseValues[i].x * (radius / 50)) * x
      y = centerY + (radius + this.noiseValues[i].y * (radius / 50)) * y
      points.push({ x, y })
      angle += slice
    }
    this.graph.moveTo(points[0].x, points[0].y)
    this.curveThrough(points)
  }

  curveThrough(points) {
    var i, n, a, b, x, y
    for (i = 0, n = points.length - 1; i < n; i++) {
        a = points[i]
        b = points[i + 1] || points[0]
        x = (a.x + b.x) * 0.5
        y = (a.y + b.y) * 0.5
        this.graph.quadraticCurveTo(a.x, a.y, x, y)
    }
    a = points[i]
    b = points[i + 1] || points[0]
    this.graph.quadraticCurveTo(a.x, a.y, b.x, b.y)
  }
  resize(w, h, shapeW = 0) {
    this.shapeW = shapeW
  }

  tick(color = 0xFFFFFF) {
    this.tickInt++
    if(this.tickInt !== 2)return
    this.tickInt = 0
    this.noiseValues = NoisePosition.noiseValues


    this.sprite.position.x = MouseHelper.easeSlowX
    this.sprite.position.y = MouseHelper.easeSlowY
    this.graph.clear()
    this.graph.beginFill(color)
    this.drawShape(this.shapeW, 0, 0)
    this.graph.endFill();
    this.graph.rotation = this.rotation * Math.PI / 180
    this.graph.scale.x = this.scale
    this.graph.scale.y = this.scale
  }
}









export default MouseBlob
