<template>
  <div class="Logo" @click="setMenuOpen(true)" >
    <canvas ref="canvas"></canvas>
    <h1 :class="readyClass">
      <no-ssr>
        <span class="icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </no-ssr>
      Beyond<br>Beauty
    </h1>
  </div>
</template>

<script>
import HomeBlob from '~/assets/js/blobs/HomeBlob'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import MenuButtonMixin from './ButtonMenuMixins'
export default {
  name: 'Logo',
  mixins: [MenuButtonMixin],
  mounted(){
    this.ctx = this.$refs.canvas.getContext('2d')
    const shapeW = ResizeHelper.width() / 2880 * 80
    this.blob = new HomeBlob(shapeW, this.canvasSize.w, this.canvasSize.h, this.canvasSize.w / 2, this.canvasSize.h / 2)
  }
}

</script>

<style lang="stylus" scoped>
.Logo
  position fixed
  z-index 10
  top 0
  left 0
  pointer-events auto
  cursor pointer
  z-index 5
  canvas
    position absolute
    top -25 * $unitV
    left 0 * $unitH
    height 320 * $unitH
    width 320 * $unitH
  .icon
    margin-right 20 * $unitH
  h1
    align-items baseline
    color $colors-black
    display flex
    font-family $hawthorn
    font-size 40 * $unitH
    font-weight normal
    left 160 * $unitH
    line-height 1
    margin 0
    margin-left -44 * $unitH
    margin-top -42 * $unitH
    padding 0
    position absolute
    text-transform uppercase
    top 160 * $unitV

</style>
