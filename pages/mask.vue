<template>
  <section class="container">
  </section>
</template>

<script>
import {TweenMax, Quad } from "gsap";
if (process.browser) {
  var Pixi = require('pixi.js')
}
export default {
  methods:{
    setup (loader, ressources) {
      this.step = 0
      this.currentMaskTween = 0
      this.currentMask = 0
      this.mask_array = []
      this.renderer.plugins.interaction.destroy()
      this.$el.appendChild(this.renderer.view)
      this.stage = new Pixi.Container()
      const container = new Pixi.Container()
      this.imgSprite = new Pixi.Sprite(ressources["np"].texture)//(new Pixi.Texture(new Pixi.BaseTexture(img)))
      this.imgSprite.interactive = false

      this.imgSprite.height = 800
      this.imgSprite.width = 450
      container.addChild(this.imgSprite)

      container.position.x = window.innerWidth * .5 - 450 / 2
      container.position.y = window.innerHeight * .5 - 800 / 2
      for (let index = 0; index < 86; index++) {
        const maskStep = new Pixi.Sprite(ressources['mask'+index].texture)//(new Pixi.Texture(new Pixi.BaseTexture(img)))
        maskStep.interactive = false
        maskStep.visible = false
        maskStep.height = 800
        maskStep.width = 450
        container.addChild(maskStep)
        this.mask_array.push(maskStep)
      }
        this.stage.addChild(container)
        this.tick()
        TweenMax.to(this, 2, {currentMaskTween: 85, repeat: -1, ease: Quad.easeInOut, onUpdate:()=>{
          this.mask_array[this.currentMask].visible = false
          this.currentMask = Math.round(this.currentMaskTween)
          this.imgSprite.mask = this.mask_array[this.currentMask]
          this.mask_array[this.currentMask].visible = true
          }})
    },
    tick(){
      this.renderer.render(this.stage)
      requestAnimationFrame(this.tick.bind(this));
    }

  },
  mounted() {
    //console.log(window)
      let width = window.innerWidth
      let height = window.innerHeight
      this.renderer = Pixi.autoDetectRenderer({ backgroundColor: 0xFFFFFF, antialias: false, width, height})

    let id
    if(!PIXI.loader.resources['np']){
        PIXI.loader.add("np", "images/NP.png")
      for (let index = 0; index < 86; index++) {
        id = index
        if(index < 10) id = '0' + index
        PIXI.loader.add("mask"+index, `images/mask/transition_bust_${id}.png`)
      }
    }
    PIXI.loader.load(this.setup.bind(this));

  }
}

</script>

<style>

</style>
