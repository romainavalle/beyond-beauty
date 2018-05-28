class MouseHelper {

  constructor () {
    this.x = 0
    this.y = 0
    this._mouseMoveHandler = this.mouseMoveHandler.bind(this)
    if(process.browser) window.addEventListener('mousemove', this._mouseMoveHandler)
  }

  mouseMoveHandler (e) {
    this.x = e.clientX
    this.y = e.clientY
  }
}

export default new MouseHelper()
