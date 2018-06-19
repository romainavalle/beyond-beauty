<template>
  <section class="Facts">
    <transition name="fadeFact">
      <p v-show="active">She did more than just a speech...</p>
    </transition>
    <transition name="fadeFact">
      <v-slider v-show="active"></v-slider>
    </transition>
    <v-timeline ref="timeline"></v-timeline>
  </section>
</template>

<script>

import vSlider from '~/components/facts/Slider.vue'
import ioMixins from '~/components/ioMixins'
import vTimeline from '~/components/facts/Timeline.vue'
import { mapActions } from 'vuex'
export default {
  name: "Facts",
  data(){
    return {
    }
  },
  mixins: [ioMixins],
  components: { vSlider, vTimeline },
  computed: {
  },
  methods: {
    ...mapActions(['setCurrentFact']),
    tick() {
      if(this.$refs.timeline)this.$refs.timeline.tick()
    },
    resize(w, h) {
      if(this.$refs.timeline)this.$refs.timeline.resize(w, h)
    },
    show() {
    },
    hide() {
    }
  },
  mounted() {
    this.setCurrentFact(2)

  }
}

</script>

<style lang="stylus" scoped>
.Facts
  position relative
  width 100%
  height 100vh
  background $colors-bgWhite
  p
    font-size 20 * $unitH
    line-height 1
    padding-top 300 * $unitV
    font-weight $semi
    text-align center
</style>
<style lang="stylus">
.fadeFact-enter-active
  transition all .8s ease-out-quart 1s
.fadeFact-enter,
.fadeFact-leave-to
  opacity 0
  transform translateY(100 * $unitH)
</style>
