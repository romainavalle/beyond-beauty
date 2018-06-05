<template>
  <button class="MenuButton" @click="setMenuOpen(true)">
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
import { mapActions } from 'vuex'
export default {
  name: 'MenuButton',
  computed: {
  },
  methods: {
    ...mapActions(['setMenuOpen'])
  },
  mounted() {

  }
}

</script>

<style lang="stylus" scoped>
.MenuButton
  background $colors-white
  cursor pointer
  left 160 * $unitH
  pointer-events auto
  position absolute
  display flex
  top 160 * $unitV
  z-index 10
  color transparent
</style>
