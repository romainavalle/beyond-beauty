import { mapState, mapGetters, mapActions } from 'vuex'

import ResizeHelper from '~/assets/js/utils/ResizeHelper'
export default {
  data() {
    return {
      readyClass: ''
    }
  },
  computed: {
    ...mapState(['isAppReady']),
    ...mapGetters(['route']),
    canvasSize() {
      return {w: ResizeHelper.width() / 2880 * 320, h: ResizeHelper.width() / 2880 * 320}
    }
  },
  methods: {
    ...mapActions(['setMenuOpen']),
    show() {
      this.resize(null, null)
      setTimeout(() => {
        this.readyClass = 'show'
      }, 1000)
    },
    tick() {
      this.blob.tick()
      this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
      this.ctx.drawImage(this.blob.canvas, 0, 0, this.canvasSize.w, this.canvasSize.h);
    },
    resize(w, h) {
      this.$refs.canvas.width = this.canvasSize.w
      this.$refs.canvas.height = this.canvasSize.h
      this.blob.resize(this.canvasSize.w, this.canvasSize.h)
    },
  },
  beforeDestroy(){
  },
  mounted() {

  }
}
