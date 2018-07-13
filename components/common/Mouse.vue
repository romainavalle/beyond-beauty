<template>
  <div class="Mouse" :class="[type, {'tablet': isTablet}]" style="font-family: Messina Sans;font-weight: 300;">
    <canvas ref="canvas"></canvas>
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
import { mapGetters } from 'vuex'
export default {

  name: 'Mouse',

  data(){
    return {
      isShown: false,
      isCanvasVisible: false,
      word: '',
      type: 'discover',
      cW: 200,
      cH: 200
    }
  },
  computed: {
    ...mapGetters(['isTablet'])
  },
  methods: {

    show() {
      if(this.isTablet) return
      MouseHelper.isMouseNeeded = true
      this.isShown = true
      TweenMax.set(this.$el, {autoAlpha: 1})
      TweenMax.to(this.$refs.word, .8,{delay: .2, scale: 1, opacity: 1, overwrite: 1, ease: Power4.easeOut})
      if(this.isCanvasVisible) {
        this.blob.show()
      }
    },

    hide() {
      if(this.isTablet) return
      TweenMax.to(this.$refs.word, .5,{scale: 0, opacity: 0, overwrite: 1, ease: Power4.easeOut, onComplete: () => {
        this.isShown = false
        TweenMax.set(this.$el, {autoAlpha: 0})
      }})
      if(this.isCanvasVisible) this.blob.hide()
    },

    tick() {
      if(this.isTablet) return
      if(!this.isShown) return
      if(this.isTablet) return
      transform(this.$refs.word, {translate3d:[MouseHelper.easeX, MouseHelper.easeY, 0]})
      if(this.blob.scale !== 0){
        this.blob.tick(this.rotation, this.scale)
        this.ctx.clearRect(0, 0, this.w,this.h)
        this.ctx.drawImage(this.blob.canvas,MouseHelper.easeSlowX - 100,MouseHelper.easeSlowY - 100, this.cW, this.cH);
      }
    },

    scaleDown() {
      if(this.isTablet) return
      this.blob.scaleDown()
    },

    scaleUp() {
      if(this.isTablet) return
      this.blob.scaleUp()
    },

    setMouseType(e) {
      if(this.isTablet) return
      this.type = e.type
      this.isCanvasVisible = false
      switch(this.type){
        case 'learn':
          this.word = 'learn more'
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
        case 'about':
          this.word = 'about'
        break
      }
    },

    resize(w, h) {
      if(this.isTablet) return
      this.w = w
      this.h = h
      this.$refs.canvas.width = w
      this.$refs.canvas.height = h
    }

  },

  beforeDestroy() {
    if(this.isTablet) return
    Emitter.removeListener('SHOW_MOUSE', this._show);
    Emitter.removeListener('HIDE_MOUSE', this._hide);
    Emitter.removeListener('SCALE_MOUSE_DOWN', this._scaleDown);
    Emitter.removeListener('SCALE_MOUSE_UP', this._scaleUp);
    Emitter.removeListener('SET_MOUSE_TYPE', this._setMouseType);
  },

  mounted(){
    if(this.isTablet) return
    this._show = this.show.bind(this);
    this._hide = this.hide.bind(this);
    this._scaleDown = this.scaleDown.bind(this);
    this._scaleUp = this.scaleUp.bind(this);
    this._setMouseType = this.setMouseType.bind(this);
    Emitter.on('SHOW_MOUSE', this._show);
    Emitter.on('HIDE_MOUSE', this._hide);
    Emitter.on('SET_MOUSE_TYPE', this._setMouseType);
    Emitter.on('SCALE_MOUSE_DOWN', this._scaleDown);
    Emitter.on('SCALE_MOUSE_UP', this._scaleUp);
    TweenMax.set(this.$refs.word, {scale: 0, opacity: 0})
    this.blob = new MouseBlob(this.cW, this.cH, 50)
    this.ctx = this.$refs.canvas.getContext('2d')
    this.ctx.font = '12px "Messina Sans';
    this.ctx.fillStyle = '#4e4e4b'
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
  will-change transform
  width 100%
  height 100%
  z-index 50
  +below('l')
    font-size 16 * $unitH
  +above('hd')
    font-size 12 * $unitH
  &.isTablet
    display none
  canvas
    width 100%
    height 100%
    top 0
    left 0
    position absolute
    display block
  span
    display block
    span
      transform translate(-50%, -50%)
      text-align center
</style>
