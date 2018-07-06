import BlobPoint from '~/assets/js/pixi/blobs/BlobPoint'
import MouseHelper from '~/assets/js/utils/MouseHelper'
class Blob {
  constructor(index, debug = false) {
    this.blobGraph = new PIXI.Sprite();
    this.blobGraph.anchor.set(.5,.5)
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
  load(getter) {
    this.blob = new PIXI.Sprite(PIXI.Texture.fromImage(getter('blob.png')));
    this.blob.anchor.set(.5,.5)
    this.blobGraph.addChild(this.blob)
  }
  resize(w, h){
    this.w = w
    this.h = h
  }

  setBlob(setDelay = false) {
    TweenMax.killTweensOf(this)
    this.radius = 200 + Math.round(Math.random() * 300)
    this.blob.width = this.radius
    this.blob.height = this.radius
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


  tick(scale, alpha) {
    this.blobGraph.alpha = alpha
    if (alpha === 0) return
    this.blobGraph.position.x = this.position.x
    this.blobGraph.position.y = this.position.y
    this.blobGraph.rotation = this.rotation * Math.PI / 180
    this.blobGraph.scale.x = scale * .9
    this.blobGraph.scale.y = scale


  }

}

export default Blob
