import SimplexNoise from 'simplex-noise'
import { $colors } from '~/assets/variables.json'
import MouseHelper from '~/assets/js/utils/MouseHelper'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import { distance } from '@merci-michel/mm-utils-math';
import Emitter from '~/assets/js/events';

class NoiseBlob {
  constructor(shapeW, w, h, centerX, centerY) {
    this.w = w
    this.h = h
    this.shapeW = shapeW
    this.time = 0
    this.totalPoints = 40
    this.centerX = centerX
    this.centerY = centerY
    this.centerEaseX = centerX
    this.centerEaseY = centerY
    this.centerOutsideX = centerX
    this.centerOutsideY = centerY
    this.gonnaGrab = false
    this.gonnaGrabStep = 0
    this.currentVal = 2
    this.attractionX = 0
    this.init()
  }

  init(){
    this.velocity = ThrowPropsPlugin.track(this,"centerX")
    this._onStartDrag = this.onStartDrag.bind(this)
    this._onDrag = this.onDrag.bind(this)
    this._onStopDrag = this.onStopDrag.bind(this)
    window.addEventListener("mousedown", this._onStartDrag, false);
    document.addEventListener('touchstart', this._onDrag, false);

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.ctx = this.canvas.getContext('2d')
    this.noise = new SimplexNoise(Math.random())
  }

  destroy() {
    ThrowPropsPlugin.untrack(this)
    window.removeEventListener("mousedown", this._onStartDrag, false);
    document.removeEventListener('touchstart', this._onDrag, false);
    document.removeEventListener('touchmove', this._onDrag, false)
    document.removeEventListener('mousemove', this._onDrag, false)
    window.removeEventListener('mouseup', this._onStopDrag, false)
    document.removeEventListener('touchend', this._onStopDrag, false)
  }

  ease (t, b, c, d) {
    t /= d;
    return c*t*t*t*t*t + b; // in quint
  }



  tick() {

    this.doNoise()
    const dist = distance(MouseHelper.x, MouseHelper.y - ResizeHelper.height() + this.h, this.centerX, this.centerY)
    if( dist < this.shapeW ){
      if(!this.grab)Emitter.emit('CURSOR:GRAB')
      this.grab = true
    }else{
      if(this.grab)Emitter.emit('CURSOR:NOTGRAB')
      this.grab = false
    }

    const dOusitdeY = this.centerY - this.centerOutsideY
    const dOusitdeX = this.centerX - this.centerOutsideX
    this.centerOutsideX += dOusitdeX / 2
    this.centerOutsideY += dOusitdeY / 2

    this.ctx.clearRect(0, 0, this.w, this.h)

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW + 20, this.centerOutsideX, this.centerOutsideY)
    this.ctx.fillStyle = $colors.bgWhite//0XCC0000//
    this.ctx.fill()
    this.ctx.restore()

    this.ctx.save()
    this.ctx.beginPath()
    this.drawShape(this.shapeW, this.centerX, this.centerY)
    this.ctx.strokeColor = $colors.black
    this.ctx.fillStyle = $colors.bgWhite
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()
  }

  doNoise() {
    this.time++
    let angle = 0
    const slice = Math.PI * 2 / this.totalPoints
    let x = 0, y = 0, displacement = 0
    this.noiseValues = []
    for(let i = 0; i < this.totalPoints; i++) {
      x = Math.cos(angle)
      y = Math.sin(angle)
      displacement =  (this.noise.noise3D(x, y, this.time * 0.005) * 5)
      this.noiseValues.push({x: x * displacement, y: y * displacement})
      angle += slice
    }
  }

  /*
  let displacement = width + (this.noise.noise3D(x, y, this.time * 0.005) * 5)
  x = this.centerX + x * displacement
  y = this.centerY + y * displacement
  */

  drawShape(radius, centerX, centerY) {
    let points = []
    let x = 0, y = 0, angle = 0
    const slice = Math.PI * 2 / this.totalPoints
    for(let i = 0; i < this.totalPoints; i++) {
      x = Math.cos(angle)
      y = Math.sin(angle)

      x = centerX + (radius + this.noiseValues[i].x) * x
      y = centerY + (radius + this.noiseValues[i].y) * y
      points.push({ x, y })
      angle += slice
    }
    this.ctx.moveTo(points[0].x, points[0].y)
    this.curveThrough(points)
  }

  curveThrough(points) {
    var i, n, a, b, x, y
    for (i = 1, n = points.length - 1; i < n; i++) {
        a = points[i]
        b = points[i + 1] || points[0]
        x = (a.x + b.x) * 0.5
        y = (a.y + b.y) * 0.5
        this.ctx.quadraticCurveTo(a.x, a.y, x, y)
    }
    a = points[i]
    b = points[i + 1] || points[0]
    this.ctx.quadraticCurveTo(a.x, a.y, b.x, b.y)
  }

  resize(w,h) {
    this.w = w
    this.h = h

    this.canvas.width = this.w
    this.canvas.height = this.h

    this.padding = (this.w / 2880 * 160) + (this.w / 2880 * 25)
    const timelineW = this.w - this.padding * 2 // width - padding
    this.steps = []
    for (let index = 0; index < 5; index++) {
      this.steps.push(this.padding + timelineW / 4 * index)
    }
  }

  checkVal(posX) {
    let max = 5000, val = - 1
    for (let i = 0; i < this.steps.length; i++) {
      if(Math.abs(posX - this.steps[i]) < max){
        max = Math.abs(posX - this.steps[i])
        val = i
      }
    }
    return val
  }

  goTo(val) {
    this.currentVal = val
    TweenMax.to(this, 1, {centerX: this.steps[val], ease: Quad.easeOut})
  }

  onStartDrag(e) {
    if(!this.grab)return
    this.isDown=true
    this.diff = (this.centerX - this.getX(e))
    this.centerX = this.getX(e) + this.diff
    document.addEventListener('touchmove', this._onDrag, false)
    document.addEventListener('mousemove', this._onDrag, false)

    window.addEventListener('mouseup', this._onStopDrag, false)
    document.addEventListener('touchend', this._onStopDrag, false)
  }
  onStopDrag(e) {
    this.isDown=false
    let a = ThrowPropsPlugin.to(this,{throwProps:{centerX:{velocity: this.velocity.getVelocity("centerX"), min: 0, max: this.w, end: this.steps}}, ease: Expo.easeOut})
    const val = this.checkVal(a.vars.throwProps.centerX.max)
    Emitter.emit('DRAG:GOTO', {val})
    document.removeEventListener('touchmove', this._onDrag, false)
    document.removeEventListener('mousemove', this._onDrag, false)
    window.removeEventListener('mouseup', this._onStopDrag, false)
    document.removeEventListener('touchend', this._onStopDrag, false)

  }
  onDrag(e) {
    e.preventDefault()
    this.centerX = this.getX(e) + this.diff
  }

  getX(e){
      return e.touches ? e.touches[0].clientX : e.clientX
  }
}









export default NoiseBlob
