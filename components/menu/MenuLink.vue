<template>
  <li class="MenuLink" :class="this.page.id">
    <router-link :to="{name:'story-pageId', params: { pageId: page.pageId }}">
      <img :src="img" alt="page.name" if="packer" draggable="false" ref="img">
      <strong v-text="page.name" ref="strong"></strong>
      <canvas ref="canvas"></canvas>
    </router-link>
  </li>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import MenuBustBlobs from '~/assets/js/blobs/MenuBustBlobs'
import { $colors } from '~/assets/variables.json'
import { mapState, mapGetters } from 'vuex'
export default {
  name: "menuEl",
  data(){
    return {
      imgW: 774,
      imgH: 832
    }
  },
  computed:{
    ...mapGetters(['getURI']),
    ...mapState(['packer']),
    canvasSize() {
      return {w: 5 * 160 *  ResizeHelper.width() / 2880, h: 5 * 160 * (ResizeHelper.width() / 2880) / (774/828)}
    },
    img(){
      return this.packer ? this.getURI(`menu/${this.page.id}.png`) : ''
    },
  },
  props:['page'],
  methods:{
    resize(w,h){
      this.$refs.canvas.width = this.canvasSize.w
      this.$refs.canvas.height = this.canvasSize.h
      this.blob.resize(this.canvasSize.w, this.canvasSize.h)
    },
    tick(x){
      TweenMax.set(this.$el, {x})

      this.blob.tick()
      this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
      this.ctx.drawImage(this.blob.canvas, 0, 0, this.canvasSize.w, this.canvasSize.h);
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d')
    this.blob = new MenuBustBlobs(this.canvasSize.w, this.canvasSize.h)
    this.blob.setColor($colors[this.page.id])
    this.blob.setBlobs(this.page.blobs)

  }
}

</script>

<style lang="stylus" scoped>
.MenuLink
  background $colors-black
  position relative
  margin 0 160 * $unitH
  user-select none
  canvas
    position absolute
    top 0
    left 0
    right 0
    bottom 0
  a
    display block
    position relative
  img
    width 5 * 160 * $unitH
    display block
  strong
    display block
    position absolute
    bottom 60 * $unitH
    right 100 * $unitH
    color $colors-grey
    font-weight normal
    font-size 21 * $unitH
  &.natalie-portman strong
    right 140 * $unitH
  &.emma-watson strong
    right 140 * $unitH
  &.jennifer-lawrence strong
    right 60 * $unitH
</style>
