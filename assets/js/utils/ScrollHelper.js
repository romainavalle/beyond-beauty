class ScrollHelper {

  constructor()  {
    this.scrollTop = 0
    if(process.browser){
      this.doc = document.documentElement
      window.addEventListener('scroll', () => this.onScroll())
    }
  }

  onScroll() {
    let scroll = (window.pageYOffset || this.doc.scrollTop)  - (this.doc.clientTop || 0)
    if(scroll != this.scrollTop){
      this.scrollTop = (window.pageYOffset || this.doc.scrollTop)  - (this.doc.clientTop || 0)
      this.scrollTop = Math.max(this.scrollTop,0)
    }
  }
}


export default new ScrollHelper();
