<template>
  <div class="Slide" :class="readyClass" :data-x="x">
    <p>
      <span v-for="(line,i) in textArray" :key="i" v-html="line" class="line"></span>
    </p>
  </div>
</template>
<script>

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
if(process.browser) {
  var transform = require('dom-transform');
}
export default {
  name: "Slide",
  data(){
    return {
      readyClass: '',
      x: 0,
      currentX: 0
    }
  },
  props: ['fact', 'id'],
  computed:{
    textArray(){
      return this.fact.html.split('<br>')
    }
  },
  methods:{
    resize(w, h){
      this.w = w
      this.h = h
    },
    show(dir){
      const from = dir > 0 ? this.w / 2 : -this.w / 2
      TweenMax.fromTo(this, 1, {x: from}, {x: 0, onComplete: () => {
        this.readyClass = 'ready'
      }})
    },
    hide(dir){
      const to = dir > 0 ? this.w / 2 : -this.w / 2
      TweenMax.to(this, 1, {x: to})
      this.readyClass = ''
    },
    backToZero(){
      TweenMax.to(this, .5, {x: 0, ease: Elastic.easeOut})
    },
    tick(x) {
      if(x) this.x = x
      if(this.currentX === this.x)return
      this.currentX = this.x
      this.$el.style.opacity = 1 - (Math.abs(this.x) / (this.w / 2))
      for (let index = 0; index < this.$spans.length; index++) {
        transform(this.$spans[index], {translate3d:[this.x * (1 - (index * .1)), 0, 0]})
      }
    }
  },
  mounted(){
    this.$spans = [].slice.call(this.$el.querySelectorAll('p .line'))
    if(this.id !== 2){
      this.x = ResizeHelper.width()
    }else{
      this.readyClass = 'ready'
    }
  }
}

</script>

<style lang="stylus" scoped>
.Slide
  position absolute
  top 0
  left 0
  p
    -webkit-text-stroke-color $colors-timelineBlack
    -webkit-text-stroke-width .25px
    color $colors-bgWhite
    font-family $hawthorn
    font-size 140 * $unitH
    left 0
    line-height .9
    position absolute
    position relative
    right 0
    text-align center
    text-transform uppercase
    top 0
    span
      display block




</style>
<style lang="stylus">
.Slide
  strong
    position relative
    font-weight normal
    &:after
      transition opacity .4s ease-in-out-quart
      content attr(data-text)
      -webkit-text-stroke-color $colors-timelineBlack
      -webkit-text-stroke-width 1px
      opacity 0
      display block
      top .1 * 140 * $unitH
      left 0
      position absolute
      color $colors-timelineBlack
  &.ready strong:after
      opacity 1
      transition opacity .8s ease-in-out-quart


</style>

