
<template>
  <footer class="AboutFooter">
    <v-menu-citations ref="menuCitations" whiteBg="true"></v-menu-citations>
    <v-menu-footer ref="menuFooter"></v-menu-footer>
  </footer>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import vMenuCitations from '~/components/menu/MenuCitations.vue'
import vMenuFooter from '~/components/menu/MenuFooter.vue'
export default {
  data(){
    return {
    }
  },
  computed:{
    ...mapGetters(['getURI']),
    ...mapState(['packer'])
  },
  components: { vMenuCitations, vMenuFooter },
  methods:{

  },
  mounted(){
    this.$refs.menuCitations.show()
    this.$refs.menuFooter.show()
  }
}

</script>

<style lang="stylus" scoped>
.AboutFooter
  position relative
  height 640 * $unitV
  background $colors-bgWhite
</style>
<style lang="stylus">
.AboutFooter
  .MenuCitations.whiteBg
    bottom 320 * $unitV
    svg
      stroke $colors-grey
      opacity .2
    .MenuCitation
      p
        color $colors-black
  .MenuFooter
    bottom 280 * $unitV //160 - 2 lineheight
    a
      color $colors-black
</style>
