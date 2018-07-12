

import { mapActions } from 'vuex';
import Emitter from '~/assets/js/events';
import vScrollLayout from '~/components/layout/ScrollLayout.vue'

if(process.browser){
  var Hammer = require('hammerjs');
}
export default {
  data(){
    return {
      scrollTop: 0,
      isReady: false,
      isShown: false
    }
  },
  components: { vScrollLayout },
  methods:{
    ...mapActions(['setCanvasVisible']),
    doReady(){
      if(this.isReady) return
      this.isReady = true
      this.hammerPanel = new Hammer.Manager(this.$root.$el)
      this.hammerPanel.add(new Hammer.Swipe());
      if(process.browser)this.setMouseWheelListener()
    },
    checkScroll(){
      if(!window.smooth)return
      if(this.scrollTop != window.smooth.vars.current.toFixed(1)){
        this.scrollTop = window.smooth.vars.current.toFixed(1)
      }
    },
    setMouseWheelListener(){
      this.$root.$el.addEventListener("mousewheel", this._doWheel, false);
      this.$root.$el.addEventListener("wheel", this._doWheel, false);
      this.hammerPanel.on('swipeup', this._checkSwipe)
    },
    removeMouseWheelListener(){
      this.$root.$el.removeEventListener("mousewheel", this._doWheel, false);
      this.$root.$el.removeEventListener("wheel", this._doWheel, false);
      this.hammerPanel.off('swipeup', this._checkSwipe)
    },

    doWheel(e) {
      if(this.scrollTop < 50){
        e.preventDefault();
        if(e.deltaY > 0 ){
          this.panDown()
        } else {
          this.panUp()
        }
      }
    },
    checkSwipe(e) {
      if(this.scrollTop < 50){
        e.preventDefault();
        if(e.type === 'swipeup'){
          this.panDown()
        }
        if(e.type === 'swipedown'){
          this.panUp()
        }
      }
    },
    panDown() {
      if(this.isShown)return

      Emitter.emit('PAGE:PANDOWN')
      TweenMax.to(this.$refs.scrollContent, 1, {yPercent: 0, clearProps: 'all', ease: Power4.easeInOut, onComplete: () => {
        window.smooth.addEvents(true)
        this.setCanvasVisible(false)
      }})
      this.show()
      this.isShown = true
      Emitter.emit('GLOBAL:RESIZE')
    },
    panUp() {
      if(!this.isShown)return
      Emitter.emit('PAGE:PANUP')
      this.setCanvasVisible(true)
      window.smooth.vars.target = 0
      window.smooth.removeEvents(true)
      TweenMax.to(this.$refs.scrollContent, 1, {yPercent: 100, ease: Power4.easeInOut})
      this.hide()
      this.isShown = false
    }
  },
  beforeDestroy() {
    this.removeMouseWheelListener()
    Emitter.removeListener('PAGE_SCROLL', this._panDown)
  },
  mounted(){
    this._doWheel = this.doWheel.bind(this)
    this._checkSwipe = this.checkSwipe.bind(this)
    this._panDown = this.panDown.bind(this)
    this._panUp = this.panUp.bind(this)
    this.isReady = false

    TweenMax.set(this.$refs.scrollContent,  {yPercent: 100})
    this.setCanvasVisible(true)
    this.$nextTick(()=>{
      window.smooth.removeEvents(true)
      window.smooth.resize()
    })
    Emitter.on('PAGE_SCROLL', this._panDown)
  }
}

