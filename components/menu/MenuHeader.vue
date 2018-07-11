<template>
  <header class="MenuHeader">
    <canvas ref="canvas"></canvas>
    <button class="close" @click="doClick" @mouseenter="doMouseEnter" @mouseleave="doMouseLeave" aria-label="close">
      close
    </button>
    <ul>
      <li><router-link :to="{'name': 'index'}">index</router-link></li>
      <li><router-link :to="{'name': 'about'}">about</router-link></li>
    </ul>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import MenuBlob from '~/assets/js/blobs/MenuBlob'
export default {
  name: "MenuHeader",
  data(){
    return {
      rotation: 145,
      scale: 0
    }
  },
  computed:{
    canvasSize() {
      let size = ResizeHelper.width() / 2880 * 640
      return {w: size, h: size}
    }
  },
  methods:{
    ...mapActions(['setMenuOpen']),

    doClick() {
      this.setMenuOpen(false)
      //TweenMax.to(this, .1, {scale:1, ease: Power4.easeIn, repeat: 1, yoyo:true})
    },
    doMouseEnter() {
      if(!this.isShow)return
      TweenMax.to(this, 1,{rotation: '+=15', scale: 1.1, ease: Power4.easeOut})
    },
    doMouseLeave() {
      if(!this.isShow)return
      TweenMax.to(this, 1,{rotation: '+=15', scale: 1, ease: Power4.easeOut})
    },
    show(delay) {
      this.isShow = true
      TweenMax.to(this.$elToAnimate, 1, {delay: delay + .5, autoAlpha: 1, clearProps: 'all', ease: Quad.easeOut})
      TweenMax.to(this, .9, { delay, scale:1.1, rotation: '+=45', ease: Power4.easeInOut})
    },
    hide() {
      this.isShow = false
      TweenMax.to(this.$elToAnimate, .8, {autoAlpha: 0, ease: Quad.easeIn})
      TweenMax.to(this, .6, {delay: .4, scale: 0, rotation:  '-=45', ease: Power4.easeInOut})
    },
    tick() {
      this.blob.tick(this.rotation, this.scale)
      this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
      this.ctx.drawImage(this.blob.canvas, 0, 0, this.canvasSize.w, this.canvasSize.h);
    },
    resize(w, h) {
      this.$refs.canvas.width = this.canvasSize.w
      this.$refs.canvas.height = this.canvasSize.h
      //const canvasPos = {x: (-130 + 640 / 2) * 2880 / w, y: (640 / 2) * (2880 / w) - 400 * (1780 / h)}
      if(!this.shapeW)this.shapeW = w / 2880 * 184
      this.blob.resize(this.canvasSize.w, this.canvasSize.h, this.shapeW)
    }
  },
  mounted() {

    this.rotation = 145
    this.$elToAnimate = this.$el.querySelectorAll('button, li')
    TweenMax.set(this.$elToAnimate, {autoAlpha: 0})
    this.ctx = this.$refs.canvas.getContext('2d')
    this.blob = new MenuBlob(this.canvasSize.w, this.canvasSize.h)
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
  top 150 * $unitH
  canvas
    top 0
    left 0
    position absolute
    width 640 * $unitH
    height 640 * $unitH
    margin-left -160 * $unitH
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
    margin-right (40 + 32)* $unitH
    margin-left -32 * $unitH
    letter-spacing 3 * $unitH
    color $colors-grey
    position relative
  a
    padding 20 * $unitH
    margin-top -20 * $unitH
    margin-left -20 * $unitH
  button, a
    font-weight $semi
    text-align left
    text-transform uppercase
    transition opacity .3s
    &:hover,
    &.nuxt-link-exact-active
      opacity .6
  a
    color $colors-white
  li
    width 160 * $unitH
  +below('l')
    font-size 16 * $unitH
  +above('hd')
    font-size 12 * $unitH
</style>
