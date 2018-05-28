<template>
  <section class="container">
  </section>
</template>

<script>
import Displacement from '~/assets/js/Displacement'
if (process.browser) {
  var dat = require('dat.gui')
  var Pixi = require('pixi.js')
}
export default {
  methods:{
    setup () {
      let width = window.innerWidth
      let height = window.innerHeight
      this.renderer = Pixi.autoDetectRenderer({ backgroundColor: 0xFFFFFF, antialias: false, width, height})
      this.renderer.plugins.interaction.destroy()
      this.$el.appendChild(this.renderer.view)
      this.stage = new Pixi.Container()

        let img = new Image()
        img.src = 'images/beyond-beauty.png'
        let sprite = new Pixi.Sprite(new Pixi.Texture(new Pixi.BaseTexture(img)))
        sprite.interactive = false
        this.displacementTexture = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
        this.displacementTexture.width = width
        this.displacementTexture.height = height
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementTexture);
        this.stage.addChild(sprite)
        this.stage.addChild(this.displacementTexture)
        sprite.filters = [this.displacementFilter];
    },
    tick(){
      this.displacement.render();
      this.displacementTexture.texture.update();
      this.renderer.render(this.stage)
      requestAnimationFrame(this.tick.bind(this));
    }

  },
  mounted() {
    //console.log(window)
    window.gui = new dat.default.GUI({name: 'Blob'});
    this.canvas = document.createElement('canvas');
    this.$el.appendChild(this.canvas)
    this.canvas.height = 100
    this.canvas.width = 100

    this.displacement = new Displacement(this.canvas)

    this.displacement.canvas = this.canvas;
    this.displacement.init();
    this.setup()
    this.tick()

  }
}

</script>

<style>

</style>
