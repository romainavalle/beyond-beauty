<template>
  <div class="Mouse" :class="type">
    <canvas ref="canvas" width="200" height="200" ></canvas>
    <span ref="word"><span v-text="word"></span></span>
  </div>
</template>

<script>
if(process.browser) {
  var transform = require('dom-transform');
}
import MouseBlob from '~/assets/js/blobs/MouseBlob'
import Emitter from '~/assets/js/events';
import MouseHelper from '~/assets/js/utils/MouseHelper'

export default {

  name: 'Mouse',

  data(){
    return {
      isShown: false,
      isCanvasVisible: false,
      word: 'discover',
      type: '',
      cW: 200,
      cH: 200
    }
  },

  methods: {

    show() {
      MouseHelper.isMouseNeeded = true
      this.isShown = true
      TweenMax.set(this.$el, {autoAlpha: 1})
      TweenMax.to(this.$refs.word, .8,{delay: .2, scale: 1, opacity: 1, overwrite: 1, ease: Power4.easeOut})
      if(this.isCanvasVisible) this.blob.show()
      this.ctx.drawImage(this.blob.canvas, 0, 0, this.cW, this.cH);
    },

    hide() {
      TweenMax.to(this.$refs.word, .5,{scale: 0, opacity: 0, overwrite: 1, ease: Power4.easeOut, onComplete: () => {
        this.isShown = false
        TweenMax.set(this.$el, {autoAlpha: 0})
      }})
      if(this.isCanvasVisible) this.blob.hide()
    },

    tick() {
      if(!this.isShown) return
      transform(this.$refs.canvas, {translate3d:[MouseHelper.easeSlowX - MouseHelper.easeX,MouseHelper.easeSlowY -  MouseHelper.easeY, 0]})
      transform(this.$el, {translate3d:[MouseHelper.easeX, MouseHelper.easeY, 0]})
      if(this.blob.scale !== 0){
        this.blob.tick(this.rotation, this.scale)
        this.ctx.clearRect(0, 0, this.cW, this.cH)
        this.ctx.drawImage(this.blob.canvas, 0, 0, this.cW, this.cH);
      }
    },

    setMouseType(e) {
      this.type = e.type
      this.isCanvasVisible = false
      switch(this.type){
        case 'learn':
          this.word = 'lear more'
        break
        case 'discover':
          this.word = 'discover'
        break
        case 'enter':
          this.word = 'enter'
          this.isCanvasVisible = true
        break
        case 'drag':
          this.word = 'drag'
          this.isCanvasVisible = true
        break
        case 'listen':
          this.word = 'listen'
          this.isCanvasVisible = true
        break
        case 'pause':
          this.word = 'pause'
          this.isCanvasVisible = true
        break
        case 'next':
          this.word = 'next'
        break
      }
    },

    resize(w, h) {
    }

  },

  beforeDestroy() {
    Emitter.removeListener('SHOW_MOUSE', this._show);
    Emitter.removeListener('HIDE_MOUSE', this._hide);
    Emitter.removeListener('SET_MOUSE_TYPE', this._setMouseType);
  },

  mounted(){
    this._show = this.show.bind(this);
    this._hide = this.hide.bind(this);
    this._setMouseType = this.setMouseType.bind(this);
    Emitter.on('SHOW_MOUSE', this._show);
    Emitter.on('HIDE_MOUSE', this._hide);
    Emitter.on('SET_MOUSE_TYPE', this._setMouseType);
    TweenMax.set(this.$refs.word, {scale: 0, opacity: 0})
    this.blob = new MouseBlob(this.cW, this.cH, 80)
    this.ctx = this.$refs.canvas.getContext('2d')
  }
}

</script>

<style lang="stylus" scoped>
.Mouse
  font-size 14 * $unitH
  font-weight $semi
  left 0
  letter-spacing 2 * $unitH
  pointer-events none
  position fixed
  text-align center
  text-transform uppercase
  top 0
  cursor pointer
  z-index 50
  canvas
    width 200px
    height 200px
    top 0
    left 0
    position absolute
    display block
    margin-top -100px
    margin-left -100px
  span
    display block
    span
      transform translate(-50%, -50%)
      text-align center
</style>
