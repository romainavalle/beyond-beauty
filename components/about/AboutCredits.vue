
<template>
  <div class="aboutCredit">
    <div class="content">
      <h3 ref="titre">Credits</h3>
      <div class="text">
        <v-about-credits-images ref="images" :images="images"></v-about-credits-images>
        <div class="project">
          <strong>Project by</strong>
          <ul>
            <li><a href="https://twitter.com/nahelmoussi" target="_blank">Nahel Moussi</a></li>
            <li><a href="https://twitter.com/louisansa" target="_blank">Louis Ansa</a></li>
            <li><a href="https://twitter.com/romainavalle" target="_blank">Romain Avalle</a></li>
          </ul>
          <strong>Sound design by</strong>
          <ul>
            <li><a href="https://soundcloud.com/dimkit/" target="_blank">Dimitri Fert</a></li>
          </ul>
        </div>

        <div class="credits">
          <strong>Photography Natalie Portman</strong>
          <ul>
            <li><span @mouseover="doMouseOver(0, $event)" @mouseout="doMouseOut(0)" v-text="images[0].name"></span></li>
            <li><span @mouseover="doMouseOver(1, $event)" @mouseout="doMouseOut(1)" v-text="images[1].name"></span></li>
          </ul>
          <strong>Photography Emma Watson</strong>
          <ul>
            <li><span @mouseover="doMouseOver(2, $event)" @mouseout="doMouseOut(2)" v-text="images[2].name"></span></li>
            <li><span @mouseover="doMouseOver(3, $event)" @mouseout="doMouseOut(3)" v-text="images[3].name"></span></li>
            <li><span @mouseover="doMouseOver(4, $event)" @mouseout="doMouseOut(4)" v-text="images[4].name"></span></li>
          </ul>
          <strong>Photography Jennifer Lawrence</strong>
          <ul>
            <li><span @mouseover="doMouseOver(5, $event)" @mouseout="doMouseOut(5)" v-text="images[5].name"></span></li>
            <li><span @mouseover="doMouseOver(6, $event)" @mouseout="doMouseOut(6)" v-text="images[6].name"></span></li>
            <li><span @mouseover="doMouseOver(7, $event)" @mouseout="doMouseOut(7)" v-text="images[7].name"></span></li>
          </ul>
          <strong>Photography Cara Delevingne</strong>
          <ul>
            <li><span @mouseover="doMouseOver(8, $event)" @mouseout="doMouseOut(8)" v-text="images[8].name"></span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ioMixins from '~/components/ioMixins'
import transform from 'dom-transform'
import vAboutCreditsImages from '~/components/about/AboutCreditsImages'
export default {
  name: 'AboutCredits',
  data(){
    return {
      begin: 0,
      isShown: true,
      images: [
        {'name': 'Aitken Jolly','img':'credits/natalie-portman/aitken-jolly.jpg'},
        {'name': 'Luc Besson','img':'credits/natalie-portman/luc-besson.jpg'},
        {'name': 'Carole Lambert','img':'credits/emma-watson/carole-lambert.jpg'},
        {'name': 'Cass Bird','img':'credits/emma-watson/cass-bird.jpg'},
        {'name': 'Malene Birger','img':'credits/emma-watson/malene-birger.jpg'},
        {'name': 'Ben Hassett','img':'credits/jennifer-lawrence/ben-hassett.jpg'},
        {'name': 'Evelyn Bencicova','img':'credits/jennifer-lawrence/evelyn-bencicova.jpg'},
        {'name': 'Mel and Adam','img':'credits/jennifer-lawrence/mel-and-adam.jpg'},
        {'name': 'Amber Fillerup Clark','img':'credits/cara-delevingne/amber-fillerup-clark.jpg'}
      ]
    }
  },
  components: { vAboutCreditsImages },
  mixins: [ioMixins],
  computed:{
    ...mapGetters(['getURI']),
    ...mapState(['packer'])
  },
  methods:{
    show() {
      if(this.isShown)return
      TweenMax.to(this.$refs.titre, 2,{ x:'0%', ease: Power3.easeOut})

      this.isShown = true
      TweenMax.staggerFromTo(this.$stagger, .8, { opacity: 0, x: -50 }, { opacity: 1, x: 0, force3D: true, clearProps: 'all', ease: Power3.easeOut }, .1)
    },
    hide() {
      if(!this.isShown)return
      this.isShown = false
      TweenMax.set(this.$refs.titre, {x: '-100%'})
        this.$stagger.forEach(element => {
        element.style.opacity = 0
      });
    },
    doMouseOver(id, e){
      this.$refs.images.show(id)
    },
    doMouseOut(id){
      this.$refs.images.hide(id)
    },
    tick() {
      if(this.active) {
        if(window.smooth.vars.current - this.begin > 150) this.show()
        this.$refs.images.tick()
      }
    },
    resize(w,h){
      this.w = w
      this.h = h
    }
  },
  watch: {
    active(val) {
      if(val) {
        this.begin = window.smooth.vars.current + (800 * this.h / 1760)
      }
    }
  },

  mounted(){
    this.$stagger = [].slice.call(this.$el.querySelectorAll('strong, li'))
    this.hide()
  }
}

</script>

<style lang="stylus" scoped>
.aboutCredit
  position relative
  font-size 26 * $unitH
  background $colors-dBlack
  .content
    padding-top 320 * $unitV
    padding-bottom 320 * $unitV
  .text
    position relative
    padding-left 6 * 160 * $unitH
    padding-top 204 * $unitH
    display flex
    .credits,
    .project
      position relative
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
    display block
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
