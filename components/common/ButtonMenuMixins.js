import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      readyClass: ''
    }
  },
  computed: {
    ...mapState(['isAppReady']),
    ...mapGetters(['route'])
  },
  methods: {
    ...mapActions(['setMenuOpen']),
    show() {
      TweenMax.to(this.$el, 1, {delay: .5, autoAlpha: 1, ease: Quad.easeOut})
      setTimeout(() => {
        this.readyClass = 'show'
      }, 1000)
    }
  },
  mounted() {
    TweenMax.set(this.$el, {autoAlpha: 0})
  }
}
