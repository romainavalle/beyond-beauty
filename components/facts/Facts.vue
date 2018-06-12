<template>
  <section class="Facts">
    <v-slider></v-slider>
    <v-timeline></v-timeline>
  </section>
</template>

<script>
import vSlider from '~/components/Facts/Slider.vue'
import vTimeline from '~/components/Facts/Timeline.vue'
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
  background $colors-white
</style>
