
class Displacement {
  constructor() {
    this.time = 0
    this.amplitude = 80
    this.speed = .11
    this.width = 500
    this.height = 500
  }

  load(getter, renderer) {
    PIXI.Texture.addToCache(getter('displacement.jpg'))
    this.baseTexture = new PIXI.BaseTexture.fromImage(getter('displacement.jpg'))
    this.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.baseTexture.width = 2000
    this.baseTexture.height = 2000

    this.texture = new PIXI.Texture(this.baseTexture)
    renderer.textureManager.updateTexture(this.texture);

    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.width = 2000
    this.sprite.height = 2000
    this.sprite.name = 'displacement'
  }

  tick() {
    this.time += this.speed
    const x = this.amplitude + Math.sin(this.time * this.speed)  * this.amplitude
    const y =  this.amplitude + Math.cos(this.time * this.speed)  * this.amplitude
    const rect = new PIXI.Rectangle(x, y, x + 320, y + 320);
    this.texture.frame = rect;
  }

  resize(w, h) {
    this.sprite.width = 2000
    this.sprite.height = 2000
  }


}

export default Displacement
