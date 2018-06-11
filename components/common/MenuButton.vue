<template>
  <button class="MenuButton" @click="setMenuOpen(true)" :class="readyClass">
    <no-ssr>
      <span class="icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </no-ssr>
    menu
  </button>
</template>

<script>
import MenuButtonMixin from './ButtonMenuMixins'
export default {
  name: 'MenuButton',
  mixins: [MenuButtonMixin]

}

</script>

<style lang="stylus" scoped>
.MenuButton
  background $colors-white
  cursor pointer
  left 160 * $unitH
  pointer-events auto
  position fixed
  display flex
  top 160 * $unitV
  z-index 10
  color transparent
</style>
