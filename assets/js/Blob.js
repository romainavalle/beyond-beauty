import BlobPoint from './BlobPoint'
import { TweenMax } from 'gsap'
class Blob {
  constructor(canvas, numPoints = 16) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d');
    this.color = 'red'
    this.numPoints = numPoints
    this.radius = 150
    this.position = { x: window.innerWidth / 2, y:  window.innerHeight / 2 }
    this.elasticity = .001
    this.friction = .0085
    this.time = 0
  }
  
  init() {
    
    const blob = window.gui.addFolder('Blob');
    const pointsController = blob.add(this, 'numPoints', 3, 30, 1)
    pointsController.onChange(this.setBlob.bind(this));
    
    const radiusController = blob.add(this, 'radius', 50, 300)
    const points = window.gui.addFolder('Points');
    const elasticityController = points.add(this, 'elasticity', 0.0001, 0.005)
    const frictionController = points.add(this, 'friction', 0.005, .01)
    elasticityController.onChange(this.onValueChange.bind(this));
    //frictionController.onChange(this.onValueChange.bind(this));
    this.setBlob()
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
      var i, max = this.points.length + 1, currentPoint, nextPoint, x, y;
      for (i = 0; i < max ; i++) {
        currentPoint = this.points[i % this.numPoints]
        nextPoint = this.points[(i+1) % this.numPoints]
        x = (currentPoint.position.x + nextPoint.position.x) * .5;
        y = (currentPoint.position.y + nextPoint.position.y) * .5;
        this.ctx.quadraticCurveTo(currentPoint.position.x, currentPoint.position.y, x, y);
        this.ctx.save();
        this.ctx.fillStyle = currentPoint.color
        this.ctx.fillRect(currentPoint.position.x-2.5, currentPoint.position.y-2.5, 5, 5);
        this.ctx.restore();
      }
  }
  
  render() {
    requestAnimationFrame(this.render.bind(this));
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].position.x, this.points[0].position.y)
    this.curveThrough();
    this.prepareStroke();
    this.ctx.fillStyle = 'white'
    this.ctx.fill();
    this.time += 0.01
    this.position.x = Math.cos(this.time) * 300 + this.canvas.width / 2
    this.position.y = Math.sin(this.time) * 300 + this.canvas.height / 2
    this.ctx.restore();
  }
  
}

export default Blob