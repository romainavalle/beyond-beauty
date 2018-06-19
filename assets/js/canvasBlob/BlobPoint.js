export default class BlobPoint {
    constructor(angle, parent, id, elasticity, friction) {
      this.id = id
      this.parent = parent;
      this.angle = Math.PI -  angle
      this.elasticity = elasticity
      this.velocity = 0
      this.spring = 0
      this.friction = friction
      this.color = 'black'
      this.point = {
        x: Math.cos(this.angle),
        y: Math.sin(this.angle)
      }
      this.acceleration = -5 + Math.random() * 10;

      this.render()
    }

    calcSpring(leftPoint, rightPoint) {
      this.acceleration = ((-5 * this.spring) + ( leftPoint.spring - this.spring ) + ( rightPoint.spring - this.spring )) * this.elasticity - this.velocity * this.friction
      if(Math.abs(this.spring) < 1 )this.acceleration = -.5 + Math.random()
      this.render()
    }

    render () {
      this.velocity += this.acceleration;
      this.spring += this.velocity;
      this.position = {
        x: this.parent.position.x + this.point.x * (this.parent.radius + this.spring),
        y: this.parent.position.y + this.point.y * (this.parent.radius + this.spring)
      }
    }

  }
