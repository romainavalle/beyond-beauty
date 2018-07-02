import NoisePosition from '~/assets/js/blobs/NoisePosition.js'

class BlobTest {
  constructor(ctx, index) {
    this.index = index
    this.ctx = ctx
    this.position = {x:0, y:0}
    this.numPoints = 40
    this.rotation = 45
  }
  setBlob() {
    this.numPoints = 40
    this.radius = 50 + Math.round(Math.random() * 100)

    const cosAngle = Math.random() * Math.PI / 2 + Math.PI / 4
    const sinAngle = Math.random() * Math.PI / 2 + Math.PI / 4
    this.position.x = Math.cos(cosAngle) * (this.w) -  this.w / 2
    this.position.y = Math.sin(sinAngle) * (this.h ) + this.h  / 2
    const x = this.position.x + this.w * Math.cos(Math.PI / 4) + this.w
    const y = this.position.y - this.h * Math.sin(Math.PI / 4) - this.h
    const time = this.radius / 3
    if (!this.firstTime) {
      TweenMax.to(this.position, time, { x, y, onComplete: this.setBlob.bind(this) }).progress(this.index / 10)
      this.firstTime = true
    } else {
      TweenMax.to(this.position, time, { x, y, onComplete: this.setBlob.bind(this) })
    }
  }

  render(scale, alpha) {

    this.getNoiseValues(this.index * 3)
    //this.noiseValues = NoisePosition.noiseValues
    //this.ctx.clearRect(0, 0, this.w, this.h)
    this.ctx.save()

    this.ctx.translate(this.position.x, this.position.y)
    this.ctx.rotate(this.rotation * Math.PI / 180)
    this.ctx.scale(scale * .8,scale)
    this.ctx.translate(-this.position.x, -this.position.y)
    this.ctx.beginPath()
    this.drawShape()
    this.ctx.stokeStyle = 'white'
    this.ctx.fillStyle = 'white'
    this.ctx.globalAlpha = alpha
    this.ctx.fill()
    this.ctx.restore()

  }

  getNoiseValues(id) {
    this.noiseValues = [...NoisePosition.getValuesFrom(id)]
  }

  drawShape() {
    let points = []
    let x = 0, y = 0, angle = 0
    const slice = Math.PI * 2 / this.numPoints
    for(let i = 0; i < this.numPoints; i++) {
      x = Math.cos(angle)
      y = Math.sin(angle)
      x = this.position.x + (this.radius + this.noiseValues[i].x * (this.radius / 30)) * x
      y = this.position.y + (this.radius + this.noiseValues[i].y * (this.radius / 30)) * y
      points.push({ x, y })
      angle += slice
    }
    this.ctx.moveTo(points[0].x, points[0].y)
    this.curveThrough(points)
  }

  curveThrough(points) {
    var i, n, a, b, x, y
    for (i = 1, n = points.length - 1; i < n; i++) {
        a = points[i]
        b = points[i + 1] || points[0]
        x = (a.x + b.x) * 0.5
        y = (a.y + b.y) * 0.5
        this.ctx.quadraticCurveTo(a.x, a.y, x, y)
    }
    a = points[i]
    b = points[i + 1] || points[0]
    this.ctx.quadraticCurveTo(a.x, a.y, b.x, b.y)
  }
  resize(w, h){
    this.w = w
    this.h = h
  }


}









export default BlobTest
