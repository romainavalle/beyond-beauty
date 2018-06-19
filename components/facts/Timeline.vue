<template>
  <div class="Timeline">
    <v-drag ref="drag"></v-drag>
    <ul>
      <v-timeline-date v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" :num="i"></v-timeline-date>
    </ul>
  </div>
</template>

<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import vTimelineDate from '~/components/facts/TimelineDate.vue'
import vDrag from '~/components/facts/Drag.vue'

export default {
  name: "Timeline",
  data(){
    return {
    }
  },
  components: { vTimelineDate, vDrag },
  computed:{
    ...mapGetters(['pageData']),
    ...mapState(['currentFact'])
  },
  methods:{
    ...mapActions(['setCurrentFact']),
    tick() {
      if(this.$refs.drag) this.$refs.drag.tick()
    },
    resize(w, h) {
      if(this.$refs.drag) this.$refs.drag.resize(w, h)
    },
    show() {
    },
    hide() {
    },
    onKey(e) {
      if(e.keyCode === 37) this.setCurrentFact(Math.max(this.currentFact - 1, 0))
      if(e.keyCode === 39) this.setCurrentFact(Math.min(this.currentFact + 1, 4))
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
  bottom 0
  &:before
    content ''
    width 100%
    height 1px
    background $colors-timelineBlack
    display block
    position absolute
    bottom 111 * $unitV
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
