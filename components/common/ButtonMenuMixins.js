import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      readyClass: '',
      rotation: 0,
      scale: 0
    }
  },
  computed: {
    ...mapState(['isAppReady', 'route']),
    canvasSize() {
      return {w: 160, h: 160}
    }
  },
  methods: {
    ...mapActions(['setMenuOpen']),
    show() {
      TweenMax.set(this.$el, {autoAlpha: 1})
      this.resize(null, null)
      this.rotation = 0
      this.readyClass = 'opacity'
      TweenMax.to(this, 1, {rotation: '+=30', scale: 1, ease: Power4.easeOut})
      setTimeout(() => {
        this.readyClass = 'show'
      }, 1000)
    },
    doClick() {
      this.setMenuOpen(true)
      //TweenMax.to(this, .1, {scale:1, ease: Power4.easeIn, repeat: 1, yoyo:true})
    },
    doMouseEnter() {
      TweenMax.to(this, 1,{rotation: '+=15', scale: 1.1, ease: Power4.easeOut})
    },
    doMouseLeave() {
      TweenMax.to(this, 1,{rotation: '+=15', scale: 1, ease: Power4.easeOut})
    },
    hide(){
      this.readyClass = 'hide'
      TweenMax.to(this, 1,{rotation: '-=30', scale: 0, ease: Power4.easeOut, onComplete: () => {
        TweenMax.set(this.$el, {autoAlpha: 0})
        this.readyClass = ''
      }})
    },
    tick() {
      if(this.scale === 0)return
      this.blob.tick(this.rotation, this.scale)
      this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
      this.ctx.drawImage(this.blob.canvas, 0, 0, this.canvasSize.w, this.canvasSize.h);
    },
    resize(w, h) {
      this.$refs.canvas.width = this.canvasSize.w
      this.$refs.canvas.height = this.canvasSize.h
      this.blob.resize(this.canvasSize.w, this.canvasSize.h, 42)
    }
  },
  beforeDestroy(){
  },
  mounted() {
    TweenMax.set(this.$el, {autoAlpha: 0})
  }
}
