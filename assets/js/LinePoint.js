export default class LinePoint {
  constructor(dist, parent) {
    this.parent = parent;
    this.dist =  dist
    this.elasticity = .001
    this.velocity = 0
    this.spring = 0
    this.friction = .0085
    this.color = 'black'
    this.point = { 
      x: 1,
      y: 0
    }
    this.acceleration = 0
    this.acceleration = -5 + Math.random() * 10;
    this.render()
  }
  
  solveWith(leftPoint, rightPoint) {
    this.acceleration = ((this.spring * -5) + ( leftPoint.spring - this.spring ) + ( rightPoint.spring - this.spring )) * this.elasticity - this.velocity * this.friction
  }

  render () {
    this.velocity += this.acceleration;
    this.spring += this.velocity * 2;

    this.position = {
      x: this.parent.position.x + this.point.x * (this.dist), 
      y: this.parent.position.y + this.spring
    }
  }

}
