<template>
  <div class="HomeCanvas">
  </div>
</template>

<script>
import ResizeHelper from "~/assets/js/utils/ResizeHelper";

import PixiBlobs from "~/assets/js/pixi/PixiBlobs";
import Background from "~/assets/js/pixi/Background";
import Portraits from "~/assets/js/pixi/Portraits";
import Titles from "~/assets/js/pixi/Titles";
import { pages } from "~/assets/data.json";
import Emitter from "~/assets/js/events";
import { mapGetters } from "vuex";

if (process.browser) {
  var Pixi = require("pixi.js");
}
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["currentHomeSlideId"])
  },
  methods: {
    load() {
      this.portraits.load();
      this.titles.load();
    },
    tick() {
      this.pixiBlobs.tick();
      this.renderer.render(this.stage);
    },
    resize(w, h) {
      this.pixiBlobs.resize(w, h);
      this.portraits.resize(w, h);
      this.titles.resize(w, h);
      this.renderer.resize(w, h);
    },
    hide(id) {
      this.portraits.hide(id);
      this.titles.hide(id);
    },
    show(delay) {
      this.pixiBlobs.setTint(pages[this.currentHomeSlideId].color);
      this.portraits.show(this.currentHomeSlideId, delay * 1.2);
      this.titles.show(this.currentHomeSlideId, delay * 0.6);
    },
    portraitClick() {
      this.$router.push({
        name: "story-pageId",
        params: { pageId: pages[this.currentHomeSlideId].pageId }
      });
    }
  },
  watch: {
    currentHomeSlideId(val, old) {
      if (old != -1) {
        this.hide(old);
        this.show(1);
      } else {
        this.show(0);
      }
    }
  },
  beforeDestroy() {
    Emitter.removeListener("PORTRAIT_CLICK", this._portraitClick);
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

    this.load();

    Emitter.on("PORTRAIT_CLICK", this._portraitClick);
  }
};
</script>

<style lang="stylus" scoped>
.HomeCanvas {
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}
</style>
