<template>
  <div class="Timeline">
    <v-drag ref="drag"></v-drag>
    <ul>
      <v-timeline-date v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" :num="i"></v-timeline-date>
    </ul>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
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
    ...mapGetters(['pageData'])
  },
  methods:{
    tick() {
      if(this.$refs.drag) this.$refs.drag.tick()
    },
    resize(w, h) {
      if(this.$refs.drag) this.$refs.drag.resize(w, h)
    },
    show() {
    },
    hide() {
    }
  },
  mounted() {
  }
}

</script>

<style lang="stylus" scoped>
.Timeline
  position absolute
  width 100%
  height 350 * $unitH
  bottom 0 * $unitV
  &:before
    content ''
    width 100%
    height 1px
    background $colors-timelineBlack
    display block
    position absolute
    bottom 166 * $unitH
  ul
    display flex
    justify-content space-between
    padding 160 * $unitH 160 * $unitH

</style>
