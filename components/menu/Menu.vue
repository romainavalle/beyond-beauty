<template>
  <div class="Menu">
    <div class="content content--top" ref="content">
      <v-menu-header ref="header"></v-menu-header>
    </div>
    <div class="line" ref="line"></div>
    <v-menu-draggable ref="menuDraggable"></v-menu-draggable>
    <div class="content content--bottom" ref="content">
      <v-menu-citations ref="menuCitations"></v-menu-citations>
      <v-menu-footer ref="footer"></v-menu-footer>
    </div>
  </div>
</template>

<script>
import vMenuLink from '~/components/menu/MenuLink.vue'
import vMenuHeader from '~/components/menu/MenuHeader.vue'
import vMenuFooter from '~/components/menu/MenuFooter.vue'
import vMenuCitations from '~/components/menu/MenuCitations.vue'
import vMenuDraggable from '~/components/menu/MenuDraggable.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: "menuEl",
  data(){
    return {
    }
  },
  components: {vMenuLink, vMenuDraggable, vMenuCitations, vMenuHeader, vMenuFooter},
  computed:{
    ...mapState(['isMenuOpen','isMenuVisible'])
  },
  methods:{
    ...mapActions(['setMenuVisible', 'setMenuCompletlyVisible']),
    tick() {
      if(this.isMenuVisible) {
        this.$refs.menuDraggable.tick()
        this.$refs.header.tick()
      }
    },
    resize(w, h) {
      this.$refs.menuDraggable.resize(w,h)
      this.$refs.header.resize(w,h)
    },
    show(){
      TweenMax.set(this.$el, {xPercent: 100, autoAlpha: 1})
      TweenMax.set(this.$refs.content, {xPercent: 0})
      TweenMax.set(this.$refs.line, {xPercent: 100})
      this.setMenuVisible(true)
      TweenMax.to(this.$el, .9, {xPercent: 0, ease: Expo.easeOut, onComplete: () => { this.setMenuCompletlyVisible(true) }})
      TweenMax.to(this.$refs.line, .9, {delay: .3, xPercent: 0, ease: Expo.easeOut})
      this.$refs.menuDraggable.show()
      this.$refs.header.show(.7)
      this.$refs.menuCitations.show(1.5)
      this.$refs.footer.show(2)
    },
    hide() {
      //TweenMax.to(this.$el, .7, {autoAlpha: 0})
      this.setMenuCompletlyVisible(false)
      TweenMax.to(this.$el, .9, {xPercent: -100, ease: Cubic.easeIn, onComplete: () => {this.setMenuVisible(false)}})
      TweenMax.to(this.$refs.content, .9, {xPercent: 100, ease: Cubic.easeIn})
      TweenMax.to(this.$refs.line, .9,{ xPercent: -100, ease: Quad.easeIn})

      this.$refs.menuDraggable.hide()
      this.$refs.menuCitations.hide()
      this.$refs.header.hide()
      this.$refs.footer.hide()
    },
    onReady(){
      TweenMax.set(this.$el, {autoAlpha: 0})
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
  overflow hidden
  .line
    width 100%
    height 1px
    position absolute
    top 50%
    left 0
    background $colors-grey
  .content
    position absolute
    width 100%
    z-index 1
    &.content--top
      top 0
    &.content--bottom
      bottom 0
</style>
