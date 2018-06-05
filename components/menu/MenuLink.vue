<template>
  <li class="MenuLink">
    <router-link :to="{name:'story-pageId', params: { pageId: page.pageId }}">
      <img :src="img" alt="page.name" if="packer" draggable="false" ref="img">
      <strong v-text="page.name"></strong>
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
  img
    width 6 * 160 * $unitH
    display block
  strong
    position absolute
    bottom 0
    right 0
    color $colors-grey
    font-weight normal
    font-size 21 * $unitH
</style>
