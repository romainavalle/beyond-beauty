<template>
  <section class="container">
  </section>
</template>

<script>
import Blobs from '~/assets/js/blob/Blobs'
import Displacement from '~/assets/js/Displacement'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
import Stats from 'stats-js'

import 'gsap/ColorPropsPlugin';
import Portrait from "~/assets/js/pixi/Portrait"
import Title from "~/assets/js/pixi/Title"
import data from '~/assets/data.json'
if (process.browser) {
  var Pixi = require('pixi.js')
}
export default {
  data(){
    return {
      currentPageId: -1,
      titles: [],
      titlesBorder: [],
      portraits: [],
    }
  },
  methods:{
    setupBlob() {
      this.displacement = new Displacement()
      this.blobs = new Blobs()
      const blobContainer = new Pixi.Sprite()
      this.blob = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.blobs.canvas));
      this.mask = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.blobs.canvas));
      TweenMax.set(this.blob, {colorProps: {tint: data.pages[0].color,format:"number"}})
      this.displacementTexture = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.displacement.canvas));
      this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementTexture);
      blobContainer.addChild(this.titleBorderSprite)
      blobContainer.addChild(this.displacementTexture)
      blobContainer.mask = this.mask
      this.stage.addChild(this.blob)
      this.stage.addChild(blobContainer)
      this.stage.addChild(this.mask)
      this.titleBorderSprite.filters = [this.displacementFilter];
    },
    setupTitle(){
      this.titleSprite = new Pixi.Sprite()
      data.pages.forEach(page => {
        const titleContainer = new Pixi.Container()
        const title = new Title(titleContainer, page.id)
        this.titleSprite.addChild(titleContainer)
        this.titles.push(title)
      });
      this.stage.addChild(this.titleSprite)
    },
    setupTitleBorder(){
      this.titleBorderSprite = new Pixi.Sprite()
      data.pages.forEach(page => {
        const titleBorderContainer = new Pixi.Container()
        const title = new Title(titleBorderContainer, page.id, true)
        this.titleBorderSprite.addChild(titleBorderContainer)
        this.titlesBorder.push(title)
      });
      //this.stage.addChild(this.titleBorderSprite)
    },
    setupPortrait(){
      this.portraitSprite = new Pixi.Sprite()
      data.pages.forEach(page => {
        const portraitContainer = new Pixi.Container()
        const portrait = new Portrait(portraitContainer, page.id)
        this.portraitSprite.addChild(portraitContainer)
        this.portraits.push(portrait)
      });
      this.stage.addChild(this.portraitSprite )
    },
    load() {
      data.pages.forEach((page,i) => {
        this.portraits[i].load()
        this.titlesBorder[i].load()
        this.titles[i].load()
      })
    },
    tick(){
      this.stats.begin()
      this.blobs.tick()
      this.displacement.tick();
      this.displacementTexture.texture.update();
      this.blob.texture.update()
      this.mask.texture.update()
      this.renderer.render(this.stage)
      this.stats.end()
      requestAnimationFrame(this.tick.bind(this));
    },
    resize(w,h) {
      this.displacementTexture.width = w
      this.displacementTexture.height = h
      this.blobs.resize(w,h)
      data.pages.forEach((page,i) => {
        this.portraits[i].resize(w, h)
        this.titlesBorder[i].resize(w, h)
        this.titles[i].resize(w, h)
      })
      this.renderer.resize(ResizeHelper.innerWidth(), h - 1);
    },
    hide(){
      this.portraits[this.currentPageId].hide()
      this.titlesBorder[this.currentPageId].hide()
      this.titles[this.currentPageId].hide()
    },
    show(delay){
      this.portraits[this.currentPageId].show(delay)
      this.titlesBorder[this.currentPageId].show(delay)
      this.titles[this.currentPageId].show(delay)
    },
    nextPage() {
      let delay = 0
      if(this.currentPageId !== -1) {
        this.hide()
        delay = 1
      }
      this.currentPageId++
      if(this.currentPageId === data.pages.length)this.currentPageId = 0
      TweenMax.to(this.blob, 2, {colorProps: {tint:data.pages[this.currentPageId].color, format:"number"}})
      this.show(delay)
      setTimeout(this.nextPage.bind(this), 8000)
    },
    setDebug() {
      this.stats = new Stats();
      document.body.appendChild( this.stats.domElement );
      // Align top-left
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
    }
  },
  mounted() {
    const width = ResizeHelper.innerWidth()
    const height = ResizeHelper.height()

    this.renderer = Pixi.autoDetectRenderer({ backgroundColor: 0xe5e3dc, antialias: false, width, height})
    this.$el.appendChild(this.renderer.view)
    this.stage = new Pixi.Container()

    this.setupTitle()
    this.setupTitleBorder()
    this.setupBlob()
    this.setupPortrait()
    this.load()
    setTimeout(this.nextPage.bind(this), 1000)
    setTimeout(this.tick.bind(this), 1000)

    this.setDebug()

  }
}

</script>

<style>

</style>
