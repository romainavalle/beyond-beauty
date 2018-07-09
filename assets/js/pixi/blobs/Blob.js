import BlobPoint from '~/assets/js/pixi/blobs/BlobPoint'
import MouseHelper from '~/assets/js/utils/MouseHelper'
class Blob {
  constructor(index) {
    this.blobGraph = new PIXI.Sprite();
    this.blobHead = new PIXI.Graphics();
    this.blobBottom = new PIXI.Graphics();
    this.blobHeadDisplace = new PIXI.Graphics();
    this.blobGraph.addChild(this.blobHead);
    this.blobGraph.addChild(this.blobHeadDisplace);
    this.blobGraph.addChild(this.blobBottom);
    this.distanceRatio = 0
    this.index = index
    this.color = 'red'
    this.numPoints = 4 + Math.floor(Math.random() * 5)
    this.originalRadius = this.radius = 70 + Math.floor(Math.random() * 100)
    this.position = { x: 0, y: 0 }
    this.elasticity = .001
    this.friction = .08
    this.rotation = 45
    this.hover = false
    this.oldMousePoint = { x: 0, y: 0 }
    this.tickInt = 0
    this.blobGraph.rotation = this.rotation * Math.PI / 180
  }

  resize(w, h){
    this.w = w
    this.h = h
    if(this.angle) this.setPos()
  }
  setPos() {
    this.startX =   Math.cos(this.angle) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
    this.startY =  Math.sin(this.angle) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
    this.endX =  Math.cos(this.angleEnd) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
    this.endY = Math.sin(this.angleEnd) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
  }
  setBlob(setDelay = false) {
    TweenMax.killTweensOf(this)
    this.numPoints = 5 + Math.floor(Math.random() * 7)
    this.radius = 20 + this.numPoints * 10
    this.divisional = Math.PI * 2 / this.numPoints
    this.points = []
    for (let i = 0; i < this.numPoints; i++) {
      let point = new BlobPoint(this.divisional * i, this, i, this.elasticity, this.friction);
      this.points.push(point);
    }
    const random = Math.random()
    this.angle = random * Math.PI / 4 + Math.PI / 2 + Math.PI / 4
    this.angleEnd = (1 - random) * Math.PI / 4 - Math.PI / 2 + Math.PI / 4
    this.setPos()
    this.prepareStroke();
    this.blobBottom.clear()
    this.blobBottom.moveTo(0, 0)
    this.blobBottom.scale.x = .8
    this.blobBottom.scale.y = .75
    this.blobBottom.position.y = this.radius * .4
    this.blobBottom.position.x = 0
    this.blobBottom.beginFill(0xccffff)
    this.blobBottom.drawCircle(0, 0, this.radius)
    this.blobBottom.endFill();
    this.blobBottom.rotation = Math.random() * Math.PI



    this.blobHead.clear()
    this.blobHead.moveTo(0, 0)
    this.blobHead.beginFill(0xcc0000)
    this.blobHead.drawCircle(0, 0, this.radius)
    this.blobHead.endFill();

    this.blobHeadDisplace.clear()
    this.blobHeadDisplace.moveTo(0, 0)
    this.blobHeadDisplace.scale.x = 1
    this.blobHeadDisplace.scale.y = 1.05
    this.blobHeadDisplace.position.y = this.radius * .1
    this.blobHeadDisplace.beginFill(0xccffcc)
    this.blobHeadDisplace.drawCircle(0, 0, this.radius)
    this.blobHeadDisplace.endFill();
    this.blobHeadDisplace.rotation = Math.random() * Math.PI

    const time = (this.radius * (.3 + Math.random() * .6)) / 6
    const delay =  setDelay ? this.index : 0
    this.ratio = 0
    TweenMax.to(this, time, {delay, ratio: 1, onComplete: this.setBlob.bind(this), overwrite: 1, ease: Linear.easeInOut, onUpdate: this.checkBlobPos.bind(this) })
  }

  checkBlobPos() {
    if(this.position.x > this.w + this.radius + 50 || this.position.y < -(this.radius + 50) )this.setBlob()
  }

  onValueChange() {
    for (let i = 0; i < this.numPoints; i++) {
      this.points[i].friction = this.friction
      this.points[i].elasticity = this.elasticity
    }
  }

  prepareStroke() {
    var i, n, prevPoint, currentPoint, nextPoint, x, y;
    for (i = 0; i < this.numPoints; i++) {
      prevPoint = this.points[i - 1] || this.points[this.numPoints - 1]
      nextPoint = this.points[i + 1] || this.points[0]
      currentPoint = this.points[i]
      currentPoint.calcSpring(prevPoint, nextPoint)
    }
  }

  curveThrough(shape) {
    var i, max = this.points.length + 1, currentPoint, nextPoint, x, y;
    for (i = 0; i < max; i++) {
      currentPoint = this.points[i % this.numPoints]
      nextPoint = this.points[(i + 1) % this.numPoints]
      x = (currentPoint.position.x + nextPoint.position.x) * .5;
      y = (currentPoint.position.y + nextPoint.position.y) * .5;
      shape.quadraticCurveTo(currentPoint.position.x, currentPoint.position.y, x, y);
    }
  }
  lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  }


  kill() {

  }
  tick(scale, alpha) {
    this.blobGraph.alpha = alpha
    this.blobGraph.position.x = this.lerp((this.w * .5) + this.startX, (this.w * .5) + this.endX, this.ratio)
    this.blobGraph.position.y = this.lerp((this.h * .5) + this.startY, (this.h * .5) + this.endY, this.ratio)

    this.blobBottom.rotation += this.ratio * Math.PI / 180 * 3
    this.blobHeadDisplace.rotation += (this.ratio) * Math.PI / 180 * 3
    this.blobGraph.scale.x = scale * .9
    this.blobGraph.scale.y = scale


  }

}

export default Blob
