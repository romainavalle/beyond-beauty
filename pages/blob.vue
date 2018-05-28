
<template>
  <section class="container">
    <v-blob ref="blob" debug="true"></v-blob>
  </section>
</template>

<script>
import vBlob from '~/components/Blob.vue'
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
      this.blob = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.$refs.blob.canvas));
      this.blob.tint = 0xCC0000
      this.stage.addChild(this.blob)
    },
    tick(){
      this.blob.texture.update()
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

    this.$nextTick(()=>{
      this.setup()
      this.tick()
    })

  }
}

</script>

<style>

</style>
