<template>
  <div class="StoryTop" :class="pages[currentPageIdNum].id">
    <div class="content">
      <div class="title">
        <h1 v-text="pages[currentPageIdNum].pageName"></h1>
        <div ref="title">
          <h2 v-text="pages[currentPageIdNum].name" :data-text="pages[currentPageIdNum].name" :class="textTopClass"></h2>
        </div>
      </div>
    </div>
    <button class="button bottom white">
      <span class="word">discover</span>
    </button>
    <div class="number" ref="number">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 527 447" v-if="currentPageIdNum === 0" preserveAspectRatio="xMidYMid slice">
        <path d="M156 3c14 0 29 4 44 12s30 22 45 39a240 240 0 0 1 45 76 283 283 0 0 1-33 246c-30 44-69 69-106 69-31 0-65-21-94-58a250 250 0 0 1-41-75 269 269 0 0 1-14-87c0-56 17-112 47-155 14-21 31-38 49-49 19-12 38-18 58-18m-31 42c-12 32-18 82-18 160 0 68 3 119 8 159 3 21 7 36 13 46s14 15 25 15c14 0 25-10 31-29 10-31 15-77 15-145v-29c-1-61-4-103-9-135-3-22-8-38-14-48-7-11-15-16-26-16s-20 8-25 22m30-44C74 1 0 107 0 225c0 62 19 118 55 164 30 37 65 58 95 58 81 0 157-111 157-228 0-64-20-121-61-167-29-34-60-51-90-51zm-2 422c-20 0-30-19-36-59-6-41-8-92-8-159 0-77 6-128 18-160 5-12 13-20 23-20 20 0 32 19 38 63 5 34 8 79 9 134v29c0 66-4 112-15 145-6 17-15 27-29 27z" class="cls-1"/>
        <path d="M488 2v348c0 24 2 39 8 52 5 12 14 21 28 30H362c28-18 36-38 36-82V161c0-41-7-54-35-61 20-11 49-30 66-42a364 364 0 0 0 59-56m2-2h-3a359 359 0 0 1-59 56c-19 14-49 33-68 43v2c29 7 36 19 36 60v189c0 44-8 63-36 81v3h167v-3c-29-17-37-37-37-81V0z" class="cls-1"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 583 457" v-if="currentPageIdNum === 1" preserveAspectRatio="xMidYMid slice">
        <path d="M156 2c14 0 29 4 44 12s30 22 45 39a240 240 0 0 1 45 76 283 283 0 0 1-33 246c-30 44-69 69-106 69-31 0-65-21-94-58a250 250 0 0 1-41-75 269 269 0 0 1-14-87c0-56 17-112 47-155 14-21 31-38 49-49 19-12 38-18 58-18m-31 42c-12 32-18 82-18 160 0 68 3 119 8 159 3 21 7 36 13 46s14 15 25 15c14 0 25-10 31-29 10-31 15-77 15-145v-29c-1-61-4-103-9-135-3-22-8-38-14-48-7-11-15-16-26-16s-20 8-25 22m30-44C74 0 0 106 0 224c0 62 19 118 55 164 30 37 65 58 95 58 81 0 157-111 157-228 0-64-20-121-61-167-29-34-60-51-90-51zm-2 422c-20 0-30-19-36-59-6-41-8-92-8-159 0-77 6-128 18-160 5-12 13-20 23-20 20 0 32 19 38 63 5 34 8 79 9 134v29c0 66-4 112-15 145-6 17-15 27-29 27z" class="cls-1"/>
        <path d="M465 3a100 100 0 0 1 102 108 133 133 0 0 1-9 50c-14 35-38 74-72 115l-28 34-8 9-7 8-34 38-4 4h5c57 0 88-6 118-22 22-12 36-25 52-47l-26 155c-3-8-6-11-11-15-9-6-24-9-49-9H335a64 64 0 0 1 5-8c7-8 15-20 25-35l5-7 33-51c23-37 39-69 50-98s16-55 16-78c0-42-27-73-65-73-23 0-42 10-60 32 6-21 9-30 17-46 22-40 61-64 104-64m0-2c-44 0-83 24-105 65-9 17-12 26-19 50l2 1c18-23 37-34 61-34 37 0 63 30 63 71 0 45-21 102-66 175-7 13-19 30-33 50l-29 43-7 8v3h162c24 0 40 3 48 8 5 4 7 7 11 16h3l27-162h-2c-17 24-31 38-54 50-29 16-60 22-117 22l42-47 36-43c34-42 58-81 72-116a135 135 0 0 0 9-50C569 47 526 1 465 1z" class="cls-1"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 569 454" v-if="currentPageIdNum === 2" preserveAspectRatio="xMidYMid slice">
        <path d="M156 2c14 0 29 4 44 12s30 22 45 39a240 240 0 0 1 45 76 283 283 0 0 1-33 246c-30 44-69 69-106 69-31 0-65-21-94-58a250 250 0 0 1-41-75 269 269 0 0 1-14-87c0-56 17-112 47-155 14-21 31-38 49-49 19-12 38-18 58-18m-31 42c-12 32-18 82-18 160 0 68 3 119 8 159 3 21 7 36 13 46s14 15 25 15c14 0 25-10 31-29 10-31 15-77 15-145v-29c-1-61-4-103-9-135-3-22-8-38-14-48-7-11-15-16-26-16s-20 8-25 22m30-44C74 0 0 106 0 224c0 62 19 118 55 164 30 37 65 58 95 58 81 0 157-111 157-228 0-64-20-121-61-167-29-34-60-51-90-51zm-2 422c-20 0-30-19-36-59-6-41-8-92-8-159 0-77 6-128 18-160 5-12 13-20 23-20 20 0 32 19 38 63 5 34 8 79 9 134v29c0 66-4 112-15 145-6 17-15 27-29 27z" class="cls-1"/>
        <path d="M448 3a101 101 0 0 1 70 28c19 18 29 41 29 66 0 27-14 55-39 76-11 9-16 13-37 26l-5 3 5 1c31 5 55 17 71 35s25 41 25 69c0 40-19 76-54 103s-83 41-136 41c-19 0-28 0-47-4 41-9 75-26 99-49 25-24 38-55 38-88 0-24-6-43-19-58-12-14-31-24-56-31 20-12 26-16 39-26 22-19 34-41 34-64 0-37-30-66-66-66-24 0-45 8-66 25 24-56 65-87 115-87m0-2c-52 0-94 33-118 91l2 1c22-18 43-26 67-26 35 0 64 28 64 64 0 22-12 44-33 62-14 11-19 15-41 28v2c52 12 76 40 76 87 0 66-54 119-140 136v2c22 5 31 5 52 5 110 0 192-62 192-146 0-58-34-95-97-106l38-26c25-22 39-50 39-78 0-53-45-96-101-96z" class="cls-1"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 643 447" v-if="currentPageIdNum === 3" preserveAspectRatio="xMidYMid slice">
        <path d="M156 2c14 0 29 4 44 12s30 22 45 39a240 240 0 0 1 45 76 283 283 0 0 1-33 246c-30 44-69 69-106 69-31 0-65-21-94-58a250 250 0 0 1-41-75 269 269 0 0 1-14-87c0-56 17-112 47-155 14-21 31-38 49-49 19-12 38-18 58-18m-31 42c-12 32-18 82-18 160 0 68 3 119 8 159 3 21 7 36 13 46s14 15 25 15c14 0 25-10 31-29 10-31 15-77 15-145v-29c-1-61-4-103-9-135-3-22-8-38-14-48-7-11-15-16-26-16s-20 8-25 22m30-44C74 0 0 106 0 224c0 62 19 118 55 164 30 37 65 58 95 58 81 0 157-111 157-228 0-64-20-121-61-167-29-34-60-51-90-51zm-2 422c-20 0-30-19-36-59-6-41-8-92-8-159 0-77 6-128 18-160 5-12 13-20 23-20 20 0 32 19 38 63 5 34 8 79 9 134v29c0 66-4 112-15 145-6 17-15 27-29 27z" class="cls-1"/>
        <path d="M560 15l-3 10a666 666 0 0 1-170 266l-4 4h104v-79c23-14 31-20 51-41 20-20 27-29 38-52v172h65v23h-65v31c0 20 2 32 5 44 4 12 10 20 25 34l5 4H455c12-8 19-18 24-30 6-13 8-29 8-52v-31H343a668 668 0 0 0 99-303h118m3-2H440c-3 91-44 218-99 304v3h144v29c0 44-9 66-33 82v2h162v-3l-7-5c-14-13-20-20-24-33-4-12-5-23-5-43v-29h65v-27h-65V119h-2c-12 25-18 33-39 55-20 21-29 27-52 40v79h-97c42-41 72-77 103-127 31-48 48-83 68-141l4-12z" class="cls-1"/>
      </svg>
      <p class="total">
        <span class="barre" ref="barre"></span>
        <span class="total-number" ref="totalNumber">04</span>
      </p>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data(){
    return {
      textTopClass: '',
      totalClass: ''
    }
  },
  computed:{
    ...mapState(['pages','isStoryVisible']),
    ...mapGetters(['currentPageIdNum']),
    color() {
      return this.pages[this.currentPageIdNum].color
    }
  },
  methods:{
    reset(){
      TweenMax.set(this.$refs.title, {opacity: 0})
      TweenMax.set(this.$refs.number, {opacity: 0, y: -80})
      TweenMax.set(this.$refs.totalNumber, {opacity: 0, x: -10})
      TweenMax.set(this.$refs.barre, {scaleY: 0})
    },
    show(){
      TweenMax.to(this.$refs.title, .5, {opacity: 1, ease: Quad.easeOut, onComplete:() => {
        setTimeout(() => { this.textTopClass = 'show' }, 1000)
      }})
      TweenMax.to(this.$refs.number, .5, {opacity: 1, y: 0, ease: Quad.easeOut})
      TweenMax.to(this.$refs.barre, .5, {delay:.5, scaleY: 1, ease: Quad.easeOut})
      TweenMax.to(this.$refs.totalNumber, .5, {delay:.5, opacity: 1, x: 0, ease: Quad.easeOut})

    }
  },
  watch: {
    isStoryVisible(val) {
      TweenMax.set(this.$el, {autoAlpha: val ? 0 : 1})
    }
  },
  mounted(){
    this.reset()
    setTimeout(this.show.bind(this), 1000)
  }
}

</script>

<style lang="stylus" scoped>
.StoryTop
  height 100vh
  overflow hidden
  position absolute
  width 100vw
  top 0
  left 0
  pointer-events none
  .content
    align-items flex-end
    bottom 0
    display flex
    justify-content center
    left 0
    position absolute
    right 0
    top 0
  .title
    height 400 * $unitV
    position relative
  h1
    position absolute
    left -5000px
  h2
    font-size 52 * $unitH
    text-align center
    line-height 1
    font-weight $light
    color $colors-grey
    position relative
    &:before
      content attr(data-text)
      top 0
      height 60 * $unitH
      position absolute
      background radial-gradient(rgba(255,255,255,1) 50%,rgba(255,255,255,0) 100%) no-repeat
      background-size 0px 0px
      background-position center center
      color transparent
      -webkit-color transparent
      transition background-size 1s ease-in-out-quad
      -webkit-background-clip text
    &.show:before
      background-size 600px 600px
  .number
    position absolute
    bottom 40 * $unitV
    right -60 * $unitH
    transform rotate(90deg)
    svg
      display block
      opacity .5
      fill white
      height 457 * $unitH
      width 583 * $unitH
    .total
      font-weight $semi
      font-size 26 * $unitH
      position absolute
      top 20%
      left 50%
      color $colors-white
      display flex
      .barre
        background $colors-white
        content ''
        display block
        margin-right 8px
        height 26 * $unitH
        width 3px
        transform-origin 0 0
  &.natalie-portman .number
    bottom 30 * $unitV
    right -67 * $unitH
    svg
      width 527 * $unitH
      height 447 * $unitH
  &.emma-watson .number
    right -88 * $unitH
    bottom 50 * $unitV
    svg
      width 583 * $unitH
      height 457 * $unitH
  &.jennifer-lawrence .number
    right -83 * $unitH
    bottom 25 * $unitV
    svg
      width 569 * $unitH
      height 454 * $unitH
  &.cara-delevingne .number
    right -124 * $unitH
    bottom 80 * $unitV
    svg
      width 643 * $unitH
      height 447 * $unitH
</style>
