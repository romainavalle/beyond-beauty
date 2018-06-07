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
import { pages } from '~/assets/data.json';
import Emitter from '~/assets/js/events';
import { mapState, mapGetters } from 'vuex';

if (process.browser) {
  var Pixi = require('pixi.js');
}
export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState(['currentHomeSlideId', 'route']),
    ...mapGetters(['currentPageId', 'getURI'])
  },
  methods: {
    onReady(){
      this.portraits.load(this.getURI)
      this.titles.load(this.getURI)
      setTimeout(()=>{
        if(this.route.name !== 'index'){
          this.background.show(0)
          this.showPage(0, 0)
          this.portraitsContainer.visible = false
        }
      },1000)
    },
    tick() {
      this.pixiBlobs.tick();
      this.renderer.render(this.stage);
    },
    resize(w, h) {
      this.pixiBlobs.resize(w, h);
      this.portraits.resize(w, h);
      this.titles.resize(w, h);
      this.background.resize(w, h);
      this.renderer.resize(w, h);
    },
    hide(id) {
      this.portraits.hide(id);
      this.titles.hide(id);
    },
    showHomeSlide(delay) {
      this.portraitsContainer.visible = true
      this.background.hide()
      this.pixiBlobs.setTint(pages[this.currentHomeSlideId].color);
      this.portraits.show(this.currentHomeSlideId, 0.2 * delay);
      this.titles.show(this.currentHomeSlideId, delay * 0.8, 1);
      this.titles.scaleTo(1, delay * 0.6, 1);
    },
    showPage(delay, time) {
      this.background.show()
      this.pixiBlobs.setTint(pages[this.currentPageId].color);
      if(this.currentHomeSlideId !== -1)this.portraits.disappear(this.currentHomeSlideId, delay * 1.2);
      this.titles.show(this.currentPageId, delay * 0.6, time);
      this.titles.scaleTo(.7, delay * 0.6, time);
    },
    portraitClick() {
      this.$router.push({
        name: 'story-pageId',
        params: { pageId: pages[this.currentHomeSlideId].pageId }
      });
    }
  },
  watch: {
    currentHomeSlideId(val, old) {
      if(this.route.name === 'index'){
        if (old != -1) {
          this.hide(old);
          this.showHomeSlide(1);
        } else {
          this.showHomeSlide(0);
        }
      }
    },
    'route.name'(val, old) {
      if(val !== 'index'){
        //this.hide(this.currentHomeSlideId)
        this.titles.hide(this.currentHomeSlideId);
        this.showPage(.5, 1)
      }else{
        this.showHomeSlide(1)
      }
    }
  },
  beforeDestroy() {
    Emitter.removeListener('PORTRAIT_CLICK', this._portraitClick);
  },

  mounted() {

    this._portraitClick = this.portraitClick.bind(this);
    const width = ResizeHelper.width();
    const height = ResizeHelper.height();
    this.renderer = Pixi.autoDetectRenderer({
      backgroundColor: 0xe5e3dc,
      antialias: false,
      width,
      height
    });
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
