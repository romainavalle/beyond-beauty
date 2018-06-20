<template>
  <div class='HomeCanvas'>
  </div>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper';

import PixiBlobs from '~/assets/js/pixi/PixiBlobs';
import Background from '~/assets/js/pixi/Background';
import Portraits from '~/assets/js/pixi/Portraits';
import Titles from '~/assets/js/pixi/Titles';
import Emitter from '~/assets/js/events';
import { mapState, mapGetters } from 'vuex';

if (process.browser) {
  var Pixi = require('pixi.js');
}
export default {
  data() {
    return {
      tempCurrentPageIdNum: -1,
      storyPushSwitched: false
    }
  },
  computed: {
    ...mapState(['currentHomeSlideId', 'route', 'isMenuVisible', 'isAppReady','pages','isStoryVisible', 'isPageTransition']),
    ...mapGetters(['currentPageIdNum', 'getURI', 'getPageIdNum'])
  },
  methods: {
    load(){
      this.portraits.load(this.getURI)
      this.titles.load(this.getURI)
    },
    onReady(){
      setTimeout(()=>{
        this.portraits.doReady()
        this.titles.doReady()
        TweenMax.set(this.$el, {'opacity' : 1})
      },200)
      setTimeout(()=>{
        if(this.route.name !== 'index'){
          this.background.show(0)
          this.showPage(0, 0)
          this.portraitsContainer.visible = false
        }
      },500)
    },
    tick() {
      if(window.smooth && this.route.name !== 'index')this.checkStory()
      if(this.isMenuVisible) return
      if(!this.isAppReady) return
      if(this.isStoryVisible && this.scrollTop < this.bounding)return
      this.pixiBlobs.tick();
      this.portraits.tick()
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
      if(nextPageNum > 3)nextPageNum = 0
      if(this.storyPushSwitched) {
        TweenMax.set(this.titlesContainer.position, {y: ResizeHelper.height() * .3})
        this.titles.hide(this.currentPageIdNum, true)
        this.titles.scaleTo(null, .4);
        this.titles.show(nextPageNum, 0, 0);
        this.pixiBlobs.setTint(this.pages[nextPageNum].color);
      }else{
        this.pixiBlobs.setTint(this.pages[this.currentPageIdNum].color);
        TweenMax.set(this.titlesContainer.position, {y: 0})
        this.titles.scaleTo(null, .7);
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
      if(window.smooth) this.bounding = window.smooth.vars.bounding - h / 2
    },
    showHomeSlide(delay = 0) {
      delay = .5
      this.pixiBlobs.setTint(this.pages[this.currentHomeSlideId].color);
      this.portraits.show(this.currentHomeSlideId);
      this.titles.show(this.currentHomeSlideId, delay * 1.3, 1);
    },
    showPage(delay, time) {
      this.background.show()
      this.pixiBlobs.setTint(this.pages[this.currentPageIdNum].color);
      this.titles.show(this.currentPageIdNum, delay * 0.6, time);
      this.titles.scaleTo(this.currentPageIdNum, .7, delay * 0.6, time);
    },
    hidePage(delay) {
      this.portraitsContainer.visible = true
      this.background.hide()
      this.portraits.appear(this.currentHomeSlideId);
      this.titles.scaleTo(this.currentHomeSlideId, 1, delay * 0.6, 1);
    },
    portraitClick() {
      this.$router.push({
        name: 'story-pageId',
        params: { pageId: this.pages[this.currentHomeSlideId].pageId }
      });
    },
    pageTrans() {
      TweenMax.to(this.titlesContainer.position, 1.7,{y: 0, ease: Expo.easeInOut})
      this.titles.scaleTo(this.currentPageIdNum , 1, 0, 1);
    }
  },
  watch: {
    currentHomeSlideId(val, old) {
      if(this.route.name === 'index'){
        if (old != -1) {
          this.portraits.hide(old);
          this.titles.hide(old);
        }else{
          this.showHomeSlide()
        }
      }
    },
    'route.name'(val, old) {
      if(old && old !== 'index' && val === 'index')this.hidePage()
      if(old && old === 'index' && val !== 'index')this.portraits.disappear(this.currentHomeSlideId);
    },
    'route.params.pageId'(val, old) {
      if(old && val) {
        this.titles.hide(this.getPageIdNum(old), this.isMenuVisible)
      }
      if(val){
        if(!this.isPageTransition) this.showPage(2, 1)
      }
    }
  },
  beforeDestroy() {
    Emitter.removeListener('PORTRAIT_CLICK', this._portraitClick);
  },

  mounted() {
    TweenMax.set(this.$el, {'opacity' : .1})

    this._portraitClick = this.portraitClick.bind(this);
    const width = ResizeHelper.width();
    const height = ResizeHelper.height();
    this.renderer = Pixi.autoDetectRenderer({
      backgroundColor: 0xe1dfd7,
      antialias: false,
      width,
      height
    });
    PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE;
    this.$el.appendChild(this.renderer.view);
    this.stage = new Pixi.Container();

    this.backgroundContainer = new Pixi.Container();
    this.background = new Background(this.backgroundContainer);
    this.stage.addChild(this.backgroundContainer);

    this.titlesContainer = new Pixi.Container();
    this.titles = new Titles(this.titlesContainer);
    this.stage.addChild(this.titlesContainer);

    this.blobContainer = new Pixi.Container();
    this.pixiBlobs = new PixiBlobs(
      this.blobContainer,
      this.titles.titleBorderSprite
    );
    this.stage.addChild(this.blobContainer);

    this.portraitsContainer = new Pixi.Container();
    this.portraits = new Portraits(this.portraitsContainer);
    this.stage.addChild(this.portraitsContainer);

    Emitter.on('PORTRAIT_CLICK', this._portraitClick);
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
