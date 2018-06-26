class MouseHelper {

  constructor () {
    this.x = -1000
    this.y = 0
    this.easeX = -1000
    this.easeY = 0
    this.easeSlowX = -1000
    this.easeSlowY = 0
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
    const dSlowX = this.x - this.easeSlowX
    const dSlowY = this.y - this.easeSlowY
    this.easeX += dX / 10
    this.easeY += dY / 10
    this.easeSlowX += dSlowX / 11
    this.easeSlowY += dSlowY / 11
  }
}

export default new MouseHelper()
