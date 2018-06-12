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
  position relative
  width 100%
  .fade-fact-enter-active
    transition all 6s
  .fade-fact-leave-active
    transition all 8s
  .fade-fact-enter
    opacity 0
    transform translateY(0, 100 * $unitH)
  .fade-fact-leave-to
    opacity 0
    transform translateY(0, 100 * $unitH)
</style>
