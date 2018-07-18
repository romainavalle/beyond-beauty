import BlobPoint from '~/assets/js/pixi/blobs/BlobPoint'
import MouseHelper from '~/assets/js/utils/MouseHelper'
class Blob {
  constructor(index, isMobile) {
    this.blobGraph = new PIXI.Sprite();
    this.blobHead = new PIXI.Graphics();
    this.blobBottom = new PIXI.Graphics();
    this.blobHeadDisplace = new PIXI.Graphics();
    this.blobGraph.addChild(this.blobHead);
    this.blobGraph.addChild(this.blobHeadDisplace);
    this.blobGraph.addChild(this.blobBottom);
    this.isMobile = isMobile
    this.distanceRatio = 0
    this.index = index
    this.color = 'red'
    this.numPoints = 4 + Math.floor(Math.random() * 5)
    this.originalRadius = this.radius = 70 + Math.floor(Math.random() * 100)
    this.position = { x: 0, y: 0 }
    this.hover = false
    this.oldMousePoint = { x: 0, y: 0 }
    this.tickInt = 0
  }

  resize(w, h){
    this.w = w
    this.h = h
    if(this.angle) this.setPos()
  }
  setPos() {
    this.startX =   Math.cos(this.angle) * ((Math.max(this.h, this.w)) + (this.radius * 1.2))
    this.startY =  Math.sin(this.angle) * ((Math.max(this.h, this.w)) + (this.radius * 1.2))
    this.endX =  Math.cos(this.angleEnd) * ((Math.max(this.h, this.w)) + (this.radius * 1.2))
    this.endY = Math.sin(this.angleEnd) * ((Math.max(this.h, this.w)) + (this.radius * 1.2))
  }
  setBlob(setDelay = false) {
    TweenMax.killTweensOf(this)
    this.numPoints = 5 + Math.floor(Math.random() * 9)
    this.radius = 20 + this.numPoints * 10

    const random = Math.random()
    this.rotation = ((Math.PI / 8) - (Math.random() * Math.PI / 4))
    this.angle = random * Math.PI / 4 + Math.PI / 2 + Math.PI / 4
    this.angleEnd = (1 - random) * Math.PI / 4 - Math.PI / 2 + Math.PI / 4 + this.rotation
    this.blobGraph.rotation = Math.PI / 4 + this.rotation
    this.setPos()
    this.blobBottom.clear()
    this.blobBottom.moveTo(0, 0)
    this.blobBottom.scale.x = .8
    this.blobBottom.scale.y = .75
    this.blobBottom.position.y = this.radius * .4
    this.blobBottom.position.x = 0
    this.blobBottom.beginFill(0xccffff)
    this.blobBottom.drawCircle(0, 0, this.radius)
    this.blobBottom.endFill();
    this.blobBottom.rotation = Math.random() * Math.PI



    this.blobHead.clear()
    this.blobHead.moveTo(0, 0)
    this.blobHead.beginFill(0xcc0000)
    this.blobHead.drawCircle(0, 0, this.radius)
    this.blobHead.endFill();

    this.blobHeadDisplace.clear()
    this.blobHeadDisplace.moveTo(0, 0)
    this.blobHeadDisplace.scale.x = 1
    this.blobHeadDisplace.scale.y = 1.05
    this.blobHeadDisplace.position.y = this.radius * .1
    this.blobHeadDisplace.beginFill(0xccffcc)
    this.blobHeadDisplace.drawCircle(0, 0, this.radius)
    this.blobHeadDisplace.endFill();
    this.blobHeadDisplace.rotation = Math.random() * Math.PI

    const time = (this.radius + (this.radius * Math.random() * .2)) / 6 * this.w / 1440
    const delay =  this.index
    this.ratio = 0

    this.blobHead.cacheAsBitmap = true
    this.blobBottom.cacheAsBitmap = true
    this.blobHeadDisplace.cacheAsBitmap = true
    TweenMax.to(this, time, {delay, ratio: 1, onComplete: this.setBlob.bind(this), overwrite: 1, ease: Linear.easeInOut, onUpdate: this.checkBlobPos.bind(this) })
  }

  checkBlobPos() {
    if(this.position.x > this.w + this.radius + 50 || this.position.y < -(this.radius + 50) )this.setBlob()
  }



  lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  }


  kill() {

  }
  tick(scale, alpha) {
    this.blobGraph.alpha = alpha
    this.blobGraph.position.x = this.lerp((this.w * .5) + this.startX, (this.w * .5) + this.endX, this.ratio)
    this.blobGraph.position.y = this.lerp((this.h * .5) + this.startY, (this.h * .5) + this.endY, this.ratio)

    this.blobBottom.rotation += this.ratio * Math.PI / 180 * 3
    this.blobHeadDisplace.rotation += (this.ratio) * Math.PI / 180 * 3
    this.blobGraph.scale.x = scale * .9
    this.blobGraph.scale.y = scale


  }

}

export default Blob
