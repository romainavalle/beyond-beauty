<template>
  <div class="Menu">
    <div class="line" ref="line"></div>
    <v-menu-header ref="header"></v-menu-header>
    <v-menu-draggable ref="menuDraggable"></v-menu-draggable>
    <v-menu-citations ref="menuCitations"></v-menu-citations>
    <v-menu-footer ref="footer"></v-menu-footer>
  </div>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import vMenuLink from '~/components/menu/MenuLink.vue'
import vMenuHeader from '~/components/menu/MenuHeader.vue'
import vMenuFooter from '~/components/menu/MenuFooter.vue'
import vMenuCitations from '~/components/menu/MenuCitations.vue'
import vMenuDraggable from '~/components/menu/MenuDraggable.vue'
import { pages } from '~/assets/data.json'
import { mapState } from 'vuex'

export default {
  name: "menuEl",
  data(){
    return {
      pages
    }
  },
  components: {vMenuLink, vMenuDraggable, vMenuCitations, vMenuHeader, vMenuFooter},
  computed:{
    ...mapState(['isMenuOpen'])
  },
  methods:{
    tick() {
      return
    },
    resize(w, h) {
      this.$refs.menuDraggable.resize(w,h)
    },
    show(){
      TweenMax.set(this.$el, {xPercent: 100, autoAlpha: 1})
      TweenMax.set(this.$refs.line, {xPercent: 100})
      TweenMax.to(this.$el, .7,{xPercent: 0, ease: Quad.easeInOut})
      TweenMax.to(this.$refs.line, .7,{delay:.35, xPercent: 0, ease: Quad.easeInOut})
      this.$refs.menuDraggable.show()
      this.$refs.header.show(1)
      this.$refs.footer.show(2)
      this.$refs.menuCitations.show()
    },
    hide() {
      TweenMax.to(this.$el, .7, {autoAlpha: 0})
      this.$refs.menuCitations.hide()
      this.$refs.header.hide()
      this.$refs.footer.hide()
    },
    onReady(){
    }
  },
  watch:{
    isMenuOpen: function(val) {
      if(val) {
        this.show()
      }else{
        this.hide()
      }
    }
  },
  mounted() {
    TweenMax.set(this.$el, {autoAlpha: 0})
    TweenMax.set(this.$el, {xPercent: 100, autoAlpha: 0})
  }
}

</script>

<style lang="stylus" scoped>
.Menu
  background $colors-black
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 15
  .line
    width 100%
    height 1px
    position absolute
    top 50%
    left 0
    background $colors-grey
</style>
