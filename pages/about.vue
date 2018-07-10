<template>
    <div class="About">
      <v-about-top></v-about-top>
      <div class="scrollContent" ref="scrollContent">
        <v-scroll-layout>
          <v-about-text ref="text"></v-about-text>
          <v-about-credits ref="credits"></v-about-credits>
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
  head () {
    return {
      title: `Beyond Beauty | About`
    }
  },
  data(){
    return {
    }
  },
  mixins: [ScrollMixins],
  components: { vAboutTop, vAboutText, vAboutCredits, vAboutFooter },
  computed:{
  },
  methods:{
    tick() {
      this.checkScroll()
      this.$refs.credits.tick()
    },
    load() {
    },
    show() {
      this.$refs.text.show()
    },
    hide() {
      this.$refs.text.hide()
      this.$refs.credits.hide()
    },
    resize(w, h) {
      this.$refs.credits.resize(w, h)

    }
  },
  mounted() {
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
