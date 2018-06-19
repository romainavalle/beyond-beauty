<template>
    <div class="Slider" :class="transName">
        <div class="slide-content" v-show="active">
          <transition :name="transName"  tag="div" appear>
            <v-slide v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" v-if="currentFact === i" ref="slide"></v-slide>
          </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import vSlide from '~/components/facts/Slide.vue'
import ioMixins from '~/components/ioMixins'

export default {
  name: "Slider",
  data(){
    return {
      transName: ""
    }
  },
  mixins: [ioMixins],
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
  watch:{
    currentFact(old, val) {
      this.$refs.slide[0].hide()
      if(old - val < 0) {
        this.transName = "factLeft"
      } else {
        this.transName = "factRight"
      }
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
  .slide-content
    position relative
    width 100%
    max-width 9 * 160 * $unitH
    margin 0 auto

</style>

<style lang="stylus">
.factLeft-leave-active,
.factRight-leave-active
  transition all 1.1s .5s
.factLeft-enter-active,
.factRight-enter-active
  transition all 1.1s linear 1.2s

.factLeft-enter-active p.top,
.factRight-enter-active p.top
  transition opacity .01s ease-out-quart .8s
.factLeft-leave-active p.top,
.factRight-leave-active p.top
  transition opacity .6s ease-in-quad !important
  color red

.factLeft-enter-active .line,
.factRight-enter-active .line
  transition all 1.2s ease-out-quart .8s

.factRight-enter-active .line:nth-child(3),
.factLeft-enter-active .line:nth-child(3)
  transition-delay 1.25s

.factRight-enter-active .line:nth-child(4),
.factLeft-enter-active .line:nth-child(4)
  transition-delay 1.3s

.factRight-enter-active .line:nth-child(5),
.factLeft-enter-active .line:nth-child(5)
  transition-delay  1.4s

.factRight-enter-active .line:nth-child(6),
.factLeft-enter-active .line:nth-child(6)
  transition-delay  1.5s

.factLeft-leave-active .line,
.factRight-leave-active .line
  transition all .8s ease-in-quad .5s

.factRight-leave-active .line:nth-child(3),
.factLeft-leave-active .line:nth-child(3)
  transition-delay .55s

.factRight-leave-active .line:nth-child(4),
.factLeft-leave-active .line:nth-child(4)
  transition-delay .6s

.factRight-leave-active .line:nth-child(5),
.factLeft-leave-active .line:nth-child(5)
  transition-delay  .7s

.factRight-leave-active .line:nth-child(6),
.factLeft-leave-active .line:nth-child(6)
  transition-delay  .8s

.factLeft-enter .line,
.factLeft-leave-to .line,
.factRight-enter .line,
.factRight-leave-to .line,
.factLeft-enter p.top,
.factLeft-leave-to p.top,
.factRight-enter p.top,
.factRight-leave-to p.top
  opacity 0

.factLeft-enter .line
  transform translateX(-400 * $unitH)
.factLeft-leave-to .line
  transform translateX(400 * $unitH)

.factRight-enter .line
  transform translateX(400 * $unitH)
.factRight-leave-to .line
  transform translateX(-400 * $unitH)
</style>
