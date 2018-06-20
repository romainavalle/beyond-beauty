'use strict'
import SmoothScroll from '~/assets/js/utils/SmoothScroll'
import classes from 'dom-classes'
import Emitter from '~/assets/js/events'
import support from '~/assets/js/utils/Support'

class Scroll extends SmoothScroll {
  constructor (opt = {}) {
    super(opt)

    this.isKeyDown = false
    this.directionUp = undefined

    this.debug = false
    this.oldTarget = 0
    this.oldAutomatic = false
    this.vars.automatic = false
    this.vars.oldTarget = false

    this.onScroll = () => {}
    this.onBeforeDebounce = () => {}
    this.onDebounce = () => {}
  }

  isKeyboardScrolling (keyCode) {
    return (keyCode === 38 || keyCode === 40 || keyCode === 32 || keyCode === 33 || keyCode === 34)
  }

  createBound () {
    ['onKeyDown', 'onKeyUp', 'onWheel', 'onTouchStart', 'onTouchMove', 'resize']
      .forEach((fn) => this[fn] = this[fn].bind(this))

    super.createBound()
  }

  addEvents () {
    super.addEvents()
    Emitter.on('GLOBAL:RESIZE', this.resize)
    if (support.hasWheelEvent) window.addEventListener('wheel', this.onWheel, false)
    if (support.hasMouseWheelEvent) window.addEventListener('mousewheel', this.onWheel, false)

    if (support.hasKeyDown) window.addEventListener('keydown', this.onKeyDown, false)
    if (support.hasKeyDown) window.addEventListener('keyup', this.onKeyUp, false)

    if (support.hasTouch) {
      window.addEventListener('touchstart', this.onTouchStart, false)
      window.addEventListener('touchmove', this.onTouchMove, false)
    }

    if (support.hasPointer && support.hasTouchWin) {
      this.bodyTouchAction = document.body.style.msTouchAction
      document.body.style.msTouchAction = 'none'
      window.addEventListener('MSPointerDown', this.onTouchStart, true)
      window.addEventListener('MSPointerMove', this.onTouchMove, true)
    }
  }

  removeEvents () {
    super.removeEvents()

    if (support.hasWheelEvent) window.removeEventListener('wheel', this.onWheel, false)
    if (support.hasMouseWheelEvent) window.removeEventListener('mousewheel', this.onWheel, false)

    if (support.hasKeyDown) window.removeEventListener('keydown', this.onKeyDown, false)
    if (support.hasKeyDown) window.removeEventListener('keyup', this.onKeyUp, false)

    if (support.hasTouch) {
      window.removeEventListener('touchstart', this.onTouchStart)
      window.removeEventListener('touchmove', this.onTouchMove)
    }

    if (support.hasPointer && support.hasTouchWin) {
      document.body.style.msTouchAction = this.bodyTouchAction
      window.removeEventListener('MSPointerDown', this.onTouchStart, true)
      window.removeEventListener('MSPointerMove', this.onTouchMove, true)
    }
  }

  onTouchStart () {
    // this.onBeforeDebounce()
  }

  onTouchMove () {
    // console.log('touchmove')
    clearTimeout(this.vars.timer2)

    if (!this.vars.ticking2) {
      this.vars.ticking2 = true
      this.oldAutomatic = this.vars.automatic
      this.vars.automatic = false
      setTimeout(() => {
        this.onBeforeDebounce()
      }, 200)
    }

    this.vars.timer2 = setTimeout(() => {
      this.vars.ticking2 = false

      this.onDebounce()
      this.vars.automatic = this.oldAutomatic
    }, 200)
  }

  onWheel (e) {
    clearTimeout(this.vars.timer2)

    if (!this.vars.ticking2) {
      this.vars.ticking2 = true
      this.oldAutomatic = this.vars.automatic
      this.vars.automatic = false
      setTimeout(() => {
        this.onBeforeDebounce()
      }, 200)
    }

    this.vars.timer2 = setTimeout(() => {
      this.vars.ticking2 = false

      this.onDebounce()
      this.vars.automatic = this.oldAutomatic
    }, 200)
  }

  onKeyDown (e) {
    if (this.isKeyDown || this.debug) return

    this.isKeyDown = true

    if (this.isKeyboardScrolling(e.keyCode)) {
      this.oldAutomatic = this.vars.automatic
      this.vars.automatic = false
      this.onBeforeDebounce()
    }
  }

  onKeyUp (e) {
    if (this.debug) return
    this.isKeyDown = false

    if (this.isKeyboardScrolling(e.keyCode)) {
      this.onDebounce()
      this.vars.automatic = this.oldAutomatic
    }
  }

  run () {
    super.run()

    this.dom.section.style[this.prefix] = this.getTransform(-this.vars.current.toFixed(2))

    if ((Math.round(this.vars.current)) !== this.vars.target) {
      Emitter.emit('GLOBAL:SCROLL', this.vars)
    }
    Emitter.emit('GLOBAL:TICK')
  }

  resize () {
    const bounding = this.dom.section.getBoundingClientRect()
    this.vars.bounding = this.vars.direction === 'vertical' ? bounding.height - (this.vars.native ? 0 : this.vars.height) : bounding.right - (this.vars.native ? 0 : this.vars.width)

    super.resize()
  }

  scrollTo (offset) {
    if (this.vars.native) {
      this.vars.direction === 'vertical' ? window.scrollTo(0, offset) : window.scrollTo(offset, 0)
    } else {
      this.vars.target = offset
      this.vars.ease = 0.05
      this.clampTarget()
    }
  }

  calc (e) {
    super.calc(e)

    this.setDirection()
  }

  setDirection () {

    if (this.vars.target > 60) {
      if (this.vars.target > this.vars.oldTarget) {
        if (this.directionUp || this.directionUp === undefined) {
          this.directionUp = false
          // Emitter.emit('GLOBAL:SCROLLDIRECTION', this.directionUp)
        }
      } else {
        if (!this.directionUp || this.directionUp === undefined) {
          this.directionUp = true
          // Emitter.emit('GLOBAL:SCROLLDIRECTION', this.directionUp)
        }
      }
    }

    this.vars.oldTarget = this.vars.target
  }

  debounce (e) {
    // console.log('automatic ', this.vars.automatonDebounceic)
    const win = this.dom.listener === document.body

    this.vars.target = this.vars.direction === 'vertical' ? win ? window.scrollY || window.pageYOffset : this.dom.listener.scrollTop : win ? window.scrollX || window.pageXOffset : this.dom.listener.scrollLeft

    this.onScroll()

    this.setDirection()

    clearTimeout(this.vars.timer)

    if (!this.vars.ticking) {
      this.vars.ticking = true
      classes.add(this.dom.listener, 'is-scrolling')
      // console.log('debounce', e)
      // console.log('send event')
    }

    this.vars.timer = setTimeout(() => {
      // this.onDebounce()
      this.vars.ticking = false
      classes.remove(this.dom.listener, 'is-scrolling')
    }, 200)
  }

  on () {
    super.on()
  }

  off () {
    super.off()
    this.oldTarget = this.vars.target
  }

  destroy () {
    Emitter.removeListener('GLOBAL:RESIZE', this.resize)
    super.destroy()
  }
}

export default Scroll
module.export = Scroll
