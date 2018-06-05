<template>
  <div class="Logo" @click="setMenuOpen(true)">
    <div :is="tag">
      <no-ssr>
        <span class="icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </no-ssr>
      Beyond<br>Beauty</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'logo',
  props: ['debug'],
  computed: {
    tag() {
      return this.$route.name === 'index' ? 'h1' : 'strong'
    }
  },
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
    width 24 * $unitH
    height 7px
    margin-right 20 * $unitH
    margin-bottom 2px
    overflow hidden
    span
      transform translateX(-28 * $unitH)
      height 1px
      width 52 * $unitH
      display block
      margin-bottom 2px
      background linear-gradient(to left, $colors-black, $colors-black 24 * $unitH, transparent 24 * $unitH, transparent 28 * $unitH, $colors-black 28 * $unitH, $colors-black 52 * $unitH)
      transition transform .3s ease-in-out-quad
      &:nth-child(2)
        transition-delay .1s
      &:nth-child(3)
        transition-delay .2s
        margin-left -10 * $unitH
  &:hover
    .icon
      span
        transform translateX(0px)
        &:nth-child(3)
          transform translateX(20 * $unitH)
  h1, strong
    font-family $hawthorn
    font-size 40 * $unitH
    color $colors-black
    margin 0
    padding 0
    text-transform uppercase
    display flex
    align-items baseline

</style>
