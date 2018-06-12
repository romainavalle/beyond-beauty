<template>
  <section class="Home" :class="{'ready' : isAppReady}">
    <strong class="title">
      <transition-group name="name">
        <span class="innerTitle" v-for="(page,i) in pages" :key="i" v-show="i === currentHomeSlideId">
          <span v-text="name(i)"></span><em></em><span v-text="title(i)"></span>
        </span>
      </transition-group>
    </strong>
    <button class="prev" @click="nextPage(-1)">
      <span class="word">
        <transition-group name="fade">
          <span class="trans" v-for="(page,i) in pages" :key="i" v-text="button(i+2)" v-show="i === currentHomeSlideId"></span>
        </transition-group>
      </span>
    </button>
    <button class="next" @click="nextPage(1)">
      <span class="word">
        <transition-group name="fade">
          <span class="trans" v-for="(page,i) in pages" :key="i" v-text="button(i)" v-show="i === currentHomeSlideId"></span>
        </transition-group>
      </span>
    </button>
  </section>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  data(){
    return {
      isIdle: false
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
      this.idleTimer = setTimeout(() => { this.isIdle = false}, 2000)
    },
    setTimer(time){
      if(this.nextPageTimer)clearTimeout(this.nextPageTimer)
      this.nextPageTimer = setTimeout(this.nextPage.bind(this, 1), time)
    },
    setMouseWheelListener(){
      this._onWheel = this.onWheel.bind(this)
      window.addEventListener("mousewheel", this._onWheel, false);
      window.addEventListener("DOMMouseScroll", this._onWheel, false);
    },
    removeMouseWheelListener(){
      window.removeEventListener("mousewheel", this._onWheel, false);
      window.removeEventListener("DOMMouseScroll", this._onWheel, false);
    },
    setKeyEvents(){
      this._onKey = this.onKey.bind(this)
      document.addEventListener("keydown", this._onKey, false);
    },
    removeKeyEvents(){
      document.addEventListener("keydown", this._onKey, false);
    },
    onKey(e) {
      if(e.keyCode === 38) this.nextPage(1)
      if(e.keyCode === 40) this.nextPage(1)
    },
    onWheel(e) {
      e.preventDefault()
      if(e.deltaY > 0) this.nextPage(1)
      if(e.deltaY < 0) this.nextPage(-1)
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
        if(this.nextPageTimer)clearTimeout(this.nextPageTimer)
      }else{
        this.setTimer(10000)
      }
    }
  },

  mounted() {
    const time = this.currentHomeSlideId === -1 ? 1000 : 10000
    if(process.browser){
      this.setMouseWheelListener()
      this.setKeyEvents()
    }
    this.setTimer(time)
    window.addEventListener("focus", this.setTimer.bind(this, 10000), false);
    window.addEventListener("blur", () => {
      if(this.nextPageTimer)clearTimeout(this.nextPageTimer)
    }, false);
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
    bottom 180 * $unitH
    font-size 20 * $unitH
    left 170 * $unitH
    position absolute
    font-weight normal
    .innerTitle
      position absolute
      display flex
      top 0
      left 0
      white-space nowrap
      align-content center
      em
        display block
        width 3px
        height 3px
        background $colors-grey
        border-radius 50%
        margin-top 8 * $unitH
      span
        display block
      span:nth-child(1)
        transform translateX(-10 * $unitH)
      span ~ span
        transform translateX(10 * $unitH)
    .name-enter-active, .name-leave-active
      transition opacity .5s
    .name-enter-active
      transition-delay .7s
    .name-enter, .name-leave-to
      opacity 0
    .name-enter-active span, .name-leave-active span
      transition transform .5s
    .name-enter-active span
      transition-delay .7s
    .name-enter span:nth-child(1), .name-leave-to span:nth-child(1)
      transform translateX(-20 * $unitH)
    .name-enter span ~ span, .name-leave-to span ~ span
      transform translateX(20 * $unitH)
  button
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
    transition letter-spacing .3s ease-in-quad
    padding-top 10px
    padding-bottom 10px
    overflow hidden
    &:hover
      transition letter-spacing .4s ease-out-quart
      letter-spacing $unitH * 8
      &:before,
      &:after
        transition transform .4s ease-out-quart
      &:before
        transform translateX(-7 * $unitH)
      &:after
        transform translateX(7 * $unitH)
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
    &:before,
    &:after
      background $colors-black
      content ''
      display block
      height 1px
      width $unitH * 22
      transition transform .3s ease-in-out-quad
    &.prev
      top 0
      transform rotate(-90deg) translate(0%, -50%)
      transform-origin 0% 0%
      &:after
        width $unitH * 40
        margin-right 0
    &.next
      bottom 0
      transform rotate(-90deg) translate(-100%, 50%)
      transform-origin 0% 100%
      &:before
        width $unitH * 40
        margin-left 0
  &.ready
    button
      transition transform .5s ease-out-quart 1s
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
