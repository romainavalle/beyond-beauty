<template>
  <section class="container">
  </section>
</template>

<script>
import Displacement from '~/assets/js/pixi/Displacement'
import { mapGetters } from 'vuex'
if (process.browser) {
  var PIXI = require('pixi.js')
  var dat = require('dat.gui')
}
export default {
  layout:'dev',
  data(){
    return {
      scaleX: 80,
      scaleY: 80
    }
  },
  computed: {
    ...mapGetters(['getURI'])
  },
  methods:{
    tick(){
      this.displacement.tick();
      this.displacementFilter.scale.x = this.scaleX
      this.displacementFilter.scale.y = this.scaleY
      this.app.renderer.render(this.app.stage);
    },
    resize(w,h){
      this.displacement.resize(w,h)
    },
    load(){
      let img = new Image()
      this.sprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture.fromImage(this.getURI('titles/titles-border.png'))))
      this.sprite.interactive = false
      this.sprite.width = 800
      this.sprite.height = 163
      this.sprite.anchor.x = .5
      this.sprite.anchor.y = .75
      this.sprite.width = 2706
      this.sprite.height = 1500
      this.sprite.position.x = window.innerWidth / 2
      this.sprite.position.y = window.innerHeight / 2
      this.displacement = new Displacement()
      this.displacement.load(this.getURI)
      this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacement.sprite);
      this.displacementFilter.scale.x = 80
      this.displacementFilter.scale.y = 80
      this.app.stage.addChild(this.displacement.sprite)
      this.app.stage.addChild(this.sprite)
      this.sprite.filters = [this.displacementFilter];
    }

  },
  mounted() {
    console.log('teee')
    let width = window.innerWidth
    let height = window.innerHeight
    this.app = new PIXI.Application({
      backgroundColor: 0x000000,
      width,
      height,
      transparent: false,
      autoStart: false,
      antialias: false,
      powerPreference: "high-performance"
    });

    this.app.renderer.autoResize = true;
    PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE
    this.app.renderer.textureGC.mode = PIXI.GC_MODES.MANUAL
    var ticker = PIXI.ticker.shared;
    // Set this to prevent starting this ticker when listeners are added to it
    // By default this is true only on the PIXI.ticker.shared instance
    ticker.autoStart = false;
    // Call this to ensure the ticker is stopped right now
    ticker.stop();
    this.$el.appendChild(this.app.view)

    window.gui = new dat.default.GUI({name: 'Blob'});
    window.gui.add(this, 'scaleX', 1, 200)
    window.gui.add(this, 'scaleY', 1, 200)
  }
}

</script>

<style>

</style>
