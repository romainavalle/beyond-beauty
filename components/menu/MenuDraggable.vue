<template>
  <nav class="MenuDraggable">
    <div class="content" ref="content">
      <ul @mouseenter="doMouseEnter" @mouseleave="doMouseLeave">
        <v-menu-link v-for="(page,i) in pages" :key="i" :page="page" ref="link"></v-menu-link>
      </ul>
    </div>
  </nav>
</template>

<script>
import vMenuLink from '~/components/menu/MenuLink.vue'
import Emitter from '~/assets/js/events'
import { mapState } from 'vuex'
if (process.browser) {
  Draggable = require('gsap/Draggable')
  ThrowPropsPlugin = require('gsap/ThrowPropsPlugin')
}
export default {
  name: "menuDraggable",
  data(){
    return {
      snapValues: [],
      currentId: 0
    }
  },
  components:{vMenuLink},
  computed:{
    ...mapState(['pages'])
  },
  methods:{
    tick() {
     this.$refs.link.forEach((el, i) => {
        el.tick()
      })
    },
    doMouseEnter(){
      Emitter.emit('SET_MOUSE_TYPE', {type: 'drag'})
      Emitter.emit('SHOW_MOUSE')
    },
    doMouseLeave() {
      Emitter.emit('HIDE_MOUSE')
    },
    resize(w, h) {
      this.w = w
      TweenMax.set(this.$el, {x: this.w / 2 - ( 160 * 4 * this.w / 2880), y: '-50%'})
      this.$refs.link.forEach((el, i)=>{
        el.resize(w,h)
      })
      const size = Math.min(160 * 5 * this.w / 2880, 480)
      const margin = 160 * 2 * this.w / 2880
      for (let i = 0; i< this.pages.length; i++) {
        this.$set(this.snapValues, i, Math.round(-i * (size + margin)))
      }
      if(this.draggable && this.draggable[0]){
        this.slideDraggable()
      }
    },
    slideDraggable(){
      TweenMax.to(this.$refs.content , .5,{
        x: -this.currentId * 160 * 8 * this.w / 2880, force3D:true, ease: Quint.easeOut,onComplete:()=>{this.draggable[0].update()}
      })
    },
    resetDraggable(){
      this.draggable = Draggable.create(this.$refs.content , {
        type:"x",
        cursor: '-webkit-grab',
        force3D: true,
        dragClickables: true,
        allowNativeTouchScrolling: false,
        edgeResistance:1,
        dragResistance:.3,
        maxDuration: .6,
        lockAxis:true,
        throwProps:true,
        zIndexBoost: false,
        allowEventDefault: true,
        snap: {
          x: this.snapValues
        },
        onThrowUpdate: ()=>{
        },
        onRelease: () => {
          Emitter.emit('SCALE_MOUSE_UP')
        },
        onPress: () => {
          Emitter.emit('SCALE_MOUSE_DOWN')
        },
        onThrowComplete: () => {
          this.currentId = this.snapValues.indexOf(Math.round(this.draggable[0].x))
        }
      });
    },
    getNearestEl() {
      let min = 50000, currentEl = 0
      this.snapValues.forEach((val, i) => {
        const dist = Math.abs(val - this.draggable[0].x)
        if (dist < min) {
          min = dist
          currentEl = i
        }
      })
      this.currentId = currentEl
    },
    show(){
      if(window.smooth) window.smooth.removeEvents()
      this.$refs.link.forEach((el, i) => {
        el.show(i * .15)
      })
      this.resetDraggable()
      this.currentId = 0
      this.idleMouseWheel = false
      TweenMax.fromTo(this.$refs.content, .9, {x: this.w}, {delay: .8, x: 0, ease: Expo.easeOut, force3D:true})
      TweenMax.set(this.$el, {autoApha: 1})
    },
    hide() {
      if(window.smooth) window.smooth.addEvents()
      TweenMax.to(this.$refs.content, .9, {x: '+=' + this.w * .2, opacity: 0, ease: Cubic.easeIn, force3D:true, onComplete: () => {TweenMax.set(this.$refs.content, {x: 0, opacity: 1})}})
      this.$refs.link.forEach((el, i) => {
        el.hide()
      })
    },
    onReady(){
    },
  },
  beforeDestroy() {
  },
  mounted() {
    TweenMax.set(this.$el, {autoApha: 0})
  }
}

</script>

<style lang="stylus" scoped>
.MenuDraggable
  position absolute
  top 50%
  transform translate(0, -50%)
  .content
    padding 0 330 * $unitH
    margin-left -330 * $unitH
    background $colors-black
    position relative
  ul
    position relative
    display flex
    flex-wrap nowrap

</style>
