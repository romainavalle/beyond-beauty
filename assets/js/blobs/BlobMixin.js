import BlobPoint from '~/assets/js/canvasBlob/BlobPoint'
import MouseHelper from '~/assets/js/utils/MouseHelper'
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
class BlobMixin {
  constructor(w, h, shapeW, numPoints) {
    this.w = w
    this.h = h
    this.centerX = w / 2
    this.centerY = h / 2
    this.numPoints = numPoints
    this.radius = shapeW
    this.position = { x: this.centerX, y: this.centerY}
    this.canvasPos = { x: this.centerX, y: this.centerY}
    this.elasticity = .0005
    this.friction = .08
    this.time = 0
    this.hover = false
    this.oldMousePoint = {x:0, y :0}
    this.init()
    this.setBlob()
  }

  init(){
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.ctx = this.canvas.getContext('2d')
  }


  setBlob() {
    this.divisional = Math.PI * 2 / this.numPoints
    this.points = []
    for(let i = 0; i < this.numPoints; i++) {
      let point = new BlobPoint(this.divisional * i, this, i, this.elasticity, this.friction);
      this.points.push(point);
    }
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
        prevPoint = this.points[i-1] || this.points[this.numPoints - 1]
        nextPoint = this.points[i+1] || this.points[0]
        currentPoint = this.points[i]
        currentPoint.calcSpring(prevPoint, nextPoint)
      }
  }

  curveThrough() {
      var i, max = this.points.length, currentPoint, nextPoint, x, y;
      for (i = 0; i < max ; i++) {
        currentPoint = this.points[i % this.numPoints]
        nextPoint = this.points[(i+1) % this.numPoints]
        x = (currentPoint.position.x + nextPoint.position.x) * .5;
        y = (currentPoint.position.y + nextPoint.position.y) * .5;
        this.ctx.quadraticCurveTo(currentPoint.position.x, currentPoint.position.y, x, y);
      }
  }

  checkMouse(){
    const mouseX = MouseHelper.x
    const mouseY = MouseHelper.y
    let diff = { x: mouseX - this.canvasPos.x, y: mouseY - this.canvasPos.y };
    let dist = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
    let angle = null;
    if(dist < this.radius && this.hover === false) {
      let vector = { x: mouseX - this.canvasPos.x, y: mouseY - this.canvasPos.y };
      angle = Math.atan2(vector.y, vector.x);
      this.hover = true;
    } else if (dist > this.radius && this.hover === true){
      let vector = { x: mouseX - this.canvasPos.x, y: mouseY - this.canvasPos.y };
      angle = Math.atan2(vector.y, vector.x);
      this.hover = false;
    }

    if(typeof angle == 'number') {
      let nearestPoint = null;
      let distanceFromPoint = 10 ;
      this.points.forEach((point)=> {
        point.color = 'red'
        if(Math.abs(angle - point.angle) < distanceFromPoint) {
          nearestPoint = point;
          distanceFromPoint = Math.abs(angle - point.angle);
        }
      })
      if(nearestPoint) {
        let strengthVec = { x: this.oldMousePoint.x - mouseX, y: this.oldMousePoint.y - mouseY };
        let strength = Math.min(Math.sqrt((strengthVec.x * strengthVec.x) + (strengthVec.y * strengthVec.y)) / 20 , 4);
        //
        nearestPoint.color = 'blue'
        nearestPoint.acceleration = (strength * (this.hover ? -1 : 1));
        nearestPoint.render()
      }
    }

    this.oldMousePoint.x = mouseX;
    this.oldMousePoint.y = mouseY;
  }

  tick() {
    if(process.browser) this.checkMouse()
    this.ctx.clearRect(0, 0, this.w, this.h)
    this.time += 0.01
  }

  drawShape() {
    this.ctx.moveTo(this.points[0].position.x, this.points[0].position.y)
    this.prepareStroke()
    this.curveThrough()
  }
  resize(w,h, canvasPos) {
    this.w = w
    this.h = h
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.canvasPos = {...canvasPos}
  }

}

export default BlobMixin
