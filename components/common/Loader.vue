<template>
  <transition v-on:leave="leave">
    <div class="Loader" v-if="!isAppReady" @click="doClick" :class="{'clickable': isAppLoaded}">
      <div class="name" v-for="(page, i) in pages" :key="i" ref="name">
        <span class="name--top" v-html="getFirstName(i)"></span>
        <span class="name--bottom" v-html="getLastName(i)"></span>
      </div>
      <div class="text">
        <div class="content">
          <p :class="{'show': show}" data-text="Four women, mainly known for their appearence. Discover their real inner beauty.">Four women, mainly known for their appearence. Discover their real inner beauty.</p>
        </div>
      </div>
      <span class="loading" ref="loading">Loading</span>
    </div>
  </transition>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import Emitter from '~/assets/js/events'
export default {
  data(){
    return {
      currentName: -1,
      show: false
    }
  },
  computed:{
    ...mapState(['isAppReady','isAppLoaded','pages']),
  },
  methods:{
    ...mapActions(['setAppReady']),
    doClick(){
      if(!this.isAppLoaded)return
      this.setAppReady()
      Emitter.emit('HIDE_MOUSE')
      clearTimeout(this.changeTimer)
      clearTimeout(this.timingTimer)
    },
    textSplit(text) {
      const textSplit = text.split('')
      return '<span>' + textSplit.join('</span><span>') + '</span>'
    },
    getFirstName(i) {
      let name = this.pages[i].name.split(' ')[0]
      return this.textSplit(name)
    },
    getLastName(i) {
      let name = this.pages[i].name.split(' ')[1]
      return this.textSplit(name)
    },
    leave: function (el, done) {
      TweenMax.to(el, 1, {delay: .1, autoAlpha: 0, ease: Quad.easeInOut, onComplete: done})
    },
    changeName() {
      if(this.currentName !== -1) this.hideName()
      this.currentName++
      if(this.currentName === 4) this.currentName = 0
      this.timingTimer = setTimeout(() => {
        this.showName()
      }, 400)
    },
    showName() {
      const name = this.$refs.name[this.currentName]
      const top = [].slice.call(name.querySelectorAll('.name--top span'))
      const bottom = [].slice.call(name.querySelectorAll('.name--bottom span'))
      let delay = 0, index = 0
      name.style.opacity = 1;
      for (index = 0; index < top.length; index++) {
        if(index > 2)delay += .05
        TweenMax.fromTo(top[index], .5, {yPercent: 110, skewY: 10}, {delay, yPercent: 0, skewY: 0, force3D: true, ease: Power3.easeOut})
      }
      delay = .3
      for (index = 0; index < bottom.length; index++) {
        if(index > 2)delay += .05
        TweenMax.fromTo(bottom[index], .5, {yPercent: 110, skewY: 10}, {delay, yPercent: 0, skewY: 0, force3D: true, ease: Power3.easeOut})
      }
      this.changeTimer = setTimeout(this._changeName, 3000)
    },
    hideName() {
      const name = this.$refs.name[this.currentName]
      const top = [].slice.call(name.querySelectorAll('.name--top span'))
      const bottom = [].slice.call(name.querySelectorAll('.name--bottom span'))
      let delay = 0, index = 0
      name.style.opacity = 1;
      for (index = 0; index < top.length; index++) {
        if(index > 2)delay += .05
        TweenMax.to(top[index], .5 ,{delay, yPercent: -110, skewY: -10, force3D: true, ease: Power3.easeIn})
      }
      delay = .3
      for (index = 0; index < bottom.length; index++) {
        if(index > 2)delay += .05
        TweenMax.to(bottom[index], .5,{delay, yPercent: -110, skewY: -10, force3D: true, ease: Power3.easeIn})
      }
    }
  },
  watch:{
    isAppLoaded(){
      Emitter.emit('SET_MOUSE_TYPE', {type: 'enter'})
      Emitter.emit('SHOW_MOUSE')
      TweenMax.to(this.$refs.loading, 1, {opacity: 0, overwrite: 1, ease: Power4.easeOut})
    }
  },
  beforeDestroy() {
    clearTimeout(this.changeTimer)
    clearTimeout(this.timingTimer)
  },
  mounted(){
    this._changeName = this.changeName.bind(this)
    for (let index = 0; index < this.$refs.name.length; index++) {
      this.$refs.name[index].style.opacity = 0;
    }
    this.$refs.loading.style.opacity = 0
    TweenMax.to(this.$refs.loading, 1, {opacity: 1, ease: Power4.easeOut})
    setTimeout(() => {
      this.show = true
    }, 300)
    setTimeout(() => {
      this.changeName()
    }, 500)
  }
}
</script>

<style lang="stylus">
.Loader
  position fixed
  background $colors-black
  top 0
  left 0
  right 0
  bottom 0
  z-index 49
  &.clickable
    cursor pointer
  .loading
    font-size 26 * $unitH
    right 160 * $unitH
    bottom 150 * $unitH
    position absolute
    color $colors-white
    pointer-events none
  .text, .name
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    display flex
    justify-content center
    flex-direction column
  .name
    -webkit-text-fill-color none
    -webkit-text-stroke-color $colors-white
    -webkit-text-stroke-width .5px
    color $colors-black
    flex-wrap wrap
    font-family $hawthorn
    font-size 620 * $unitH
    opacity 0
    //letter-spacing 8 * $unitH
    line-height .8
    margin-left 160 * $unitH
    text-transform uppercase
    .name--top,
    .name--bottom
      overflow hidden
      display flex
      span
        display block
  .text p
    font-size 60 * $unitH
    font-weight $light
    margin-left 480 * $unitH
    position relative
    width 520 * $unitH
    color transparent
    transform translateZ(0.1px)
    &:before
      content attr(data-text)
      top 0
      right 0
      left 0
      bottom 0
      position absolute
      background radial-gradient(rgba(#f8ceb6,1) 20%,rgba(#f8ceb6,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      color transparent
      -webkit-color transparent
      transition background-size 1s ease-out-quad
      -webkit-background-clip text
    &.show:before
      background-size 600px 600px
</style>
