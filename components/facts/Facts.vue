<template>
  <section class="Facts">
    <v-slider></v-slider>
    <v-timeline></v-timeline>
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
  computed:{
  },
  methods:{
    ...mapActions(['setCurrentFact']),
    show(){
    },
    hide(){
    }
  },
  mounted(){
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
</style>
