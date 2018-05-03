import LinePoint from './LinePoint'
class Line {
  constructor(canvas, numPoints = 12) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d');
    this.color = 'red'
    this.numPoints = numPoints
    this.divisional = 1000 / this.numPoints
    this.position = { x: 0, y: 0 }
    this.position = { x: window.innerWidth / 2, y:  window.innerHeight / 2 }
    
    this.time = 0
    this.points = [];
  }
  
  init() {
    for(let i = 0; i < this.numPoints; i++) {
      let point = new LinePoint(this.divisional * i, this);
      this.points.push(point);
    }
  }

  renderPoints(){
    this.ctx.beginPath();
    // this.ctx.moveTo( this.points[0].position.x, this.points[0].position.y );
    for(let i = 0; i < this.numPoints; i++) {
      let currentPoint = this.points[i]
      let lastPoint = this.points[i-1] || this.points[this.numPoints - 1]
      let nextPoint = this.points[i+1] || this.points[0]
      currentPoint.solveWith(lastPoint, nextPoint);
      currentPoint.render()

      // var xc = (currentPoint.position.x + nextPoint.position.x) / 2;
      // var yc = (currentPoint.position.y + nextPoint.position.y) / 2;
      // this.ctx.quadraticCurveTo(currentPoint.position.x, currentPoint.position.y, xc, yc);

      this.ctx.lineTo(currentPoint.position.x, currentPoint.position.y)
      this.ctx.fillStyle = currentPoint.color;
      if (i === 0)this.ctx.fillStyle = 'red'
      if (i === this.numPoints - 1)this.ctx.fillStyle = 'green'
      this.ctx.fillRect(currentPoint.position.x-2.5, currentPoint.position.y-2.5, 5, 5);
    }

    this.ctx.fillStyle = this.color;
    //this.ctx.closePath();
    this.ctx.stroke();
  }
  
  render() {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    
    this.renderPoints()
    this.time+=0.01
    // this.position.x = Math.cos(this.time) * 300 + this.canvas.width / 2
    // this.position.y = Math.sin(this.time) * 300 + this.canvas.height / 2
    // setTimeout(this.render.bind(this), 500)
    requestAnimationFrame(this.render.bind(this));
  }
  
}

export default Line