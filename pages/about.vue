<template>
    <div class="About">
      <v-about-top></v-about-top>
      <div class="scrollContent" ref="scrollContent">
        <v-scroll-layout>
          <v-about-text></v-about-text>
          <v-about-credits></v-about-credits>
          <v-about-footer></v-about-footer>
        </v-scroll-layout>
      </div>
    </div>
</template>

<script>
import ScrollMixins from '~/components/ScrollMixins.js'
import vAboutTop from '~/components/about/AboutTop.vue'
import vAboutText from '~/components/about/AboutText.vue'
import vAboutCredits from '~/components/about/AboutCredits.vue'
import vAboutFooter from '~/components/about/AboutFooter.vue'
import Emitter from '~/assets/js/events';
export default {
  data(){
    return {
    }
  },
  mixins: [ScrollMixins],
  components: { vAboutTop, vAboutText, vAboutCredits, vAboutFooter },
  computed:{
  },
  methods:{
    tick(){
      this.checkScroll()
    },
    load(){
    },
    show(){
    },
    hide(){
    },
    resize(w,h){

    }
  },
  mounted(){
    Emitter.emit('SET_MOUSE_TYPE', {type: 'about'})
  }
}

</script>

<style lang="stylus" scoped>
.About
  position relative
  width 100%
  .scrollContent
    position relative
    width 100%
    height 100vh

</style>
