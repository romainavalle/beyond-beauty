<template>
  <transition v-on:leave="leave">
    <div class="Loader" v-if="!isAppReady" @click="doClick" :class="{'clickable': isAppLoaded}">
      <div class="name" v-for="(page, i) in pages" :key="i" ref="name">
        <span class="name--top" v-html="getFirstName(i)"></span>
        <span class="name--bottom" v-html="getLastName(i)"></span>
      </div>
      <div class="text" ref="text">
        <div class="content" :class="{'show': show}">
          <p v-html="intro.text" class="text"></p>
          <p v-html="intro.html" class="html" ref="html"></p>
        </div>
      </div>
      <span class="loader" ref="loader"><div class="bar"></div></span>
      <span class="loading" ref="loading">Loading</span>
      <span class="enter" ref="enter" v-if="isTablet">Enter</span>
    </div>
  </transition>
</template>

<script>
import SoundHelper from '~/assets/js/utils/SoundHelper'
import { mapState, mapGetters, mapActions } from 'vuex'
import Emitter from '~/assets/js/events'

export default {
  data(){
    return {
      currentName: -1,
      show: false,
      isActive: false,
      isMouseShowed: false,
      currentSpan: 0
    }
  },
  computed:{
    ...mapState(['isAppReady','isAppLoaded','pages', 'intro']),
    ...mapGetters(['isTablet'])
  },
  methods:{
    ...mapActions(['setAppReady']),
    tick() {
      if(!this.isActive) return
      if(this.isTablet) return
      const pos = SoundHelper.getPos()
      if(pos > this.time_array[this.currentSpan]){
        const textSplit = this.$spans[this.currentSpan].innerText.split(' ')
        const text = '<span>' + textSplit.join('</span> <span>') + '</span>'
        let time =  this.duration - this.time_array[this.currentSpan]
        if(this.time_array[this.currentSpan + 1])time = this.time_array[this.currentSpan + 1] - this.time_array[this.currentSpan]
        const stagger = (time) / textSplit.length
        this.$spans[this.currentSpan].innerHTML = text
        this.$spans[this.currentSpan].style.opacity = 1
        TweenMax.staggerFromTo(this.$spans[this.currentSpan].querySelectorAll('span'), .3,{opacity: 0}, {opacity: 1, ease:Quad.easeOut}, stagger)
        this.currentSpan++
      }
    },
    doClick(){
      if(!this.isMouseShowed)return
      if(!this.isTablet) SoundHelper.fadeOut()
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
      TweenMax.to(this.$refs.text, .6, {delay: .4, autoAlpha: 0, ease: Quad.easeInOut})
      TweenMax.to(this.$refs.name, .6, {delay: .5, autoAlpha: 0, ease: Quad.easeInOut})
      TweenMax.to(el, 1, {delay: 1, autoAlpha: 0, ease: Quad.easeInOut, onComplete: done})
    },
    changeName() {
      if(this.currentName !== -1) this.hideName()
      this.currentName++
      if(this.currentName === 4) this.currentName = 0
      this.timingTimer = setTimeout(this.showName.bind(this), 700)
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
      if(this.isTablet && this.currentName === 3) this.doClick()
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
        TweenMax.to(this.$refs.loader.querySelector('.bar'), .3, {scaleX: 1, ease: Linear.easeInOut})
        TweenMax.to(this.$refs.loader, 1, {delay:.3, opacity: 0, overwrite: 1, ease: Power4.easeOut})
        TweenMax.to(this.$refs.loading, 1, {delay:.3, opacity: 0, overwrite: 1, ease: Power4.easeOut})

        if(this.isTablet)TweenMax.to(this.$refs.enter, 1, {delay:1, opacity: 1, overwrite: 1, ease: Power4.easeOut})
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
    TweenMax.to(this.$refs.loading, .3, {opacity: 1, ease: Power4.easeOut})
    this.$refs.loader.style.opacity = 0
    TweenMax.to(this.$refs.loader, .3, {opacity: 1, ease: Power4.easeOut})
    TweenMax.to(this.$refs.loader.querySelector('.bar'), 3, {scaleX: .9, ease: Linear.easeInOut})
    //
    if(this.isTablet)this.$refs.enter.style.opacity = 0
    this.$spans = [].slice.call(this.$refs.html.querySelectorAll('span'))
    this.time_array = this.$spans.map(el => {return parseFloat(el.dataset.time)})

    this.$spans.forEach(element => {
      element.style.opacity = 0
    });
    //
    setTimeout(() => {
      this.show = true
      if(this.isTablet) TweenMax.staggerTo(this.$spans, .3, {delay:1, opacity: 1} , .2)
    }, 200)
    this.changeTimer = setTimeout(() => {
      if(!this.isTablet) SoundHelper.createSound('intro')
      this.isActive = true
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
  .loading, .enter
    font-size 24 * $unitH
    right 160 * $unitH
    bottom 160 * $unitH
    position absolute
    color $colors-white
    pointer-events none
    +above('hd')
      font-size 20 * $unitH
      bottom 162 * $unitH
  .loader
    left 160 * $unitH
    bottom 160 * $unitH
    position absolute
    background $colors-grey
    pointer-events none
    height 1px
    width 160 * $unitH
    .bar
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      background white
      transform-origin 0 0
      transform scale(0,1)
      will-change transform
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
      padding-left 50 * $unitH
      span
        display block
        will-change transform
  .text .content
    margin-left 480 * $unitH
    position relative
    margin-top -34 * $unitH
    p
      position relative
      display block
      font-size 60 * $unitH
      font-weight $light
      line-height 1.5
      transition opacity 3s ease-in-out-sine
      opacity 0
      color $colors-grey
      &.html
        position absolute
        left 0
        top 0
        color $colors-white
    +above('hd')
      margin-top -42 * $unitH
      p
        font-size 46 * $unitH
  .text .content.show p
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
