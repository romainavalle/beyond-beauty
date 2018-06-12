<template>
  <div class="Timeline">
    <ul>
      <v-timeline-date v-for="(fact,i) in pageData.facts" :key="i" :fact="fact" :num="i"></v-timeline-date>
    </ul>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import vTimelineDate from '~/components/facts/TimelineDate.vue'

export default {
  name: "Timeline",
  data(){
    return {
    }
  },
  components: { vTimelineDate },
  computed:{
    ...mapGetters(['pageData'])
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
.Timeline
  position absolute
  width 100%
  bottom 240 * $unitV
  ul
    display flex
    justify-content space-between
    padding 0 320 * $unitH
    &:before
      content ''
      width 100%
      height 1px
      background $colors-black
      display block
      position absolute
      left -320 * $unitH

</style>
