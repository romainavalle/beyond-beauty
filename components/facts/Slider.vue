<template>
  <div class="Slider">
    <transition-group name="fadeFact"  tag="div" appear>
      <v-slide v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" v-if="currentFact === i"></v-slide>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import vSlide from '~/components/facts/Slide.vue'

export default {
  name: "Slider",
  data(){
    return {
    }
  },
  components: { vSlide },
  computed:{
    ...mapGetters(['pageData']),
    ...mapState(['currentFact'])
  },
  methods:{
    show(){
    },
    hide(){
    }
  },
  mounted(){
  }
}

</script>

<style lang="stylus" scoped>
.Slider
  padding-top 160 * $unitV
  position relative
  width 100%
  .fadeFact-enter-active
    transition all .8s ease-out-quart .5s
  .fadeFact-leave-active
    transition all .5s ease-in-quad
  .fadeFact-enter
    opacity 0
    transform translateY(100 * $unitH)
  .fadeFact-leave-to
    opacity 0
    transform translateY(-100 * $unitH)
</style>
