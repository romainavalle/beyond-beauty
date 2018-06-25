class MouseHelper {

  constructor () {
    this.x = 0
    this.y = 0
    this.easeX = 0
    this.easeY = 0
    this._mouseMoveHandler = this.mouseMoveHandler.bind(this)
    if(process.browser) window.addEventListener('mousemove', this._mouseMoveHandler)
  }

  mouseMoveHandler (e) {
    this.x = e.clientX
    this.y = e.clientY
  }
  tick() {
    const dX = this.x - this.easeX
    const dY = this.y - this.easeY
    this.easeX += dX / 10
    this.easeY += dY / 10
  }
}

export default new MouseHelper()
