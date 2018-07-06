import BlobPoint from '~/assets/js/pixi/blobs/BlobPoint'
import MouseHelper from '~/assets/js/utils/MouseHelper'
class Blob {
  constructor(index, debug = false) {
    this.blobGraph = new PIXI.Graphics({nativeLines: true});
    this.blobGraph.name = "blob"
    this.index = index
    this.debug = debug
    this.color = 'red'
    this.numPoints = 4 + Math.floor(Math.random() * 5)
    this.originalRadius = this.radius = 70 + Math.floor(Math.random() * 100)
    this.position = { x: 0, y: 0 }
    this.elasticity = .001
    this.friction = .08
    this.rotation = 45
    this.hover = false
    this.oldMousePoint = { x: 0, y: 0 }
  }

  resize(w, h){
    this.w = w
    this.h = h
  }

  setBlob(setDelay = false) {
    TweenMax.killTweensOf(this)
    this.blobGraph.clear()
    this.numPoints = 5 + Math.floor(Math.random() * 4)
    this.radius = 20 + this.numPoints * 15
    this.divisional = Math.PI * 2 / this.numPoints
    this.points = []
    for (let i = 0; i < this.numPoints; i++) {
      let point = new BlobPoint(this.divisional * i, this, i, this.elasticity, this.friction);
      this.points.push(point);
    }
    const random = Math.random()
    const angle = random * Math.PI / 4 + Math.PI / 2 + Math.PI / 4
    const angleEnd = (1 - random) * Math.PI / 4 - Math.PI / 2 + Math.PI / 4

    this.position.x = this.w * .5 + Math.cos(angle) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
    this.position.y = this.h * .5 + Math.sin(angle) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
    const x = this.w * .5 + Math.cos(angleEnd) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
    const y = this.h * .5 + Math.sin(angleEnd) * ((Math.min(this.h, this.w)) + (this.radius * 1.2))
    const time = this.radius / 5
    const delay =  setDelay ? this.index : 0
    TweenMax.to(this.position, time, {delay, x, y, onComplete: this.setBlob.bind(this), overwrite: 1, onUpdate: this.checkBlobPos.bind(this) })
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

  curveThrough() {
    var i, max = this.points.length + 1, currentPoint, nextPoint, x, y;
    for (i = 0; i < max; i++) {
      currentPoint = this.points[i % this.numPoints]
      nextPoint = this.points[(i + 1) % this.numPoints]
      x = (currentPoint.position.x + nextPoint.position.x) * .5;
      y = (currentPoint.position.y + nextPoint.position.y) * .5;
      this.blobGraph.quadraticCurveTo(currentPoint.position.x, currentPoint.position.y, x, y);

    }
  }

  checkMouse() {
    const mouseX = MouseHelper.x
    const mouseY = MouseHelper.y
    let diff = { x: mouseX - this.position.x, y: mouseY - this.position.y };
    let dist = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
    let angle = null;
    if (dist < this.radius && this.hover === false) {
      let vector = { x: mouseX - this.position.x, y: mouseY - this.position.y };
      angle = Math.atan2(vector.y, vector.x);
      this.hover = true;
    } else if (dist > this.radius && this.hover === true) {
      let vector = { x: mouseX - this.position.x, y: mouseY - this.position.y };
      angle = Math.atan2(vector.y, vector.x);
      this.hover = false;
    }

    if (typeof angle == 'number') {
      let nearestPoint = null;
      let distanceFromPoint = 10;
      this.points.forEach((point) => {
        point.color = 'red'
        if (Math.abs(angle - point.angle) < distanceFromPoint) {
          nearestPoint = point;
          distanceFromPoint = Math.abs(angle - point.angle);
        }
      })
      if (nearestPoint) {
        let strengthVec = { x: this.oldMousePoint.x - mouseX, y: this.oldMousePoint.y - mouseY };
        let strength = Math.min(Math.sqrt((strengthVec.x * strengthVec.x) + (strengthVec.y * strengthVec.y)) / 20, 5);
        //
        nearestPoint.color = 'blue'
        nearestPoint.acceleration = (strength * (this.hover ? -1 : 1));
        nearestPoint.tick()
      }
    }

    this.oldMousePoint.x = mouseX;
    this.oldMousePoint.y = mouseY;
  }
  kill() {

  }
  tick(scale, alpha) {
    this.blobGraph.alpha = alpha
    if (alpha === 0) return
    if (process.browser) this.checkMouse()
    this.blobGraph.clear()
    this.blobGraph.position.x = this.position.x
    this.blobGraph.position.y = this.position.y
    this.blobGraph.moveTo(0, 0)

    this.blobGraph.beginFill(0xFFFFFF)
    this.curveThrough();
    this.prepareStroke();
    this.blobGraph.endFill();
    this.blobGraph.rotation = this.rotation * Math.PI / 180
    this.blobGraph.scale.x = scale * .9
    this.blobGraph.scale.y = scale


  }

}

export default Blob
