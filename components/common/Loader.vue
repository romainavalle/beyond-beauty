<template>
  <transition v-on:leave="leave">
    <div class="Loader" v-if="!isAppReady" @click="doClick" :class="{'clickable': isAppLoaded}">
      <div class="name" v-for="(page, i) in pages" :key="i" ref="name">
        <span class="name--top" v-html="getFirstName(i)"></span>
        <span class="name--bottom" v-html="getLastName(i)"></span>
      </div>
      <div class="text">
        <div class="content">
          <p :class="{'show': show}">Four women mainly<br>known for their appearance.<br>Discover their true<br>inner beauty.</p>
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
      show: false,
      isMouseShowed: false
    }
  },
  computed:{
    ...mapState(['isAppReady','isAppLoaded','pages']),
  },
  methods:{
    ...mapActions(['setAppReady']),
    doClick(){
      if(!this.isMouseShowed)return
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
      }, 700)
    },
    showName() {
      const name = this.$refs.name[this.currentName]
      const top = [].slice.call(name.querySelectorAll('.name--top span'))
      const bottom = [].slice.call(name.querySelectorAll('.name--bottom span'))
      let delay = 0, index = 0
      name.style.opacity = .2;
      //name.style.opacity = 1;
      for (index = 0; index < top.length; index++) {
        if(index > top.length - 3)delay += .05
        TweenMax.fromTo(top[index], .8, {yPercent: 110, skewY: 20, scaleY: 1.4}, {delay, yPercent: 0, skewY: 0, scaleY: 1, force3D: true, ease: Power4.easeOut})
      }
      delay = .1
      for (index = 0; index < bottom.length; index++) {
        if(index > bottom.length - 3)delay += .05
        TweenMax.fromTo(bottom[index], .8, {yPercent: 110, skewY: 20, scaleY: 1.4}, {delay, yPercent: 0, skewY: 0, scaleY: 1,force3D: true, ease: Power4.easeOut})
      }
      this.changeTimer = setTimeout(this._changeName, 3000)
    },
    hideName() {
      const name = this.$refs.name[this.currentName]
      const top = [].slice.call(name.querySelectorAll('.name--top span'))
      const bottom = [].slice.call(name.querySelectorAll('.name--bottom span'))
      let delay = 0, index = 0
      for (index = 0; index < top.length; index++) {
        if(index > top.length - 3)delay += .05
        TweenMax.to(top[index], .8,{delay, yPercent: -120, skewY: -10, scaleY: 1.2, force3D: true, ease: Power4.easeIn})
      }
      delay = .1
      for (index = 0; index < bottom.length; index++) {
        if(index > bottom.length - 3)delay += .05
        TweenMax.to(bottom[index], .8,{delay, yPercent: -120, skewY: -10, scaleY: 1.2, force3D: true, ease: Power4.easeIn})
      }
    }
  },
  watch:{
    isAppLoaded(){
      setTimeout(() => {
        Emitter.emit('SET_MOUSE_TYPE', {type: 'enter'})
        Emitter.emit('SHOW_MOUSE')
        this.isMouseShowed = true
        TweenMax.to(this.$refs.loading, 1, {opacity: 0, overwrite: 1, ease: Power4.easeOut})
      }, 1000)
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
    }, 200)
    this.changeTimer = setTimeout(() => {
      this.changeName()
    }, 1800)
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
    -webkit-text-stroke-color $colors-white
    -webkit-text-stroke-width .5px
    color $colors-black
    flex-wrap wrap
    font-family $hawthorn
    font-weight 500
    font-size 620 * $unitH
    opacity 0
    letter-spacing 10 * $unitH
    line-height .82
    margin-left 160 * $unitH
    text-transform uppercase
    .name--bottom
      margin-top -8 * $unitH
    .name--top,
    .name--bottom
      overflow hidden
      display flex
      span
        display block
        will-change transform
  .text p
    font-size 60 * $unitH
    font-weight $light
    line-height 1.5
    margin-left 480 * $unitH
    position relative
    width 800 * $unitH
    margin-top -34 * $unitH
    opacity 0
    transition opacity 3s ease-in-out-sine
    &.show
      opacity 1
    /*&:before
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
      background-size 600px 600px*/

    /*transform translateZ(0.1px)
    transition 1s
    clip-path ellipse(1px 1px at center)
    &.show
      clip-path ellipse(300px 300px at center)*/
</style>
