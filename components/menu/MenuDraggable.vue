<template>
  <nav class="MenuDraggable">
    <div class="content" ref="content">
      <ul>
        <v-menu-link v-for="(page,i) in pages" :key="i" :page="page" ref="link"></v-menu-link>
      </ul>
    </div>
  </nav>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import vMenuLink from '~/components/menu/MenuLink.vue'
import { pages } from '~/assets/data.json'
if (process.browser) {
  Draggable = require('gsap/Draggable')
  ThrowPropsPlugin = require('gsap/ThrowPropsPlugin')
}
export default {
  name: "menuDraggable",
  data(){
    return {
      pages,
      snapValues: [],
      currentId: 0
    }
  },
  components:{vMenuLink},
  methods:{
    tick() {
    },
    resize(w, h) {
      TweenMax.set(this.$el, {x: ResizeHelper.width() / 2 - ( 160 * 4 * ResizeHelper.width() / 2880)})
      this.$refs.link.forEach((el, i)=>{
        el.resize(w,h)
      })
      for (let i = 0; i< pages.length; i++) {
        this.snapValues.push(Math.round(-i * 160 * 8 * ResizeHelper.width() / 2880))
        this.$set(this.snapValues, i, Math.round(-i * 160 * 8 * ResizeHelper.width() / 2880))
      }
      if(this.draggable && this.draggable[0]){
        this.draggable[0].update()
        this.slideDraggable()
      }
    },
    slideDraggable(){
      TweenMax.set(this.$refs.content ,{
        x: -this.currentId * 160 * 8 * ResizeHelper.width() / 2880, force3D:true
      })
      this.draggable[0].update()
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
        snap: {
          x: this.snapValues
        },
        onThrowUpdate: ()=>{
          this.getNearestEl()
        },
        onDrag: () => {
          this.getNearestEl()
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
      this.resetDraggable()
      this.currentId = 0
      TweenMax.fromTo(this.$refs.content, .7, {x: ResizeHelper.width()}, {delay: .7, x: 0, ease: Quad.easeInOut, force3D:true})
      TweenMax.set(this.$el, {autoApha: 1})
    },
    onReady(){

    }

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
  .content
    background $colors-black
    position relative
    transform translate(0, -50%)
  ul
    position relative
    display flex
    flex-wrap nowrap

</style>
