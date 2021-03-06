import NoisePosition from '~/assets/js/blobs/NoisePosition.js'

class BlobMixinNoise {
  constructor(w, h, shapeW = 0) {
    this.w = w
    this.h = h
    this.shapeW = shapeW
    this.totalPoints = 40
    this.centerX = h / 2
    this.centerY = h / 2
    this.centerOutsideX = h / 2
    this.centerOutsideY = h / 2
    this.rotation = 0
    this.scale = 0
    this.init()
  }

  init(){
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.ctx = this.canvas.getContext('2d')
  }


  tick() {
    this.noiseValues = NoisePosition.noiseValues
    this.ctx.clearRect(0, 0, this.w, this.h)
  }

  getNoiseValues(id) {
    this.noiseValues = [...NoisePosition.getValuesFrom(id)]
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

  resize(w,h, shapeW = 0) {
    this.w = w
    this.h = h
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.shapeW = shapeW
  }

}









export default BlobMixinNoise
