<template>
  <transition v-on:leave="leave">
    <div class="Loader" v-if="!isAppReady"></div>
  </transition>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data(){
    return {
    }
  },
  computed:{
    ...mapState(['isAppReady']),
  },
  methods:{
    leave: function (el, done) {
      TweenMax.to(el, 1, {delay: .1, autoAlpha: 0, ease: Quad.easeInOut, onComplete: done})
    },
  }
}
</script>

<style lang="stylus">
.Loader
  position fixed
  background white
  top 0
  left 0
  right 0
  bottom 0
  z-index 99999
</style>
