<template>
<div class="MenuButton">
  <canvas ref="canvas"></canvas>
  <button :class="readyClass" @click="doClick" @mouseenter="doMouseEnter" @mouseleave="doMouseLeave" aria-label="menu">
    <no-ssr>
      <span class="icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </no-ssr>
  </button>
</div>
</template>

<script>
import MenuButtonBlob from '~/assets/js/blobs/MenuButtonBlob'
import MenuButtonMixin from './ButtonMenuMixins'
export default {
  name: 'MenuButton',
  mixins: [MenuButtonMixin],
  mounted(){
    this.ctx = this.$refs.canvas.getContext('2d')
    this.blob = new MenuButtonBlob(this.canvasSize.w, this.canvasSize.h)
  }
}

</script>

<style lang="stylus" scoped>
.MenuButton
  left 160 * $unitH
  position fixed
  top 160 * $unitV
  z-index 10
  canvas
    height 320 * $unitH
    margin-left -160 * $unitH
    margin-top -160 * $unitH
    position absolute
    width 320 * $unitH
  button
    align-items center
    cursor pointer
    display flex
    height 160 * $unitH
    justify-content center
    margin-left -80 * $unitH
    margin-top -80 * $unitH
    pointer-events auto
    position relative
    width 160 * $unitH
    z-index 10
</style>
