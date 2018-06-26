export default {
  data() {
    return {
      active: false
    }
  },

  methods: {
    ioCb(e){
      if(e[0].intersectionRatio === 0){
        //console.log('IO', this.$options.name, 'inactive')
        this.active = false
      }else{
        console.log('IO', this.$options.name, 'active')
        this.active = true
      }
    }
  },
  beforeDestroy() {
    this.io.unobserve(this.$el);
  },
  mounted() {
    this.io = new IntersectionObserver(this.ioCb.bind(this))
    this.io.observe(this.$el);
  }
}
