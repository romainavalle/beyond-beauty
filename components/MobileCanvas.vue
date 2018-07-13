<template>
  <div class='HomeCanvas'>
    <p>Discover the experience<br>on desktop</p>
  </div>
</template>

<script>
import ResizeHelper from '~/assets/js/utils/ResizeHelper';
import PixiBlobs from '~/assets/js/pixi/PixiBlobs';
import Titles from '~/assets/js/pixi/TitlesMobile';
import { mapGetters } from 'vuex'
if(process.browser){
  require('pixi.js')
}

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['getURI'])
  },
  methods: {
    load(){
      this.titlesContainer = new PIXI.Container();
      this.titlesContainer.name = 'titlesContainer';
      this.titles = new Titles(this.titlesContainer);
      this.titles.load(this.getURI)
      this.app.stage.addChild(this.titlesContainer);
      const blobContainer = new PIXI.Container();
      blobContainer.name = "blobContainer"
      const isMobile = true
      this.pixiBlobs = new PixiBlobs(
        blobContainer,
        this.titles.titleBorderSprite,
        this.titles.titleBorderAboutSprite,
        this.app.renderer,
        this.getURI,
        isMobile
      );
      this.app.stage.addChild(blobContainer);
      this.pixiBlobs.show()
      this.pixiBlobs.setTint(0xf0cab2)
    },
    tick() {
      this.pixiBlobs.tick()
      this.app.renderer.render(this.app.stage);
    },
    resize(w, h) {
      this.titles.resize(w, h)
      this.pixiBlobs.resize(w, h, 50 * w / 1440)
    },
  },
  mounted() {
    this.app = new PIXI.Application({
      backgroundColor: 0xe1dfd8,
      transparent: false,
      autoStart: false,
      antialias: false,
      resolution: 1,
      width: ResizeHelper.width(),
      height: ResizeHelper.height(),
      autoResize: true,
      powerPreference: "high-performance"
    });

    this.app.renderer.autoResize = true;
    PIXI.WebGLRenderer.batchMode = PIXI.WebGLRenderer.BATCH_SIMPLE
    var ticker = PIXI.ticker.shared;
    ticker.autoStart = false;
    ticker.stop();
    this.$el.appendChild(this.app.view)


  }
};
</script>

<style lang='stylus' scoped>
.HomeCanvas
  height 100%
  overflow hidden
  position fixed
  width 100%
  p
    color $colors-black
    font-size 20px
    font-weight $light
    left 50%
    position absolute
    text-align center
    top 60%
    transform translate(-50%, -50%)
    width 100%
    z-index 2

</style>
