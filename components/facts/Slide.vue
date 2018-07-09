<template>
  <div class="Slide" :class="[readyClass, {'hover': isHover}]">
    <p class="bottom">
      <span v-for="(line,i) in textArray" :key="i" v-html="line" class="line"></span>
    </p>
    <div class="canvasContainer">
      <canvas ref="canvas" :class="canvasClass"></canvas>
    </div>
    <p class="top">
      <span v-for="(line,i) in textArray" :key="i" v-html="line" class="line"></span>
    </p>
  </div>
</template>
<script>

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import Emitter from '~/assets/js/events'
if(process.browser) {
  var transform = require('dom-transform');
}
export default {
  name: "Slide",
  data(){
    return {
      readyClass: '',
      x: 0,
      currentX: 0,
      currentFrame: 0,
      canvasWidth: 800,
      canvasHeight: 800,
      isImgShown : false,
      isAppearing: false,
      canvasClass: '',
      isHover: false
    }
  },
  props: ['fact', 'id', 'images'],
  computed:{
    textArray(){
      return this.fact.html.split('<br>')
    }
  },
  methods:{
    load() {
      if(this.id !== 2){
        this.x = ResizeHelper.width()
        this.hide(1,0)
      }else{
        this.show(1,0)
      }
      setTimeout(this.checkImageRatio.bind(this), 100)
    },
    resetCanvasPos(){
      let x = -60, y = 50
      if(this.isVertical){
        x = -50
        y = 60
      }
      TweenMax.set(this.$refs.canvas, {x, y})

    },
    doMouseOver() {
      Emitter.emit('HIDE_MOUSE')
      this.isHover = true
      //if(this.isImgShown) return
      //if(this.isTweening)return
      //this.isImgShown = true
      //this.isTweening = true
      this.images.show(this.id)
      TweenMax.to(this.$refs.canvas, .8, {y: 0, x: 0, ease: Quart.easeOut, onComplete: ()=>{
        //this.isTweening = false
        //if(this.isHideRequested)this.doMouseOut(true)
      }})
    },
    doMouseOut(/*isRequested*/) {
      this.isHover = false
      Emitter.emit('SHOW_MOUSE')
      //if(!isRequested) Emitter.emit('SHOW_MOUSE')
      //if(!this.isImgShown) return
      //if(this.isTweening) this.isHideRequested = true
     // if(this.isTweening)return
      //this.isTweening = true
      //this.isHideRequested = false
      //this.isImgShown = false
      this.images.hide()
      let x = 60, y = -50
      if(this.isVertical){
         x = 50
         y = -60
      }
      TweenMax.to(this.$refs.canvas, .6, {x, y, ease: Cubic.easeIn, onComplete: ()=>{
        this.resetCanvasPos()
        //this.isTweening = false
        //if(this.isHideRequested)this.doMouseOut(true)
      }})
    },
    checkImageRatio() {
      this.isVertical = false
      if(this.images.image_array[this.id].width < this.images.image_array[this.id].height) {
        this.isVertical = true
      }
      let w,h
      if(this.isVertical) {
        w = 584 / 1440 * this.w
        h = 973 / 1440 * this.w
        this.canvasClass = 'vertical'
      }else{
        h = 579 / 1440 * this.w
        w = 964 / 1440 * this.w
        this.canvasClass = 'horizontal'
      }
      this.$refs.canvas.width = this.canvasWidth = w
      this.$refs.canvas.height = this.canvasHeight = h

    },
    resize(w, h){
      this.w = w
      this.h = h
      if(this.images.image_array[this.id]) this.checkImageRatio()
    },
    show(dir, time = .5){
      const from = dir < 0 ? this.w / 2 : -this.w / 2
      TweenMax.set(this.$el, {autoAlpha: 1})
      this.isAppearing = true
      TweenMax.fromTo(this, time, {x: from}, {x: 0, overwrite: 1, onComplete: () => {
        this.isAppearing = false
        this.readyClass = 'ready'
        this.addListeners()
        this.resetCanvasPos()
      }})
    },
    hide(dir, time = 1){
      this.removeListeners()
      if(this.images) this.images.hide()
      const to = dir < 0 ? this.w / 2 : -this.w / 2
      TweenMax.to(this, time, {x: to, overwrite: 1, onComplete: () => {
        TweenMax.set(this.$el, {autoAlpha: 0})
      }})
      this.readyClass = ''
    },
    backToZero(){
      TweenMax.to(this, .7, {x: 0, ease: CustomEase.create("custom", "M0,0 C0.156,0 0.098,0.823 0.332,1 0.546,1.162 0.598,1 1,1"), overwrite: 1})
    },
    tick(x) {
      if(x) this.x = x
      if(this.images.currentImage === this.id) {
        if(this.currentFrame != this.images.currentFrame) {
          this.currentFrame = this.images.currentFrame
          this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
          this.ctx.drawImage(this.images.canvas, this.images.x, this.images.y, this.images.width, this.images.height, 0, 0, this.canvasWidth, this.canvasHeight)
        }
      }
      if(this.currentX === this.x)return
      this.currentX = this.x
      this.$el.style.opacity = 1 - (Math.abs(this.x) / (this.w / 2))
      let delay
      for (let index = 0; index < this.$spans.length; index++) {
        delay = (1 - (index * .08))
        if(this.isAppearing) delay =  .4 + (index * .08)
        transform(this.$spans[index], {translate3d:[this.x * delay, 0, 0]})
        transform(this.$spansTop[index], {translate3d:[this.x * delay, 0, 0]})
      }
    },
    addListeners() {
      this.$strong.forEach(element => {
        element.addEventListener('mouseover', this._doMouseOver)
        element.addEventListener('mouseleave', this._doMouseOut)
      });

    },
    removeListeners() {
      this.$strong.forEach(element => {
        element.removeEventListener('mouseover', this._doMouseOver)
        element.removeEventListener('mouseleave', this._doMouseOut)
      });
    }

  },
  beforeDestroy() {
    this.removeListeners()
  },
  mounted(){
    this._doMouseOver = this.doMouseOver.bind(this)
    this._doMouseOut = this.doMouseOut.bind(this)
    this.$spans = [].slice.call(this.$el.querySelectorAll('p.bottom .line'))
    this.$spansTop = [].slice.call(this.$el.querySelectorAll('p.top .line'))
    this.$strong = [].slice.call(this.$el.querySelectorAll('p.top strong'))
    this.canvas = this.$refs.canvas
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    this.ctx = this.canvas.getContext('2d')

  }
}

</script>

<style lang="stylus" scoped>
.Slide
  position absolute
  top 0
  left 0
  .canvasContainer
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    pointer-events none
  canvas
    display block
    &.vertical
      height 973 * $unitH
      width 584 * $unitH
    &.horizontal
      width 964 * $unitH
      height 579 * $unitH
  p
    -webkit-text-stroke-color $colors-timelineBlack
    -webkit-text-stroke-width .25px
    color $colors-bgWhite
    font-family $hawthorn
    font-size 140 * $unitH
    font-weight 500
    left 0
    line-height .9
    position relative
    right 0
    text-align center
    text-transform uppercase
    top 0
    &.top
      -webkit-text-stroke-color transparent
      -webkit-text-stroke-width .25px
      color transparent
      position absolute
      left 0
    span
      display block
      will-change transform
</style>
<style lang="stylus">
.Slide
  strong
    position relative
    cursor pointer
    font-weight 500
  .top strong
    transition all .4s ease-in-out-quart
    -webkit-text-stroke-color $colors-timelineBlack
    -webkit-text-stroke-width .25px
    font-weight 500
    opacity 0
    color $colors-timelineBlack
  &.ready .top strong
      opacity 1
      transition opacity .8s ease-in-out-quart
  &.ready.hover .top strong
    opacity 1
    transition all .8s ease-in-out-quart
    -webkit-text-stroke-color $colors-black
    color $colors-black


</style>

