<template>
  <div class="Logo" @click="setMenuOpen(true)">
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
import { mapActions } from 'vuex'
export default {
  name: 'logo',
  methods: {
    ...mapActions(['setMenuOpen'])
  },
  mounted() {
  }
}

</script>

<style lang="stylus" scoped>
.Logo
  position absolute
  top 160 * $unitV
  left 160 * $unitH
  margin-left -44 * $unitH
  margin-top -42 * $unitH
  z-index 10
  pointer-events auto
  cursor pointer
  .icon
    margin-right 20 * $unitH
    margin-bottom 2px
  h1
    font-family $hawthorn
    font-size 40 * $unitH
    color $colors-black
    margin 0
    padding 0
    text-transform uppercase
    display flex
    align-items baseline

</style>
