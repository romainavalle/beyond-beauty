<template>
  <div class="Logo">
    <canvas ref="canvas"></canvas>
    <h1 :class="readyClass" @mouseenter="doMouseEnter" @mouseleave="doMouseLeave" @click="doClick">
      <no-ssr>
        <span class="icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </no-ssr>
      <span ref="titre">Beyond<br>Beauty</span>
    </h1>
  </div>
</template>

<script>
import HomeBlob from '~/assets/js/blobs/HomeBlob'
import MenuButtonMixin from './ButtonMenuMixins'
export default {
  name: 'Logo',
  mixins: [MenuButtonMixin],
  methods:{
    show(){
      TweenMax.fromTo(this.$refs.titre, 1, {opacity: 0, x: 30}, {opacity: 1, x: 0})
      MenuButtonMixin.methods.show.call(this)
    },
    hide(){
      TweenMax.to(this.$refs.titre, 1,{opacity: 0, x: -30})
      MenuButtonMixin.methods.hide.call(this)
    }
  },
  mounted(){
    TweenMax.set(this.$refs.titre, {opacity: 0, x: 30})
    this.rot = 0
    this.ctx = this.$refs.canvas.getContext('2d')
    this.blob = new HomeBlob(160, 160)
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
    top 0 * $unitH
    left 10 * $unitH
    height 160px
    width 160px
  .icon
    margin-right 20 * $unitH
  h1
    align-items baseline
    color $colors-black
    display flex
    font-family $hawthorn
    font-size 20px
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
