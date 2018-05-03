
<template>
  <section class="container">
    <v-blob ref="blob"></v-blob>
  </section>
</template>

<script>
import vBlob from '~/components/Blob.vue'
import Displacement from '~/assets/js/Displacement'
if (process.browser) {
  var dat = require('dat.gui')
  var Pixi = require('pixi.js')
}
export default {
  components:{vBlob},
  methods:{
    setup () {
      let width = window.innerWidth * 2
      let height = window.innerHeight * 2
      
      this.renderer = Pixi.autoDetectRenderer({ backgroundColor: 0xFFFFFF, antialias: false, width, height})
      this.renderer.plugins.interaction.destroy()
      this.$el.appendChild(this.renderer.view)
      this.stage = new Pixi.Container()
      this.container = new Pixi.Container()
      let baseSprite = new Pixi.Sprite.fromImage('images/beyond-beauty.png')
      let sprite = new Pixi.Sprite.fromImage('images/beyond-beauty-2.png')
      sprite.interactive = false
      baseSprite.interactive = false
      sprite.scale.x = sprite.scale.y = baseSprite.scale.x = baseSprite.scale.y = .5      
      this.blob = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.$refs.blob.canvas));
      this.blob.tint = 0xCC0000
      this.mask = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.$refs.blob.canvas));
      this.displacementTexture = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
      this.displacementTexture.width = width
      this.displacementTexture.height = height
      this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementTexture);
      this.container.addChild(sprite)
      this.container.addChild(this.displacementTexture)
      this.container.mask = this.mask
      this.stage.addChild(baseSprite)
      this.stage.addChild(this.blob)
      this.stage.addChild(this.container)
      this.stage.addChild(this.mask)
      sprite.filters = [this.displacementFilter];
    },
    tick(){
      this.displacement.render();
      this.displacementTexture.texture.update();
      this.blob.texture.update()
      this.mask.texture.update()
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
    this.$nextTick(()=>{
      this.setup()
      this.tick()
    })
   
  }
}

</script>

<style>

</style>
