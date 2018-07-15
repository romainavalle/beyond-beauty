<template>
  <canvas class='HomeCanvas'>
  </canvas>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
import PixiBlobs from '~/assets/js/pixi/PixiBlobs';
import MouseBlob from '~/assets/js/pixi/blobs/MouseBlob'
import Background from '~/assets/js/pixi/Background';
import Portraits from '~/assets/js/pixi/Portraits';
import Titles from '~/assets/js/pixi/Titles';
import TitlesAbout from '~/assets/js/pixi/TitlesAbout';
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
      storyPushSwitched: false,
      isTickAvailable: false
    }
  },
  computed: {
    ...mapState(['currentHomeSlideId', 'route', 'isMenuCompletlyVisible', 'isAppReady','pages','isCanvasVisible', 'isPageTransition']),
    ...mapGetters(['currentPageIdNum','nextPageIdNum', 'getURI', 'getPageIdNum'])
  },
  methods: {
    ...mapActions(['setPageTransition']),
    load(){

      this.backgroundContainer = new PIXI.Container();
      this.backgroundContainer.name = "backgroundContainer"
      this.background = new Background(this.backgroundContainer);
      this.app.stage.addChild(this.backgroundContainer);


      this.titlesContainer = new PIXI.Container();
      this.titlesContainer.name = 'titlesContainer';
      this.titles = new Titles(this.titlesContainer);
      this.titles.load(this.getURI, this.app.renderer)
      this.app.stage.addChild(this.titlesContainer);

      this.titlesAboutContainer = new PIXI.Container();
      this.titlesAboutContainer.name = 'titlesAboutContainer';
      this.titlesAbout = new TitlesAbout(this.titlesAboutContainer);
      this.titlesAbout.load(this.getURI, this.app.renderer)
      this.app.stage.addChild(this.titlesAboutContainer);

      const blobContainer = new PIXI.Container();
      blobContainer.name = "blobContainer"
      this.pixiBlobs = new PixiBlobs(
        blobContainer,
        this.titles.titleBorderSprite,
        this.titlesAbout.titleBorderSprite,
        this.app.renderer,
        this.getURI
      );
      //this.pixiBlobs.load(this.getURI)

      this.app.stage.addChild(blobContainer);

      this.portraitsContainer = new PIXI.Container();
      this.portraitsContainer.name = "portraitsContainer";
      this.portraits = new Portraits(this.portraitsContainer);
      this.portraits.load(this.getURI, this.app.renderer)
      this.app.stage.addChild(this.portraitsContainer);

      this.mouseBlob = new MouseBlob(100, true)
      this.app.stage.addChild(this.mouseBlob.sprite);
    },

    onReady(){
      this.isTickAvailable = true
      if(this.route.name === 'story-pageId') this.checkStory()
      Emitter.on('CANVAS_CLICK', this._canvasClick);
      Emitter.on('SHOW_MOUSE', this._showMouse);
      Emitter.on('HIDE_MOUSE', this._hideMouse);
      Emitter.on('TRANSITION:FINISHED', () => {
        if(this.route.name === 'index')this.showHomeSlide()
      })
      Emitter.on('PAGE:PANDOWN', this._panDown);
      Emitter.on('PAGE:PANUP', this._panUp);

      this.$el.style.opacity = 1

      this.portraits.doReady()
      this.titles.doReady()

      this.titlesAboutContainer.visible = false
      if(this.route.name === 'index'){
        this.showHome(0)
      }
      if(this.route.name === 'story-pageId'){
        this.background.show(0)
        this.showPage(0, 0)
        this.portraitsContainer.visible = false
      }
      if(this.route.name === 'about'){
        this.showAbout(1)
        this.portraitsContainer.visible = false
        this.titlesContainer.visible = false
      }
      setTimeout(()=> {
        this.pixiBlobs.show()
      }, 1700)
    },

    tick() {
      if(window.smooth && this.route.name === 'story-pageId' && this.isTickAvailable)this.checkStory()
      if(this.isMenuCompletlyVisible) return
      if(!this.isCanvasVisible && (window.smooth && window.smooth.vars.current < this.bounding))return
      this.pixiBlobs.tick()
      if(this.isAppReady) this.mouseBlob.tick();
      this.app.renderer.render(this.app.stage);
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
        this.isTickAvailable = false
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
        this.titles.scaleTo(null, this.currentScale);
        this.titles.hide(nextPageNum , true)
        this.titles.show(this.currentPageIdNum, 0, 0);
      }
    },
    resize(w, h) {
      this.portraits.resize(w, h);
      this.titles.resize(w, h);
      this.titlesAbout.resize(w, h);
      this.background.resize(w, h);
      this.pixiBlobs.resize(w, h, 50 * w / 1440)
      this.mouseBlob.resize(w, h, 50 * w / 1440)
      this.app.renderer.resize(w, h);
      if(window.smooth && this.$route.name === 'pageId-story') this.bounding = window.smooth.vars.bounding - h / 2
      if(window.smooth && this.$route.name === 'about') this.bounding = window.smooth.vars.bounding
    },
    showHomeSlide(delay = 0) {
      delay = .5
      this.pixiBlobs.setTint(this.pages[this.currentHomeSlideId].color);
      this.portraits.show(this.currentHomeSlideId, this.direction);
      this.titles.show(this.currentHomeSlideId, delay * 1.3, 1, this.direction);
    },
    showAbout(delay = 0) {
      this.pixiBlobs.scale(1)
      this.titlesAbout.show(delay)
      this.background.hide(0)
      this.pixiBlobs.mask = 'about'
      this.pixiBlobs.setTint('#d5d2c7');
      this.titlesContainer.visible = false
      this.portraitsContainer.visible = false
      this.titlesAboutContainer.visible = true
    },

    showPage(delay, time, direction = 'forward') {
      this.pixiBlobs.scale(.8)
      this.titlesContainer.visible = true
      this.titlesAboutContainer.visible = false
      this.background.show()
      this.pixiBlobs.mask = 'regular'
      this.pixiBlobs.show()
      this.pixiBlobs.setTint(this.pages[this.currentPageIdNum].color);
      this.titles.show(this.currentPageIdNum, delay, time, direction);
      this.currentScale = this.midScale
      //this.currentScale = this.smlScale
      this.titles.scaleTo(this.currentPageIdNum, this.currentScale, delay, time);
    },
    showHome(delay = 0) {
      this.pixiBlobs.scale(1)
      this.mouseBlob.hide()
      this.portraitsContainer.visible = true
      this.titlesContainer.visible = true
      this.titlesAboutContainer.visible = false
      this.background.hide()
      this.currentScale = this.regScale
      this.titles.scaleTo(this.currentHomeSlideId, this.currentScale, delay, 1);
      this.pixiBlobs.mask = 'regular'
      this.pixiBlobs.setTint(this.pages[this.currentHomeSlideId === -1 ? 0 : this.currentHomeSlideId].color);
    },
    hideHome() {
      this.portraits.hide(this.currentHomeSlideId)
      this.titles.hide(this.currentHomeSlideId)
    },
    hideAbout() {
      this.titlesAbout.hide()
    },
    canvasClick() {
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
      this.titles.goToYPos(0, 1.3)
      this.currentScale = this.midScale
      this.titles.scaleTo(this.currentPageIdNum , this.currentScale, 0, 1, true);
    },
    showMouse() {
      if(this.$route.name === 'index'){
        this.mouseBlob.show()
      }else{
        this.pixiBlobs.showMouse()
      }
    },
    hideMouse() {
      this.mouseBlob.hide()
      this.pixiBlobs.hideMouse()
    },
    panDown(){
      TweenMax.to(this.$el, 1, {yPercent: -50, ease: Power4.easeInOut})
    },
    panUp(){
      TweenMax.to(this.$el, 1, {yPercent: 0, ease: Power4.easeInOut})
    }
  },
  watch: {
    currentHomeSlideId(val, old) {
      if(this.route.name === 'index') {
        TweenMax.set(this.$el, {yPercent: 0})
        if (old !== -1) {
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
        } else {
          this.direction = 'forward'
          this.showHomeSlide()
        }
      }
    },
    'route.name'(val, old) {
      TweenMax.set(this.$el, {yPercent: 0})
      if(old && old === 'index' && val === 'story-pageId'){
        this.portraits.disappear(this.currentHomeSlideId);
        setTimeout(() => {this.portraitsContainer.visible = false}, 1000)
      }
      if(old && old === 'index' && val === 'about'){
        this.hideHome()
      }
      if(old && old === 'story-pageId' && val === 'index' && this.currentHomeSlideId != -1)this.portraits.appear(this.currentHomeSlideId);
      if(val === 'index')this.showHome()
      if(val === 'about')this.showAbout(1)
      if(old === 'about')this.hideAbout()
    },
    'route.params.pageId'(val, old) {
      if(!this.isPageTransition) TweenMax.set(this.$el, {yPercent: 0})
      let dir = 'forward'
      if(old && val) {
        dir = this.getPageIdNum(old) - this.getPageIdNum(val) > 0 ? 'forward' : 'backward'
        this.titles.hide(this.getPageIdNum(old), this.isMenuCompletlyVisible, dir)
      }
      if(val !== undefined){
        if(!this.isPageTransition) this.showPage(this.isMenuCompletlyVisible ?  .8 : 0, 1.5, dir)
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

    this.app = new PIXI.Application({
      backgroundColor: 0xe1dfd7,
      transparent: false,
      autoStart: false,
      autoResize: true,
      powerPreference: "high-performance",
      view: this.$el,
      resolution: 1,
      legacy: true //flickering on old browser
    });
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR

    PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE
    var ticker = PIXI.ticker.shared;
    ticker.autoStart = false;
    ticker.stop();
  }
};
</script>

<style lang='stylus' scoped>
.HomeCanvas
  height 100%
  overflow hidden
  position fixed
  width 100%

</style>
