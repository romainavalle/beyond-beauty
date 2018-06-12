<template>
  <section class="Facts">
    <p>She did more than just a speech...</p>
    <v-slider></v-slider>
    <v-timeline ref="timeline"></v-timeline>
  </section>
</template>

<script>
import vSlider from '~/components/facts/Slider.vue'
import vTimeline from '~/components/facts/Timeline.vue'
import { mapActions } from 'vuex'
export default {
  name: "Facts",
  data(){
    return {
    }
  },
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
  background $colors-white
  p
    font-size 20 * $unitH
    padding-top 320 * $unitV
    font-weight $semi
    text-align center
</style>
