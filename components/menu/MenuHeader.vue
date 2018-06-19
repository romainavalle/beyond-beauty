<template>
  <header class="MenuHeader">
    <canvas ref="canvas"></canvas>
    <button class="close" @click="setMenuOpen(false)">
      close
    </button>
    <ul>
      <li><router-link :to="{'name': 'index'}">index</router-link></li>
      <li><a href="#">about</a></li>
    </ul>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import MenuBlob from '~/assets/js/blobs/MenuBlob'
export default {
  name: "MenuHeader",
  computed:{
    canvasSize() {
      return {w: ResizeHelper.width() / 2880 * 640, h: ResizeHelper.width() / 2880 * 640}
    }
  },
  methods:{
    ...mapActions(['setMenuOpen']),
    show(delay) {
      TweenMax.to(this.$elToAnimate, 1, {delay: delay + .2, autoAlpha: 1, ease: Quad.easeOut})
      TweenMax.to(this.$refs.canvas, .7,{delay, scaleX: 1, scaleY:1, ease: Quad.easeOut})
    },
    hide() {
      TweenMax.to(this.$elToAnimate, .8, {autoAlpha: 0, ease: Quad.easeIn})
      TweenMax.to(this.$refs.canvas, .6,{scaleX: 0, scaleY: 0, ease: Quad.easeIn})
    },
    tick() {
      this.blob.tick()
      this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
      this.ctx.drawImage(this.blob.canvas, 0, 0, this.canvasSize.w, this.canvasSize.h);
    },
    resize(w, h) {
      this.$refs.canvas.width = this.canvasSize.w
      this.$refs.canvas.height = this.canvasSize.h
      this.blob.resize(this.canvasSize.w, this.canvasSize.h)
    }
  },
  mounted() {
    this.$elToAnimate = this.$el.querySelectorAll('button, li')
    TweenMax.set(this.$elToAnimate, {autoAlpha: 0})
    TweenMax.set(this.$refs.canvas, {scaleX: 0, scaleY: 0})
    this.ctx = this.$refs.canvas.getContext('2d')
    const shapeW = ResizeHelper.width() / 2880 * 300
    this.blob = new MenuBlob(shapeW, this.canvasSize.w, this.canvasSize.h, this.canvasSize.w / 2, this.canvasSize.h / 2)
  }
}
</script>

<style lang="stylus" scoped>
.MenuHeader
  position absolute
  display flex
  flex-wrap nowrap
  width 100%
  font-size 14 * $unitH
  letter-spacing 3 * $unitH
  text-transform uppercase
  display flex
  top 139 * $unitV // 160 - fontsize
  z-index 1
  canvas
    top 0
    left 0
    position absolute
    width 640 * $unitH
    height 640 * $unitH
    margin-left -130 * $unitH
    margin-top -310 * $unitH
    transform rotate(180deg)
  ul
    display flex
  button
    width 440 * $unitH
    padding-top 139 * $unitV
    padding-bottom 139 * $unitV
    margin-top -139 * $unitV
    padding-left 160 * $unitH
    margin-right 120 * $unitH
    letter-spacing 3 * $unitH
    color $colors-grey
    position relative
  button, a
    font-weight $semi
    display block
    text-align left
    text-transform uppercase
  a
    color $colors-white
  li
    width 160 * $unitH
</style>
