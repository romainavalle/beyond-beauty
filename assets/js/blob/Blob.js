import BlobPoint from '~/assets/js/blob/BlobPoint'
import MouseHelper from '~/assets/js/utils/MouseHelper'
import { TweenMax } from 'gsap'
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
class Blob {
  constructor(ctx, debug = false) {
    this.ctx = ctx
    this.debug = debug
    this.color = 'red'
    this.numPoints = 4 + Math.floor(Math.random() * 5)
    this.radius = 70 + Math.floor(Math.random() * 100)
    this.position = { x: window.innerWidth / 2, y:  window.innerHeight / 2 }
    this.elasticity = .001
    this.friction = .0085
    this.time = 0
    this.hover = false
    this.oldMousePoint = {x:0, y :0}
    this.init()
    this.setBlob()
  }

  init() {
    if(this.debug){
      /*const blob = window.gui.addFolder('Blob');
      const pointsController = blob.add(this, 'numPoints', 3, 30, 1)
      pointsController.onChange(this.setBlob.bind(this));

      const radiusController = blob.add(this, 'radius', 50, 300)
      const points = window.gui.addFolder('Points');
      const elasticityController = points.add(this, 'elasticity', 0.0001, 0.005)
      const frictionController = points.add(this, 'friction', 0.005, .01)
      elasticityController.onChange(this.onValueChange.bind(this));*/
    }
    //frictionController.onChange(this.onValueChange.bind(this));
  }
  setBlob() {
    this.numPoints = 4 + Math.floor(Math.random() * 5)
    this.radius = 30 + this.numPoints * 15
    this.divisional = Math.PI * 2 / this.numPoints
    this.points = []
    for(let i = 0; i < this.numPoints; i++) {
      let point = new BlobPoint(this.divisional * i, this, i, this.elasticity, this.friction);
      this.points.push(point);
    }
    const cosAngle = Math.random() * Math.PI / 3
    const sinAngle = Math.random() * Math.PI / 3
    this.position.x = Math.cos(cosAngle + Math.PI / 4 + Math.PI / 6) * (ResizeHelper.width() ) - ResizeHelper.width() / 2
    this.position.y =  Math.sin(sinAngle + Math.PI / 4 + Math.PI / 6) * (ResizeHelper.height() ) + ResizeHelper.height() / 2
    const x =  this.position.x + ResizeHelper.width() * Math.cos(Math.PI / 4) + ResizeHelper.width()
    const y = this.position.y - ResizeHelper.height() * Math.sin(Math.PI / 4) - ResizeHelper.height()
    const time = this.radius / 5
    if(!this.firstTime){
      TweenMax.to(this.position, time,{x,y, onComplete:this.setBlob.bind(this)}).progress(Math.random())
      this.firstTime = true
    }else{
      TweenMax.to(this.position, time,{x,y, onComplete:this.setBlob.bind(this)})
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
      var i, max = this.points.length + 1, currentPoint, nextPoint, x, y;
      for (i = 0; i < max ; i++) {
        currentPoint = this.points[i % this.numPoints]
        nextPoint = this.points[(i+1) % this.numPoints]
        x = (currentPoint.position.x + nextPoint.position.x) * .5;
        y = (currentPoint.position.y + nextPoint.position.y) * .5;
        this.ctx.quadraticCurveTo(currentPoint.position.x, currentPoint.position.y, x, y);
        if(this.debug){
          this.ctx.fillStyle = currentPoint.color
          this.ctx.fillRect(currentPoint.position.x-2.5, currentPoint.position.y-2.5, 5, 5);
        }
      }
  }

  checkMouse(){
    const mouseX = MouseHelper.x
    const mouseY = MouseHelper.y
    let diff = { x: mouseX - this.position.x, y: mouseY - this.position.y };
    let dist = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
    let angle = null;
    if(dist < this.radius && this.hover === false) {
      let vector = { x: mouseX - this.position.x, y: mouseY - this.position.y };
      angle = Math.atan2(vector.y, vector.x);
      this.hover = true;
    } else if (dist > this.radius && this.hover === true){
      let vector = { x: mouseX- this.position.x, y: mouseY - this.position.y };
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
        let strength = Math.min(Math.sqrt((strengthVec.x * strengthVec.x) + (strengthVec.y * strengthVec.y)) / 20 , 50);
        //
        nearestPoint.color = 'blue'
        nearestPoint.acceleration = (strength * (this.hover ? -1 : 1));
        nearestPoint.render()
      }
    }

    this.oldMousePoint.x = mouseX;
    this.oldMousePoint.y = mouseY;
  }
  kill(){

  }
  render() {
    if(process.browser) this.checkMouse()

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].position.x, this.points[0].position.y)
    this.curveThrough();
    this.prepareStroke();
    this.ctx.stokeStyle = 'white'
    this.ctx.fillStyle = 'white'
    this.ctx.fill();
    this.time += 0.01
    this.ctx.restore();
  }

}

export default Blob
