<template>
  <div class="Timeline" :class="{'show': showClass}">
    <div class="line" ref="line"></div>
    <v-drag ref="drag"></v-drag>
    <ul>
      <v-timeline-date v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" :num="i" ref="fact"></v-timeline-date>
    </ul>
  </div>
</template>

<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import vTimelineDate from '~/components/facts/TimelineDate.vue'
import vDrag from '~/components/facts/Drag.vue'
import ioMixins from '~/components/ioMixins'


export default {
  name: "Timeline",
  data(){
    return {
      showClass: false
    }
  },
  mixins: [ioMixins],
  components: { vTimelineDate, vDrag },
  computed:{
    ...mapGetters(['pageData']),
    ...mapState(['currentFact'])
  },
  methods:{
    ...mapActions(['setCurrentFact']),
    tick() {
      if(this.active) this.$refs.drag.tick()
    },
    resize(w, h) {
      this.$refs.drag.resize(w, h)
    },
    show() {
      this.showClass = true
      let delay = 0
      this.$refs.fact.forEach((el, i) => {
        if(i == 0 || i === 4)delay = 2.5
        if(i == 1 || i === 3)delay = 1.5
        if(i == 2)delay = 3
        el.show(delay)
      })
      this.$refs.drag.show(2.5)
    },
    hide() {
      this.$refs.drag.hide()
      this.showClass = false
      this.$refs.fact.forEach(el => {
        el.hide()
      })
    },
    onKey(e) {
      if(e.keyCode === 37) this.setCurrentFact(Math.max(this.currentFact - 1, 0))
      if(e.keyCode === 39) this.setCurrentFact(Math.min(this.currentFact + 1, 4))
    }
  },
  watch: {
    active (val) {
      if(val) {
        this.show()
      }else{
        // this.hide()
      }
    }
  },
  beforeDestroy(){
    document.addEventListener("keydown", this._onKey, false);
  },
  mounted() {
    this._onKey = this.onKey.bind(this)
    document.addEventListener("keydown", this._onKey, false);
  }
}

</script>

<style lang="stylus" scoped>
.Timeline
  position absolute
  width 100%
  height 320 * $unitV
  bottom 40 * $unitV
  &.show .line
    opacity .3
    transform scale(1, 1)
    transition transform 2s ease-out-quart 1s, opacity  2s ease-out-quart 1s
  .line
    background $colors-timelineBlack
    bottom 111 * $unitV
    display block
    height 1px
    opacity 0
    position absolute
    transform scale(0, 1)
    width 100%
  ul
    display flex
    justify-content space-between
    padding 0 160 * $unitH
    position absolute
    left 0
    width 100%
    bottom 107 * $unitV
    pointer-events none

</style>
