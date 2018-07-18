<template>
  <section class="Home" :class="{'ready' : isAppReady}">
    <strong class="title">
      <transition-group name="name" :duration="1000">
        <span class="innerTitle" v-for="(page,i) in pages" :key="i" v-show="i === currentHomeSlideId">
          <span v-text="name(i)"></span>

          <svg viewBox="0 0 16 16">
          <circle  cx="8" cy="8" r="1" class="point"/>
          <circle  cx="8" cy="8" r="7" class="bottom"/>
          <circle  cx="8" cy="8" r="7" class="timer" ref="timer"/>
          </svg>
          <span v-text="title(i)"></span>
        </span>
      </transition-group>
    </strong>
    <button class="prev buttonHome" @click="nextPage(-1)" aria-label="prev">
      <span class="word">
        <transition-group name="fade">
          <span class="trans" v-for="(page,i) in pages" :key="i" v-text="button(i+2)" v-show="i === currentHomeSlideId"></span>
        </transition-group>
      </span>
    </button>
    <button class="next buttonHome" @click="nextPage(1)" aria-label="next">
      <span class="word">
        <transition-group name="fade">
          <span class="trans" v-for="(page,i) in pages" :key="i" v-text="button(i)" v-show="i === currentHomeSlideId"></span>
        </transition-group>
      </span>
    </button>
  </section>
</template>
<script>
import Emitter from '~/assets/js/events';
import { mapState, mapActions } from 'vuex';
export default {
  data(){
    return {
      isIdle: false,
      isReady: false
    }
  },
  computed: {
    ...mapState(['currentHomeSlideId', 'isMenuOpen', 'isAppReady', 'pages'])
  },
  methods:{
    ...mapActions(['setCurrentHomeSlideId']),
    tick() {

    },
    name(id){
      return this.id !== -1 ? this.pages[id % 4].name : ''
    },
    title(id){
      return this.id !== -1 ? this.pages[id % 4].pageName : ''
    },
    button(id){
      switch(id % 4) {
        case 0:
          return 'TWO'
        break
        case 1:
          return 'THREE'
        break
        case 2:
          return 'FOUR'
        break
        case 3:
          return 'ONE'
        break
        default:
          return 'ONE'
        break
      }
    },
    nextPage(increment) {
      if(this.isIdle)return
      this.isIdle = true

      let id = this.currentHomeSlideId + increment
      if(id === this.pages.length)id = 0
      if(id === -1)id = this.pages.length - 1

      this.setCurrentHomeSlideId(id)

      clearTimeout(this.idleTimer)
      this.setTimer(10000)
      this.idleTimer = setTimeout(() => { this.isIdle = false}, 1500)
    },
    setTimer(time){
      if(this.nextPageTimer)clearTimeout(this.nextPageTimer)
      this.nextPageTimer = setTimeout(this.nextPage.bind(this, 1), time)
      if(this.currentHomeSlideId !== -1){
        this.$refs.timer[this.currentHomeSlideId].style.strokeDashoffset = 45
        TweenMax.to(this.$refs.timer[this.currentHomeSlideId], (time / 1000) - 1, {delay: 1,'stroke-dashoffset': 0, ease: Linear.easeInOut})
      }
    },
    setMouseWheelListener(){
      this._onWheel = this.onWheel.bind(this)
      window.addEventListener("mousewheel", this._onWheel, false);
      window.addEventListener("wheel", this._onWheel, false);
    },
    removeMouseWheelListener(){
      window.removeEventListener("mousewheel", this._onWheel, false);
      window.removeEventListener("wheel", this._onWheel, false);
    },
    setKeyEvents(){
      this._onKey = this.onKey.bind(this)
      document.addEventListener("keydown", this._onKey, false);
    },
    removeKeyEvents(){
      document.addEventListener("keydown", this._onKey, false);
    },
    onKey(e) {
      if(e.keyCode === 38) this.nextPage(-1)
      if(e.keyCode === 40) this.nextPage(1)
    },
    onWheel(e) {
      e.preventDefault()
      if(e.deltaY > 0) this.nextPage(1)
      if(e.deltaY < 0) this.nextPage(-1)
    },
    onReady(isFistLoad){
      if(this.isReady) return
      this.isReady = true
      let time = 10000
      if(isFistLoad || this.currentHomeSlideId === -1 ) time = 1000
      this.setTimer(time)
      if(process.browser){
        this.setMouseWheelListener()
        this.setKeyEvents()
      }
      Emitter.emit('SET_MOUSE_TYPE', {type: 'discover'})
    }
  },
  beforeDestroy(){
    if(process.browser){
      this.removeMouseWheelListener()
      this.removeKeyEvents()
    }
    clearTimeout(this.nextPageTimer)
    clearTimeout(this.idleTimer)
  },
  watch:{
    isMenuOpen(val){
      if(val){
        this.menuInitClose = false
        if(this.nextPageTimer) clearTimeout(this.nextPageTimer)
      }else{
        if(!this.menuInitClose) {
          this.menuInitClose = true
          this.setTimer(10000)
        }
      }
    }
  },

  mounted() {
    this.menuInitClose = true
  }
}

</script>

<style lang="stylus" scoped>
.Home
  height 100%
  overflow hidden
  position absolute
  top 0
  width 100%
  pointer-events none
  .title
    bottom 188 * $unitH
    font-size 20 * $unitH
    left 160 * $unitH
    position absolute
    font-weight normal
    .innerTitle
      position absolute
      display flex
      top 0
      left 0
      white-space nowrap
      align-content center
      svg
        fill none
        stroke white
        display block
        width 34 * $unitH
        height 34 * $unitH
        stroke $colors-grey
        transform translateX(-16 * $unitH) translateY(-6 * $unitH) translateZ(0px) rotate(-90deg) scale(1, 1)
        .point
          fill $colors-grey
        .bottom
          opacity .3
          stroke-width .25
        .timer
          stroke-dashoffset 45
          stroke-dasharray 45
          stroke-width 1px
      span
        display block
        will-change transform
      span:nth-child(1)
        transform translateX(0 * $unitH)
        margin-right 18px
      span ~ span
        transform translateX(0 * $unitH)
    .name-enter-active, .name-leave-active
      transition opacity .5s
      &:before
        transform translateX(-7 * $unitH)
      &:after
        transform translateX(7 * $unitH)
    .name-enter-active
      transition-delay .7s
    .name-enter, .name-leave-to
      opacity 0
      &:before,
      &:after
        transition transform .4s ease-out-quart
    .name-enter-active span, .name-leave-active span
      transition transform .5s
    .name-enter-active svg, .name-leave-active svg
      transition transform .5s
    .name-enter-active span
      transition-delay .7s
    .name-enter span:nth-child(1), .name-leave-to span:nth-child(1)
      transform translateX(-20 * $unitH)
    .name-enter span ~ span, .name-leave-to span ~ span
      transform translateX(20 * $unitH)
    .name-enter svg, .name-leave-to svg
      transform translateX(-10px) rotate(-90deg) scale(0.3, 0.3)
    +below('l')
      font-size 24 * $unitH
      .innerTitle svg
        transform translateX(-18 * $unitH) translateY(-2 * $unitH) translateZ(0px) rotate(-90deg) scale(1, 1)
    +above('hd')
      font-size 16 * $unitH
      .innerTitle svg
        transform translateX(-12 * $unitH) translateY(-8 * $unitH) translateZ(0px) rotate(-90deg) scale(1, 1)
  .buttonHome
    align-items center
    color $colors-black
    display flex
    letter-spacing $unitH * 4
    font-size 14 * $unitH
    font-weight $semi
    justify-content center
    left 50%
    position absolute
    text-transform uppercase
    pointer-events auto
    transition opacity .5s ease-in-quad, transform .5s ease-out-quart
    padding-top 10px
    padding-bottom 10px
    overflow hidden
    &:hover
      opacity .6
      /*transition letter-spacing .4s ease-out-quart
      letter-spacing $unitH * 8
      &:before,
      &:after
        transition transform .4s ease-out-quart
      &:before
        transform translateX(-7 * $unitH)
      &:after
        transform translateX(7 * $unitH)*/
    .word
      position relative
      width 100 * $unitH
      height 14 * 1.3 * $unitH
      transform translateX(3 * $unitH)
      &>span
        position relative
        display block
        width 100%
        height  100%
      .trans
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        text-align center
    +below('l')
      font-size 16 * $unitH
      .word
        height 16 * 1.3 * $unitH
    +above('hd')
      font-size 12 * $unitH
      .word
        height 12 * 1.3 * $unitH
    &:before,
    &:after
      background $colors-black
      content ''
      display block
      height 1px
      width $unitV * 40
      transition transform .3s ease-in-out-quad
    &.prev
      top 0
      transform rotate(-90deg) translate(0%, -50%)
      transform-origin 0% 0%
      &:after
        width $unitV * 80
        margin-right 0
    &.next
      bottom 0
      transform rotate(-90deg) translate(-100%, 50%)
      transform-origin 0% 100%
      &:before
        width $unitV * 80
        margin-left 0
  &.ready
    .prev
      transform rotate(-90deg) translate(-100%, -50%)
    .next
      transform rotate(-90deg) translate(0%, 50%)
  .fade-enter-active, .fade-leave-active
    transition opacity .5s
  .fade-enter-active
    transition-delay .5s
  .fade-enter, .fade-leave-to
    opacity 0


</style>
