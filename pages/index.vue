<template>
  <section class="Home">

    <p class="title"><span v-text="name"></span>&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;<span v-text="title"></span></p>
    <button v-text="button('prev')" class="prev" @click="nextPage(-1)"></button>
    <button v-text="button('next')" class="next" @click="nextPage(1)"></button>
  </section>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import data from '~/assets/data.json'
import { mapGetters, mapActions } from 'vuex';
export default {
  data(){
    return {
      isIdle: false
    }
  },
  computed: {
    ...mapGetters(['currentHomeSlideId']),
    name(){
      return this.currentHomeSlideId !== -1 ? data.pages[this.currentHomeSlideId].name : ''
    },
    title(){
      return this.currentHomeSlideId !== -1 ? data.pages[this.currentHomeSlideId].pageName : ''
    }
  },
  methods:{
    ...mapActions(['setCurrentHomeSlideId']),
    button(type){
      switch(this.currentHomeSlideId) {
        case 0:
          return type === 'prev' ? 'FOUR' : 'TWO'
        break
        case 1:
          return type === 'prev' ? 'ONE' : 'THREE'
        break
        case 2:
          return type === 'prev' ? 'TWO' : 'FOUR'
        break
        case 3:
          return type === 'prev' ? 'THREE' : 'ONE'
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
      if(id === data.pages.length)id = 0
      if(id === -1)id = data.pages.length - 1

      this.setCurrentHomeSlideId(id)

      clearTimeout(this.idleTimer)
      clearTimeout(this.nextPageTimer)
      this.nextPageTimer = setTimeout(this.nextPage.bind(this, 1), 10000)
      this.idleTimer = setTimeout(() => { this.isIdle = false}, 2000)
    },
  },
  beforeDestroy(){
    clearTimeout(this.nextPageTimer)
    clearTimeout(this.idleTimer)
  },
  mounted() {
    this.nextPageTimer = setTimeout(this.nextPage.bind(this, 1), 1000)
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
    font-size 14 * $unitH
    left 80 * $unitH
    position absolute
  button
    align-items center
    color black
    display flex
    letter-spacing $unitH * 4
    font-size 10 * $unitH
    font-weight $semi
    justify-content center
    left 50%
    position absolute
    text-transform uppercase
    pointer-events auto
    &:before,
    &:after
      background black
      content ''
      display block
      height 1px
      margin 0 10px
      width $unitV * 22
    &.prev
      top 0
      transform rotate(-90deg) translate(-100%, -50%)
      transform-origin 0% 0%
      &:after
        width $unitV * 40
        margin-right 0
    &.next
      bottom 0
      transform rotate(-90deg) translate(0%, 50%)
      transform-origin 0% 100%
      &:before
        width $unitV * 40
        margin-left 0

</style>
