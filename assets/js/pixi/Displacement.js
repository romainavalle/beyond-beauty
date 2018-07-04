
class Displacement {
  constructor() {
    this.time = 0
    this.amplitude = 80
    this.speed = .11
    this.width = 500
    this.height = 500
  }

  load(getter) {
    PIXI.Texture.addToCache(getter('displacement.png'))
    this.baseTexture = new PIXI.BaseTexture.fromImage(getter('displacement.png'))
    this.baseTexture.width = 1000
    this.baseTexture.height = 1000

    this.texture = new PIXI.Texture(this.baseTexture)
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.name = 'displacement'
  }

  tick() {
    this.time += this.speed
    const x = 250 - this.amplitude + Math.sin(this.time * this.speed)  * this.amplitude
    const y = 250 - this.amplitude + Math.cos(this.time * this.speed)  * this.amplitude
    const rect = new PIXI.Rectangle(x, y, x + 500, y + 500);
    this.texture.frame = rect;
  }

  resize(w, h) {
    this.sprite.width = w
    this.sprite.height = h
  }


}

export default Displacement
