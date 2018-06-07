<template>
  <div class="MenuCitations">
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
      this.$refs.citation[this.currentId].show(.5)
      this.citationTimer = setTimeout(this._next, 10000)
    },
    show() {
      this.citationTimer = setTimeout(this._next, 1000)
    },
    hide(){
      if(this.currentId === -1)return
      this.$refs.citation[this.currentId].hide()
      clearTimeout(this.citationTimer)
    }
  },
  beforeDestroy(){
    clearTimeout(this.citationTimer)
  },
  mounted() {
    this._next = this.next.bind(this)

  }
}

</script>

<style lang="stylus" scoped>
.MenuCitations
  bottom 181 * $unitV // cause citation are absolute -> fontsize
  left 160 * $unitH
  position absolute
  width 100%
</style>
