<template>
  <div class="MenuCitations" :class="{'whiteBg' : whiteBg}">
    <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 80 62">
      <path fill="none" d="M36 0C19 10 0 14 0 41c0 8 3 13 8 17 21 14 41-25 14-31 2-13 9-19 15-27h-1zm29 27c2-13 9-19 15-27h-1C62 9 43 14 43 41c0 7 3 13 7 16 21 16 43-24 15-30z"/>
    </svg>
    <ul>
      <v-menu-citation v-for="(citation, i) in citations" :key="i" :citation="citation" ref="citation"></v-menu-citation>
    </ul>
  </div>
</template>

<script>
import { citations } from '~/assets/data.json'
import vMenuCitation from '~/components/menu/MenuCitation.vue'
export default {
  name: "MenuCitations",
  data(){
    return {
      citations,
      currentId: -1
    }
  },
  props: ['whiteBg'],
  components: { vMenuCitation },
  computed:{
  },
  methods:{
    next() {
      if(this.currentId !== -1) {
        this.$refs.citation[this.currentId].hide()
      }
      this.currentId++
      if(this.currentId === this.citations.length) this.currentId = 0
      this.$refs.citation[this.currentId].show(.8)
      this.citationTimer = setTimeout(this._next, 10000)
    },
    show(delay) {
      TweenMax.to(this.$el, 1.2,{delay: delay, opacity: 1, ease: Quad.easeOut})
      this.citationTimer = setTimeout(this._next, (delay * 1000) - 800)
    },
    hide(){
      if(this.currentId === -1)return
      this.$refs.citation[this.currentId].hide()
      clearTimeout(this.citationTimer)
      TweenMax.to(this.$el, .8, {opacity: 0, ease: Quad.easeIn})
    }
  },
  beforeDestroy(){
    clearTimeout(this.citationTimer)
  },
  mounted() {
    this._next = this.next.bind(this)
    this.$el.style.opacity = 0
  }
}

</script>

<style lang="stylus" scoped>
.MenuCitations
  bottom 181 * $unitV // cause citation are absolute -> fontsize
  left 80 * $unitH
  position absolute
  width 100%
  svg
    width 160 * $unitH
    height 118 * $unitH
    position absolute
    stroke white
    opacity .12
    stroke-width .5px
    left -113 * $unitH
    top -70 * $unitH
</style>
