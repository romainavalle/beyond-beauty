class MouseHelper {

  constructor () {
    this.isFirst = true
    this.isMouseNeeded = false
    this.x = 500
    this.y = 500
    this.easeX = 500
    this.easeY = 500
    this.easeSlowX = 500
    this.easeSlowY = 500
    this._mouseMoveHandler = this.mouseMoveHandler.bind(this)
    if(process.browser) window.addEventListener('mousemove', this._mouseMoveHandler)
  }

  mouseMoveHandler (e) {
    this.x = e.clientX
    this.y = e.clientY
    if(this.isFirst && !this.isMouseNeeded){
      this.easeSlowX = this.easeX = this.x
      this.easeSlowY = this.easeY = this.y
    }
    this.isFirst = false
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
