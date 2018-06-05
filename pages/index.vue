<template>
  <section class="Home">
    <strong class="title">
      <transition-group name="name">
        <span class="innerTitle" v-for="(page,i) in pages" :key="i" v-show="i === currentHomeSlideId">
          <span v-text="name(i)"></span>·<span v-text="title(i)"></span>
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
import { pages } from '~/assets/data.json'
import { mapState, mapActions } from 'vuex';
export default {
  data(){
    return {
      isIdle: false,
      pages
    }
  },
  computed: {
    ...mapState(['currentHomeSlideId'])
  },
  methods:{
    ...mapActions(['setCurrentHomeSlideId']),
    name(id){
      return this.id !== -1 ? pages[id % 4].name : ''
    },
    title(id){
      return this.id !== -1 ? pages[id % 4].pageName : ''
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
      if(id === pages.length)id = 0
      if(id === -1)id = pages.length - 1

      this.setCurrentHomeSlideId(id)

      clearTimeout(this.idleTimer)
      this.setTimer(10000)
      this.idleTimer = setTimeout(() => { this.isIdle = false}, 2000)
    },
    setTimer(time){
      if(this.nextPageTimer)clearTimeout(this.nextPageTimer)
      this.nextPageTimer = setTimeout(this.nextPage.bind(this, 1), time)
    }
  },
  beforeDestroy(){
    clearTimeout(this.nextPageTimer)
    clearTimeout(this.idleTimer)
  },

  mounted() {
    const time = this.currentHomeSlideId === -1 ? 1000 : 10000
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
    bottom 80 * $unitH
    font-size 20 * $unitH
    left 80 * $unitH
    position absolute
    font-weight normal
    .innerTitle
      position absolute
      display flex
      top 0
      left 0
      white-space nowrap
      span
        display block
      span:nth-child(1)
        transform translateX(-10 * $unitH)
      span:nth-child(2)
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
    .name-enter span:nth-child(2), .name-leave-to span:nth-child(2)
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
    transition letter-spacing .5s ease-in-out-quad
    padding-top 10px
    padding-bottom 10px
    overflow hidden
    &:hover
      letter-spacing $unitH * 6
      &:before
        transform translateX(-5 * $unitH)
      &:after
        transform translateX(5 * $unitH)
    .word
      position relative
      width 60 * $unitH
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
      transition transform .5s ease-in-out-quad
    &.prev
      top 0
      transform rotate(-90deg) translate(-100%, -50%)
      transform-origin 0% 0%
      &:after
        width $unitH * 40
        margin-right 0
    &.next
      bottom 0
      transform rotate(-90deg) translate(0%, 50%)
      transform-origin 0% 100%
      &:before
        width $unitH * 40
        margin-left 0
  .fade-enter-active, .fade-leave-active
    transition opacity .5s
  .fade-enter-active
    transition-delay .5s
  .fade-enter, .fade-leave-to
    opacity 0


</style>
