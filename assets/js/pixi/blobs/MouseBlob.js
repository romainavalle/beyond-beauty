import MouseHelper from '~/assets/js/utils/MouseHelper'
class MouseBlob{
  constructor(shapeW = 200, isBlur = false) {
    this.scale = 0
    this.rotation = 0
    this.color = 'white'
    this.shapeW = shapeW
    this.ticker = 0
    this.isBlur = isBlur
    this.init()
  }
  init() {
    this.sprite = new PIXI.Sprite()
    this.graphs = [
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
      {graph: new PIXI.Graphics()},
    ]
    this.graphs.forEach((element, i) => {
    this.sprite.addChild(element.graph)
    })
    if(this.isBlur) {

      var blurFilter = new PIXI.filters.BlurFilter();
      blurFilter.blur = 10;
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
      filter.apply = function(filterManager, input, output) {
        this.uniforms.threshold = .5
        filterManager.applyFilter(this, input, output);
      }
      this.sprite.filters = [blurFilter, filter];
    }
  }
  show() {
    this.rotation = 0
    TweenMax.to(this, 1, {rotation: '+=30', scale: 1, ease: Power4.easeOut})
  }
  hide() {
    TweenMax.to(this, .5, {rotation: '+=30', scale: 0, ease: Power4.easeOut})
  }
  drawShape() {
    this.graphs.forEach((element, i) => {
      element.graph.clear()
      element.graph.beginFill(0xffffff )
      element.graph.drawCircle(0, 0, this.shapeW)
      element.direction = 1 - Math.random() * 2
      element.posX = (Math.cos(i / 8 * Math.PI * 2) * this.shapeW * .15)
      element.posY = (Math.sin(i / 8 * Math.PI * 2) * this.shapeW * .15)
      element.rotation = Math.random() * 360 * Math.PI * 2
      element.graph.endFill();
      element.graph.cacheAsBitmap = true
    });
  }

  resize(w, h, shapeW = 0) {
    this.shapeW = shapeW
    this.drawShape()
  }

  tick(color = 0xFFFFFF) {
    this.ticker += .008
    this.sprite.position.x = MouseHelper.easeSlowX
    this.sprite.position.y = MouseHelper.easeSlowY
    for (let index = 0; index < this.graphs.length; index++) {
      const element = this.graphs[index];
      element.graph.position.x = element.posX  + (Math.cos(this.ticker * (index + 1) / 8 * Math.PI * 2) * this.shapeW * .05) * element.direction
      element.graph.position.y = element.posY + (Math.sin(this.ticker * (index + 1) / 8 * Math.PI * 2) * this.shapeW * .05) * element.direction
      element.graph.scale.x = .95 + Math.cos(this.ticker * (index + 1) / 10 * Math.PI * 2) * .09
      element.graph.scale.y = .9 + Math.sin(this.ticker * (index + 1) / 10 * Math.PI * 2) * .09
      element.graph.rotation = element.rotation + element.direction * this.ticker / 360
    }
    this.sprite.rotation = this.rotation * Math.PI / 180
    this.sprite.scale.x = this.scale
    this.sprite.scale.y = this.scale
  }
}









export default MouseBlob
