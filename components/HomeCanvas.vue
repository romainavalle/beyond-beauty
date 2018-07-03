<template>
  <div class='HomeCanvas'>
  </div>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
import PixiBlobs from '~/assets/js/pixi/PixiBlobs';
import MouseBlob from '~/assets/js/pixi/blobs/MouseBlob'
import Background from '~/assets/js/pixi/Background';
import Portraits from '~/assets/js/pixi/Portraits';
import Titles from '~/assets/js/pixi/Titles';
import Emitter from '~/assets/js/events';
import { mapActions, mapState, mapGetters } from 'vuex';
if(process.browser){
  require('pixi.js')
}

export default {
  data() {
    return {
      currentScale: 1,
      regScale: 1,
      midScale: .55,
      smlScale: .36,
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
      this.stage = new PIXI.Container();

      this.backgroundContainer = new PIXI.Container();
      this.background = new Background(this.backgroundContainer);
      this.stage.addChild(this.backgroundContainer);


      this.titlesContainer = new PIXI.Container();
      this.titles = new Titles(this.titlesContainer);
      this.titles.load(this.getURI)
      this.stage.addChild(this.titlesContainer);

      const blobContainer = new PIXI.Container();
      blobContainer.name = "blobContainer"
      this.pixiBlobs = new PixiBlobs(
        blobContainer,
        this.titles.titleBorderSprite,
        this.renderer,
        this.getURI
      );

      this.pixiBlobs.hide()
      this.stage.addChild(blobContainer);

      this.portraitsContainer = new PIXI.Container();
      this.portraits = new Portraits(this.portraitsContainer);
      this.portraits.load(this.getURI)
      this.stage.addChild(this.portraitsContainer);



      this.mouseBlob = new MouseBlob(200)
      this.stage.addChild(this.mouseBlob.graph);
    },
    onReady(){
      Emitter.on('CANVAS_CLICK', this._canvasClick);
      Emitter.on('SHOW_MOUSE', this._showMouse);
      Emitter.on('HIDE_MOUSE', this._hideMouse);
      Emitter.on('TRANSITION:FINISHED', this.showHomeSlide.bind(this))
      Emitter.on('PAGE:PANDOWN', this._panDown);
      Emitter.on('PAGE:PANUP', this._panUp);

      this.portraits.doReady()
      this.titles.doReady()
      this.$el.style.opacity = 1
      if(this.route.name !== 'index'){
        this.background.show(0)
        this.showPage(0, 0)
        this.portraitsContainer.visible = false
      }
      this.pixiBlobs.show()
    },
    tick() {
      if(window.smooth && this.route.name !== 'index')this.checkStory()
      if(this.isMenuCompletlyVisible) return
      if(this.isStoryVisible && (window.smooth && window.smooth.vars.current < this.bounding))return
      this.pixiBlobs.tick()
      if(this.isAppReady)this.mouseBlob.tick();
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
    checkSwitchBeforePageChange() {
      if(this.storyPushSwitched) {
        this.storyPushSwitched = false
        this.doSwitch()
      }
    },
    doSwitch() {
      let nextPageNum = this.currentPageIdNum + 1
      this.mouseBlob.hide()
      if(nextPageNum > 3)nextPageNum = 0
      if(this.storyPushSwitched) {
        TweenMax.set(this.$el, {yPercent: 0})
        this.titles.goToYPos(ResizeHelper.height() * .3, 0)
        this.titles.hide(this.currentPageIdNum, true)
        this.currentScale = this.smlScale
        this.titles.scaleTo(null, this.currentScale);
        this.titles.show(nextPageNum, 0, 0);
        this.pixiBlobs.hide()
        this.pixiBlobs.setTint(this.pages[nextPageNum].color);
        this.pixiBlobs.tick()
      }else{
        TweenMax.set(this.$el, {yPercent: -50})
        this.pixiBlobs.setTint(this.pages[this.currentPageIdNum].color);
        this.pixiBlobs.show()
        this.pixiBlobs.tick()
        this.titles.goToYPos(0, 0)
        this.currentScale = this.midScale
        this.titles.scaleTo(null, this.midScale);
        this.titles.hide(nextPageNum , true)
        this.titles.show(this.currentPageIdNum, 0, 0);
      }
    },
    resize(w, h) {
      this.pixiBlobs.resize(w, h);
      this.portraits.resize(w, h);
      this.titles.resize(w, h);
      this.background.resize(w, h);
      this.renderer.resize(w, h);

      this.pixiBlobs.resize(w, h, 80 * w / 1440)
      this.mouseBlob.resize(w, h, 80 * w / 1440)
      if(window.smooth) this.bounding = window.smooth.vars.bounding - h / 2
    },
    showHomeSlide(delay = 0) {
      delay = .5
      this.mouseBlob.show()
      this.pixiBlobs.setTint(this.pages[this.currentHomeSlideId].color);
      this.portraits.show(this.currentHomeSlideId, this.direction);
      this.titles.show(this.currentHomeSlideId, delay * 1.3, 1, this.direction);
    },
    showPage(delay, time, direction = 'forward') {
      console.log('showPage')
      this.background.show()
      this.pixiBlobs.show()
      this.pixiBlobs.setTint(this.pages[this.currentPageIdNum].color);
      this.titles.show(this.currentPageIdNum, delay, time, direction);
      this.currentScale = this.midScale
      this.titles.scaleTo(this.currentPageIdNum, this.currentScale, delay, time);
    },
    hidePage(delay = 0) {
      console.log('hidePage')
      this.mouseBlob.hide()
      this.portraitsContainer.visible = true
      this.background.hide()
      this.portraits.appear(this.currentHomeSlideId);
      this.currentScale = this.regScale
      this.titles.scaleTo(this.currentHomeSlideId, this.currentScale, delay, 1);
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
        this.pixiBlobs.showMouse()
      }
    },
    hideMouse() {
      console.log('hideMouse')
      this.mouseBlob.hide()
      this.pixiBlobs.hideMouse()
    },
    panDown(){
      TweenMax.to(this.$el, .5, {yPercent: -50, ease:  Circ.easeOut})
    },
    panUp(){
      TweenMax.to(this.$el, .5, {yPercent: 0, ease: Cubic.easeIn})
    }
  },
  watch: {
    currentHomeSlideId(val, old) {
      console.log('watch -> currentHomeSlideId',val, old)
      if(this.route.name === 'index') {
        TweenMax.set(this.$el, {yPercent: 0})
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
      console.log('watch -> route.name',val, old)
      TweenMax.set(this.$el, {yPercent: 0})
      if(old && old !== 'index' && val === 'index')this.hidePage()
      if(old && old === 'index' && val !== 'index'){
        this.portraits.disappear(this.currentHomeSlideId);
        setTimeout(() => {this.portraitsContainer.visible = false}, 1000)
      }
    },
    'route.params.pageId'(val, old) {
      console.log('watch -> route.params.pageId',val, old, this.isPageTransition)
      if(!this.isPageTransition) TweenMax.set(this.$el, {yPercent: 0})
      let dir = 'forward'
      if(old && val) {
        dir = this.getPageIdNum(old) - this.getPageIdNum(val) > 0 ? 'forward' : 'backward'
        console.log(this.isMenuCompletlyVisible)
        this.titles.hide(this.getPageIdNum(old), this.isMenuCompletlyVisible, dir)
      }
      if(val !== undefined){
        console.log('test undefined', val)
        if(!this.isPageTransition) this.showPage(0, 1.5, dir)
      }
    }
  },
  beforeDestroy() {
    Emitter.removeListener('CANVAS_CLICK', this._canvasClick);
    Emitter.removeListener('SHOW_MOUSE', this._showMouse);
    Emitter.removeListener('HIDE_MOUSE', this._hideMouse);
    Emitter.removeListener('PAGE:PANDOWN', this._panDown);
    Emitter.removeListener('PAGE:PANUP', this._panUp);
  },

  mounted() {
    this._canvasClick = this.canvasClick.bind(this);
    this._showMouse = this.showMouse.bind(this);
    this._hideMouse = this.hideMouse.bind(this);
    this._panDown = this.panDown.bind(this);
    this._panUp = this.panUp.bind(this);
    this.$el.style.opacity = .1


    this.renderer = new PIXI.WebGLRenderer({
      backgroundColor: 0xe1dfd7,
      transparent: false,
      antialias: false,
      powerPreference: "high-performance"
    });
    this.renderer.autoResize = true;
    this.renderer.preserveDrawingBuffer = true
    this.renderer.legacy = true
    PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE;
    this.renderer.textureGC.mode = PIXI.GC_MODES.MANUAL
    this.$el.appendChild(this.renderer.view);


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
