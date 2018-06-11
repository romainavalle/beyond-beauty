<template>
  <li class="MenuLink" :class="this.page.id">
    <router-link :to="{name:'story-pageId', params: { pageId: page.pageId }}">
      <img :src="img" alt="page.name" if="packer" draggable="false" ref="img">
      <strong v-text="page.name" ref="strong"></strong>
      </router-link>
  </li>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
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
    img(){
      return this.packer ? this.getURI(`menu/${this.page.id}.png`) : ''
    },
  },
  props:['page'],
  methods:{
    resize(w,h){
    },
    tick(x){
      TweenMax.set([this.$refs.img, this.$refs.strong], {x})
    }
  },
  mounted() {
  }
}

</script>

<style lang="stylus" scoped>
.MenuLink
  background $colors-black
  position relative
  margin 0 160 * $unitH
  user-select none
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
