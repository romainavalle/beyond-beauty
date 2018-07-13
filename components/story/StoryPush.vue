<template>
  <div class="StoryPush">
    <span class="name" ref="name"><span v-html="name"></span></span>
    <router-link :to="{name:'story-pageId', params: { pageId: pages[nextPageIdNum].pageId }}" @click.native="setPageTransition(true)">
      <span class="title" v-text="pages[this.nextPageIdNum].pageName"></span>
    </router-link>
  </div>
</template>
<script>
if(process.browser) {
  var transform = require('dom-transform');
}
import { mapActions, mapGetters, mapState } from 'vuex';
import ioMixins from '~/components/ioMixins'
export default {
  name: 'StoryPush',
  data(){
    return {
    }
  },
  mixins: [ioMixins],
  computed:{
    ...mapState(['pages']),
    ...mapGetters(['nextPageIdNum']),
    name() {
      return `${this.pages[this.nextPageIdNum].name}<em></em>0${this.nextPageIdNum + 1}`
    }
  },
  methods:{
    ...mapActions(['setPageTransition']),
    tick() {
      if(!this.active)return
      transform(this.$refs.name,{y: ( window.smooth.vars.current - window.smooth.vars.bounding) / 2})
    },
    onReady() {
      TweenMax.set(this.$refs.name,  {opacity: 1})
    },
    hide() {
      TweenMax.to(this.$refs.name, .6, {delay: .3, opacity: 0, ease: Power3.easeOut})
    }
  },
  mounted(){

  }
}

</script>

<style lang="stylus" scoped>
.StoryPush
  position relative
  width 100%
  height 50vh
  overflow hidden
  a
    display block
    position absolute
    top 0
    left 0
    bottom 0
    right 0
  span
    display block
    position absolute
  .title
    text-indent -50000px
  .name
    color $colors-speechdGrey
    font-size 26 * $unitH
    line-height 1
    top 50%
    left (160 - 26) * $unitH
    span
      align-items center
      justify-content center
      display flex
      transform translate(-50%, -50%) rotate(-90deg)
      position relative
    em
      width 4px
      height 4px
      display block
      margin 0 10px
      background $colors-speechdGrey
      border-radius 50%

</style>

<style lang="stylus">
.StoryPush em
  width 4px
  height 4px
  display block
  margin 0 10px
  background $colors-speechdGrey
  border-radius 50%
</style>
