<template>
  <section class="Facts">
    <span class="button top black">
      <span class="word">learn more</span>
    </span>
    <transition name="fadeFact">
      <p v-show="active">She did more than just a speech...</p>
    </transition>
    <transition name="fadeFact">
      <v-slider v-show="active" ref="slider"></v-slider>
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
      if(this.$refs.slider)this.$refs.slider.tick()
    },
    resize(w, h) {
      if(this.$refs.timeline)this.$refs.timeline.resize(w, h)
      if(this.$refs.slider)this.$refs.slider.resize(w, h)
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
  background $colors-bgWhite
  height (1760 + 80) * $unitV
  pointer-events auto
  position relative
  width 100%
  p
    font-size 20 * $unitH
    line-height 1
    padding-top 360 * $unitV
    font-weight normal
    text-align center
    color $colors-timelineBack
</style>
<style lang="stylus">
.fadeFact-enter-active
  transition all .8s ease-out-quart
.fadeFact-enter,
.fadeFact-leave-to
  opacity 0
  transform translateY(-100 * $unitH)
</style>
