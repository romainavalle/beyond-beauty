
<template>
  <div class="aboutText">
    <div class="content">
      <p>tribute<img v-if="packer" :src="getURI('about/emma-watson.jpg')" alt="emma watson">to<br>four inspiring<br>women<img v-if="packer" :src="getURI('about/jennifer-lawrence.jpg')" alt="jennifer lawrence">mainly<br>known for their<br>appearances<br>although they<br>stand<img v-if="packer" :src="getURI('about/natalie-portman.jpg')" alt="natalie portman">up &amp; act<br> for the greater<br>good.<img v-if="packer" :src="getURI('about/cara-delevingne.jpg')" alt="cara delevingne">true<br>inner beauty.</p>
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
.aboutText
  position relative
  pointer-events auto
  .content
    padding-top 320 * $unitV
    padding-bottom 320 * $unitV
    background $colors-dBlack
    p
      text-align center
      font-size 238 * $unitH
      font-weight 500
      line-height 0.85
      font-family $hawthorn
      color $colors-dBlack
      -webkit-text-stroke-color $colors-white
      -webkit-text-stroke-width .25px
      text-transform uppercase
    img
      display inline-block
      width 437 * $unitH
      vertical-align text-bottom
      margin-left -30 * $unitH
      margin-right -30 * $unitH
      position relative

</style>
