import Blob from '~/assets/js/canvasBlob/Blob'
class Blobs {
  constructor(debug = false) {
    this.debug = debug
    this.init()
  }
  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')
    this.blobs = []
    for (let index = 0; index < 8; index++) {
      const blob = new Blob(this.ctx, index, false)
      this.blobs.push(blob)
    }
  }
  tick(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.blobs.forEach(element => {
      element.render();
    });
  }

  resize(w, h) {
    this.canvas.width = w
    this.canvas.height = h
  }

}

export default Blobs
