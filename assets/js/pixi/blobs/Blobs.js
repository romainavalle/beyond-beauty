import Blob from '~/assets/js/pixi/blobs/Blob'
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
import MouseBlob from '~/assets/js/pixi/blobs/MouseBlob'
class Blobs {
  constructor() {
    this.sprite = new PIXI.Sprite()
    this.sprite.name = 'blobs'
    this.alpha = 0
    this.scale = 0
    this.actualScale = 1
    this.init()
  }
  init() {
    this.mouseBlob = new MouseBlob()
    this.sprite.addChild(this.mouseBlob.sprite)
    this.blobs = []
    const w = ResizeHelper.width()
    const h = ResizeHelper.height()
    for (let index = 0; index < 10; index++) {
      const blob = new Blob(index)
      blob.resize(w, h)
      this.sprite.addChild(blob.blobGraph)
      this.blobs.push(blob)
    }

    var blurFilter = new PIXI.filters.BlurFilter();
    //blurFilter.blur = 10;


// create filter
var fragSrc = [
  'precision mediump float;',
  'varying vec2 vTextureCoord;',
  'uniform sampler2D uSampler;',
  'uniform float threshold;',
  'void main(void)',
  '{',
  '    vec4 color = texture2D(uSampler, vTextureCoord);',
  '    vec3 mcolor = vec3(255.0, 255.0, 255.0);',
  '    if (color.a > threshold) {',
  '       gl_FragColor = vec4(mcolor, 1.0);',
  '    } else {',
  '       gl_FragColor = vec4(vec3(0.0), 0.0);',
  '    }',
  '}'
].join('\n')


const filter = new PIXI.Filter( null, fragSrc );
filter.apply = function(filterManager, input, output)
{
  this.uniforms.threshold = .5

  // draw the filter...
  filterManager.applyFilter(this, input, output);
}



    this.sprite.filters = [blurFilter, filter];
  }
  load(getter) {
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].load(getter);
    }
  }
  showMouse() {
    this.mouseBlob.show()
  }
  hideMouse() {
    this.mouseBlob.hide()
  }
  show() {
    if(this.isShown) return
    this.isShown = true
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].setBlob(true);
    }
    this.scale = this.actualScale
    this.alpha = 1
    //TweenMax.to(this, .3, { alpha: 1 })
    //TweenMax.to(this, 3, { scale: this.actualScale, ease: Power4.easeOut })
  }
  toggle() {
    if(!this.isShown) return
    TweenMax.to(this, 1, { scale: this.actualScale * 1.2, ease: CustomEase.create("custom", "M0,0,C0.3,0,0.298,1.044,0.498,1.044,0.704,1.044,0.698,0,1,0")/*ease: Power4.easeIn, repeat: 1, yoyo: true, yoyoEase: Bounce.easeOut*/ })
  }
  scaleTo(scale) {
    if(this.isShown) return
    this.actualScale = scale
    let delay = .5
    let time = 1
    if(scale === 1) {
      delay = .5
      time = 1
    }
    TweenMax.to(this, time, {delay, scale: this.actualScale, ease: Power4.easeOut })
  }
  hide() {
    this.alpha = 0
    this.scale = 0
    TweenMax.killTweensOf(this)
    this.tick()
    this.isShown = false
  }
  tick() {
    this.mouseBlob.tick()
    if(!this.isShown) return
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].tick(this.scale, this.alpha);
    }
  }

  resize(w, h, shapeW) {

    this.mouseBlob.resize(w, h, shapeW)
    for (let index = 0; index < this.blobs.length; index++) {
      this.blobs[index].resize(w, h)
    }
  }

}




export default Blobs
