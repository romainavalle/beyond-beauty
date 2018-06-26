<template>
  <div class='HomeCanvas'>
  </div>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
import Displacement from '~/assets/js/Displacement'
import Blobs from '~/assets/js/canvasBlob/Blobs'
import PixiBlobs from '~/assets/js/pixi/PixiBlobs';
import MouseBlob from '~/assets/js/blobs/MouseBlob'
import Background from '~/assets/js/pixi/Background';
import Portraits from '~/assets/js/pixi/Portraits';
import Titles from '~/assets/js/pixi/Titles';
import Emitter from '~/assets/js/events';
import { mapActions, mapState, mapGetters } from 'vuex';

if (process.browser) {
  var Pixi = require('pixi.js');
}
export default {
  data() {
    return {
      currentScale: 1,
      regScale: 1,
      midScale: .65,
      smlScale: .45,
      tempCurrentPageIdNum: -1,
      storyPushSwitched: false
    }
  },
  computed: {
    ...mapState(['currentHomeSlideId', 'route', 'isMenuCompletlyVisible', 'isAppReady','pages','isStoryVisible', 'isPageTransition']),
    ...mapGetters(['currentPageIdNum','nextPageIdNum', 'getURI', 'getPageIdNum'])
  },
  methods: {
    ...mapActions(['setPageTransition']),
    load(){
      this.portraits.load(this.getURI)
      this.titles.load(this.getURI)
    },
    onReady(){
      setTimeout(()=>{
        this.portraits.doReady()
        this.titles.doReady()
        this.$el.style.opacity = 1
      },200)
      setTimeout(()=>{
        if(this.route.name !== 'index'){
          this.background.show(0)
          this.showPage(0, 0)
          this.portraitsContainer.visible = false
        }
        this.pixiBlobs.show()
      },500)
    },
    tick() {
      if(window.smooth && this.route.name !== 'index')this.checkStory()
      if(this.isMenuCompletlyVisible) return
      if(!this.isAppReady) return
      if(this.isStoryVisible && (window.smooth && window.smooth.vars.current < this.bounding))return
      this.displacement.tick()
      this.pixiBlobs.tick();
      this.mouseBlob.tick(true);
      this.pageMouseBlob.tick(true)
      this.blobs.tick()
      this.portraits.tick()
      this.displacementBlobsTexture.texture.update()
      this.mouseBlobSprite.texture.update()
      this.renderer.render(this.stage);
    },
    checkStory() {
      if(window.smooth.vars.current === 0)this.storyPushSwitched = false
      if(window.smooth.vars.current > 500) {
        if(this.storyPushSwitched) return
        this.storyPushSwitched = true
        this.doSwitch()
      }else{
        if(!this.storyPushSwitched) return
        this.storyPushSwitched = false
        this.doSwitch()
      }
    },
    doSwitch() {
      let nextPageNum = this.currentPageIdNum + 1
      this.mouseBlob.hide()
      if(nextPageNum > 3)nextPageNum = 0
      if(this.storyPushSwitched) {
        this.titles.goToYPos(ResizeHelper.height() * .3, 0)
        this.titles.hide(this.currentPageIdNum, true)
        this.currentScale = this.smlScale
        this.titles.scaleTo(null, this.currentScale);
        this.titles.show(nextPageNum, 0, 0);
        this.pixiBlobs.hide()
        this.pixiBlobs.setTint(this.pages[nextPageNum].color);
        this.pageMouseBlob.setTint(this.pages[nextPageNum].color)
        this.pageMouseBlob.show()
        this.blobs.tick()
      }else{
        this.pageMouseBlob.setTint(this.pages[this.currentPageIdNum].color)
        this.pageMouseBlob.hide()
        this.pixiBlobs.setTint(this.pages[this.currentPageIdNum].color);
        this.titles.goToYPos(0, 0)
        this.currentScale = this.midScale
        this.titles.scaleTo(null, this.midScale);
        this.titles.hide(nextPageNum , true)
        this.pixiBlobs.show()
        this.titles.show(this.currentPageIdNum, 0, 0);
      }
    },
    resize(w, h) {
      this.pixiBlobs.resize(w, h);
      this.portraits.resize(w, h);
      this.titles.resize(w, h);
      this.background.resize(w, h);
      this.renderer.resize(w, h);
      this.mouseBlob.resize(w, h, 60 * w / 1440)
      this.pageMouseBlob.resize(w, h, 60 * w / 1440)
      if(window.smooth) this.bounding = window.smooth.vars.bounding - h / 2
    },
    showHomeSlide(delay = 0) {
      console.log('showHomeSlide')
      delay = .5
      //this.mouseBlob.show()
      this.pixiBlobs.setTint(this.pages[this.currentHomeSlideId].color);
      this.pageMouseBlob.setTint(this.pages[this.currentHomeSlideId].color)
      this.portraits.show(this.currentHomeSlideId, this.direction);
      this.titles.show(this.currentHomeSlideId, delay * 1.3, 1, this.direction);
    },
    showPage(delay, time, direction = 'forward') {
      console.log('showPage')
      this.pixiBlobs.show()
      this.background.show()
      this.pixiBlobs.setTint(this.pages[this.currentPageIdNum].color);
      this.pageMouseBlob.setTint(this.pages[this.currentPageIdNum].color)
      this.titles.show(this.currentPageIdNum, delay * 0.6, time, direction);
      this.currentScale = this.midScale
      this.titles.scaleTo(this.currentPageIdNum, this.currentScale, delay * 0.6, time);
    },
    hidePage(delay) {
      console.log('hidePage')
      this.mouseBlob.hide()
      this.portraitsContainer.visible = true
      this.background.hide()
      this.portraits.appear(this.currentHomeSlideId);
      this.currentScale = this.regScale
      this.titles.scaleTo(this.currentHomeSlideId, this.currentScale, delay * 0.6, 1);
    },
    canvasClick() {
      console.log('canvasClick')
      switch (this.currentScale) {
        case this.regScale:
          this.$router.push({
            name: 'story-pageId',
            params: { pageId: this.pages[this.currentHomeSlideId].pageId }
          });
        break
        case this.midScale:
          Emitter.emit('PAGE_SCROLL')
        break
        case this.smlScale:
          this.setPageTransition(true)
          this.$router.push({
            name: 'story-pageId',
            params: { pageId: this.pages[this.nextPageIdNum].pageId }
          });
        break
      }
    },
    pageTransition() {
      console.log('pageTrans')
      Emitter.emit('HIDE_MOUSE');
      this.titles.goToYPos(0, 1.2)
      this.currentScale = this.midScale
      this.titles.scaleTo(this.currentPageIdNum , this.currentScale, 0, 1.2, true);
    },
    showMouse() {
      console.log('showMouse')
      if(this.$route.name === 'index'){
        this.mouseBlob.show()
      }else{
        this.pageMouseBlob.show()
      }
    },
    hideMouse() {
      console.log('hideMouse')
      this.mouseBlob.hide()
      this.pageMouseBlob.hide()
    }
  },
  watch: {
    currentHomeSlideId(val, old) {
      // console.log('watch -> currentHomeSlideId',val, old)
      if(this.route.name === 'index') {
        if (old != -1) {
          if(val !== 0){
            if(val - old > 0){
              this.direction = 'forward'
            }else{
              this.direction = 'back'
            }
          }else{
            if(old === 3)this.direction = 'forward'
            if(old === 1)this.direction = 'back'
          }
          if(old === 0){
            if(val === 1)this.direction = 'forward'
            if(val === 3)this.direction = 'back'
          }
          this.portraits.hide(old, this.direction);
          this.titles.hide(old, false, this.direction);
        }else{
          this.direction = 'forward'
          this.showHomeSlide()
        }
      }
    },
    'route.name'(val, old) {
      // console.log('watch -> route.name',val, old)
      if(old && old !== 'index' && val === 'index')this.hidePage()
      if(old && old === 'index' && val !== 'index'){
        this.portraits.disappear(this.currentHomeSlideId);
        setTimeout(() => {this.portraitsContainer.visible = false}, 1000)
      }
    },
    'route.params.pageId'(val, old) {
      // console.log('watch -> route.params.pageId',val, old)
      if(old && val) {
        this.titles.hide(this.getPageIdNum(old), this.isMenuCompletlyVisible)
      }
      if(val !== undefined){
        // console.log('test undefined', val)
        if(!this.isPageTransition) this.showPage(.2, 1.5)
      }
    }
  },
  beforeDestroy() {
    Emitter.removeListener('CANVAS_CLICK', this._canvasClick);
    Emitter.removeListener('SHOW_MOUSE', this._showMouse);
    Emitter.removeListener('HIDE_MOUSE', this._hideMouse);
  },

  mounted() {
    this._canvasClick = this.canvasClick.bind(this);
    this._showMouse = this.showMouse.bind(this);
    this._hideMouse = this.hideMouse.bind(this);
    this.$el.style.opacity = .1

    this.mouseBlob = new MouseBlob(200, 200)
    this.blobs = new Blobs()

    this.renderer = Pixi.autoDetectRenderer({
      backgroundColor: 0xe1dfd7,
      antialias: false
    });
    this.renderer.autoResize = true;
    // PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE;
    this.$el.appendChild(this.renderer.view);

    this.displacement = new Displacement()
    this.displacementBlobsTexture = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.displacement.canvas));
    this.displacementMouseBlobTexture = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.displacement.canvas));

    this.stage = new Pixi.Container();

    this.backgroundContainer = new Pixi.Container();
    this.background = new Background(this.backgroundContainer);
    this.stage.addChild(this.backgroundContainer);

    this.titlesContainer = new Pixi.Container();
    this.titles = new Titles(this.titlesContainer);
    this.stage.addChild(this.titlesContainer);

    const blobContainer = new Pixi.Container();

    this.pixiBlobs = new PixiBlobs(
      blobContainer,
      this.titles.titleBorderSprite,
      this.displacementBlobsTexture,
      new Blobs()
    );

    this.pixiBlobs.hide()
    this.stage.addChild(blobContainer);

    this.portraitsContainer = new Pixi.Sprite();
    this.portraits = new Portraits(this.portraitsContainer);
    this.stage.addChild(this.portraitsContainer);


    this.mouseBlobSprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.mouseBlob.canvas));
    const mousePageSprite =  new Pixi.Sprite()
    this.pageMouseBlob = new PixiBlobs(
      mousePageSprite,
      this.titles.titleBorderMouseSprite,
      this.displacementMouseBlobTexture,
      new MouseBlob(200, 200)
    );

    this.stage.addChild(mousePageSprite);
    this.stage.addChild(this.mouseBlobSprite);
    Emitter.on('CANVAS_CLICK', this._canvasClick);
    Emitter.on('SHOW_MOUSE', this._showMouse);
    Emitter.on('HIDE_MOUSE', this._hideMouse);
    Emitter.on('TRANSITION:FINISHED', this.showHomeSlide.bind(this))
  }
};
</script>

<style lang='stylus' scoped>
.HomeCanvas {
  height: 100%;
  overflow: hidden;
  position: fixed;
  width: 100%;
}
</style>
