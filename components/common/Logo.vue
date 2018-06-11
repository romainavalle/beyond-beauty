<template>
  <div class="Logo" @click="setMenuOpen(true)" :class="readyClass">
    <h1>
      <no-ssr>
        <span class="icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </no-ssr>
      Beyond<br>Beauty</h1>
  </div>
</template>

<script>
import MenuButtonMixin from './ButtonMenuMixins'
export default {
  name: 'Logo',
  mixins: [MenuButtonMixin]

}

</script>

<style lang="stylus" scoped>
.Logo
  position fixed
  top 160 * $unitV
  left 160 * $unitH
  margin-left -44 * $unitH
  margin-top -42 * $unitH
  z-index 10
  pointer-events auto
  cursor pointer
  .icon
    margin-right 20 * $unitH
  h1
    font-family $hawthorn
    font-size 40 * $unitH
    color $colors-black
    line-height 1
    font-weight normal
    margin 0
    padding 0
    text-transform uppercase
    display flex
    align-items baseline

</style>
