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
  layout:'dev',
  methods:{
    setup () {
      let width = window.innerWidth
      let height = window.innerHeight
      this.renderer = Pixi.autoDetectRenderer({ backgroundColor: 0xFFFFFF, antialias: true, width, height})
      this.renderer.plugins.interaction.destroy()
      this.$el.appendChild(this.renderer.view)
      this.stage = new Pixi.Container()

        let img = new Image()
        img.src = 'images/titles-border/cara-delevingne-1.png'
        let sprite = new Pixi.Sprite(new Pixi.Texture(new Pixi.BaseTexture(img)))
        sprite.interactive = false
        sprite.width = 800
        sprite.height = 163
        sprite.anchor.x = .5
        sprite.anchor.y = .5
        sprite.position.x = width / 2
        sprite.position.y = height / 2
        this.displacementTexture = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.displacement.canvas));
        this.displacementTexture.width = width
        this.displacementTexture.height = height
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementTexture);
        this.stage.addChild(sprite)
        this.stage.addChild(this.displacementTexture)
        sprite.filters = [this.displacementFilter];
    },
    tick(){
      this.displacement.tick();
      this.displacementTexture.texture.update();
      this.renderer.render(this.stage)
    }

  },
  mounted() {
    //console.log(window)
    window.gui = new dat.default.GUI({name: 'Blob'});
    this.displacement = new Displacement(true)
    this.setup()
  }
}

</script>

<style>

</style>
