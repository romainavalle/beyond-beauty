
<template>
  <div class="aboutCredit">
    <div class="content">
      <h3>Credits</h3>
      <div class="text">
        <div class="projects">
          <strong>Project by</strong>
          <ul>
            <li><a href="https://twitter.com/nahelmoussi" target="_blank">Nahel Moussi</a></li>
            <li><a href="https://twitter.com/louisansa" target="_blank">Louis Ansa</a></li>
            <li><a href="https://twitter.com/romaindr" target="_blank">Romain Avalle</a></li>
          </ul>
        </div>

        <div class="credits">
          <strong>Photography Natalie Portman</strong>
          <ul>
            <li><span>Nahel Moussi</span></li>
            <li><span>Louis Ansa</span></li>
            <li><span>Romain Avalle</span></li>
          </ul>
          <strong>Photography Emma Watson</strong>
          <ul>
            <li><span>Nahel Moussi</span></li>
            <li><span>Louis Ansa</span></li>
            <li><span>Romain Avalle</span></li>
          </ul>
          <strong>Photography Jennifer Lawrence</strong>
          <ul>
            <li><span>Nahel Moussi</span></li>
            <li><span>Louis Ansa</span></li>
            <li><span>Romain Avalle</span></li>
          </ul>
          <strong>Photography Cara Delevingne</strong>
          <ul>
            <li><span>Nahel Moussi</span></li>
            <li><span>Louis Ansa</span></li>
            <li><span>Romain Avalle</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data(){
    return {
    }
  },
  computed:{
    ...mapGetters(['getURI']),
    ...mapState(['packer'])
  },
  methods:{

  },

  mounted(){
  }
}

</script>

<style lang="stylus" scoped>
.aboutCredit
  position relative
  font-size 26 * $unitH
  .content
    padding-top 320 * $unitV
    padding-bottom 320 * $unitV
    background $colors-dBlack
  .text
    padding-left 6 * 160 * $unitH
    padding-top 204 * $unitH
    display flex
    div
      width 3 * 160 * $unitH
  ul
    margin-bottom 100 * $unitV
    li
      line-height 40 * $unitH
  span, a
    position relative
    display inline-block
    cursor pointer
    color $colors-white
    &:before
      content ''
      height 1px
      width 100%
      display block
      position absolute
      bottom 0
      left 0
    &:after
      content ''
      height 1px
      width 100%
      background $colors-white
      display block
      position absolute
      bottom 0
      left 0
      transform scale(0,1)
      transition transform .3s ease-in-out-quart
      transform-origin 100% 0%
    &:hover:after
      transform scale(1,1)
      transform-origin 0% 0%
  strong
    line-height 40 * $unitH
    font-size 20 * $unitH
    color $colors-grey
  h3
    font-size 238 * $unitH
    color $colors-white
    opacity .03
    margin-left -90 * $unitH
    position absolute


</style>
