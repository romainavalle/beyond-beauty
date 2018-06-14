// import DisplacementPoint from './DisplacementPoint'
//import PerlinNoise from '~/assets/js/PerlinNoise'
class Displacement {
  constructor(debug = false) {
    this.debug = debug
    this.color = 'black'
    this.width = 500
    this.height = 500
    this.time = 0
    this.amplitude = 80
    this.speed = .11
    this.scale = 1.8
    this.points = []
    this.init()
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    if(this.debug){
      document.body.appendChild(this.canvas)
      this.canvas.style.position = 'absolute'
      this.canvas.style.bottom = '0px'
      this.canvas.style.left = '0px'
    }
    this.canvas.height = this.height
    this.canvas.width = this.width
    this.img =  new Image()
    this.img.src = require('~/assets/images/t9.png')
    // this.setDisplacement()
    if(this.debug){
      window.gui.add(this, 'speed', 0.01, .2)
      window.gui.add(this, 'amplitude', 10, 100)
    }
  }
  /*setDisplacement() {
    for(let i = 0; i < this.width * this.height; i++) {
      let point = new DisplacementPoint(i, i % this.width, Math.floor(i / this.width));
      this.points.push(point);
    }
  }*/

  fill() {
    this.ctx.drawImage(this.img, -this.amplitude + Math.sin(this.time * this.speed)  * this.amplitude, -this.amplitude + Math.cos(this.time * this.speed)  * this.amplitude);
      /*var i, n, prevPoint, currentPoint, nextPoint, x, y;
      for (i = 0; i < this.width * this.height; i++) {
        currentPoint = this.points[i]
        this.ctx.fillStyle = this.color
        let noise = PerlinNoise.noise((i % this.width) / (10 * this.scale) + this.time, Math.floor(i / this.width) / (10 * this.scale) + this.time, 0.3)
        this.ctx.fillStyle = "rgba(" + Math.floor(noise*255) + "," + Math.floor(noise*255) + "," + Math.floor(noise*255) + "," + 1 + ")";
        this.ctx.fillRect(currentPoint.x, currentPoint.y, 1, 1);
      }*/

  }

  tick() {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.save();
    this.fill();
    this.time += this.speed
    this.ctx.restore();
  }

}

export default Displacement
