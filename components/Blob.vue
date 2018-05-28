<template>
  <div class="blob">
  </div>
</template>

<script>
import Blob from '~/assets/js/blob/Blob'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
if (process.browser) {
  var dat = require('dat.gui')
}
export default {
    name: "blob",
    props:['debug'],
    methods:{
    resize(w,h) {
      this.canvas.width = w
      this.canvas.height = h
    }
  },
  mounted() {
    //console.log(window)

    this.canvas = document.createElement('canvas');

    this.blob = new Blob(this.canvas, this.debug)

    TweenMax.ticker.addEventListener('tick', ()=>{
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.blob.render();
    })

  }
}

</script>

<style>

</style>
